import dotenv from 'dotenv';
dotenv.config({ path: new URL('./.env', import.meta.url) });
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import assessmentRoutes from './src/routes/assessmentRoutes.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const origins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173').split(',').map(x => x.trim());

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin(origin, cb) {
  if (!origin || origins.includes(origin)) return cb(null, true);
  return cb(new Error('Origin not allowed'));
}, methods:['GET','POST','OPTIONS'], allowedHeaders:['Content-Type'] }));
app.use(express.json({ limit:'32kb' }));
app.get('/api/health', (_req,res) => res.json({ok:true,service:'gut-health-assessment-api'}));
app.use('/api/assessments', rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:'draft-7',legacyHeaders:false}), assessmentRoutes);
app.use((err,_req,res,_next) => {
  if (err?.type === 'entity.too.large') return res.status(413).json({error:'REQUEST_TOO_LARGE'});
  if (err?.message === 'Origin not allowed') return res.status(403).json({error:'ORIGIN_NOT_ALLOWED'});
  console.error('Unhandled API error:', err?.message || 'Unknown error');
  return res.status(500).json({error:'INTERNAL_SERVER_ERROR'});
});
app.listen(port, () => console.log(`Gut Health API listening on http://localhost:${port}`));
