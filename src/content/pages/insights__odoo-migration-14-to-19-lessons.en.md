---
title: "What Breaks Upgrading Odoo 14 to 19: Checklist | Aws Dayoub"
description: "Notes from Odoo upgrades between 14 and 19: the module inventory, what breaks first in views, ORM and controllers, migration scripts, and pre-cut-over tests."
h1: "Upgrading custom modules from Odoo 14 to 19: what breaks, in order"
lead: "Process notes from database and custom-module upgrades I have run between Odoo 14 and 19: the inventory before, what breaks during, and the checks that decide whether to cut over."
og_alt: "Upgrading custom modules from Odoo 14 to 19: technical notes by Aws Dayoub on what breaks, migration scripts and pre-cut-over tests."
locale: en
translationKey: insights/odoo-migration-14-to-19-lessons
kind: article
updated: 2026-09-06
pubDate: 2026-09-06
tags:
  - migration
  - upgrade
  - custom modules
  - migration scripts
breadcrumb: Migration lessons
related:
  - /services/odoo-migration/
  - /services/odoo-customization/
  - /work/construction-project-suite/
  - /insights/configuration-before-customisation/
  - /services/odoo-support/
questions:
  - q: "What breaks first in custom modules between major versions?"
    a: "Views, because they are validated when the module loads, before any record is read. Between 14 and 19 the two changes that stop a module at that point are the removal of attrs and states in 17 and the rename of tree to list in 18. ORM calls fail next, when code runs: the deprecated name_get, the changed _read_group signature, the access methods introduced in 18. Controllers fail only when a request arrives, and in 19 that is the type='json' alias. Reports fail when printed. Testing in that order brings the expensive surprises forward."
  - q: "Why do custom views fail after an upgrade when the models still load?"
    a: "Because the upgrade process carries the database, not the code. The models load because the Python was ported. The views fail because they are XML, validated against the target version's view architecture at load time, and that architecture changed: attribute syntax in 17, the list root element in 18. An inherited view that targets a core element by XPath fails for a second reason, when the core view it points at has moved. The fix is mechanical once found; finding it before users do is the point of the empty-database install."
cta:
  heading: "Planning an upgrade?"
  body: "Send me the list of your custom modules and the version you are on. I will tell you what I would check first, before any quote."
  whatsapp_label: "Message on WhatsApp"
  email_label: "Send an email"
draft: true
sources:
  - label: "Upgrade — Odoo 19.0 documentation"
    url: "https://www.odoo.com/documentation/19.0/administration/upgrade.html"
  - label: "Upgrade a customized database — Odoo 19.0 developer howto"
    url: "https://www.odoo.com/documentation/19.0/developer/howtos/upgrade_custom_db.html"
  - label: "Upgrade scripts — Odoo 19.0 developer reference"
    url: "https://www.odoo.com/documentation/19.0/developer/reference/upgrades/upgrade_scripts.html"
  - label: "Neutralized database — Odoo 19.0 documentation"
    url: "https://www.odoo.com/documentation/19.0/administration/neutralized_database.html"
  - label: "ORM changelog — Odoo 19.0 developer reference"
    url: "https://www.odoo.com/documentation/19.0/developer/reference/backend/orm/changelog.html"
  - label: "View architectures — Odoo 17.0 developer reference"
    url: "https://www.odoo.com/documentation/17.0/developer/reference/user_interface/view_architectures.html"
  - label: "View architectures — Odoo 18.0 developer reference"
    url: "https://www.odoo.com/documentation/18.0/developer/reference/user_interface/view_architectures.html"
  - label: "Assets — Odoo 15.0 frontend reference"
    url: "https://www.odoo.com/documentation/15.0/developer/reference/frontend/assets.html"
  - label: "Web controllers — Odoo 19.0 developer reference"
    url: "https://www.odoo.com/documentation/19.0/developer/reference/backend/http.html"
  - label: "odoo/odoo pull request: deprecated type='json' alias for type='jsonrpc'"
    url: "https://github.com/odoo/odoo/pull/195132"
  - label: "External RPC API — Odoo 19.0 developer reference (deprecation notice)"
    url: "https://www.odoo.com/documentation/19.0/developer/reference/external_rpc_api.html"
  - label: "Odoo forum: Since 17.0, the attrs and states attributes are no longer used"
    url: "https://www.odoo.com/forum/help-1/since-170-the-attrs-and-states-attributes-are-no-longer-used-239190"
  - label: "Odoo forum: Wrong value for ir.ui.view.type 'tree' on Odoo 18"
    url: "https://www.odoo.com/forum/help-1/odoo18-valueerror-wrong-value-for-iruiviewtype-tree-in-docker-283593"
---

Most of what goes wrong in an Odoo upgrade is visible before it starts: the custom modules are known, the versions between source and target are known, and what each version changed is documented. The work is to look at all three before the upgraded database arrives, not after.

These notes come from the upgrades I have run between Odoo 14 and 19, from 14 to 18 with an employer in Dubai and to 19 with my current employer in Riyadh. What a migration engagement includes is on the [migration service page](/services/odoo-migration/); this page is the technical side.

## What an upgrade is, and what it is not

Odoo's upgrade documentation defines an upgrade as moving a database from an older version to a newer supported version, and lists what it does not cover: downgrading, switching editions, changing hosting type, and migrating from another ERP. Server moves and data imports from another system are different jobs; this article is about the version upgrade.

