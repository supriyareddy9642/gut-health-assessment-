import { scoreAssessment } from '../services/scoringService.js';
import { saveAssessmentToGoogleSheets } from '../services/googleSheetsService.js';

export async function createAssessment(req,res) {
  const input=req.validatedAssessment;
  const score=scoreAssessment(input.answers);
  const submittedAt=new Date().toISOString();
  const record={
    assessmentId:input.assessmentId,submittedAt,
    patient:{...input.patient,age:req.patientAge,email:input.patient.email||''},
    language:input.language,answers:input.answers,perQuestion:score.perQuestion,
    totalScore:score.total,maxScore:score.maxScore,category:score.category
  };
  try {
    const saved=await saveAssessmentToGoogleSheets(record);
    return res.status(saved.duplicate?200:201).json({
      assessmentId:input.assessmentId,submittedAt:saved.submittedAt||submittedAt,
      totalScore:score.total,maxScore:score.maxScore,category:score.category,
      saved:true,duplicate:Boolean(saved.duplicate)
    });
  } catch(err) {
    console.error('Assessment persistence failed:',err.message);
    return res.status(502).json({error:'ASSESSMENT_SAVE_FAILED',message:'Assessment could not be saved. Your answers have been retained. Please retry.'});
  }
}
