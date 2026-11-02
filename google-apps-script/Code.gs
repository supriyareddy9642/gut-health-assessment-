/**
 * Configure Script Properties:
 * GHA_SPREADSHEET_ID, GHA_SHARED_SECRET, GHA_SHEET_TAB (optional: Assessments)
 * The Node backend posts {secret, record}. Do not call this from the browser.
 */
const HEADERS = [
  'Assessment ID','Submitted At','Full Name','Date of Birth','Age','Location','Mobile','Email','Language',
  'Q1a','Q1b','Q2a','Q2b','Q2c','Q3a','Q3b','Q4a','Q4b',
  'Q1a Points','Q1b Points','Q2a Points','Q2b Points','Q2c Points','Q3a Points','Q3b Points','Q4a Points','Q4b Points',
  'Total Score','Maximum Score','Risk Category','Consent'
];

function doPost(e) {
  const lock=LockService.getScriptLock();
  try {
    const props=PropertiesService.getScriptProperties();
    const secret=props.getProperty('GHA_SHARED_SECRET');
    const spreadsheetId=props.getProperty('GHA_SPREADSHEET_ID');
    const tab=props.getProperty('GHA_SHEET_TAB')||'Assessments';
    if(!secret||!spreadsheetId) return output_({ok:false,error:'SCRIPT_PROPERTIES_NOT_CONFIGURED'});
    const raw=e&&e.postData&&e.postData.contents;
    if(!raw||raw.length>30000) return output_({ok:false,error:'INVALID_REQUEST'});
    const body=JSON.parse(raw);
    if(!body||body.secret!==secret) return output_({ok:false,error:'UNAUTHORIZED'});
    validate_(body.record);
    lock.waitLock(15000);
    const sheet=SpreadsheetApp.openById(spreadsheetId).getSheetByName(tab);
    if(!sheet) return output_({ok:false,error:'SHEET_TAB_NOT_FOUND'});
    if(sheet.getLastRow()===0) {
      sheet.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
      sheet.setFrozenRows(1);
      sheet.getRange(1,1,1,HEADERS.length).setFontWeight('bold');
    } else {
      const h=sheet.getRange(1,1,1,HEADERS.length).getValues()[0];
      if(h.join('|')!==HEADERS.join('|')) return output_({ok:false,error:'SHEET_HEADERS_MISMATCH'});
    }
    const r=body.record, last=sheet.getLastRow();
    if(last>=2) {
      const ids=sheet.getRange(2,1,last-1,1).getValues().flat();
      if(ids.includes(r.assessmentId)) return output_({ok:true,duplicate:true,submittedAt:r.submittedAt});
    }
    const p=r.patient,a=r.answers,s=r.perQuestion;
    const row=[
      r.assessmentId,r.submittedAt,safe_(p.fullName),p.dob,p.age,safe_(p.location),p.mobile,safe_(p.email||''),r.language,
      a.q1a,a.q1b,a.q2a,a.q2b,a.q2c,a.q3a,a.q3b,a.q4a,a.q4b,
      s.q1a,s.q1b,s.q2a,s.q2b,s.q2c,s.q3a,s.q3b,s.q4a,s.q4b,
      r.totalScore,r.maxScore,r.category,p.consent?'Yes':'No'
    ];
    sheet.appendRow(row);
    return output_({ok:true,duplicate:false,submittedAt:r.submittedAt});
  } catch(err) {
    console.error('GHA save error:',err&&err.message?err.message:'Unknown');
    return output_({ok:false,error:'SAVE_FAILED'});
  } finally { try{lock.releaseLock();}catch(_){} }
}
function validate_(r) {
  const ids=['q1a','q1b','q2a','q2b','q2c','q3a','q3b','q4a','q4b'];
  if(!r||!/^[0-9a-f-]{36}$/i.test(String(r.assessmentId||''))) throw new Error('Invalid ID');
  if(!['en','te','ta'].includes(r.language)) throw new Error('Invalid language');
  if(!r.patient||r.patient.consent!==true||!r.patient.fullName||!r.patient.dob||!r.patient.mobile||!r.patient.location) throw new Error('Invalid patient');
  if(!r.answers||!r.perQuestion) throw new Error('Missing answers');
  ids.forEach(id=>{if(!['yes','no'].includes(r.answers[id])||typeof r.perQuestion[id]!=='number')throw new Error('Invalid answer');});
  if(!Number.isInteger(r.totalScore)||r.totalScore<0||r.totalScore>10) throw new Error('Invalid score');
  const cat=r.totalScore<=3?'lower':r.totalScore<=6?'intermediate':'higher';
  if(r.category!==cat) throw new Error('Invalid category');
}
function safe_(v) {
  const s=String(v==null?'':v).slice(0,500);
  return '=+-@'.includes(s.charAt(0)) ? "'" + s : s;
}
function setupSheet() {
  const p=PropertiesService.getScriptProperties(),id=p.getProperty('GHA_SPREADSHEET_ID');
  const tab=p.getProperty('GHA_SHEET_TAB')||'Assessments';
  if(!id) throw new Error('Set GHA_SPREADSHEET_ID first');
  const ss=SpreadsheetApp.openById(id);
  let sh=ss.getSheetByName(tab); if(!sh) sh=ss.insertSheet(tab);
  if(sh.getLastRow()===0) {
    sh.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
    sh.setFrozenRows(1); sh.getRange(1,1,1,HEADERS.length).setFontWeight('bold');
  }
  return 'Sheet ready: '+tab;
}
function output_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
