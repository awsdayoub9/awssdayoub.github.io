---
title: "Odoo Freelancer FAQ: Upgrades, Pricing, ZATCA | Aws Dayoub"
description: "Twelve questions answered by the person who would do the work: upgrades, data migration, Odoo versions, Arabic training, ZATCA, pricing model, NDA and timeline."
h1: "What companies ask before hiring an Odoo freelancer, answered plainly"
lead: "These are the questions companies put to me before an Odoo project starts, answered by the person who would do the work. Four more, on remote work, ownership of code and data, life after go-live and how to start, are answered on the home page."
og_alt: "Frequently asked questions before hiring Aws Dayoub for an Odoo project: upgrades, migration, versions, Arabic training, ZATCA, pricing, NDA."
locale: en
translationKey: faq
kind: faq
updated: 2026-09-06
breadcrumb: "FAQ"
related:
  - /how-i-work/
  - /services/odoo-migration/
  - /services/odoo-support/
  - /services/odoo-implementation/
questions:
  - q: "Do you configure standard Odoo or write code?"
    a: "Both, in that order. Every requirement is mapped to standard Odoo first, and where configuration covers it, configuration is what you get. Custom code is written only for gaps recorded in the specification, as modules that inherit from standard models and views rather than replacing them, with the core left untouched. I run the requirement sessions and write the specification myself, then build whatever the specification says must be built, so you deal with one person for both sides."
  - q: "Can you sign an NDA?"
    a: "Yes. An NDA can be signed before discovery, so that process documents, sample data and financial figures can be shared in the first session without hesitation. Send your standard agreement if you have one. Confidentiality also shapes this site: client names appear only where they are already on my CV, and the two systems delivered as an employee of iLines Solutions are described by sector without naming the end client."
  - q: "Can you work alongside our existing partner or internal team?"
    a: "Yes. In both of my remote roles, at iLines Solutions in Riyadh and at Hash Code IT Solutions in Dubai, the work has run alongside functional consultants and client stakeholders: requirements come from them, built and tested modules go back. The same arrangement works with your implementation partner or your internal IT team, given a written split of who owns which module, shared access to the staging database and one repository. The one condition is that the scope for my part is written before I start."
  - q: "What happens to customisations when we upgrade?"
    a: "They are carried forward, because they are built for it. Custom modules inherit from standard models and views instead of modifying the core, so an upgrade means adapting the modules to the new framework rather than rebuilding them. I have done that work from Odoo 14 to 18 and to 19, one module at a time, with scripts that carry live data across module upgrades. Each module is delivered with documentation, which is what makes the next upgrade a known quantity."
  - q: "How is our data migrated?"
    a: "In trials, not in one step. The source data is cleansed first, then loaded into a test database, where I reconcile the trial balance, the stock on hand and every open invoice, order and payslip against the old system. Each difference is corrected and the trial run again until nothing differs. You sign off on that validated test database, and only then is the migration run for real at cut-over. Between Odoo versions the same discipline applies, with the custom modules checked alongside the data."
  - q: "Which Odoo versions do you work with?"
    a: "Odoo 14 to 19. Migration work has taken databases and custom modules from 14 to 18 and to 19, and current build work, including the construction project suite, is on Odoo 19. If you are on an older version, the first step is a migration audit of your database and custom modules. If you are starting fresh, I recommend the current version so that your first upgrade is as far away as possible."
  - q: "Do you work with Odoo Community or Enterprise?"
    a: "Whichever edition you hold or intend to buy; the edition is settled at discovery rather than assumed. It matters because the edition decides which apps are available out of the box, and therefore how much falls to configuration and how much to custom development, so the specification is written against the edition you will actually run. The method does not change with the edition: standard first, custom code only for recorded gaps."
  - q: "Can training and documentation be in Arabic?"
    a: "Yes. Arabic is my native language and I work in English at C1, so requirement sessions, training and documentation can be delivered in Arabic, in English, or in both where one team prefers each. Documentation is written in the language its readers will use, with the terms matching what they see on screen, so that the training, the manual and the system say the same thing."
  - q: "Can you integrate payments, attendance devices and government platforms?"
    a: "Yes. The delivered example is the Tap payment gateway: connected through redirect and callback flows, with each transaction reconciled on return and posted automatically into Sales and Accounting, so finance does not reconcile by hand. Biometric attendance devices and government platforms are the other areas of my integration experience. Integrations are built through Odoo controllers and REST APIs, and the data flow of each is documented, so your team knows what moves, in which direction, and which system holds the record."
  - q: "Do you handle ZATCA e-invoicing?"
    a: "Through Odoo's standard Saudi localisation modules, yes. Odoo ships ZATCA Phase 2 e-invoicing as part of that localisation, and for a Saudi client it is set up and verified in the ZATCA simulation environment before go-live, alongside the chart of accounts and VAT configuration. It is scoped at discovery as part of the implementation, not sold as a separate product, and I present it as standard functionality configured and tested rather than as something I build from scratch."
  - q: "How is pricing decided?"
    a: "After discovery, never before it. The model is one of the four under How I work: fixed scope after discovery, a support retainer for a live system, hourly customisation on a running system, or a migration audit for an older version. What moves the price is the modules in scope, the volume and condition of the data to migrate, the integrations, the custom development the specification records, and the training required. Scope changes are written up, priced and approved before work starts, so the price does not drift."
  - q: "What drives the timeline?"
    a: "The same things that drive the price, plus decisions. Modules in scope, the state of the data, the number of integrations and the amount of custom development set the size of the work. What sets the pace is how quickly your side makes decisions, whether key users are free for UAT, and how clean the source data turns out to be. The timeline is written into the scope after discovery, with its assumptions beside it. I do not quote durations before I have seen the processes."