One documented rule shapes the rest: a database that contains custom modules cannot be upgraded until a version of those modules exists for the target version. The upgrade process carries standard data and configuration; the custom code is my job, and where the time goes.

## Before: the inventory

I start with a written inventory, not with the database.

- Every custom module, its version string and its dependencies, including third-party modules.
- Which modules add models or fields, change views, add controllers or reports, or ship JavaScript, because each group fails differently.
- Custom reports, QWeb PDF and XLSX, with a printed sample of each from production, and any Studio customisations, which still have to be tested against the ported modules.
- Every integration and where its credentials live, plus the scheduled actions and mail templates that custom modules created.

Odoo's howto for upgrading a customised database gives two pieces of advice I follow first: stop developments, because a feature that keeps changing has to be re-upgraded and re-tested each time, and make the custom modules install on an empty database in the target version before touching the upgraded copy of production, which separates code errors from data errors.

## During: what breaks first in custom modules

Custom modules break in a predictable order: views at module load, before any record is read; then ORM calls; then controllers, only when a request reaches them; then reports, only when someone prints one. The table lists the changes I check for at each hop; sources are at the end of the page.

| Hop | Change | How it shows up |
|---|---|---|
| Views, 17 | `attrs` and `states` are gone; `invisible`, `readonly` and `required` take Python expressions; `column_invisible` hides a list column | Module load fails: "Since 17.0, the attrs and states attributes are no longer used" |
| Views, 18 | The root element of list views is `list`; the previous name was `tree` | "Wrong value for ir.ui.view.type: 'tree'" |
| ORM, 17 | `name_get` deprecated; read `display_name` instead. `_read_group` has a new signature | Deprecation warnings, then wrong labels; custom grouping code raises |
| ORM, 18 | New access methods `check_access`, `has_access` and `_filtered_access` combine rights and rules | Older access helpers in custom code need review |
| Controllers, 19 | `type='json'` becomes a deprecated alias of `type='jsonrpc'` | A single warning in the log, then silence |
| Assets, 15 | Assets are bundles declared under the manifest `assets` key | JavaScript and templates missing from the bundle |

The database upgrade fixes none of this; the custom views, methods and routes arrive exactly as they were. The loud failures are the cheap ones. A view that refuses to load is found at once. A record rule that references a renamed field, a computed field whose dependency changed, or a QWeb template that inherits a core template by XPath after the core structure moved, fails quietly and is found by a user.

The `type='json'` deprecation ships with a rewrite script, `odoo-bin upgrade_code --script route-jsonrpc`; the diff still has to be read. Odoo 19's external API reference also marks the XML-RPC and JSON-RPC endpoints as scheduled for removal in a later release; integrations that call them keep working on 19 and go on the plan.

## Migration scripts versus configuration

A migration script is a Python file with a `migrate(cr, version)` function that Odoo runs while a module is being updated. The reference defines the layout: a version folder under `migrations/` holding `pre-*.py`, `post-*.py` and `end-*.py` files, run in that order and in lexical order within each phase, and only when the version in the folder name is above the installed one. A script in a wrongly numbered folder never runs, and nothing tells you.

A script holds anything that must happen to existing rows and cannot be expressed as data: renaming a column while keeping its values, moving values from a field that no longer exists into a new model, recomputing stored fields whose formula changed. A pre-script does the renames before the model loads, so the old column is not dropped; a post-script fills the new structures once the model exists.

Configuration does not belong in a script. Settings, sequences, groups, mail templates and automated actions are records; they belong in the module's data files or in the configuration register the functional specification maintains. A script that creates configuration hides it from the next person.

The construction suite I work on as an employee of iLines Solutions is where this discipline is not optional. The modules are live on client projects and keep evolving, so each module upgrade ships with scripts that carry the live project data across; the [engagement summary](/work/construction-project-suite/) describes the scope. The habit is the same on any project: log the row counts before, run, log them after, compare.

## Testing the migrated database before cut-over

The upgraded test database is neutralised before anyone clicks through it: planned actions, outgoing emails, bank synchronisation, payment providers, delivery methods and IAP tokens are deactivated. Some things can only be tested by re-enabling them deliberately, one at a time.

The upgrade documentation lists what to check on the upgraded database: deactivated views, views still displaying correctly, reports generating correctly, mail templates, translations, filters and exports. I add the checks that concern custom code:

- Install and update every custom module with no errors, and no warnings that were not there before.
- Log in as one user from each access group and open every custom menu, form and list.
- Print every custom report and compare it with the production sample.
- Compare record counts on every model a migration script touched; balances, stock and open documents are checked with key users against the service page's validation list.
- Trigger every integration against its test endpoint.
- Run the scheduled actions by hand, one at a time.
- Repeat the sequence on a fresh upgraded copy, because changes made to production after the upload are not in the upgraded database.

The howto's last piece of advice is the one most often skipped: a full rehearsal of the production upgrade shortly before it, on a fresh copy. If it fails, the date moves.

## After: cut-over and the first weeks

Cut-over is the rehearsal repeated on production, with developments frozen. Then the neutralisation is undone deliberately: outgoing mail, planned actions, payment providers and integrations come back one at a time, each watched. Users find what the tests did not, mostly in reports; what the first weeks cover is on the [support page](/services/odoo-support/).
