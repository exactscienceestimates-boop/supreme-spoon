# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

This is a **Roofing CRM automation platform** built on **Zoho One**. The goal is
end-to-end automation of the roofing business lifecycle: marketing → lead capture →
estimate → permit → material order → production scheduling → invoice → close.

All orchestration happens through Zoho APIs, Zoho Creator (custom apps/scripts), and
custom integration code (webhooks, serverless functions, or middleware) that stitches
Zoho modules together.

---

## Zoho One Modules in Use & Their Roles

| Module | Role |
|---|---|
| **Zoho CRM** | Source of truth for leads, contacts, accounts, deals, activities |
| **Zoho Creator** | Custom apps: inspection forms, job tracking, permit tracker, material order intake |
| **Zoho Books** | Estimates (quotes), invoices, purchase orders, payments |
| **Zoho Projects** | Production scheduling, job phases, task assignments for crews |
| **Zoho Analytics** | Reporting dashboards (pipeline, revenue, job costs, marketing ROI) |
| **Zoho Campaigns / Marketing Automation** | Lead nurturing, drip emails, campaign tracking |
| **Zoho Flow** | No-code/low-code automation flows between modules |
| **Zoho Cliq / Mail** | Internal comms and customer-facing email triggers |
| **Zoho Sign** | E-signature on estimates and contracts |
| **Zoho WorkDrive** | Document storage: permits, photos, contracts, material sheets |

---

## Business Pipeline & Automation Touchpoints

```
[Marketing] → [Lead Capture] → [Qualification] → [Estimate] → [Contract/Sign]
     → [Permit] → [Material Order] → [Production] → [Inspection] → [Invoice] → [Collect]
```

### Stage Details

1. **Marketing** — Zoho Campaigns / Meta/Google Ads → lead forms → CRM
2. **Lead Capture** — Web forms, Zoho CRM web-to-lead, Creator intake forms, phone/Cliq
3. **Qualification** — CRM lead scoring, auto-assign to sales rep, schedule inspection
4. **Estimate** — Creator inspection form populates Zoho Books quote; Zoho Sign for approval
5. **Permit** — Creator permit tracker module: jurisdiction, submittal date, approval status
6. **Material Order** — Creator form → Zoho Books Purchase Order → supplier webhook/email
7. **Production Scheduling** — Deal won triggers Zoho Projects project creation with template phases
8. **Inspection / QC** — Creator mobile form for job-site photos, checklist, sign-off
9. **Invoice** — Auto-generated from Books quote on project completion milestone
10. **Collection** — Zoho Books payment links, reminders, Zoho Sign lien waivers

---

## Zoho API Conventions

### Authentication
- All Zoho APIs use **OAuth 2.0** (server-side, self-client, or org-based tokens).
- Refresh tokens are long-lived; store them in environment variables, never in code.
- Token endpoint: `https://accounts.zoho.com/oauth/v2/token`
- Scope pattern: `ZohoCRM.modules.ALL,ZohoBooks.fullaccess.all,ZohoCreator.form.CREATE`

### Base URLs (US data center — adjust if on EU/AU/IN)
```
CRM:      https://www.zohoapis.com/crm/v6/
Books:    https://www.zohoapis.com/books/v3/
Creator:  https://www.zohoapis.com/creator/v2.1/
Projects: https://www.zohoapis.com/projects/v3/portals/{portal_id}/
Flow:     triggers via webhooks, no direct REST needed
```

### Key Patterns
- CRM records use `id` fields (18-char alphanumeric); always reference by ID in
  cross-module links, never by name.
- Books requires `organization_id` as a query param on every request.
- Creator uses `app_name` and `form_name` in the URL path.
- All list endpoints paginate with `page` + `per_page`; max 200 records per page.
- Webhooks from Zoho deliver JSON; validate the `x-zoho-webhook-token` header.

---

## Zoho Creator App Structure

