#!/usr/bin/env node
'use strict';

/**
 * Legal document validation (F0).
 *
 * The ztech-legal repository is four documents with no build, no test and no
 * CI, so a change to a legal document could silently break a link, drop an
 * effective date, or reintroduce a legacy product name. This script is the
 * regression gate.
 *
 * It separates two kinds of finding:
 *
 *   REGRESSION  - a property the documents have today and must keep. Failing
 *                 one of these fails CI.
 *   KNOWN GAP   - a property the documents SHOULD have and do not. These are
 *                 tracked in docs/LEGAL-GAPS.md and reported, but they do not
 *                 fail CI, because closing them is a legal decision that
 *                 engineering cannot make (they need the registered entity
 *                 name, the governing law, the subprocessor list, and so on).
 *
 * Usage: node scripts/check-legal.js
 * Exit code 0 = no regressions, 1 = a regression was found.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const DOCUMENTS = ['index.html', 'privacy.html', 'terms.html'];

const regressions = [];
const knownGaps = [];

function regress(message) {
  regressions.push(message);
}

function gap(id, message) {
  knownGaps.push({ id, message });
}

/* ------------------------------------------------------------- documents -- */

const missing = DOCUMENTS.filter((f) => !fs.existsSync(path.join(ROOT, f)));
if (missing.length) {
  regress(`missing document(s): ${missing.join(', ')}`);
}

const text = {};
for (const f of DOCUMENTS) {
  if (!missing.includes(f)) text[f] = fs.readFileSync(path.join(ROOT, f), 'utf8');
}

const all = Object.values(text).join('\n');

/* ------------------------------------------------- 1. product and brand -- */

const PRODUCT = 'ZTech Lead Generation';
const BRAND = 'ZuniTech';

for (const [file, body] of Object.entries(text)) {
  if (!body.includes(PRODUCT)) {
    regress(`${file}: the product name "${PRODUCT}" is missing`);
  }
}

// The brand is currently written "Zunitech" in the documents but "ZuniTech" in
// the product repository. One spelling must win. Until the legal entity name
// is decided, this is a reported inconsistency, not a hard failure.
const brandForms = new Set();
if (all.includes('ZuniTech')) brandForms.add('ZuniTech');
if (all.includes('Zunitech')) brandForms.add('Zunitech');
if (brandForms.size > 1) {
  gap('BRAND-1', 'the brand is written both "ZuniTech" and "Zunitech" across the documents and the product repository');
}
if (all.includes('Zunitech') && !all.includes('ZuniTech')) {
  gap('BRAND-1', 'the brand is written "Zunitech"; the product repository uses "ZuniTech"');
}

// The company hierarchy: Zuni Enterprise (parent) / ZuniTech (brand) /
// ZTech Lead Generation (product). The registered entity details are a
// clearly flagged placeholder until the business confirms them - they must
// never be invented, and the placeholder must never be quietly removed.
if (!all.includes('Zuni Enterprise')) {
  gap('BRAND-2', 'the parent company "Zuni Enterprise" is not named in the documents');
}
if (!/TO BE CONFIRMED/i.test(all)) {
  gap('BRAND-3', 'the flagged placeholder for the unconfirmed registration details is missing');
}

// Legacy product names must never reappear.
const LEGACY = ['phone全球获客', 'phone-global-leads', 'com.whatsapp.automation'];
for (const legacy of LEGACY) {
  if (all.includes(legacy)) {
    regress(`a legacy product identifier is present in the documents: "${legacy}"`);
  }
}

/* ------------------------------------------------------- 2. effective date -- */

for (const [file, body] of Object.entries(text)) {
  if (file === 'index.html') continue; // the landing page carries no effective date
  if (!/Effective\s+\d{1,2}\s+\w+\s+\d{4}/.test(body)) {
    regress(`${file}: no "Effective <date>" line`);
  }
}

/* -------------------------------------------------------- 3. broken links -- */

