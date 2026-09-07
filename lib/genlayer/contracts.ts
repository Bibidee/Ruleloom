import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
export const publicClient=createClient({chain:studionet});
export const addresses={book:process.env.NEXT_PUBLIC_RULEBOOK_ADDRESS as `0x${string}`,pass:process.env.NEXT_PUBLIC_PASSBOOK_ADDRESS as `0x${string}`};
export function assertConfigured(){if(!addresses.book||!addresses.pass||/^0x0{40}$/i.test(addresses.book)||/^0x0{40}$/i.test(addresses.pass))throw new Error('Ruleloom is not deployed yet. Configure the Studionet Book and Passbook addresses.');}
export async function readBook(id:bigint){assertConfigured();return publicClient.readContract({address:addresses.book,functionName:'get_rulebook',args:[id]}) as Promise<any>}
export async function readClause(book:bigint,id:bigint){assertConfigured();return publicClient.readContract({address:addresses.book,functionName:'get_clause',args:[book,id]}) as Promise<any>}
export async function readApplication(id:bigint){assertConfigured();return publicClient.readContract({address:addresses.book,functionName:'get_application',args:[id]}) as Promise<any>}
export async function readEvaluation(id:bigint){assertConfigured();return publicClient.readContract({address:addresses.book,functionName:'get_evaluation',args:[id]}) as Promise<any>}
export async function readPass(id:bigint){assertConfigured();return publicClient.readContract({address:addresses.pass,functionName:'get_pass',args:[id]}) as Promise<any>}
export async function latestApplication(book:bigint,applicant:`0x${string}`){assertConfigured();return publicClient.readContract({address:addresses.book,functionName:'latest_application',args:[book,applicant]}) as Promise<bigint>}
export async function passByEvaluation(evaluation:bigint){assertConfigured();return publicClient.readContract({address:addresses.pass,functionName:'get_pass_by_evaluation',args:[evaluation]}) as Promise<any>}
export async function isAuthorized(rulebook:bigint,holder:`0x${string}`){assertConfigured();return publicClient.readContract({address:addresses.pass,functionName:'is_authorized',args:[rulebook,holder]}) as Promise<boolean>}
export async function latestRulebook(creator:`0x${string}`){assertConfigured();return publicClient.readContract({address:addresses.book,functionName:'latest_rulebook',args:[creator]}) as Promise<bigint>}
