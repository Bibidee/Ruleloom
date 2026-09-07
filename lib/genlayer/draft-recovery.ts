import type {ClauseDraft} from './definition';
export type Draft={title:string;purpose:string;resource:string;maxDuration:string;cooldown:string;maxEvidence:number;clauses:ClauseDraft[]};
export const matchingDraft=(book:any,d:Draft)=>book?.status==='DRAFT'&&book.title===d.title&&book.purpose===d.purpose&&book.resource===d.resource&&Number(book.max_duration)===Number(d.maxDuration)&&Number(book.cooldown)===Number(d.cooldown)&&Number(book.max_evidence)===d.maxEvidence;
export const matchingClause=(on:any,c:ClauseDraft,index:number)=>Number(on?.id)===index+1&&on.label===c.label&&on.prose===c.prose&&on.severity===c.severity&&on.evidence_need===c.evidenceNeed;
