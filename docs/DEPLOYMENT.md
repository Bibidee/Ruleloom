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

The following is a fresh, completed lifecycle on the corrected deployment. It was performed from the applicant wallet `0xEA8c474cED58DB2750F21a797636a64FeF39297d`; it does not reuse a pass or application from a previous deployment.

| Step | Finalized transaction | Canonical result |
| --- | --- | --- |
| Create rulebook | [`0x9181…9212`](https://explorer-studio.genlayer.com/tx/0x9181d99cfabc383ceee11289a593621eca779df99d23e065aaa0bf5eade09212) | Rulebook `#1`, created as `DRAFT` |
| Add clause | Canonically present on Rulebook `#1` before sealing | Clause `#1`: `REQUIRED` / `PUBLIC_URL` |
| Seal rulebook | [`0x04e8…aa96`](https://explorer-studio.genlayer.com/tx/0x04e881f1af3d18621fc19aa7e59f548c3951f4de9007d7ca8c0656663734aa96) | `SEALED`; definition hash `6d1b3349fa3f7d0aeba321a8948b109e30ce494435e642870de03c52137b88a6` |
| Submit application | [`0x0f85…8f63`](https://explorer-studio.genlayer.com/tx/0x0f855e450ecba15dd0c610944460228ec7e6c2d18cfa7b09515a8423b0578f63) | Application `#1`, `SUBMITTED` |
| Start evaluation | [`0xc177…86df`](https://explorer-studio.genlayer.com/tx/0xc1774faa7d9f27f9355c391d0715b14813df6f6b1e5ac028b1139f8ac83a86df) | Evaluation `#1` started |
| Evaluate | [`0x81aa…b4bf`](https://explorer-studio.genlayer.com/tx/0x81aa8e3128edfddffe642b4bf922909026981321f9fe4e09a68e708a389cb4bf) | Evaluation `#1`: `ALLOW`; clause `#1`: `SATISFIED` |
| Issue pass | [`0x3814…744f`](https://explorer-studio.genlayer.com/tx/0x38146ebdb7fd3b96600f63396627e3c5fc1b4be0a5a77e1695be7f8bc0c6744f) | Pass `#1` issued from evaluation `#1` |

The evaluated public source was `https://raw.githubusercontent.com/Bibidee/Ruleloom/main/README.md`. The stored clause excerpt is exactly: `Ruleloom is a browser-to-GenLayer access-policy product.` The canonical evaluation reason is: `The source contains the exact required statement as specified in the clause prose.`

Final canonical reads after the Passbook's finalized Book notification confirm:

| Check | Result |
| --- | --- |
| `get_evaluation(1).issued` | `true` |
| `get_pass(1).evaluation_id` | `1` |
| `get_pass_by_evaluation(1).id` | `1` |
| `get_pass(1).holder` | `0xEA8c474cED58DB2750F21a797636a64FeF39297d` |
| `get_pass(1).rulebook_id` / definition hash | `1` / exact sealed hash above |
| `get_pass(1).active` | `true` |
| `active_pass(1, applicant)` | `1` |
| `is_authorized(1, applicant)` | `true` |

The production application was reloaded at `/pass/1` after issuance. It continued to show Pass `#1` as `AUTHORIZED`, active, and linked to evaluation `#1`.

## Deployment procedure

Use the active, unlocked Studionet CLI account to deploy both sources, bind the pair, and then verify source parity and canonical binding before assigning their public addresses to the production frontend. Never place a signer secret in a repository file or browser environment variable.
