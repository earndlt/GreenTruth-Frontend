
# RBAC & Segregation of Duties (SoD)

## Overview

GreenTruth uses Role-Based Access Control (RBAC) to ensure users only have access according to their roles, increasing security and compliance.

### RBAC Roles

| Role     | Permissions                            |
|----------|----------------------------------------|
| Admin    | Full org/user/settings/tx control      |
| Member   | Transactional, except admin            |
| Guest    | Read-only                              |

---

## SoD Add-On (via Subscription)

When activated, SoD introduces more granular workflow separation (“park and post”)—no user may approve their own transaction:

| Role           | Key Permissions                                                                       |
|----------------|---------------------------------------------------------------------------------------|
| Administrator  | User/org/settings management; minimal tx privileges                                   |
| Treasury       | Initiate transactions, retirements, intra-org transfers                               |
| Risk           | Manage vendors, create new token batches                                              |
| Trader         | Combines Treasury & Risk                                                              |
| Professional   | 3rd party; vendor management/transaction initiation                                   |
| Manager        | Approve/post all actions (**2FA required**)                                           |
| Analyst        | Read-only                                                                             |

### SoD Permission Matrix

| Activity               | Treasury | Risk | Trader | Manager | Professional | Analyst |
|------------------------|----------|------|--------|---------|--------------|---------|
| Initiate Transactions  | ✔️       | ❌   | ✔️     | ❌      | ✔️           | ❌      |
| Approve Transactions   | ❌       | ❌   | ❌     | ✔️      | ❌           | ❌      |
| Retire/Transfer Tokens | ✔️       | ❌   | ✔️     | ✔️      | ❌           | ❌      |
| Administer Vendors     | ❌       | ✔️   | ✔️     | ❌      | ✔️           | ❌      |
| Approve Batches        | ❌       | ❌   | ❌     | ✔️      | ❌           | ❌      |
| Read-Only              | ✔️       | ✔️   | ✔️     | ✔️      | ❌           | ✔️      |

### Integration with EarnDLT

1. **Role Mapping**: Map EarnDLT user types to platform roles (see `src/context/UserContext.tsx`, `RoleSelector.tsx`).
2. **Permission Enforcement**: Use `hasPermission()` and clearly gate all sensitive actions; if SoD enabled, ensure “initiator ≠ approver/poster”.
3. **2FA Enforcement**: Manager role must have 2FA set up before approval actions.
4. **API/Sync**: When syncing with EarnDLT, always enforce platform role mapping and SoD. The “park and post” logic must be honored on UI and backend.
5. **Subscription Logic**: SoD is a Stripe billing add-on; expose SoD roles in UI only if enabled (`subscription.addons` contains `'sod'`).
6. **Testing/QA**: Test all permission and “park and post” flows as listed.

**Reference Files**:
- `src/context/UserContext.tsx`
- `src/components/settings/admin/RoleSelector.tsx`
- `src/components/settings/BillingTab.tsx`

See the in-app Knowledge Base ("RBAC & SoD" article) for user-facing help.
