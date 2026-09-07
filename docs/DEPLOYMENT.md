# Deployment

Deploy both sources unchanged to Studionet (`61999`) using the stable py-genlayer dependency header. The Book is first deployed with the zero address, the Passbook is deployed with that Book address, and the deployer then performs the Book's one-time `bind_passbook` write. The command waits for successful finalized execution, extracts the deployment addresses, verifies on-chain source hashes, and checks both canonical schemas before printing configuration values. Set public addresses only after preserving those receipts.

Run `GENLAYER_PRIVATE_KEY=<funded signer> node scripts/deploy-studionet.mjs`. The signer is intentionally never read from, written to, or committed in a repository file.
