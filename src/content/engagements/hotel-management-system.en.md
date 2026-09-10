---
key: "hotel-management-system"
order: 1
lang: "en"
sector: "Hospitality"
title: "A hotel that closes its own day."
status: "production"
status_label: "In production · 2024"
period: "03/2024 – 12/2024"
client: "Grand Hotel Tartus — hospitality (production deployment)"
attribution: "Built while employed at IRAM (Latakia); in production at Grand Hotel Tartus."
role: "Designed and delivered end to end: data model, business logic, views, reports and staff training."
situation: "The hotel needed a system built around its own front-office operations: reservations, rate policies, night audit and outlet billing."
situation_detail: "The hotel needed a system built around its own front-office operations: reservations and room availability, rate plans that change with demand and occupancy, outlet billing across the hotel's services, and a night audit that posts the day's revenue and closes the operating day, with reports for occupancy, revenue and daily operations."
approach: "I worked directly with hotel management and front-desk staff to map the daily operations, and that map became the system design. The property-management modules were built from the ground up on Odoo: data model, business logic, views and reports. Point of Sale was integrated across hotel outlets so service charges accumulate on the guest folio, and the night audit was automated to post the day's revenue and close the operating day. Staff were trained on the delivered system."
scope: "Front office (check-in and check-out, room assignment, reservations), room inventory and availability, guest folios, rate plans with demand- and occupancy-based pricing, automated night audit, POS across hotel outlets, reports for occupancy, revenue and daily operations."
delivered: "A property-management system as custom Odoo modules: a rate engine applying demand- and occupancy-based pricing, service charges from POS outlets accumulating on the guest folio, and a night audit that posts the day's revenue and closes the operating day. Staff were trained on the delivered system."
stack:
  - "Odoo"
  - "Python"
  - "XML views"
  - "QWeb reports"
  - "POS"
odoo_version: ""
updated: "2026-09-06"
record:
  version: "Odoo"
  modules:
    - "Reservations"
    - "Room inventory and availability"
    - "Guest folios"
    - "Rate engine"
    - "Night audit"
    - "Reports: occupancy, revenue, daily operations"
  integrations:
    - "Point of Sale across hotel outlets, service charges routed to the guest folio"
  role: "Designed and delivered end to end"
  status: "In production, Grand Hotel Tartus"
schematic_alt: "Schematic of the hotel system. A rate engine prices reservations, which check room inventory and open a guest folio. POS outlets post service charges to the folio. The night audit posts the day's revenue, closes the operating day and feeds the reports for occupancy, revenue and daily operations. POS is the standard Odoo app; the rest are custom modules."
detail_note: ""
titleblock:
  project: "Hotel PMS"
  odoo: "Odoo"
  status: "In production"
  role: "End to end"
screenshots: []
---
