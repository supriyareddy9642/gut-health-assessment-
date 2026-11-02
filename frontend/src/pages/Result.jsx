
import {
  CheckCircle2,
  Info,
  Leaf,
  ListChecks,
  RotateCcw,
  FileDown,
  MessageCircle,
} from 'lucide-react';

import { jsPDF } from 'jspdf';

import { MAX_SCORE } from '@gha/shared';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import ScoreRing from '../components/ScoreRing.jsx';
import InfoCard from '../components/InfoCard.jsx';
import { useAssessment } from '../hooks/AssessmentContext.jsx';
import { LANGUAGES, format } from '../translations/index.js';
import { CATEGORY_STYLES } from '../utils/categoryStyles.js';

const PDF_LABELS = {
  en: {
    title: 'Gut Health Assessment Report',
    patient: 'Patient Name',
    date: 'Assessment Date',
    score: 'Total Score',
    category: 'Risk Category',
    meaning: 'Assessment Result',
    improvement: 'Ways to Improve Gut Health',
    factors: 'Factors That May Affect Gut Health',
    important: 'Important Information',
    disclaimer: 'This assessment is an awareness tool only. It is not a diagnostic test and does not replace medical advice.',
    pdf: 'Gut_Health_Report',
  },
  te: {
    title: 'Gut Health Assessment Report',
    patient: 'Patient Name',
    date: 'Assessment Date',
    score: 'Total Score',
    category: 'Risk Category',
    meaning: 'Assessment Result',
    improvement: 'Ways to Improve Gut Health',
    factors: 'Factors That May Affect Gut Health',
    important: 'Important Information',
    disclaimer: 'This assessment is for awareness only. It is not a diagnostic test. Please consult a doctor for medical advice.',
    pdf: 'Gut_Health_Report',
  },
  ta: {
    title: 'Gut Health Assessment Report',
    patient: 'Patient Name',
    date: 'Assessment Date',
    score: 'Total Score',
    category: 'Risk Category',
    meaning: 'Assessment Result',
    improvement: 'Ways to Improve Gut Health',
    factors: 'Factors That May Affect Gut Health',
    important: 'Important Information',
    disclaimer: 'This assessment is for awareness only. It is not a diagnostic test. Please consult a doctor for medical advice.',
    pdf: 'Gut_Health_Report',
  },
};

