
import React from "react";
import { Shield } from "lucide-react";

// RBAC & SoD article (UI only; used within article list)
const RbacAndSodArticle = () => (
  <div className="prose max-w-none">
    <strong><h2>Role-Based Access Control (RBAC)</h2></strong>
    <p>
      Our platform provides flexible, secure access management through Role-Based Access Control (RBAC).
      RBAC aligns your organization’s user permissions with EarnDLT system user types and enables seamless integration for authorized users.
    </p>
    <h3>RBAC User Types:</h3>
    <ul>
      <li>
        <strong>Admin:</strong> Has full platform permissions, including managing users, profiles, organization settings, and all transactional activities.
        <br />
        <span className="text-xs text-muted-foreground">Tip: Limit Admin users to reduce risk.</span>
      </li>
      <li>
        <strong>Member:</strong> Can perform all platform actions except administrative ones. Note: Members can both create and approve their own activities (e.g., transactions), so review activity carefully before approval.
      </li>
      <li>
        <strong>Guest:</strong> Read-only access to all organizational sections; cannot create, modify, or approve activities.</li>
    </ul>
    <h4 className="mt-3">Permission Table:</h4>
    <table className="not-prose border border-collapse w-full text-sm">
      <thead className="bg-muted">
        <tr>
          <th className="px-2 py-1 border">Permission/Action</th>
          <th className="px-2 py-1 border">Admin</th>
          <th className="px-2 py-1 border">Member</th>
          <th className="px-2 py-1 border">Guest</th>
        </tr>
      </thead>
      <tbody>
        <tr><td className="border px-2 py-1">Add or manage users</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">❌</td></tr>
        <tr><td className="border px-2 py-1">Buy/Sell Tokens</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">❌</td></tr>
        <tr><td className="border px-2 py-1">Approve Token Actions</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">❌</td></tr>
        <tr><td className="border px-2 py-1">Retire Tokens</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">❌</td></tr>
        <tr><td className="border px-2 py-1">Transfer Tokens in Org</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">❌</td></tr>
        <tr><td className="border px-2 py-1">Read-Only Access</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">✔️</td></tr>
      </tbody>
    </table>
    <hr className="my-4"/>
    <h2><strong>Segregation of Duties (SoD)</strong> <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">Add-on Feature</span></h2>
    <p>
      <span className="inline-flex items-center gap-1"><Shield className="inline h-4 w-4 text-primary" />SoD </span>
      is an advanced, optional feature supporting organizations with complex compliance needs, such as those in the United States subject to the Sarbanes-Oxley Act (SOX). When enabled (paid add-on), SoD introduces additional user roles and approval steps, enforcing “park and post” workflows—the user who initiates an action cannot approve it, reducing risk and error.
    </p>
    <h3>SoD User Roles:</h3>
    <ul>
      <li><strong>Administrator:</strong> Manages users, org settings, and can administer trading partners. Limited transactional permissions.</li>
      <li><strong>Treasury:</strong> Initiates transactions, token retirements, and intra-org transfers.</li>
      <li><strong>Risk:</strong> Manages Vendors and creates new token batches on the EarnDLT registry.</li>
      <li><strong>Trader:</strong> Combines Treasury and Risk permissions, enabling efficient trading operations.</li>
      <li><strong>Professional:</strong> Third-party marketer/accountant role; can administer vendors and initiate transactions.</li>
      <li><strong>Manager <span className="text-xs text-amber-600 font-medium">(Requires 2FA)</span>:</strong> Approves transactions (“post” step), token retirements, transfers, and new token batches on the EarnDLT registry.</li>
      <li><strong>Analyst:</strong> General read-only user; cannot create, edit, or delete information.</li>
    </ul>
    <h4 className="mt-3">SoD Permissions by Role:</h4>
    <table className="not-prose border border-collapse w-full text-sm">
      <thead className="bg-muted">
        <tr>
          <th className="px-2 py-1 border">Key Activity</th>
          <th className="px-2 py-1 border">Treasury</th>
          <th className="px-2 py-1 border">Risk</th>
          <th className="px-2 py-1 border">Trader</th>
          <th className="px-2 py-1 border">Manager</th>
          <th className="px-2 py-1 border">Professional</th>
          <th className="px-2 py-1 border">Analyst</th>
        </tr>
      </thead>
      <tbody>
        <tr><td className="border px-2 py-1">Initiate Transactions</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">❌</td></tr>
        <tr><td className="border px-2 py-1">Approve Transactions</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">✔️ (2FA)</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">❌</td></tr>
        <tr><td className="border px-2 py-1">Retire/Transfer Tokens</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">❌</td></tr>
        <tr><td className="border px-2 py-1">Administer Vendors</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">❌</td></tr>
        <tr><td className="border px-2 py-1">Approve Batches</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">❌</td></tr>
        <tr><td className="border px-2 py-1">Read-Only Access</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">✔️</td><td className="border px-2 py-1 text-center">❌</td><td className="border px-2 py-1 text-center">✔️</td></tr>
      </tbody>
    </table>
    <p className="mt-4">
      <span className="font-bold">How to Enable SoD:</span> 
      <br />
      The SoD (Segregation of Duties) feature is available as a paid add-on in the Billing & Subscription section. Once enabled, your organization can assign the new SoD roles, and the additional approval steps will be enforced automatically.
    </p>
    <p className="mt-2">
      <span className="font-bold">Need more help?</span> If you have additional questions about RBAC or SoD, please contact support or submit a support ticket.
    </p>
  </div>
);

export default RbacAndSodArticle;
