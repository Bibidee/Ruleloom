# Architecture

`ruleloom_book.py` owns sealed rulebooks, frozen applications, nondeterministic evidence interpretation, and deterministic decision derivation. It never executes author prose. `ruleloom_pass.py` consumes a Book evaluation, checks its policy hash and current ALLOW decision, then stores a non-transferable expiry-bound pass. The browser reads both contracts with an unsigned Studionet client and writes only through the connected EIP-1193 wallet.
