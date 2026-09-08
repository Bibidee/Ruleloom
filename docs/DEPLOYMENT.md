# Deployment

Ruleloom is deployed to Studionet (chain `61999`) as a matched Book and Passbook pair. The Book was deployed first with the zero address, the Passbook was deployed against that Book, and the Book was then bound to the Passbook with its one-time binding method.

## Current corrected deployment

Contract source commit: `730d1319cd96978bf733836a2b4b35dbe17e8100`.

| Item | Value |
| --- | --- |
| RuleloomBook | `0x01EF66F3337c68242eC3620c0B650790B6d8B1E9` |
| RuleloomPass | `0x475B74ccecAa86B795CAC6c99C1eBF08f832A396` |
| Book source SHA-256 / bytes | `982d04e658f36c6b5c24ae116912f6b9914a89f4ec9862b1f23884aef9b072c0` / `17509` |
| Pass source SHA-256 / bytes | `017b20bcf7909273762adb522f3f91c35156045294a5df81724c365cda98aab2` / `4129` |
| Book deploy | `0x56faf43429e1f0fd5a6527085c766da3f0adb9d61588aa8ddeb425fc334c0f39` |
| Pass deploy | `0x3125a0b486f866d9d000246ffd20e5d877a998e8e78069497ce51755dd0fdb79` |
| Book to Passbook binding | `0xdf0767dcf0b310a2dc8cc443373dd3f032908679ba1309a6bcd534197a9343a1` |

Fresh canonical reads confirm `Book.get_passbook()` returns the Passbook address and `Passbook.get_book_address()` returns the Book address. The live schemas expose the Book evaluation/recovery lifecycle and the Passbook issuance, lookup, expiry, and authorization methods.

Fresh on-chain source retrieval verified byte-for-byte parity for both contracts:

| Contract | Source parity |
| --- | --- |
| RuleloomBook | VERIFIED |
| RuleloomPass | VERIFIED |

## Production frontend

Vercel project: `ruleloom`. Canonical production URL: [the-ruleloom.vercel.app](https://the-ruleloom.vercel.app). Its public production environment uses the current Book and Passbook addresses above, and a fresh production deployment was created after that configuration change. The legacy `ruleloom-psi.vercel.app` address, if retained by Vercel, is secondary and is not the canonical URL.

## Live lifecycle record

The corrected deployment has been bound and source-verified. The fresh user-facing lifecycle is intentionally recorded only after it has been performed through the production application: create rulebook, add clause, seal, submit application, start and run evaluation, issue the resulting pass, and verify finalized Book accounting plus authorization. No lifecycle result is claimed here before those canonical reads exist.

## Deployment procedure

Use the active, unlocked Studionet CLI account to deploy both sources, bind the pair, and then verify source parity and canonical binding before assigning their public addresses to the production frontend. Never place a signer secret in a repository file or browser environment variable.
