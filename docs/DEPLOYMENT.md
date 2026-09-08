# Deployment

Deploy both sources unchanged to Studionet (`61999`) using the stable py-genlayer dependency header. The Book is first deployed with the zero address, the Passbook is deployed with that Book address, and the deployer then performs the Book's one-time `bind_passbook` write. The command waits for successful finalized execution, extracts the deployment addresses, verifies on-chain source hashes, and checks both canonical schemas before printing configuration values. Set public addresses only after preserving those receipts.

## Current frozen deployment

Frozen contract source commit: `81c4e61b801cb0a2e7f43752fbe917f9680a1133`.

| Item | Value |
| --- | --- |
| RuleloomBook | `0xb14dFC7F1E30C3b468aF9c9E1636e47d181cfF06` |
| RuleloomPass | `0x3069B8f059Eeb8842A6AC8357179245d6208E5e2` |
| Book source SHA-256 / bytes | `41e547a1ac19639bd999b56d34f71c8fa2c15642b9f44791e88df27e07352220` / `14907` |
| Pass source SHA-256 / bytes | `7a0c41717fed8beab2ee3e2c32a7a67ec44d9e4b1301816a4d2de9069263c5da` / `3311` |
| Book deploy | `0x3a3632b692754952e6cc4e49ccd40c666fe02352d466fce2efc9e9d0d990bf85` |
| Pass deploy | `0x3f554685f8b4fd1d06385e719175f1826866d07a12141d2f06ed1596bbd74cc6` |
| One-time binding | `0xe91a05ee1ae5deae6196515535f36cb552fa47253d511f5ede28bb084becce63` |

Fresh `genlayer code` checks verified byte-for-byte source parity for both deployed contracts. Fresh schemas expose the Book lifecycle methods and Passbook issuance/authorization methods. A live policy lifecycle is recorded here only after canonical `ALLOW`, finalized Book `issued=true`, and `is_authorized=true` are observed.

## Verified live lifecycle

The authorized signer created and completed this canonical lifecycle on the frozen deployment.

| Transition | Evidence |
| --- | --- |
| Create Book #1 | `0xf23ca49af9cadf9a6da74c05c0dba2699d989b14780b08407046680bc730fad5` |
| Add clause | `0xaecf4c679d25a363ffbb4f8aae86f20b46d094ca2a604785a62fa2c6632b142b` |
| Seal | `0x285bcdd405a317936d37e321e7ac6c06e67520f3f0f7aa0e1ec03f05db2731e6` |
| Definition hash | `a4c50e71220d96e0e5df4798cd396f77a7cb5a3a24aba06c70dfcf02adf05d66` |
| Submit application #1 | `0xc0b7a7495b816f53563417b24b064a272f6cfbb744031d70115d4af2514039ab` |
| Evaluate #1 | `0x505109b40243dbb95407a26309f3ad565c3cdd92b53cb5df5c4bdaadaf5152a3` |
| Issue pass #1 | `0xb191f8ad57069c2f3a9afe1a6fe9fd8526ec7b856cfc0167b6bd933edf1d5332` |

Canonical reads verified `SEALED`, `SUBMITTED`, `ALLOW`, pass `#1` active, Book evaluation `issued=true`, `active_pass(1, holder)=1`, and `is_authorized(1, holder)=true`. The grounded finding was `SATISFIED` at source index `0` with literal excerpt `# Ruleloom` from the submitted public HTTPS source.

## Production frontend

Vercel project: `ruleloom`. Production deployment: [ruleloom-psi.vercel.app](https://ruleloom-psi.vercel.app). It is configured with the frozen Book and Passbook public addresses and its homepage, `/new`, `/books`, and `/verify` routes returned HTTP 200. The requested `ruleloom.vercel.app` alias is already in use outside this Vercel scope, so it could not be assigned.

Run `GENLAYER_PRIVATE_KEY=<funded signer> node scripts/deploy-studionet.mjs`. The signer is intentionally never read from, written to, or committed in a repository file.
