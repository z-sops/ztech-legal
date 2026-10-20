# Legal gaps register

Every item here is a **known** gap in the `ztech-legal` documents. They are
reported by `node scripts/check-legal.js` on every CI run and are tracked here
so they are visible, owned and not forgotten.

They are deliberately **not** CI failures. Each one needs a decision or a
document that engineering cannot produce: the registered entity name, the
governing law, the subprocessor list, the retention periods, the transfer
mechanism.

**Status of the documents today:** they describe a **local-only, Gmail-only
Windows desktop app**. The shipped product also collects business data from a
third-party provider, sends WhatsApp messages through the Meta Cloud API,
drafts pitches with an LLM, and calls the ZuniSEO research service — which
means ZuniTech operates a server that receives lead identifiers and
prospect-site data. The current policy says the opposite
(*"Everything ZTech stores runs and stays on your own computer"*, index.html).
**These documents must be rewritten before any commercial sale.** This is audit
gap G-58 and it is rated Critical.

---

| ID | Gap | Severity | Owner | Notes |
|---|---|---|---|---|
| ~~BRAND-1~~ | ~~The brand is written "Zunitech" in the legal documents but "ZuniTech" in the product repository~~ | — | **Closed in F1** | The documents now use **ZuniTech** everywhere. |
| ~~BRAND-2~~ | ~~The parent company "Zuni Enterprise" was not named~~ | — | **Closed in F1** | Every document now states the hierarchy: **Zuni Enterprise** (parent) → **ZuniTech** (technology brand) → **ZTech Lead Generation** (product). |
| BRAND-3 | The **registered entity name, registration number and registered address** are still unconfirmed | High | Legal | Every document carries a clearly flagged placeholder — `[Registered entity name, registration number and registered address: TO BE CONFIRMED …]`. `scripts/check-legal.js` FAILS if that placeholder is removed, so the gap cannot be forgotten. **Nothing is invented**: no entity name, number or address has been made up. |
| ENTITY-1 | No governing-law clause and no jurisdiction | High | Legal | Required in both the privacy policy and the terms. |
| ENTITY-3 | The only contact address is a personal Gmail address (`z.sdevops1@gmail.com`) | High | Ops | A monitored support address and a privacy contact are needed for DSAR intake. |
| GDPR-1 | No DPA and no controller/processor role allocation | Critical | Legal | ZuniTech is a controller of lead data and a processor for ZuniSEO jobs. ZuniSEO's own `docs/DEPLOY.md` already flags this: *"Publish a privacy policy and a DPA before selling in the EU/UK"*. |
| GDPR-2 | No subprocessor list | Critical | Legal | The real subprocessors are: Google (Gmail API), Meta (WhatsApp Cloud API), CoreClaw (`openapi.coreclaw.com`), the ZuniSEO service, and the LLM provider. None are named. |
| GDPR-3 | No international-transfer mechanism and no data-residency statement | Critical | Legal | ZuniTech is in Pakistan; the ZuniSEO service stores results for 90 days. SCCs / UK Addendum / transfer impact assessment are needed. |
| GDPR-4 | No DSAR intake and no erasure workflow | High | Legal | Only Google-access removal and uninstall are covered. There is no path for a person whose data was collected from a third party and who never interacted with ZTech. |
| GDPR-5 | No retention schedule | High | Legal | Needed for leads, drafts, approvals, consent/unsubscribe records, research envelopes, logs and quarantined payloads. The only retention figure in the estate is ZuniSEO's 90 days, and it is not surfaced. |
| GDPR-6 | No cookie or consent-management policy | Medium | Legal | The SaaS will have a web frontend and OAuth. |
| GDPR-7 | No record of processing (Art. 30) and no DPIA for systematic lead scoring | Medium | Legal | The platform scores and ranks prospects, which is profiling. |
| LAW-1 | No lawful-basis analysis for B2B outbound | Critical | Legal | No Art. 6(1)(f) legitimate-interest assessment, no Art. 14 notice mechanism for third-party-sourced contacts, no CAN-SPAM / PECR / UWG / CASL rules, no "how to be removed" path, no source attribution for collected fields. |
| LAW-2 | WhatsApp is not mentioned at all | Critical | Legal | The product sends via the Meta Cloud API with **no approved template configuration**. Nothing addresses the 24-hour customer-service window, opt-in/opt-out keywords, template approval, or the fact that WhatsApp outreach needs its own lawful basis. |
| LAW-3 | No AI/LLM disclosure | High | Legal | Lead and company data is sent to an external LLM to draft pitches. The documents say only that data is "not used to train AI/ML models", which is a different statement. No named provider, no prompt-retention statement, no EU AI Act / Art. 22 notice. |
| LAW-4 | The ZuniSEO research service is not mentioned | Critical | Legal | It receives the lead domain, an opaque `requested_for` id and prospect-site content, and stores results for 90 days. |
| COM-1 | No subscription, refund, renewal or SLA terms | High | Commercial | The terms are consumer-style, with no licence grant and no commercial terms. |
| COM-2 | No export-control, sanctions, accessibility or insurance statement | Low | Legal | Needed for enterprise buyers. |
| SCOPE-1 | The documents describe a different product | Critical | Legal | Every gap above is a symptom of this one. The rewrite is the task. |

---

## How to close an item

1. Make the change in the relevant document (`index.html`, `privacy.html`,
   `terms.html`).
2. Re-run `node scripts/check-legal.js`. The item disappears from the report
   automatically when the required wording is present.
3. Update the status column here and record it in `docs/PROJECT-UPDATE.md`.
4. The CI job fails only on **regressions** — a broken link, a missing
   effective date, a missing Google-scope disclosure, the loss of the
   opt-out obligation, the return of a legacy product identifier, or the
   removal of the flagged placeholder for the unconfirmed registration
   details.
