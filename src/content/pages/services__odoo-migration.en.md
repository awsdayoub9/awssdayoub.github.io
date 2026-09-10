---
title: "Odoo Migration 14 to 19 with a Trial Run First | Aws Dayoub"
description: "Odoo migration from 14 to 19: database upgrade, custom modules refactored, live data carried by scripts, and a trial run validated before cut-over."
h1: "Odoo migration from 14 to 19, tested before you cut over"
lead: "The database is upgraded on a test copy, custom modules are refactored, and opening balances, stock and open documents are checked before production moves."
og_alt: "Odoo migration by Aws Dayoub: versions 14 to 19, custom modules refactored, data validated before cut-over."
locale: en
translationKey: services/odoo-migration
kind: service
updated: 2026-09-06
breadcrumb: Migration
related:
  - /work/construction-project-suite/
  - /services/odoo-customization/
  - /services/odoo-support/
questions:
  - q: "Can we skip versions and go straight from Odoo 14 to 18 or 19?"
    a: "From your side, yes: you leave the version you have and arrive on the one you want, in one project. The path between them runs on the test copy; your users never work on an intermediate version. Commercially, what matters is that the custom modules are refactored once, for the target version, rather than at every step."
  - q: "How will we know our data is intact after the upgrade?"
    a: "Through the validation checklist on this page, run on the test database before cut-over and again after it. Opening balances, stock and open documents are compared against the source system, the month-end reports are re-run and compared line by line, and your key users sign off each area. If a figure does not match, the fix goes into the migration scripts and the trial is repeated."
  - q: "Which of our custom modules should we carry forward to the new version, and which should we drop?"
    a: "The assessment answers that per module, before the quote. Some modules need deprecated APIs replaced and views adapted, some are retired because the target version covers them as standard, and a few are worth rebuilding because they were written against core. You see the list with a decision against each module, so you can drop the modules nobody uses rather than pay to migrate them."
cta:
  heading: "Ask for a migration assessment"
  body: "Tell me your current version, your edition and whether you hold the source of your custom modules. The assessment comes before the quote."
  whatsapp_label: "Message on WhatsApp"
  email_label: "Send an email"
draft: false
sources: []
---

## What a migration engagement covers

A version migration is more than running the upgrade. The engagement covers:

- The database upgrade itself, from your current version to the target, on a copy of production.
- Custom modules: assessment, refactoring of deprecated APIs, adaptation of views, and retirement of modules the target version now covers as standard.
- Migration scripts for live data, so records the custom modules own arrive in the new structure rather than being re-entered.
- Data-integrity validation after each step: counts, balances and documents compared against the source.
- A trial migration on a test database, repeated until the validation passes, with your key users testing on it.
- Cut-over planning: the freeze window, the final run, and who confirms what before users are let back in.
- Stabilisation after cut-over, handled as [support](/services/odoo-support/).

Server moves and data migration from a legacy system are different jobs; they can be scoped alongside a version migration but are quoted as their own work.

## Migrations on record

- Odoo 14 to 18 at Hash Code IT Solutions, Dubai (remote, 01/2025 to 07/2025): deprecated APIs refactored in custom modules, views adapted to the target version, data integrity validated after the upgrade.
- To Odoo 19 at iLines Solutions, Riyadh (remote, since 07/2025): custom modules across a large multi-company suite, with migration scripts that carry live project data across module upgrades on the [construction project suite](/work/construction-project-suite/).

## How the engagement runs

- **Assess.** An inventory of modules, custom code, integrations and data volumes, and a written plan: what is upgraded, refactored, retired or rebuilt.
- **Trial migrate.** The upgrade and the refactored modules run on a copy of production; the result becomes the test database.
- **Validate.** The post-upgrade checklist below, run by me and then by your key users.
- **Repeat.** Fixes go into scripts, not into the test database by hand, so the final run reproduces them.
- **Cut over.** A freeze on the old system, the final run, validation again, then users return on the new version.

## Migration readiness checklist

Answering these before discovery shortens the assessment. The ones you cannot answer are where the risk sits.

- Your current Odoo version and edition, and whether you hold the source code of every custom module.
- A list of installed modules, marking which are standard, which are third-party and which were written for you.
- Whether the system has been upgraded before, and whether the scripts from that upgrade still exist.
- The integrations that call Odoo or are called by it: payment gateways, attendance devices, portals, external systems.
- The large tables and how fast they grow: invoices, journal entries, stock moves, attendance records.
- What is open at any given moment: unposted invoices, open purchase orders, stock in transit, payslips not yet validated.
- The reports finance and management rely on at month-end, which will be re-run on the test database.
- A freeze window the business can accept for the final run, and who will sign off the validation.
- A staging server, or the capacity to host a test copy of production.

## Post-upgrade validation checklist

This is what the test database is checked against, after each trial run and again after the final one. Your key users own the last column; nothing goes live on my checks alone.

| Area | What is compared against the source | Signed off by |
|---|---|---|
| Opening balances | Trial balance per company and per journal at the cut-over date; receivable and payable ageing | Finance |
| Stock | Quantity on hand per product and location; stock valuation; moves in transit | Inventory or operations |
| Open documents | Unposted invoices, open sales and purchase orders, draft payslips, open projects and tasks | Each department's key user |
| Reports | The month-end reports named at discovery, re-run on the test database and compared line by line | Finance and management |
| Users and access | Every user logs in, sees the right companies and menus, and the record rules hold | Your administrator, with me |
| Integrations | Each external connection tested end to end against the counterpart's test environment | The owner of each integration |
| Custom modules | Each custom feature exercised on real records by the user who depends on it | Key users |

## Hosting changes who runs the upgrade

On Odoo Online the database upgrade is requested from the database manager and run by Odoo; on Odoo.sh it runs on a staging branch first; a self-hosted database is uploaded, upgraded and returned to your own server. The custom modules and the validation are my work in every case, but the test copy, the freeze window and the rollback path are planned differently, so hosting is one of the first questions at discovery.

## Related work

- [Construction project suite](/work/construction-project-suite/): migration scripts carry live project data across module upgrades on Odoo 19, delivered as an employee of iLines Solutions.
- [Odoo customisation](/services/odoo-customization/): how modules are written so that the next migration is shorter.