Creator apps live under an **owner account** and contain **forms**, **reports**,
and **pages**. Deluge (Zoho's scripting language) is used for field logic, workflow
triggers, and API calls within Creator.

### Apps to Build / Already Built
- `roofing-crm` — main app
  - **Forms**: `Lead_Intake`, `Inspection_Report`, `Permit_Tracker`,
    `Material_Order`, `Job_Completion_Checklist`
  - **Reports**: `Open_Jobs`, `Permit_Status_Board`, `Material_Orders_Pending`
  - **Pages**: crew dashboard, manager overview

### Deluge Conventions
- Use `invokeurl` for all outbound API calls within Deluge.
- Store OAuth tokens in **Zoho Creator Connections** (not hardcoded).
- Prefix custom functions with the stage they belong to:
  `lead_`, `estimate_`, `permit_`, `production_`, `invoice_`.
- All Deluge workflow scripts live in `/creator/scripts/` in this repo as `.dg` files
  for version control (Zoho Creator itself is the runtime).

---

## Integration / Middleware Code

Any custom code outside Zoho (Node.js/Python serverless, webhook handlers, etc.) lives
in `/integrations/`. Structure:

```
/integrations/
  /zoho-auth/        # Token refresh helpers, OAuth flow
  /crm/              # CRM record create/update helpers
  /books/            # Estimate and invoice generation
  /creator/          # Creator form submission triggers
  /webhooks/         # Inbound webhook handlers (Zoho → external)
  /suppliers/        # Outbound to supplier APIs (ABC Supply, SRS, etc.)
```

### Environment Variables Required
```
ZOHO_CLIENT_ID
ZOHO_CLIENT_SECRET
ZOHO_REFRESH_TOKEN
ZOHO_ORG_ID           # Books organization ID
ZOHO_PORTAL_ID        # Projects portal ID
ZOHO_CREATOR_OWNER    # Creator account owner username
ZOHO_CREATOR_APP      # Creator app link name
```

---

## Key Workflows to Keep in Mind

- **Lead → Deal**: Web form submission → CRM Lead created → auto-converted to Deal
  on qualification → triggers inspection scheduling.
- **Estimate approval**: Books Quote sent via Zoho Sign → on signature → Deal stage
  moves to "Estimate Approved" via CRM webhook.
- **Permit loop**: Creator permit form updated → if status = "Approved" → Zoho Projects
  production phase unlocked via API.
- **Job completion → Invoice**: Projects milestone "Job Complete" marked → webhook →
  auto-create Books Invoice from linked Quote line items.
- **Payment received**: Books payment webhook → CRM Deal stage = "Closed Won" →
  Cliq notification to manager.

---

## Data Model Cross-Reference

| Entity | CRM Module | Books Entity | Creator Form | Projects |
|---|---|---|---|---|
| Customer | Contact + Account | Customer | — | Client |
| Job | Deal | Quote → Invoice | Inspection_Report | Project |
| Permit | Custom Module | — | Permit_Tracker | Task (phase) |
| Material Order | — | Purchase Order | Material_Order | Task |
| Crew | (Users/Vendors) | Vendor | — | Users |

---

## Zoho Connections (no direct API key needed in code)

For Creator Deluge scripts, use named **Connections** (configured in Creator → Settings
→ Connections) so secrets never appear in script code:
- `zoho_crm_connection`
- `zoho_books_connection`
- `zoho_projects_connection`
- `zoho_sign_connection`

---

## Development Workflow

1. Build/test Creator forms and Deluge scripts inside Zoho Creator's IDE first.
2. Export Deluge scripts to `/creator/scripts/` for version control.
3. Build integration middleware locally against Zoho sandbox org before production.
4. Use Zoho's **Sandbox** environment (CRM → Setup → Sandbox) for testing automations
   without touching live data.
5. Zoho Flow automations are documented in `/docs/flows/` as diagrams or markdown
   since they can't be exported as code.

---

## To Add Later

- Specific supplier API details (ABC Supply, SRS, Beacon, etc.)
- Custom CRM module API names (check via CRM → Setup → Developer Space → APIs)
- Data center adjustment if org is on EU/AU/IN (swap base URLs above)
- Phone/SMS integration details (Zoho Voice, Twilio, etc.)
- Measurement tool integrations (EagleView, GAF QuickMeasure, Hover, etc.)
