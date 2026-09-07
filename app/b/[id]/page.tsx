import {BookView} from '@/components/book-view';
export default async function Book({params}:{params:Promise<{id:string}>}){const {id}=await params;return <main><span className="eyebrow">Rulebook / canonical contract state</span><BookView id={id}/></main>}