cta:
  heading: "Still deciding?"
  body: "Describe your business in a sentence and I will tell you whether Odoo fits and how I would scope it."
  whatsapp_label: "Ask on WhatsApp"
  email_label: "Or send an email"
draft: false
sources: []
---

## Working together

### Do you configure standard Odoo or write code?

Both, in that order. Every requirement is mapped to standard Odoo first, and where configuration covers it, configuration is what you get. Custom code is written only for gaps recorded in the specification, as modules that inherit from standard models and views rather than replacing them, with the core left untouched. I run the requirement sessions and write the specification myself, then build whatever the specification says must be built, so you deal with one person for both sides.

### Can you sign an NDA?

Yes. An NDA can be signed before discovery, so that process documents, sample data and financial figures can be shared in the first session without hesitation. Send your standard agreement if you have one. Confidentiality also shapes this site: client names appear only where they are already on my CV, and the two systems delivered as an employee of iLines Solutions are described by sector without naming the end client.

### Can you work alongside our existing partner or internal team?

Yes. In both of my remote roles, at iLines Solutions in Riyadh and at Hash Code IT Solutions in Dubai, the work has run alongside functional consultants and client stakeholders: requirements come from them, built and tested modules go back. The same arrangement works with your implementation partner or your internal IT team, given a written split of who owns which module, shared access to the staging database and one repository. The one condition is that the scope for my part is written before I start.

## Building and upgrading

### What happens to customisations when we upgrade?

They are carried forward, because they are built for it. Custom modules inherit from standard models and views instead of modifying the core, so an upgrade means adapting the modules to the new framework rather than rebuilding them. I have done that work from Odoo 14 to 18 and to 19, one module at a time, with scripts that carry live data across module upgrades. Each module is delivered with documentation, which is what makes the next upgrade a known quantity.

### How is our data migrated?

In trials, not in one step. The source data is cleansed first, then loaded into a test database, where I reconcile the trial balance, the stock on hand and every open invoice, order and payslip against the old system. Each difference is corrected and the trial run again until nothing differs. You sign off on that validated test database, and only then is the migration run for real at cut-over. Between Odoo versions the same discipline applies, with the custom modules checked alongside the data.

### Which Odoo versions do you work with?

Odoo 14 to 19. Migration work has taken databases and custom modules from 14 to 18 and to 19, and current build work, including the construction project suite, is on Odoo 19. If you are on an older version, the first step is a migration audit of your database and custom modules. If you are starting fresh, I recommend the current version so that your first upgrade is as far away as possible.

### Do you work with Odoo Community or Enterprise?

Whichever edition you hold or intend to buy; the edition is settled at discovery rather than assumed. It matters because the edition decides which apps are available out of the box, and therefore how much falls to configuration and how much to custom development, so the specification is written against the edition you will actually run. The method does not change with the edition: standard first, custom code only for recorded gaps.

## Saudi and Gulf specifics

### Can training and documentation be in Arabic?

Yes. Arabic is my native language and I work in English at C1, so requirement sessions, training and documentation can be delivered in Arabic, in English, or in both where one team prefers each. Documentation is written in the language its readers will use, with the terms matching what they see on screen, so that the training, the manual and the system say the same thing.

### Can you integrate payments, attendance devices and government platforms?

Yes. The delivered example is the Tap payment gateway: connected through redirect and callback flows, with each transaction reconciled on return and posted automatically into Sales and Accounting, so finance does not reconcile by hand. Biometric attendance devices and government platforms are the other areas of my integration experience. Integrations are built through Odoo controllers and REST APIs, and the data flow of each is documented, so your team knows what moves, in which direction, and which system holds the record.

### Do you handle ZATCA e-invoicing?

Through Odoo's standard Saudi localisation modules, yes. Odoo ships ZATCA Phase 2 e-invoicing as part of that localisation, and for a Saudi client it is set up and verified in the ZATCA simulation environment before go-live, alongside the chart of accounts and VAT configuration. It is scoped at discovery as part of the implementation, not sold as a separate product, and I present it as standard functionality configured and tested rather than as something I build from scratch.

## Starting

### How is pricing decided?

After discovery, never before it. The model is one of the four under How I work: fixed scope after discovery, a support retainer for a live system, hourly customisation on a running system, or a migration audit for an older version. What moves the price is the modules in scope, the volume and condition of the data to migrate, the integrations, the custom development the specification records, and the training required. Scope changes are written up, priced and approved before work starts, so the price does not drift.

### What drives the timeline?

The same things that drive the price, plus decisions. Modules in scope, the state of the data, the number of integrations and the amount of custom development set the size of the work. What sets the pace is how quickly your side makes decisions, whether key users are free for UAT, and how clean the source data turns out to be. The timeline is written into the scope after discovery, with its assumptions beside it. I do not quote durations before I have seen the processes.

## Where these answers come from

Every answer on this page describes how I actually work, drawn from the projects on my CV rather than from a template. Where a question is about an Odoo feature rather than about working with me, Odoo's own documentation is the better source, and I will say so.

## Where to read more

- The six phases, the terms of engagement and the engagement models: [How I work](/how-i-work/).
- Validating data after an upgrade and handling custom modules during migration: [Odoo migration](/services/odoo-migration/).
- What hypercare includes, the handover pack and working with your internal admin: [Odoo support](/services/odoo-support/).
- Saudi localisation scope and preparing for discovery: [Odoo implementation](/services/odoo-implementation/).
- Remote work with Saudi and Gulf companies, ownership of code and data, life after go-live and how to start: [the home page](/).
