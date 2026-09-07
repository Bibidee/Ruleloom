import { z } from 'zod';
export const severity = z.enum(['REQUIRED','EXCLUSION','PREFERENCE']);
export const evidenceNeed = z.enum(['NONE','PUBLIC_URL','OPTIONAL_URL']);
export const clauseSchema = z.object({label:z.string().trim().min(2).max(60), prose:z.string().trim().min(12).max(900), severity, evidenceNeed});
export const bookSchema = z.object({title:z.string().trim().min(3).max(80),purpose:z.string().trim().min(10).max(600),resource:z.string().trim().min(2).max(80),maxDuration:z.string().regex(/^\d+$/).refine(v=>BigInt(v)>0n && BigInt(v)<=31536000n),cooldown:z.string().regex(/^\d+$/),maxEvidence:z.coerce.number().int().min(1).max(6),clauses:z.array(clauseSchema).min(1).max(12)});
export const httpsUrl = z.string().url().max(400).refine(v=>{try { const u=new URL(v); return u.protocol==='https:' && !u.username && !u.password && !u.hash && !/^(localhost|127\.|10\.|192\.168\.|169\.254\.)/i.test(u.hostname); } catch {return false;}}, 'Use a public HTTPS URL without credentials or fragments.');
