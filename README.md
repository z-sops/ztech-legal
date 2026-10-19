# ztech-legal

The public legal documents for **ZTech Lead Generation**, a product of
**ZuniTech**.

| File | Purpose |
|---|---|
| `index.html` | Landing page: what the product is, how it uses Google, and links to the two policies. |
| `privacy.html` | Privacy Policy — what data ZTech accesses, how it is stored and protected, how it is shared, and how it is removed. |
| `terms.html` | Terms of Service — the licence, the operator's responsibilities, opt-outs, and the limitations of liability. |

## Status

> **The documents currently describe a local-only, Gmail-only desktop app.**
> The shipped product also collects business data from a third-party provider,
> sends WhatsApp messages through the Meta Cloud API, drafts pitches with an
> external LLM, and calls the ZuniSEO research service. **These documents must
> be rewritten before any commercial sale.**
>
> The full list of what is missing is in [`docs/LEGAL-GAPS.md`](docs/LEGAL-GAPS.md).
> Every item there needs a decision or a document that engineering cannot
> produce — the registered entity name, the governing law, the subprocessor
> list, the retention periods, the transfer mechanism.

## Validation

```bash
node scripts/check-legal.js
```

The script separates two kinds of finding:

- **Regressions** — properties the documents have today and must keep. These
  fail CI: a broken internal link, a missing effective date, a missing Google
  scope disclosure, the loss of the opt-out obligation, or the return of a
  legacy product identifier.
- **Known gaps** — properties the documents should have and do not. These are
  reported and tracked in `docs/LEGAL-GAPS.md`, and they do not fail the build
  because closing them is a legal decision.

There is no build step and no dependency: the documents are plain HTML with
inline CSS, so they can be served from any static host.

## Document control

- Every policy carries an `Effective <date>` line. **Changing the wording
  changes the effective date.**
- The three documents are versioned together in this repository. A change to
  one of them is a change to the published set.
- The privacy policy and the terms are published at the same time. A policy
  update that lands without a terms update, or the reverse, is a regression
  and CI will not catch it — review it by hand.

## Related

- `docs/PROJECT-UPDATE.md` — the running log for this repository.
- The cross-repository audit and programme log live in the **ZTech Lead
  Generation** repository (`docs/AUDIT-BASELINE-2026-10-20.md` and
  `docs/PROJECT-UPDATE.md`).

---

© 2026 ZuniTech. All rights reserved.
