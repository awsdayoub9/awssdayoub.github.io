---
title: "Odoo Implementation for HR, Accounting & Ops | Aws Dayoub"
description: "Odoo implementation for HR and payroll, accounting, sales, purchasing, inventory, projects and POS, run remotely from the requirements workshop to go-live."
h1: "Odoo implementation configured around how your business runs"
lead: "One person runs the requirements workshop, writes the specification, configures the apps on a staging database, migrates the data, runs UAT and stays through go-live."
og_alt: "Odoo implementation by Aws Dayoub: HR and payroll, accounting, sales, purchasing, inventory, projects and POS, from workshop to go-live."
locale: en
translationKey: services/odoo-implementation
kind: service
updated: 2026-09-06
breadcrumb: Implementation
related:
  - /work/hotel-management-system/
  - /work/construction-project-suite/
  - /services/odoo-customization/
  - /services/odoo-support/
  - /how-i-work/
questions:
  - q: "What should we prepare before the discovery workshop?"
    a: "The checklist on this page is the full answer. If you have only an afternoon, bring the document samples and the approval chains: the first tells me what the system must produce, the second tells me who must be able to stop it. Everything else can be gathered during the workshop itself."
  - q: "Can HR and payroll go live together with accounting?"
    a: "Yes, and it is often the cleaner option, because payslips post into accounting and both departments share the month-end close. Payroll needs its salary rules, contracts and opening balances loaded, and I recommend a parallel run against your current payslips before cut-over, so its data migration and UAT are planned as their own track inside the same scope."
  - q: "What does Saudi localisation cover in an implementation?"
    a: "The Saudi chart of accounts, VAT configuration and ZATCA Phase 2 e-invoicing through Odoo's standard localisation modules, verified in the ZATCA simulation environment before go-live. Payroll items such as GOSI, WPS and Mudad, and Hijri dates in reports, are assessed with your accountant at discovery and written into the scope as covered, deferred or out of scope."
cta:
  heading: "Start with a discovery workshop"
  body: "Send a few lines about the apps in scope and the companies involved. The quote follows discovery; it never comes before it."
  whatsapp_label: "Message on WhatsApp"
  email_label: "Send an email"
draft: false
sources: []
---

## Who this is for

- Your company is moving finance, HR and payroll onto Odoo and wants the same person in the workshop and at go-live.
- Your finance, HR and operations departments work from spreadsheets and disconnected tools, and management wants one system of record.
- An earlier rollout stalled between the requirements and the go-live, and the apps are installed but not trusted.
- You want the apps set up first and custom code only where the specification proves a gap.

If the system is already live and the question is a missing report or an integration, the [customisation page](/services/odoo-customization/) is the better starting point.

## What an implementation includes

The scope is written after discovery and covers the apps your processes need: HR and payroll, accounting, sales, purchasing, inventory, projects and POS. Within it:

- A requirements workshop with your stakeholders and, where you have them, your consultants and accountant.
- A functional specification and gap analysis, marking each requirement as configured or built.
- Configuration on a staging database, demonstrated in short cycles before anything reaches production.
- Data migration: cleanse, trial load, verification of opening balances, stock and open documents.
- UAT with your key users against the specification, and training in Arabic or English.
- Go-live and hypercare through the first weeks, described on the [support page](/services/odoo-support/).

My experience includes work within a large multi-company Odoo suite; what the scope covers for each company in a group is settled at discovery and written down.

## Before the workshop: what to bring

Discovery goes faster, and the specification comes out more accurate, when these arrive before the first session. None of them needs to be polished.

- A list of the companies, branches and currencies that will live in the system.
- Your current chart of accounts, even if you intend to replace it.
- One example of each document you issue today: quotation, sales invoice, purchase order, goods receipt, payslip, delivery note.
- The approval chains as they actually run: who signs a purchase, who releases a payment, who approves leave.
- Export samples from the current system or spreadsheets: customers, suppliers, products, employees, open invoices, stock on hand.
- The names of the key users per department, the people who will test and sign off.
- The reports management reads today, with an example of each.
- Any regulatory constraint you already know about: VAT registration, e-invoicing obligations, payroll filings.

## What the gap analysis decides on an implementation

Every requirement is mapped to standard Odoo before any code is considered, and the table shows the kind of decision that comes out of the gap analysis, with examples from the domains I work in. How the rows marked Build are then written, and the checklist they are held to, is on the [customisation page](/services/odoo-customization/).

| Requirement | Decision | Why |
|---|---|---|
| Purchase orders above an agreed amount need a second approval | Configure | Standard purchase approval settings cover it |
| Room rates that move with demand and occupancy | Build | No standard app prices reservations this way; delivered as custom modules for the hotel system |
| Allowances and deductions on the payslip | Configure first | Salary rules are configurable; code only for a rule the engine cannot express |
| Leave approved by the line manager, then HR | Configure | The standard Time Off approval chain covers it |
| Invoice layout with your branding in Arabic and English | Configure, then report | Standard layout settings first; a QWeb report only if the layout needs more |
| Stock valued automatically and reordered per warehouse | Configure | Standard inventory valuation settings and reordering rules cover it |

## Saudi localisation and ZATCA e-invoicing

For Saudi companies the scope includes the Saudi chart of accounts, VAT and ZATCA Phase 2 e-invoicing, set up through Odoo's standard Saudi localisation modules.

Payroll filings such as GOSI and WPS, the Mudad platform and Hijri date handling are assessed with your accountant at discovery, so that the specification states what the standard modules cover and what does not belong in the first release. Broader questions about e-invoicing are answered on the [FAQ](/faq/).

## Bilingual rollouts: English management, Arabic users

Gulf implementations often run in two languages: management reads English, the people posting the transactions read Arabic. The workshop and the specification follow your decision-makers; training, user guides and printed documents are prepared in Arabic, English or both, so the manual and the screen agree.

## Related work

- [Hotel management system](/work/hotel-management-system/): front office, rate management, night audit and POS across outlets, built on Odoo and in production at Grand Hotel Tartus. An implementation where most of the front office had to be built rather than configured.
- [Construction project suite](/work/construction-project-suite/): CSI cost coding, BOQ comparison and budget control on Odoo 19 for contracting clients, delivered as an employee of iLines Solutions.
