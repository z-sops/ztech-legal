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

### Review state (2026-10-20)

The review branch is **pushed** and the review PR is **open as a draft**:
https://github.com/z-sops/ztech-legal/pull/1
(the head of the review branch -> base `main`).
Nothing is merged, deployed or released.

**CI IS GREEN:** https://github.com/z-sops/ztech-legal/actions/runs/39396564845
— 1/1 job (the legal document check: 0 regressions, 11 known gaps).

The first push was refused with *"refusing to allow a Personal Access Token to
create or update workflow `.github/workflows/ci.yml` without `workflow`
scope"* — the available token had only `repo`. A `git push --dry-run` does
**not** detect this; it passed, and only the real push was refused.

### F2 — what the cloud product will need from these documents (2026-10-20)

**Branch:** `feat/f2-cloud-saas-architecture` (based on the F0/F1 head
`a7e4d4b`). **Status: DESIGN FOR REVIEW — no implementation has started.**

The ZTech cloud architecture is in the ZTech Lead Generation repository,
`docs/F2-CLOUD-SAAS-ARCHITECTURE.md`. It changes what these documents must
eventually say, and it adds new obligations that are **not** yet written:

| Gap | What F2 makes necessary |
|---|---|
| **SCOPE-1** | The documents describe a local-only, Gmail-only desktop app. F2 makes ZTech a multi-tenant cloud service that stores customer CRM data, runs background jobs, and calls paid providers. The rewrite becomes unavoidable. |
| **ENTITY-1/2** | A registered entity name, number and address are still unconfirmed. The placeholder stays until they are. |
| **GDPR-1/2/3** | F2 introduces real subprocessors at scale: the secret store, the job workers, the object store, the payment provider, and the per-workspace provider credentials. The subprocessor list and the transfer analysis must name them. |
| **GDPR-4/5** | F2 adds a data-subject request flow across every workspace, a retention schedule for the new tables (jobs, invocations, invoices, audit log) and the platform-level data (an org's activity across workspaces). |
| **LAW-2/3/4** | F2 makes the CRM a record of contacts, so the lawful basis, the AI disclosure (the LLM drafts pitches) and the ZuniSEO/paid-provider transfers all become material statements rather than edge cases. |
| **New** | A **data-processing agreement** between a customer and ZuniTech, a **subprocessor list** the customer accepts, a **breach-notification** process, and a **platform-admin access** disclosure — the break-glass model in F2 §5.7 must be disclosed to customers, including the fact that a customer sees a banner when an administrator accesses their workspace. |
| **New — break-glass** | The platform-super-admin model is **APPROVED (2026-10-20)**: controlled, time-limited, audited access **only when necessary**, and **no permanent unrestricted access** to customer CRM records, messages, credentials or prospect information. This must be disclosed to customers in the policy, together with the fact that a grant requires a stated reason, expires automatically, and is visible to the customer. A customer must also be able to **revoke** a grant. |
| **New — multi-instance OI** | The per-tenant Opportunity Intelligence model means customer research data is processed in an **instance dedicated to that customer**, with that customer's own provider credentials. The subprocessor list must therefore name the isolation model, the instance locations, and the fact that a provider credential is never shared between tenants. | |

**Nothing in these documents is changed by F2 at this stage.** The F2 plan
records the obligations; the rewrite is a separate, business-approved work item
that the F2 milestones gate.

### Next

F1 (branding — which decides BRAND-1) and then the legal rewrite, which
needs the decisions listed in `docs/LEGAL-GAPS.md`.
