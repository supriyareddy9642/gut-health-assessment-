function required(name) {
  const value = process.env[name];
  if (!value || !value.trim()) throw new Error(`Missing environment variable: ${name}`);
  return value.trim();
}
export async function saveAssessmentToGoogleSheets(record) {
  const endpoint = required('GOOGLE_APPS_SCRIPT_URL');
  const secret = required('GHA_SHARED_SECRET');
  if (!endpoint.startsWith('https://script.google.com/macros/s/') || !endpoint.endsWith('/exec')) throw new Error('GOOGLE_APPS_SCRIPT_URL must be a deployed Apps Script /exec URL');
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(),20000);
  try {
    const response = await fetch(endpoint,{
      method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({secret,record}),redirect:'follow',signal:controller.signal
    });
    const text = await response.text();
    let data;
    try { data=JSON.parse(text); } catch { throw new Error(`Apps Script non-JSON response (HTTP ${response.status})`); }
    if (!response.ok || data?.ok!==true) throw new Error(`Apps Script error: ${data?.error || response.status}`);
    return data;
  } finally { clearTimeout(timer); }
}
