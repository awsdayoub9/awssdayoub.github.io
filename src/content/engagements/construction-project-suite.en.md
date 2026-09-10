---
key: "construction-project-suite"
order: 3
lang: "en"
sector: "Contracting"
title: "Budget control that says no before the money leaves."
status: "progress"
status_label: "In progress · 2025 – present"
period: "2025 – present"
client: "Contracting-sector clients via iLines Solutions (clients not named), Odoo 19"
attribution: "Delivered as an employee of iLines Solutions."
role: "Developing the project modules, the budget-control mixin and the migration scripts as an employee of iLines Solutions."
situation: "Project cost control for contracting clients on Odoo 19: CSI cost coding, BOQ comparison, manpower analytics, management dashboards and spending limits on purchase requests, receipts and payment documents."
situation_detail: "Custom project modules for contracting-sector clients on Odoo 19: CSI cost coding, BOQ comparison, manpower analytics and management dashboards, plus a budget-control layer that enforces spending limits on purchase requests, receipts and payment documents. The modules are live on client projects and keep evolving, so migration scripts carry live project data across module upgrades."
approach: "The suite is built as custom project modules on Odoo 19: modules for CSI cost coding, BOQ comparison, manpower analytics and management dashboards, plus a reusable validation mixin that enforces spending limits on purchase requests, receipts and payment documents. Because the modules are live on client projects, migration scripts carry live project data across each module upgrade."
scope: "CSI cost coding, BOQ comparison, manpower analytics, management dashboards, a validation mixin enforcing spending limits on purchase requests, receipts and payment documents, and migration scripts for live project data."
delivered: "Custom project modules for CSI cost coding, BOQ comparison, manpower analytics and management dashboards, plus a reusable validation mixin that enforces spending limits on purchase requests, receipts and payment documents; migration scripts carry live project data across module upgrades."
stack:
  - "Odoo 19"
  - "Python mixins"
  - "Dashboards"
  - "Migration scripts"
odoo_version: "19"
updated: "2026-09-06"
record:
  version: "Odoo 19"
  modules:
    - "CSI cost coding"
    - "BOQ comparison"
    - "Manpower analytics"
    - "Management dashboards"
    - "Budget-control mixin"
    - "Migration scripts"
  integrations:
    - "Spending-limit validation on purchase requests, receipts and payment documents"
  role: "Project modules, budget-control mixin and migration scripts (iLines Solutions)"
  status: "In progress"
schematic_alt: "Schematic of the construction suite on Odoo 19. A standard Project carries CSI cost codes. Custom modules cover CSI cost coding, BOQ comparison, manpower analytics and management dashboards. The budget-control mixin enforces spending limits on the purchase request, the receipt and the payment document. Migration scripts carry live project data across module upgrades."
detail_note: "Migration scripts carry live project data across upgrades."
titleblock:
  project: "Project suite"
  odoo: "19"
  status: "In progress"
  role: "Build, migrate"
screenshots: []
---