export default function Result() {
  const { state, t, actions } = useAssessment();

  const { result } = state;

  const cat = t.result.categories[result.category];
  const style = CATEGORY_STYLES[result.category];

  const locale = LANGUAGES.find(
    (l) => l.code === state.language
  )?.locale;

  const date = new Date(result.submittedAt).toLocaleDateString(
    locale,
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );

  const outOf = format(t.result.outOf, {
    max: MAX_SCORE,
  });

  const labels =
    PDF_LABELS[state.language] || PDF_LABELS.en;

  // ------------------------------------------------
  // DOWNLOAD PDF REPORT
  // ------------------------------------------------

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const margin = 18;
      const contentWidth = pageWidth - margin * 2;

      let y = 22;

      const addText = (text, fontSize = 10, gap = 7) => {
        doc.setFontSize(fontSize);

        const lines = doc.splitTextToSize(
          String(text || ''),
          contentWidth
        );

        const requiredHeight = lines.length * (fontSize * 0.45) + gap;

        if (y + requiredHeight > pageHeight - 18) {
          doc.addPage();
          y = 20;
        }

        doc.text(lines, margin, y);
        y += requiredHeight;
      };

      const addHeading = (text) => {
        y += 3;
        doc.setFont('helvetica', 'bold');
        addText(text, 12, 9);
        doc.setFont('helvetica', 'normal');
      };

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(labels.title, margin, y);

      y += 12;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(
        'Sri Ramakrishna Speciality Hospital',
        margin,
        y
      );

      y += 12;

      doc.setDrawColor(210, 220, 230);
      doc.line(margin, y, pageWidth - margin, y);

      y += 12;

      // Patient information
      addHeading('PATIENT INFORMATION');

      addText(`${labels.patient}: ${state.patient.fullName}`);
      addText(`${labels.date}: ${date}`);

      if (state.patient.dob) {
        addText(`Date of Birth: ${state.patient.dob}`);
      }

      if (state.patient.location) {
        addText(`Location: ${state.patient.location}`);
      }

      y += 3;

      // Score
      addHeading('ASSESSMENT SCORE');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);

      addText(
        `${result.totalScore} / ${MAX_SCORE}`,
        17,
        8
      );

      doc.setFont('helvetica', 'normal');

      addText(`${labels.category}: ${cat.label}`);

      // Meaning
      addHeading(labels.meaning);
      addText(cat.meaning, 10, 8);

      // Improvement tips
      addHeading(labels.improvement);

      (t.education.improveItems || []).forEach((item, index) => {
        addText(`${index + 1}. ${item}`, 10, 5);
      });

      // Factors
      addHeading(labels.factors);

      (t.education.factorsItems || []).forEach((item, index) => {
        addText(`${index + 1}. ${item}`, 10, 5);
      });

      // Important information
      addHeading(labels.important);
      addText(t.result.importantBody, 10, 7);
      addText(t.result.redFlags, 10, 7);

      // Disclaimer
      addHeading('DISCLAIMER');
      addText(labels.disclaimer, 9, 8);

      // Footer
      const totalPages = doc.internal.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');

        doc.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: 'right' }
        );
      }

      const safeName = state.patient.fullName
        .trim()
        .replace(/[^a-z0-9]/gi, '_');

      doc.save(
        `${labels.pdf}_${safeName}.pdf`
      );
    } catch (error) {
      console.error('PDF generation failed:', error);
      window.alert('Unable to generate PDF. Please try again.');
    }
  };

  // ------------------------------------------------
  // SHARE REPORT THROUGH WHATSAPP
  // ------------------------------------------------

  const shareWhatsApp = () => {
    const message = [
      'Gut Health Assessment Report',
      '',
      `Hospital: Sri Ramakrishna Speciality Hospital`,
      `Patient: ${state.patient.fullName.trim()}`,
      `Assessment Date: ${date}`,
      `Score: ${result.totalScore} / ${MAX_SCORE}`,
      `Risk Category: ${cat.label}`,
      '',
      'This assessment is an awareness tool only and is not a medical diagnosis.',
      '',
      'Please consult a healthcare professional for medical advice.',
    ].join('\n');

    const whatsappUrl =
      `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappUrl,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="space-y-5">

      {result.preview && (
        <p
          role="status"
          className="rounded-xl border border-mid-border bg-mid-soft px-4 py-2 text-center text-xs font-bold text-mid"
        >
          DEV PREVIEW – result calculated locally and NOT saved
        </p>
      )}

      <div>
        <h1 className="text-2xl font-bold text-navy-900">
          {t.result.title}
        </h1>

        {!result.preview && (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-ok">
            <CheckCircle2
              className="h-4 w-4"
              aria-hidden="true"
            />
            {t.result.saved}
          </p>
        )}
      </div>

      <Card className="p-6 text-center sm:p-8">

        <dl className="mb-6 grid grid-cols-2 gap-3 border-b border-slate-100 pb-5 text-left">

          <div className="min-w-0">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {t.result.patient}
            </dt>

            <dd className="mt-0.5 truncate text-sm font-bold text-navy-900">
              {state.patient.fullName.trim()}
            </dd>
          </div>

          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {t.result.date}
            </dt>

            <dd className="mt-0.5 text-sm font-bold text-navy-900">
              {date}
            </dd>
          </div>

        </dl>

        <ScoreRing
          score={result.totalScore}
          max={MAX_SCORE}
          category={result.category}
          label={t.result.scoreLabel}
          outOf={outOf}
        />

        <div
          className={`mx-auto mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-base font-bold ${style.soft} ${style.border} ${style.text}`}
        >
          <style.Icon
            className="h-5 w-5"
            aria-hidden="true"
          />

          {cat.label}
        </div>

        <p className="mt-3 text-xs font-medium text-slate-500">
          {t.result.notDiagnosis}
        </p>

      </Card>

      <section
        className={`rounded-3xl border p-5 sm:p-6 ${style.soft} ${style.border}`}
      >
        <h2
          className={`flex items-center gap-2 text-base font-bold ${style.text}`}
        >
          <ListChecks
            className="h-5 w-5"
            aria-hidden="true"
          />

          {t.result.meaningTitle}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-800">
          {cat.meaning}
        </p>
      </section>

      <section className="rounded-3xl border border-high-border bg-high-soft p-5 sm:p-6">

        <h2 className="flex items-center gap-2 text-base font-bold text-high">
          <Info
            className="h-5 w-5"
            aria-hidden="true"
          />

          {t.result.importantTitle}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-800">
          {t.result.importantBody}
        </p>

        <p className="mt-3 text-sm font-semibold leading-relaxed text-high">
          {t.result.redFlags}
        </p>

      </section>

      <InfoCard
        icon={Leaf}
        title={t.education.improveTitle}
        items={t.education.improveItems}
        bullet={CheckCircle2}
      />

      <InfoCard
        icon={Info}
        title={t.education.factorsTitle}
        items={t.education.factorsItems}
        bullet={Info}
      />

      {/* REPORT ACTIONS */}

      <div className="space-y-3 pt-2">

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={downloadPDF}
        >
          <FileDown
            className="h-5 w-5"
            aria-hidden="true"
          />

          Download PDF Report
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={shareWhatsApp}
        >
          <MessageCircle
            className="h-5 w-5"
            aria-hidden="true"
          />

          Share Report via WhatsApp
        </Button>

      </div>

      {/* START NEW ASSESSMENT */}

      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={actions.reset}
      >
        <RotateCcw
          className="h-5 w-5"
          aria-hidden="true"
        />

        {t.result.startNew}
      </Button>

    </div>
  );
}
