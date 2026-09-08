# Ruleloom

Ruleloom is a browser-to-GenLayer access-policy product. An author writes bounded natural-language clauses, seals their canonical definition, and applicants provide public evidence. GenLayer validators independently fetch that evidence and classify each clause. Deterministic Book logic derives `ALLOW`, `DENY`, or `REVIEW`; the separate Passbook issues a time-limited, non-transferable pass only from a current `ALLOW` receipt.

The production target is **Studionet (chain 61999)**. `genlayer-js` is pinned exactly to `1.1.8`. There is no backend verdict service, server wallet, or off-chain source of truth.

Evidence is HTTPS-only. `PUBLIC_URL` findings are consequential only when their literal excerpt is present in a fetched public source; otherwise they become `UNRESOLVED` and fail closed to `REVIEW`. `NONE` is statement-only and `OPTIONAL_URL` may be statement-only. Required failures and satisfied exclusions deny; unresolved required or exclusion findings review. Pass issuance sends Book accounting at finalized stage, and authorization ends naturally at expiry.

## Run

From this directory: `npm ci && npm run dev`. Configure the deployed Book and Passbook addresses in `.env.local` using `.env.example`. Browser writes use the injected wallet and await finalized execution plus a canonical readback.

## Deployment

Current Studionet deployment: Book `0xb14dFC7F1E30C3b468aF9c9E1636e47d181cfF06`; Passbook `0x3069B8f059Eeb8842A6AC8357179245d6208E5e2`.

Production app: [the-ruleloom.vercel.app](https://the-ruleloom.vercel.app). The older `ruleloom-psi.vercel.app` alias remains a secondary deployment alias.

`node scripts/deploy-studionet.mjs` intentionally stops without a funded signer. It prints source hashes and requires explicit Studionet deployment configuration. See [deployment notes](docs/DEPLOYMENT.md).
