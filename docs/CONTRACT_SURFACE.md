# Contract surface

Book writes: `bind_passbook`, `create_rulebook`, `add_clause`, `seal`, `set_paused`, `submit_application`, `evaluate`, and Passbook-only `mark_issued`. Book views expose rulebooks, clauses, applications, and evaluation receipts. Passbook writes: `issue_from_evaluation`, `expire_pass`; views: `get_pass`, `active_pass`, `is_authorized`. The Book starts unbound at the zero address and accepts exactly one deployer-only nonzero Passbook binding before the first rulebook is created; Passbook is constructed with the Book address.
