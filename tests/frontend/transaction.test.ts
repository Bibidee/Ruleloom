import {describe,it,expect} from 'vitest';
import {submitAndConfirm} from '@/lib/genlayer/transaction';
const client=(receipt:any)=>({writeContract:async()=> '0xabc',waitForTransactionReceipt:async()=>receipt});
describe('transaction confirmation',()=>{
  it('accepts FINISHED_WITH_RETURN only with canonical readback',async()=>{const states:any[]=[];const r=await submitAndConfirm(client({txExecutionResultName:'FINISHED_WITH_RETURN'}),{},async()=>true,s=>states.push(s));expect(r.ok).toBe(true);expect(states.at(-1).phase).toBe('EXECUTION_CONFIRMED')});
  it('classifies finalized execution errors',async()=>{const states:any[]=[];const r=await submitAndConfirm(client({txExecutionResultName:'REVERTED'}),{},async()=>true,s=>states.push(s));expect(r.ok).toBe(false);expect(states.at(-1).phase).toBe('EXECUTION_ERROR')});
  it('rejects successful execution without canonical state',async()=>{const states:any[]=[];const r=await submitAndConfirm(client({txExecutionResultName:'SUCCESS'}),{},async()=>false,s=>states.push(s));expect(r.ok).toBe(false);expect(states.at(-1).phase).toBe('CANONICAL_MISMATCH')});
});
