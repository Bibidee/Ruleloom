import {readFileSync,createHash} from 'node:fs';
const required=['GENLAYER_PRIVATE_KEY','NEXT_PUBLIC_RULEBOOK_ADDRESS','NEXT_PUBLIC_PASSBOOK_ADDRESS'];
const missing=required.filter(k=>!process.env[k]); if(missing.length) throw new Error(`Deployment blocked: missing ${missing.join(', ')}. Use a funded Studionet signer; this script never creates or stores one.`);
for(const f of ['contracts/ruleloom_book.py','contracts/ruleloom_pass.py']){const source=readFileSync(f);console.log(JSON.stringify({network:'Studionet',chainId:61999,file:f,bytes:source.length,sha256:createHash('sha256').update(source).digest('hex')}));}
console.log('Deploy Passbook with Book address, bind Book to Passbook, then record finalized execution receipts and canonical reads.');
