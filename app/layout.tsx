import type {Metadata} from 'next'; import './globals.css'; import {WalletProvider} from '@/lib/wallet/provider'; import {Nav} from '@/components/nav';
export const metadata:Metadata={title:'Ruleloom — Plain-language access policies',description:'Seal rules. Ground decisions. Issue passes.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><WalletProvider><Nav/>{children}<footer>RULELOOM / POLICY IS SEALED · DECISION IS DERIVED · PASS IS ON-CHAIN</footer></WalletProvider></body></html>}
