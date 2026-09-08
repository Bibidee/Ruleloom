# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""Deterministic, non-transferable passes issued from RuleloomBook ALLOW receipts."""
from genlayer import *
from datetime import datetime, timezone
import json
def _now(): return int(datetime.now(timezone.utc).timestamp())
def _put(v): return json.dumps(v,sort_keys=True,separators=(",",":"))
@gl.contract_interface
class RuleloomBook:
    class View:
        def get_evaluation(self,evaluation_id:u256)->dict: ...
        def get_rulebook(self,rulebook_id:u256)->dict: ...
        def get_application(self,application_id:u256)->dict: ...
    class Write:
        def mark_issued(self,evaluation_id:u256)->None: ...
class RuleloomPass(gl.Contract):
    book_address:Address; passes:TreeMap[u256,str]; by_evaluation:TreeMap[u256,u256]; active_by_holder:TreeMap[str,u256]; next_pass_id:u256
    def __init__(self,book_address:Address): self.book_address=book_address; self.next_pass_id=u256(1)
    def _key(self,book_id,holder): return str(book_id)+":"+str(holder).lower()
    @gl.public.write
    def issue_from_evaluation(self,evaluation_id:u256)->u256:
        book=RuleloomBook(self.book_address); e=book.view().get_evaluation(evaluation_id); rb=book.view().get_rulebook(u256(e["rulebook_id"]))
        if e["decision"]!="ALLOW" or e["issued"] or self.by_evaluation.get(evaluation_id,u256(0))!=u256(0) or e["definition_hash"]!=rb["definition_hash"]: raise gl.vm.UserError("exact current ALLOW evaluation required")
        if str(gl.message.sender_address).lower()!=e["applicant"].lower(): raise gl.vm.UserError("holder must issue own pass")
        # A holder can have many historical passes, but exactly one current
        # pass per rulebook. Replacements are retained and explicitly inactive.
        key=self._key(e["rulebook_id"],e["applicant"]); previous=self.active_by_holder.get(key,u256(0))
        if previous!=u256(0):
            prior=json.loads(self.passes[previous]); prior["active"]=False; prior["revocation_source"]="replaced"; self.passes[previous]=_put(prior)
        pid=self.next_pass_id; self.next_pass_id+=u256(1); expiry=_now()+int(_load_app_duration(e,book))
        self.passes[pid]=_put({"id":int(pid),"rulebook_id":e["rulebook_id"],"definition_hash":e["definition_hash"],"evaluation_id":int(evaluation_id),"holder":e["applicant"],"issued_at":_now(),"expiry":expiry,"active":True,"revocation_source":"natural_expiry"}); self.by_evaluation[evaluation_id]=pid; self.active_by_holder[key]=pid; book.emit(on="finalized").mark_issued(evaluation_id); return pid
    @gl.public.write
    def expire_pass(self,pass_id:u256)->None:
        p=json.loads(self.passes[pass_id])
        if not p["active"]: return
        if _now()<p["expiry"]: raise gl.vm.UserError("pass not expired")
        p["active"]=False; p["revocation_source"]="natural_expiry"; self.passes[pass_id]=_put(p)
        if self.active_by_holder.get(self._key(p["rulebook_id"],p["holder"]),u256(0))==pass_id: self.active_by_holder[self._key(p["rulebook_id"],p["holder"])]=u256(0)
    @gl.public.view
    def get_book_address(self)->Address: return self.book_address
    @gl.public.view
    def get_pass_count(self)->u256: return self.next_pass_id-u256(1)
    @gl.public.view
    def get_pass(self,pass_id:u256)->dict: return json.loads(self.passes[pass_id])
    @gl.public.view
    def get_pass_by_evaluation(self,evaluation_id:u256)->dict:
        pid=self.by_evaluation.get(evaluation_id,u256(0))
        if pid==u256(0): return {"id":0,"active":False}
        return json.loads(self.passes[pid])
    @gl.public.view
    def active_pass(self,rulebook_id:u256,holder:Address)->u256:
        pid=self.active_by_holder.get(self._key(rulebook_id,holder),u256(0))
        if pid==u256(0): return pid
        p=json.loads(self.passes[pid]); return pid if p["active"] and _now()<p["expiry"] else u256(0)
    @gl.public.view
    def is_authorized(self,rulebook_id:u256,holder:Address)->bool: return self.active_pass(rulebook_id,holder)!=u256(0)
def _load_app_duration(e,book): return book.view().get_application(u256(e["application_id"]))["requested_duration"]