for (const [file, body] of Object.entries(text)) {
  const links = [...body.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const link of links) {
    if (/^(https?:|mailto:|#)/.test(link)) continue;
    const target = link === './' ? 'index.html' : link;
    if (!fs.existsSync(path.join(ROOT, target))) {
      regress(`${file}: broken internal link "${link}"`);
    }
  }
}

/* ---------------------------------------------- 4. document completeness -- */

if (text['privacy.html'] && !/googleapis\.com\/auth\/gmail\.send/.test(text['privacy.html'])) {
  regress('privacy.html: the gmail.send scope is no longer disclosed');
}
if (text['privacy.html'] && !/googleapis\.com\/auth\/gmail\.metadata/.test(text['privacy.html'])) {
  regress('privacy.html: the gmail.metadata scope is no longer disclosed');
}
if (text['terms.html'] && !/opt[- ]out/i.test(text['terms.html'])) {
  regress('terms.html: the opt-out obligation is no longer stated');
}

/* ------------------------------------------------- 5. known legal gaps -- */

// These are the gaps recorded in the cross-repository audit (G-58, G-59,
// G-60). They are reported, and tracked in docs/LEGAL-GAPS.md. They do not
// fail the build: each one needs a decision or a document that only the
// business can supply.

if (!/governing law|governed by|jurisdiction/i.test(all)) {
  gap('ENTITY-1', 'no governing-law clause and no jurisdiction are named');
}
if (!/registered (address|office)|company (number|registration|reg\. no)/i.test(all)) {
  gap('ENTITY-2', 'no registered entity name, registration number or registered address');
}
if (!/data processing agreement|\bDPA\b|Article 28/i.test(all)) {
  gap('GDPR-1', 'no data processing agreement and no controller/processor role allocation');
}
if (!/subprocessor/i.test(all)) {
  gap('GDPR-2', 'no subprocessor list (the product actually uses Google, Meta WhatsApp, CoreClaw, the ZuniSEO service and an LLM provider)');
}
if (!/standard contractual clauses|\bSCCs?\b|transfer impact assessment/i.test(all)) {
  gap('GDPR-3', 'no international-transfer mechanism (ZuniTech is in Pakistan) and no data-residency statement');
}
if (!/data subject|DSAR|erasure request|access request/i.test(all)) {
  gap('GDPR-4', 'no data-subject-access / erasure intake and no deletion workflow');
}
if (!/retention|retained for|delete after/i.test(all)) {
  gap('GDPR-5', 'no retention schedule for leads, drafts, approvals, consent, research, logs or quarantined payloads');
}
if (!/cookie|consent banner|consent management/i.test(all)) {
  gap('GDPR-6', 'no cookie or consent-management policy');
}
if (!/legitimate interest|Article 6|CAN-SPAM|PECR|CASL|ePrivacy/i.test(all)) {
  gap('LAW-1', 'no lawful-basis analysis for B2B outbound and no country-specific marketing rules');
}
if (!/WhatsApp/i.test(all)) {
  gap('LAW-2', 'the product sends WhatsApp messages through the Meta Cloud API, but the documents do not mention WhatsApp at all');
}
if (!/language model|\bLLM\b|model provider|third-party model|draft.*(AI|model)/i.test(all)) {
  gap('LAW-3', 'no AI/LLM disclosure (lead and company data is sent to an LLM to draft pitches)');
}
if (!/ZuniSEO|zuni-seo/i.test(all)) {
  gap('LAW-4', 'the product calls the ZuniSEO research service, which receives lead identifiers and prospect-site data; the documents do not mention it');
}
if (!/subscription|refund|renewal|service level|\bSLA\b/i.test(all)) {
  gap('COM-1', 'no subscription, refund, renewal or SLA terms (the documents are written for a consumer desktop app)');
}

/* ---------------------------------------------------------------- output -- */

console.log('Legal document check');
console.log(`  documents: ${DOCUMENTS.length} (${Object.keys(text).length} present)`);
console.log(`  regressions: ${regressions.length}`);
console.log(`  known gaps: ${knownGaps.length} (tracked in docs/LEGAL-GAPS.md)`);

if (knownGaps.length) {
  console.log('');
  console.log('Known gaps - not failing the build, each needs a business decision:');
  for (const g of knownGaps) console.log(`  - [${g.id}] ${g.message}`);
}

if (regressions.length) {
  console.log('');
  console.log('=== REGRESSIONS ===');
  for (const r of regressions) console.log(`  - ${r}`);
  console.log('');
  console.log(`${regressions.length} regression(s) found.`);
  process.exit(1);
}

console.log('');
console.log('No regressions.');
process.exit(0);
