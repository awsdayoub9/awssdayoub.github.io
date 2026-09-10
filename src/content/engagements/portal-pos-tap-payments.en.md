---
key: "portal-pos-tap-payments"
order: 2
lang: "en"
sector: "Portal and payments"
title: "Ordering and paying without the back office."
status: "deployment"
status_label: "Client deployment · 2025"
period: "2025"
client: "Client deployment via iLines Solutions, Riyadh (client not named)"
attribution: "Delivered as an employee of iLines Solutions."
role: "Built the portal POS and the payment integration as an employee of iLines Solutions."
situation: "Portal users browse a catalogue, place simplified orders and track them without back-office access; online payments through Tap are reconciled and posted automatically into Sales and Accounting."
situation_detail: "Portal users browse a catalogue, place simplified orders and track their status without back-office access. Online payments go through the Tap gateway: each transaction's state is reconciled on return and posted automatically into Sales and Accounting, with a custom order model bridging into the standard Sales app."
approach: "The portal POS was built on Odoo's website and portal layer: controllers, QWeb templates and JavaScript on the front end, backed by a custom order model that bridges into Sales. The Tap payment gateway was integrated through its redirect and callback flows, with transaction states reconciled on return and the result posted automatically into Sales and Accounting."
scope: "Portal catalogue, simplified orders with status tracking, custom order model bridging into Sales, Tap payment gateway with redirect and callback flows, transaction-state reconciliation, automatic posting to Sales and Accounting."
delivered: "A lightweight POS in the Odoo portal backed by a custom order model, with Tap redirect and callback handling, transaction-state reconciliation and automatic posting into Sales and Accounting."
stack:
  - "Odoo portal controllers"
  - "QWeb"
  - "JavaScript"
  - "Tap API"
odoo_version: ""
updated: "2026-09-06"
record:
  version: "Odoo"
  modules:
    - "Portal catalogue"
    - "Portal order"
    - "Payment transaction handling"
    - "Order tracking in the portal"
  integrations:
    - "Tap payment gateway (redirect, callback, reconciliation)"
    - "Sales"
    - "Accounting"
  role: "Portal POS and payment integration (iLines Solutions)"
  status: "Client deployment"
schematic_alt: "Schematic of the portal POS. A portal user browses the catalogue and places a portal order, which bridges into a standard Sales order and redirects the user to the Tap gateway. Tap's callback updates the payment transaction, which reconciles its state, posts to Sales and Accounting and updates order tracking for the user. Tap is an external integration."
detail_note: ""
titleblock:
  project: "Portal POS"
  odoo: "Odoo"
  status: "Deployed"
  role: "Build, integrate"
screenshots: []
---
