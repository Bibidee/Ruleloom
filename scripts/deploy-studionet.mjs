import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createAccount, createClient, decodeTransaction } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
const privateKey=process.env.GENLAYER_PRIVATE_KEY;
if(!privateKey) throw new Error('Deployment blocked: GENLAYER_PRIVATE_KEY is required. Provide a funded Studionet signer only through the environment; this script never creates or stores one.');
const source=(file)=>readFileSync(file,'utf8'); const digest=(value)=>createHash('sha256').update(value).digest('hex');
const bookCode=source('contracts/ruleloom_book.py'),passCode=source('contracts/ruleloom_pass.py'),account=createAccount(privateKey),client=createClient({chain:studionet,account}),zero='0x0000000000000000000000000000000000000000';
const successful=(receipt)=>new Set(['FINISHED_WITH_RETURN','SUCCESS']).has(String(receipt?.txExecutionResultName??receipt?.consensus_data?.leader_receipt?.[0]?.execution_result));
async function finalized(hash,label){const receipt=await client.waitForTransactionReceipt({hash,status:'FINALIZED',retries:180,interval:5000});if(!successful(receipt))throw new Error(`${label} finalized without successful execution: ${String(receipt?.txExecutionResultName??receipt?.consensus_data?.leader_receipt?.[0]?.execution_result)}`);return receipt}
async function deployedAddress(hash,label){await finalized(hash,label);const decoded=decodeTransaction(await client.getTransaction({hash}));const address=decoded.txDataDecoded?.contractAddress;if(!address)throw new Error(`${label} receipt has no contract address; inspect ${hash} before any follow-up transaction.`);return address}
async function verifySource(address,expected,label){const deployed=await client.getContractCode({address});if(typeof deployed!=='string'||digest(deployed)!==digest(expected))throw new Error(`${label} source bytes differ at ${address}`)}
console.log(JSON.stringify({network:'Studionet',chainId:61999,bookSha256:digest(bookCode),passSha256:digest(passCode),deployer:account.address}));
const bookHash=await client.deployContract({code:bookCode,args:[zero]}),bookAddress=await deployedAddress(bookHash,'Book deployment');
const passHash=await client.deployContract({code:passCode,args:[bookAddress]}),passAddress=await deployedAddress(passHash,'Passbook deployment');
const bindHash=await client.writeContract({address:bookAddress,functionName:'bind_passbook',args:[passAddress],value:0n}); await finalized(bindHash,'Book/Passbook binding');
await verifySource(bookAddress,bookCode,'Book');await verifySource(passAddress,passCode,'Passbook');
const bookSchema=await client.getContractSchema({address:bookAddress}),passSchema=await client.getContractSchema({address:passAddress});if(!bookSchema.methods.bind_passbook||!passSchema.methods.issue_from_evaluation)throw new Error('Canonical schema does not expose the expected lifecycle methods.');
console.log(JSON.stringify({bookAddress,passAddress,bookDeployTx:bookHash,passDeployTx:passHash,bindTx:bindHash,bookSourceSha256:digest(bookCode),passSourceSha256:digest(passCode)}));
console.log(`Set NEXT_PUBLIC_RULEBOOK_ADDRESS=${bookAddress} and NEXT_PUBLIC_PASSBOOK_ADDRESS=${passAddress} only after preserving the receipts above.`);
