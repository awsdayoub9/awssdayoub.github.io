---
title: "Upgrade-Safe Odoo Customisation & Modules | Aws Dayoub"
description: "Inheritance-based Odoo modules, approval workflows, QWeb reports, dashboards, portal pages and integrations such as Tap payments, built to survive upgrades."
h1: "Odoo customisation that survives the next upgrade"
lead: "Inheritance-based modules, workflows, reports, dashboards, portal pages and integrations, written only where the specification shows a gap and delivered in a repository you own."
og_alt: "Odoo customisation and integration by Aws Dayoub: inheritance-based modules that survive upgrades."
locale: en
translationKey: services/odoo-customization
kind: service
updated: 2026-09-06
breadcrumb: Customisation
related:
  - /work/portal-pos-tap-payments/
  - /work/hotel-management-system/
  - /work/construction-project-suite/
  - /services/odoo-migration/
questions:
  - q: "When do you refuse to write custom code?"
    a: "When a setting, a standard app or a report layout already covers the need, when the request rebuilds a standard feature, or when the change would require editing core. In each case I show the configuration instead. If you still prefer code, the specification records that it was a choice rather than a gap."
  - q: "Can you build the reports and dashboards our management asks for?"
    a: "Yes. PDF reports are built with QWeb in your layout, Excel exports as XLSX, and dashboards from the data the apps already hold, with OWL components where the standard views cannot show it. The first step is a sample of the report management reads today, so the specification can say which figures come from standard fields and which need a computed one."
  - q: "How do you approach a payment-gateway integration?"
    a: "As the four-step flow in the table on this page: request, redirect and callback, reconciliation, posting. Discovery establishes which gateway, which currencies and which documents a payment must update. The integration is built on staging with the gateway's test credentials, and finance signs off on the posting before go-live. Tap is the gateway on my record; others with a redirect-and-callback model follow the same pattern."
cta:
  heading: "Describe the gap"
  body: "Tell me what standard Odoo does not do for you. I will say whether it needs a setting, a module or an integration."
  whatsapp_label: "Message on WhatsApp"
  email_label: "Send an email"
draft: false
sources: []
---

## When custom code is justified

Standard Odoo first: where configuration covers the need, that is what you get, and the order I follow before any code is the standard app, then configuration, then automation, then an inherited module. Code is written only where the specification shows a gap that no setting, no standard app and no report layout closes.

- A business rule Odoo cannot express: a rate that moves with occupancy, or a spending limit that blocks purchase requests, receipts and payments.
- A document that does not exist: a night audit that closes the operating day, or a portal order placed without back-office access.
- Data that has to move between Odoo and a system it does not know: a payment gateway, an attendance device, a government platform.

## What gets built

- Inheritance-based modules that extend standard models, views and business logic without editing core.
- Approval workflows: multi-step validation with the right approvers, states and blocking rules.
- Access rights and record rules, so each role sees and edits only what it should.
- QWeb PDF reports and Excel (XLSX) exports in your layout, in Arabic and English.
- Dashboards for management, and OWL components where the standard interface is not enough.
- Portal pages for customers, suppliers or field staff who need a narrow view of the system.

## The upgrade-safety checklist applied to every module

Every custom module is checked against this list before it reaches your staging database. It is the same list I work through when a database is migrated.

- No edits to core or to third-party modules; everything extends by inheritance.
- Views are inherited with targeted XPath, not replaced wholesale, so upstream view changes still apply.
- Business logic sits in overridden methods that call the original, never in copied core code.
- Fields, models and menus carry the module's own prefix, so they cannot collide with a future standard one.
- No direct SQL where the ORM can do the job; where it is unavoidable, it is isolated and commented.
- Access rights and record rules are declared in the module, not set by hand in the database.
- Data the module owns has a migration script from the first release, so a later upgrade has something to run.
- The module installs cleanly on an empty database and on a copy of yours.
- A README states what the module does, which standard models it touches and why.

## Integrations

Integration sits inside this engagement because the pattern is the same: a module, controllers and a documented data flow. Integration experience covers the Tap payment gateway, delivered with reconciliation into Sales and Accounting, together with biometric attendance devices and government platforms, built through controllers and REST APIs.

- Payment gateways: redirect and callback flows, transaction states, automatic posting.
- Attendance devices: device logs brought into Odoo attendance.
- Government platforms and external systems: REST calls with logging, so failures are visible.
- Portal and mobile: HTTP and JSON controllers exposing only the actions the user needs, authenticated inside Odoo.

The evidence is the [portal POS with Tap payments](/work/portal-pos-tap-payments/): portal ordering without back-office access, with each transaction reconciled on return and posted automatically.

## How a payment integration flows

The flow below is the general redirect-and-callback pattern for payment gateways. The Tap integration on my record covered its redirect and callback flows, transaction-state reconciliation and automatic posting into Sales and Accounting. Finance cares about the last two rows; an integration that stops after the second leaves them reconciling by hand.

| Step | What happens | Where it lands in Odoo |
|---|---|---|
| Request | Odoo creates a payment transaction for the order and hands the payment to the gateway | A pending payment transaction linked to the order |
| Redirect and callback | The user pays on the gateway's page and returns; the gateway calls Odoo's callback controller with the result | The callback controller updates the transaction state |
| Reconciliation | The returned transaction state is reconciled with the order, so a paid, failed or abandoned payment each ends in the right state | Transaction and order agree; anything unresolved is left for review |
| Posting | A confirmed payment posts into Sales and Accounting without anyone re-keying it | Order confirmed in Sales; payment recorded in Accounting |

The same shape applies to an attendance device or a government platform, and the documented flow is handed over with the module.

## What you receive with every module

The module in a repository you own, installable on an empty database and on a copy of yours; a README naming the standard models it touches; access rights declared in the module rather than set by hand; a demonstration on your staging database before release; and, for an integration, the documented data flow and the callback addresses to check when it fails.

## Related work

- [Portal POS and Tap payments](/work/portal-pos-tap-payments/): the integration evidence above, delivered as an employee of iLines Solutions.
- [Hotel management system](/work/hotel-management-system/): front-office modules built from the ground up, including the rate engine and the night audit.
- [Construction project suite](/work/construction-project-suite/): a validation mixin, management dashboards and migration scripts on Odoo 19.
