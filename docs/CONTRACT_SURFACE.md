# Contract surface

Book writes: `create_rulebook`, `add_clause`, `seal`, `set_paused`, `submit_application`, `evaluate`, and Passbook-only `mark_issued`. Book views expose rulebooks, clauses, applications, and evaluation receipts. Passbook writes: `issue_from_evaluation`, `expire_pass`; views: `get_pass`, `active_pass`, `is_authorized`. Both constructors require their counterpart address, so deployment must bind the pair deliberately.
