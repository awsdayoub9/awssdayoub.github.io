---
title: "Configuration Before Customisation in Odoo | Aws Dayoub"
description: "The sequence I follow before writing Odoo code: standard app, configuration, automation, inherited module, last resort. With examples and upgrade costs."
h1: "Configuration before customisation: how I decide what to build in Odoo"
lead: "Every requirement goes through the same sequence before any code is written. This is the sequence, with examples from approval workflows, reports, portal pages and budget control, what skipping it costs at upgrade time, and how the specification records each decision."
og_alt: "Configuration before customisation: how Aws Dayoub decides what to configure and what to build in Odoo."
locale: en
translationKey: insights/configuration-before-customisation
kind: article
updated: 2026-09-06
pubDate: 2026-09-06
tags:
  - configuration
  - customisation
  - functional specification
  - upgrade-safe
breadcrumb: Configuration before customisation
related:
  - /services/odoo-customization/
  - /how-i-work/
  - /insights/odoo-migration-14-to-19-lessons/
  - /services/odoo-migration/
  - /work/construction-project-suite/
  - /work/hotel-management-system/
questions: []
cta:
  heading: "Bring me a requirement"
  body: "Send one requirement you think needs custom code. I will reply with where it lands in the sequence and why, before any quote."
  whatsapp_label: "Message on WhatsApp"
  email_label: "Send an email"
draft: true
sources:
  - label: "Upgrade — Odoo 19.0 documentation"
    url: "https://www.odoo.com/documentation/19.0/administration/upgrade.html"
  - label: "Upgrade a customized database — Odoo 19.0 developer howto"
    url: "https://www.odoo.com/documentation/19.0/developer/howtos/upgrade_custom_db.html"
  - label: "Automation rules — Odoo 19.0 documentation"
    url: "https://www.odoo.com/documentation/19.0/applications/studio/automated_actions.html"
  - label: "Studio — Odoo 19.0 documentation"
    url: "https://www.odoo.com/documentation/19.0/applications/studio.html"
  - label: "Approval rules (Studio) — Odoo 19.0 documentation"
    url: "https://www.odoo.com/documentation/19.0/applications/studio/approval_rules.html"
  - label: "ORM API, inheritance and extension — Odoo 19.0 developer reference"
    url: "https://www.odoo.com/documentation/19.0/developer/reference/backend/orm.html"
  - label: "Request managers approval for expensive orders — Odoo documentation, earlier version"
    url: "https://www.odoo.com/documentation/13.0/applications/inventory_and_mrp/purchase/purchases/rfq/approvals.html"
---

"Configuration before customisation" is the phrase on my home page, and this is the argument behind it. The short version is a sequence: the standard app, then configuration, then automation and settings, then an inherited module, and only then something built from the ground up. Each step is cheaper to own than the next, and each must be shown not to cover the need before I move on. The specification records the decision, so the reason survives after everyone has forgotten the meeting.

## The cost nobody quotes

Custom code is quoted once and paid for at every upgrade: the standard apps are upgraded by the upgrade process, the custom modules by whoever maintains them, refactored for the target version with every renamed API and changed view attribute between the two versions accounted for, as my [migration notes](/insights/odoo-migration-14-to-19-lessons/) show. Every line of custom code is a line someone will read again at each upgrade, so the first question is always whether the line needs to exist.

## The sequence

### The standard app, as shipped

The first test is whether the standard app already does it, perhaps under a different name or in a different place. Many customisation requests raised in workshops are for a feature that exists and has not been switched on. Demonstrating the standard flow on a test database, with the client's own data, settles most of them.

### Configuration

Settings, sequences, chart of accounts, taxes, pricelists, warehouse routes, salary structures, user groups and record rules. Configuration changes behaviour without adding code, and the upgrade carries it. The specification records each configured item, because configuration that is not written down is lost the first time someone asks why the system behaves as it does.

### Automation and settings that reach further than they look

