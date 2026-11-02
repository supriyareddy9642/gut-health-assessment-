import { calculateScore } from '@gha/shared';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';
// Preview mode exists ONLY in dev builds. It never talks to a server and never saves anything.
const PREVIEW = import.meta.env.DEV && import.meta.env.VITE_DEV_PREVIEW === 'true';

export class ApiError extends Error {
  constructor(kind) {
    super(kind);
    this.kind = kind; // 'network' | 'rate' | 'server' | 'invalid'
  }
}

export async function submitAssessment(payload) {
  if (PREVIEW) {
    await new Promise((r) => setTimeout(r, 700));
    const s = calculateScore(payload.answers);
    return {
      assessmentId: payload.assessmentId,
      submittedAt: new Date().toISOString(),
      totalScore: s.total,
      category: s.category,
      preview: true,
    };
  }

  let res;
  try {
    res = await fetch(`${BASE}/api/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError('network');
  }
  if (res.status === 429) throw new ApiError('rate');
  if (!res.ok) throw new ApiError(res.status >= 500 ? 'server' : 'invalid');

  let data;
  try {
    data = await res.json();
  } catch {
    throw new ApiError('server');
  }
  const ok =
    data && typeof data.totalScore === 'number' && typeof data.category === 'string' &&
    typeof data.submittedAt === 'string';
  if (!ok) throw new ApiError('server');
  return data; // { assessmentId, submittedAt, totalScore, category }
}
