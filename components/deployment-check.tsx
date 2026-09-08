'use client';

import {useEffect, useState} from 'react';
import {addresses, verifyBindings} from '@/lib/genlayer/contracts';

const short=(address?:string)=>address?`${address.slice(0,6)}…${address.slice(-4)}`:'not configured';

export function DeploymentCheck(){
 const [binding,setBinding]=useState<'checking'|'verified'|'unavailable'>('checking');
 useEffect(()=>{void verifyBindings().then(ok=>setBinding(ok?'verified':'unavailable')).catch(()=>setBinding('unavailable'))},[]);
 return <aside className="deployment-check" aria-label="Studionet deployment configuration">
  <span>STUDIONET 61999</span><span>BOOK <code title={addresses.book}>{short(addresses.book)}</code></span><span>PASS <code title={addresses.pass}>{short(addresses.pass)}</code></span><span>PAIR {binding}</span>
 </aside>
}
