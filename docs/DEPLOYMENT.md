# Deployment

Ruleloom is deployed to Studionet (chain `61999`) as a matched Book and Passbook pair. The Book was deployed first with the zero address, the Passbook was deployed against that Book, and the Book was then bound to the Passbook with its one-time binding method.

## Current matched deployment

Contract source commit: `4e239dc1d6e5e438cb1896398a0f494e6f554dcc`.

| Item | Value |
| --- | --- |
| RuleloomBook | `0x9c05a449d078a40CAc09E451921ce40A7b758d95` |
| RuleloomPass | `0x7628A9d75d1AA9D9Fb001f4A8f7543816f0725F0` |
| Book source SHA-256 / bytes | `6121bfe389ccbdcf491f3ad8ed3778c2a7e9835b7404b5d9f5cee7760147e617` / `17825` |
| Pass source SHA-256 / bytes | `017b20bcf7909273762adb522f3f91c35156045294a5df81724c365cda98aab2` / `4129` |
| Book deploy | `0x5e25fd8437fe5d87213a7ad5ac25b02cd6ffbd6e43bbc8ca608aa7026560cab4` |
| Pass deploy | `0x7aba485729d4c235bed010f24e459f82481bb100cb4271ec501dc65ed1f4e7cf` |
| Book to Passbook binding | `0x405987b8c2ff8dc398ed08db37af62eae5e051b75de60121523df8b1292d29de` |

Fresh canonical reads confirm `Book.get_passbook()` returns the Passbook address and `Passbook.get_book_address()` returns the Book address. The live schemas expose the Book evaluation/recovery lifecycle and the Passbook issuance, lookup, expiry, and authorization methods.

Fresh on-chain source retrieval verified byte-for-byte parity for both contracts:

| Contract | Source parity |
| --- | --- |
| RuleloomBook | VERIFIED |
| RuleloomPass | VERIFIED |

## Production frontend

Vercel project: `ruleloom`. Canonical production URL: [the-ruleloom.vercel.app](https://the-ruleloom.vercel.app). Its public production environment uses the current Book and Passbook addresses above, and a fresh production deployment was created after that configuration change. The legacy `ruleloom-psi.vercel.app` address, if retained by Vercel, is secondary and is not the canonical URL.

## Live lifecycle record

The following is a fresh, completed lifecycle on the matched deployment. It was performed from the applicant wallet `0xEA8c474cED58DB2750F21a797636a64FeF39297d`; it does not reuse a pass or application from a previous deployment.

| Step | Finalized transaction | Canonical result |
| --- | --- | --- |
| Create rulebook | [`0x1a7e…4c33`](https://explorer-studio.genlayer.com/tx/0x1a7eaede44ed6f10f8a6c2e00cc6f66c33f8085a37319e73e190535a8de74c33) | Rulebook `#3`, created as `DRAFT` |
| Add clause | [`0x74c2…aefb`](https://explorer-studio.genlayer.com/tx/0x74c20e5ff01b0a238dc8ae0c57bda65d4ecd888a13fda2dd6ba2c5f33039aefb) | Clause `#1`: `REQUIRED` / `PUBLIC_URL` |
| Seal rulebook | [`0xad6a…032e`](https://explorer-studio.genlayer.com/tx/0xad6a80c57e839dcea8235e1cff5777c454335bc0a3eaa4cc084cccd7a2b8032e) | `SEALED`; definition hash `c0fc327c58639dbc3b7de9ed0864c6fd4d349f468f1d7842ed29d760fc9ab026` |
| Submit application | [`0x0190…7ebd`](https://explorer-studio.genlayer.com/tx/0x019096ef1d8d7fc745f405ca63ce7fcc1502ba47ee60dee8701991297a577ebd) | Application `#2`, `SUBMITTED` |
| Start evaluation | [`0x26f9…3791`](https://explorer-studio.genlayer.com/tx/0x26f9f102105b83981abebb7a1bf3a14c56c05a539d3c136a26b672a1fcdb3791) | Evaluation `#2` started |
| Evaluate | [`0x3054…82c4`](https://explorer-studio.genlayer.com/tx/0x305417fb602ed8c032c2f5ec54395a203ba9d151bc498ec17af48bcd9c7282c4) | Evaluation `#2`: `ALLOW`; clause `#1`: `SATISFIED` |
| Issue pass | [`0x52c7…9d12`](https://explorer-studio.genlayer.com/tx/0x52c75004dca0d015dd9f82d2c00b5dae5a06549ab5cb55f3198937a964ae9d12) | Pass `#1` issued from evaluation `#2` |

The evaluated public source was `https://raw.githubusercontent.com/Bibidee/Ruleloom/main/README.md`. The stored clause excerpt is exactly: `Ruleloom is a browser-to-GenLayer access-policy product.` The canonical evaluation reason is: `The required statement 'Ruleloom is a browser-to-GenLayer access-policy product' is found verbatim in the untrusted source at index 0, satisfying the evidence need for PUBLIC_URL.`

Final canonical reads after the Passbook's finalized Book notification confirm:

| Check | Result |
| --- | --- |
| `get_evaluation(2).issued` | `true` |
| `get_pass(1).evaluation_id` | `2` |
| `get_pass_by_evaluation(2).id` | `1` |
| `get_pass(1).holder` | `0xEA8c474cED58DB2750F21a797636a64FeF39297d` |
| `get_pass(1).rulebook_id` / definition hash | `3` / exact sealed hash above |
| `get_pass(1).active` | `true` |
| `active_pass(3, applicant)` | `1` |
| `is_authorized(3, applicant)` | `true` |

The production application was reloaded at `/pass/1` after issuance. It continued to show Pass `#1` as `AUTHORIZED`, active, and linked to evaluation `#2`.

## Deployment procedure

Use the active, unlocked Studionet CLI account to deploy both sources, bind the pair, and then verify source parity and canonical binding before assigning their public addresses to the production frontend. Never place a signer secret in a repository file or browser environment variable.