Odoo's automation rules execute predefined actions in response to a trigger: values updated, a date reached, an email received. The actions include updating or creating records, creating activities, sending emails and calling webhooks. Studio, in Odoo's own words, is a toolbox used to customise Odoo without coding knowledge, covering fields, views, reports, automation rules and approval rules; it is an Enterprise feature. Where a client has it, many approval steps, notifications and derived fields can live there without a module, and each rule belongs in the configuration register with its purpose, because Studio customisations still have to be tested after every upgrade and are harder to keep in a repository.

### An inherited module

When behaviour has to change, an inherited module is the next step. Odoo's ORM offers extension, where a module uses `_inherit` without `_name` and modifies an existing model in place, and delegation, where `_inherits` lets a model use the fields of another. Views are inherited the same way, by XPath on the parent view. A module built this way adds fields, constraints, computed values and steps to a standard object without touching Odoo's own code. I do not edit core; an edited core is a database that can never be upgraded cleanly.

### Built from the ground up, as a last resort

Some things have no standard object to inherit from: a hotel guest folio is not an invoice, and a night audit is not a journal entry. When the domain object does not exist, a new model is the honest answer, and the specification says why. The cost is known in advance: this is the code that will be ported at every upgrade.

## Four examples, as design choices

| Requirement | Where it lands | Why |
|---|---|---|
| Purchase orders above an amount need a manager's approval | Configuration first; an approval rule where the chain is conditional | Purchase has long shipped an order-approval setting with a minimum amount, and on Enterprise, Studio approval rules cover approvals on a button; code only if the chain depends on data neither can read |
| A management report in the client's own layout | An inherited QWeb template | The data is standard; only the presentation changes. The template is inherited by XPath and re-tested at every upgrade |
| A portal page where customers order without back-office access | An inherited module: controllers, templates and access rules | The portal framework exists; the page, its routes and its record rules do not. Standard portal security is extended, never replaced |
| Spending limits on purchase requests, receipts and payment documents | An inherited module: a validation mixin applied to each document | The rule is the same on three documents and must block, not warn. A mixin holds the rule once, and each document inherits it |

The last two match work in my engagement summaries, the [portal POS](/work/portal-pos-tap-payments/) and the [construction suite](/work/construction-project-suite/); the [hotel system](/work/hotel-management-system/) is the ground-up case. The step is chosen by what the standard cannot do, not by what is quickest to write.

## What skipping the sequence costs at upgrade time

- A core edit is lost at the first upgrade, or blocks it.
- A custom model that duplicates a standard one, a customer table next to partners, is maintained forever and never benefits from Odoo's own improvements.
- Logic written in code that could have been an automation rule has to be ported at each version; the rule would have been carried.
- A report built as a new template rather than an inherited one drifts from the standard report until the two disagree.
- Custom code that solved a process problem preserves the problem. The process stays wrong, now with software around it.

Each of these arrives as a line in the upgrade estimate; what the upgrade process asks of custom code before it starts is in the migration notes linked above. How I assess a database with this history is on the [migration service page](/services/odoo-migration/).

## How the specification records the decision

The functional specification I write after discovery has one row per requirement, and each row holds:

- The requirement, in the client's words.
- The standard behaviour: what Odoo does out of the box, shown on the test database.
- The decision: configured, automated, inherited or built.
- Where: the setting, the rule, or the module and the model.
- The reason: what the standard could not do, in one sentence.
- The upgrade note: what has to be re-tested or ported at the next version.

The client signs the specification, and the rows marked built are the entire custom scope; later scope changes are written against the same rows. The process is on [how I work](/how-i-work/), and the module checklist every built row is held to, with the cases where I decline to write code at all, is on the [customisation page](/services/odoo-customization/).

## Why a sequence, and not judgement case by case

Because judgement case by case drifts towards code. Code is satisfying to write and easy to quote. The sequence is a brake on both: it forces the standard demonstration first, makes every skipped step visible in the specification, and leaves the client with a system that Odoo carries forward rather than whoever maintains the modules.
