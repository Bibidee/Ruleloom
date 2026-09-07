import os
import json
from pathlib import Path
import pytest
from gltest.direct import create_address
from gltest.direct.sdk_loader import setup_sdk_paths

# gltest 0.29 opens a temporary stdin handle before unlinking it. Windows
# forbids that unlink; keeping the tiny temporary file lets Direct Mode use
# the same encoded message path as other hosts.
_unlink = os.unlink
def _windows_safe_unlink(path):
    try:
        _unlink(path)
    except PermissionError:
        pass
os.unlink = _windows_safe_unlink

def _address(seed):
    # Direct Mode normally adds the matching SDK while loading a contract. Do
    # it before building constructor arguments so Address storage gets its
    # production representation without loading the contract twice.
    setup_sdk_paths(Path("contracts/ruleloom_book.py"))
    return create_address(seed)

@pytest.mark.direct
def test_book_create_add_seal_and_immutable(direct_vm, direct_deploy, direct_alice):
    book = direct_deploy("contracts/ruleloom_book.py", _address("pass"))
    with direct_vm.expect_revert("authorized"):
        with direct_vm.prank(direct_alice): book.bind_passbook(create_address("pass"))
    bid = book.create_rulebook("Access", "A policy purpose long enough.", "Lab", 60, 0, 1, "")
    book.add_clause(bid, "Identity", "Applicant confirms their identity in the statement.", "REQUIRED", "NONE")
    assert book.get_rulebook(bid)["clause_count"] == 1
    book.seal(bid)
    assert book.get_rulebook(bid)["status"] == "SEALED"
    with direct_vm.expect_revert("draft"):
        book.add_clause(bid, "Later", "This must not mutate a sealed rulebook.", "REQUIRED", "NONE")

@pytest.mark.direct
def test_direct_decision_matrix(book_factory):
    book = book_factory()
    b = {"id":1,"clause_count":1}
    book.clauses["1:1"] = '{"id":1,"severity":"REQUIRED","evidence_need":"NONE"}'
    assert book._derive(b,[{"clause_id":1,"finding":"SATISFIED"}])[0] == "ALLOW"
    assert book._derive(b,[{"clause_id":1,"finding":"NOT_SATISFIED"}])[0] == "DENY"
    assert book._derive(b,[{"clause_id":1,"finding":"UNRESOLVED"}])[0] == "REVIEW"
    assert book._derive(b,[{"clause_id":1,"finding":"NOT_APPLICABLE"}])[0] == "REVIEW"

@pytest.mark.direct
def test_direct_exclusion_and_required_not_satisfied_deny(book_factory):
    book = book_factory()
    b = {"id": 1, "clause_count": 2}
    book.clauses["1:1"] = '{"id":1,"severity":"REQUIRED","evidence_need":"NONE"}'
    book.clauses["1:2"] = '{"id":2,"severity":"EXCLUSION","evidence_need":"NONE"}'
    assert book._derive(b, [{"clause_id": 1, "finding": "NOT_SATISFIED"}, {"clause_id": 2, "finding": "NOT_SATISFIED"}])[0] == "DENY"
    assert book._derive(b, [{"clause_id": 1, "finding": "SATISFIED"}, {"clause_id": 2, "finding": "SATISFIED"}])[0] == "DENY"

@pytest.mark.direct
def test_pass_authorization_and_expiry_in_direct_mode(direct_deploy):
    holder = _address("holder")
    passbook = direct_deploy("contracts/ruleloom_pass.py", _address("book"))
    passbook.passes[1] = json.dumps({"id":1,"rulebook_id":7,"definition_hash":"a"*64,"evaluation_id":3,"holder":str(holder),"issued_at":0,"expiry":4102444800,"active":True,"revocation_source":"natural_expiry"}, sort_keys=True, separators=(",",":"))
    passbook.active_by_holder["7:" + str(holder).lower()] = 1
    assert passbook.is_authorized(7, holder) is True
    p = passbook.get_pass(1); p["expiry"] = 1; passbook.passes[1] = json.dumps(p, sort_keys=True, separators=(",",":"))
    passbook.expire_pass(1)
    assert passbook.is_authorized(7, holder) is False

def _evaluated_book(direct_vm, direct_deploy, finding, severity="REQUIRED", source_index=0, excerpt="Alice is an active member of the Alpha Builder program."):
    source="Alice is an active member of the Alpha Builder program."
    direct_vm.mock_web(r"alpha\.example", {"status":200,"body":source})
    direct_vm.mock_llm(r"You evaluate sealed", json.dumps({"clauses":[{"clause_id":1,"finding":finding,"source_index":source_index,"excerpt":excerpt}],"reason":"mocked evidence"}))
    book=direct_deploy("contracts/ruleloom_book.py", _address("pass"))
    bid=book.create_rulebook("Alpha", "A policy purpose long enough.", "Lab", 60, 0, 1, "")
    book.add_clause(bid,"Membership","Applicant must provide public evidence confirming membership in the Alpha Builder program.",severity,"PUBLIC_URL")
    definition=book.seal(bid)
    aid=book.submit_application(bid,definition,"Alice is applying with public membership evidence.",30,["https://alpha.example/member"])
    eid=book.evaluate(aid)
    return book,bid,aid,eid

@pytest.mark.direct
def test_direct_mocked_public_url_allow_lifecycle(direct_vm, direct_deploy):
    book,bid,aid,eid=_evaluated_book(direct_vm,direct_deploy,"SATISFIED")
    assert book.get_application(aid)["status"] == "ALLOWED"
    assert book.get_evaluation(eid)["decision"] == "ALLOW"
    assert book.get_evaluation(eid)["clauses"][0]["excerpt"] == "Alice is an active member of the Alpha Builder program."

@pytest.mark.direct
@pytest.mark.parametrize("finding,source_index,excerpt", [("NOT_SATISFIED",0,"Alice is an active member of the Alpha Builder program."),("SATISFIED",-1,""),("SATISFIED",4,"Alice is an active member of the Alpha Builder program."),("SATISFIED",0,"different text")])
def test_direct_mocked_public_url_decisions(direct_vm, direct_deploy, finding, source_index, excerpt):
    book,_,aid,eid=_evaluated_book(direct_vm,direct_deploy,finding,source_index=source_index,excerpt=excerpt)
    expected="DENIED" if finding=="NOT_SATISFIED" and source_index==0 else "REVIEW"
    assert book.get_application(aid)["status"] == expected
    assert book.get_evaluation(eid)["decision"] == {"DENIED":"DENY","REVIEW":"REVIEW"}[expected]

@pytest.mark.direct
def test_direct_mocked_exclusion_denies(direct_vm, direct_deploy):
    book,_,aid,eid=_evaluated_book(direct_vm,direct_deploy,"SATISFIED",severity="EXCLUSION")
    assert book.get_application(aid)["status"] == "DENIED"
    assert book.get_evaluation(eid)["decision"] == "DENY"

@pytest.fixture
def book_factory(direct_deploy):
    def make():
        return direct_deploy("contracts/ruleloom_book.py", _address("pass"))
    return make
