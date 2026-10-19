# Project update log — ZTech Legal

Running log for the ZTech legal documents. Newest first.

**Owner:** ZuniTech engineering
**Last updated:** 2026-10-20

> This repository is one of the **three** ZTech repositories. `z-sops/zuni-seo`
> is a separate ZuniTech product and an external integration dependency; it is
> inspected read-only and is never modified from here.
>
> The full cross-repository audit lives in the ZTech Lead Generation
> repository: `docs/AUDIT-BASELINE-2026-10-20.md`. This log records only the
> work done in **this** repository.

---

## 2026-10-20 — F0 foundation (branch `feat/cloud-saas-f0-foundation`)

**Base:** `main` @ `4d738d6` (verified against `origin/main`, 0 ahead / 0 behind)

### What was done

| Item | Result |
|---|---|
| CI | `.github/workflows/ci.yml` — a dependency-free validation of the three documents, plus a UTF-8 / control-character check and a structural completeness check. |
| Validation script | `scripts/check-legal.js` — separates **regressions** (fail the build) from **known gaps** (reported, tracked). |
| Gap register | `docs/LEGAL-GAPS.md` — 18 tracked gaps with an id, a severity, an owner and the wording that would close each one. |
| Log | This file. |

### The gate

`node scripts/check-legal.js` currently reports **0 regressions** and **13
known gaps**.

**Regressions (these fail CI):**
- a missing document;
- the product name *ZTech Lead Generation* disappearing from a document;
- a legacy product identifier reappearing (`phone全球获客`,
  `phone-global-leads`, `com.whatsapp.automation`);
- a missing `Effective <date>` line on the privacy policy or the terms;
- a broken internal link;
- the `gmail.send` or `gmail.metadata` scope disclosure disappearing;
- the opt-out obligation disappearing from the terms.

**Known gaps (these are reported and tracked, they do not fail the build):**
BRAND-1, ENTITY-1, ENTITY-2, GDPR-1 … GDPR-6, LAW-1 … LAW-4, COM-1.

### The finding that matters

**These documents describe a product that no longer exists.**

They describe a **local-only, Gmail-only Windows desktop app**:
*"Everything ZTech stores runs and stays on your own computer"*
(`index.html`), *"no Zunitech server receives Google data"* (`privacy.html`).

The shipped product also:
- collects business data from a third-party provider (CoreClaw,
  `openapi.coreclaw.com`);
- sends WhatsApp messages through the Meta Cloud API, with **no approved
  template configuration**;
- sends lead and company data to an **external LLM** to draft pitches;
- calls the **ZuniSEO research service**, which receives the lead domain, an
  opaque `requested_for` id and prospect-site content, and stores results for
  90 days.

So ZuniTech **does** operate a server that receives lead identifiers and
prospect-site data. The privacy policy says the opposite. This is audit gap
**G-58** and it is rated **Critical** — it is a commercial blocker, not a
wording problem.

### Verified

```
node scripts/check-legal.js
  Legal document check
    documents: 3 (3 present)
    regressions: 0
    known gaps: 13 (tracked in docs/LEGAL-GAPS.md)
  No regressions.
```

The documents were also confirmed to be valid UTF-8 with no stray control
characters — the byte sequence `C2 B7` that appears as `A·` in a console is a
correct UTF-8 middle dot, not mojibake.

### Nothing was rewritten

No legal wording was changed in F0. Rewriting a privacy policy and terms of
service is a legal decision, and doing it in an engineering pass would put
words into a document that the business has not approved. F0 delivers the
inventory, the tracking and the gate; the rewrite is scheduled with F1 and
needs the registered entity name, the governing law, the subprocessor list and
the retention periods.

### Next

F1 (branding — which decides BRAND-1) and then the legal rewrite, which
needs the decisions listed in `docs/LEGAL-GAPS.md`.
