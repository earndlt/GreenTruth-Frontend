
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const useKnowledgeBase = () => {
  const [_, setState] = React.useState();
  function navigateToArticle(title: string) {
    const exactTitle = "Integration Guide: Connecting GreenTruth to Your Infrastructure";
    
    // Find element with the data-article-title attribute
    const el = document.querySelector(
      `[data-article-title="${title}"]`
    );
    
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.log("Could not find element with title:", title);
      window.location.hash = "#knowledge-base";
      window.scrollTo(0, 0);
    }
  }
  return { navigateToArticle };
};

const IntegrationHubAccessArticle = () => {
  const { navigateToArticle } = useKnowledgeBase();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Hub Access: Unlocking API &amp; Automation Capabilities</CardTitle>
      </CardHeader>
      <CardContent>
        <section className="space-y-3">
          <p>
            <strong>Integration Hub Access</strong> connects your GreenTruth account to external tools, platforms, and data sources—empowering your business to automate workflows, sync data, and build custom integrations tailored to your needs.
          </p>
          <h3 className="font-semibold mt-3">Add-on Pricing & Plan Availability</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold mb-2">Integration Hub Add-on Pricing</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>Team Plan:</strong> Optional add-on at <span className="text-primary font-semibold">$150/month</span>
              </li>
              <li>
                <strong>Business Plan:</strong> Included by default at no extra cost
              </li>
              <li>
                <strong>Enterprise Plan:</strong> Included by default at no extra cost
              </li>
              <li className="text-red-600">
                <strong>Not Available:</strong> Basic and Pro plans cannot access Integration Hub
              </li>
            </ul>
          </div>
          <h3 className="font-semibold mt-3">Key Integration Capabilities</h3>
          <ul className="list-disc pl-5 my-2 space-y-1 text-sm">
            <li><b>Robust APIs:</b> Access GreenTruth's comprehensive REST APIs for transactions, reporting, vendor management, and document storage.</li>
            <li><b>Automated Data Sync:</b> Integrate with ERPs (SAP, Microsoft Dynamics, Oracle, etc.), CRMs, accounting software, or custom systems—bidirectionally and on your schedule.</li>
            <li><b>3rd-Party Services:</b> Connect Zapier, Make, or custom webhook-based solutions for notifications, process automation, or dashboard updates.</li>
            <li><b>Secure Authentication:</b> Use SSO, OIDC, or service key authentication to protect API usage and control access.</li>
            <li><b>Dedicated Support:</b> Access integration best practices, code samples, and fast-track troubleshooting via our expert team.</li>
          </ul>
          <h3 className="font-semibold mt-3">How to Enable Integration Hub Access</h3>
          <ol className="list-decimal pl-6 text-sm space-y-2">
            <li>
              <b>For Team Plan Users:</b>
              <ul className="list-disc pl-5">
                <li>Go to <b>Billing & Subscription</b> in your GreenTruth admin area</li>
                <li>Select the <b>Integration Hub Access</b> add-on</li>
                <li>Complete the purchase (<span className="text-primary">$150/month</span>)</li>
              </ul>
            </li>
            <li>
              <b>For Business and Enterprise Plan Users:</b>
              <ul className="list-disc pl-5">
                <li>Integration Hub Access is <b>automatically included</b></li>
                <li>No additional configuration required</li>
              </ul>
            </li>
          </ol>
          <h3 className="font-semibold mt-3">Practical Integration Scenarios</h3>
          <ul className="list-disc pl-6 text-sm space-y-2 mt-2">
            <li>
              <b>Automated Vendor Onboarding:</b> Automatically add new vendors from your ERP into GreenTruth and sync compliance documents.
            </li>
            <li>
              <b>Real-time Certificate Status:</b> Use webhooks via Zapier to alert your team when an EAC certificate is issued, retired, or transferred.
            </li>
            <li>
              <b>ERP Financial Sync:</b> Pull EAC transaction/payment status into your accounting system daily to reduce reconciliation effort.
            </li>
            <li>
              <b>SSO Authentication:</b> Integrate with Microsoft, Google, or Okta for secure programmatic API access.
            </li>
            <li>
              <b>Custom Dashboards:</b> Build dashboards in Tableau/PowerBI that fetch data from GreenTruth.
            </li>
            <li>
              <b>Edge Workflow Automation:</b> Trigger custom Lambda/serverless functions from transaction events.
            </li>
          </ul>
          <div className="mt-4 text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
            <b>Need Help?</b>
            <p className="mt-1">
              For integration guides, API documentation, or personalized assistance, contact support via the help portal or email{" "}
              <a href="mailto:integrations@greentruth.com" className="text-blue-700 underline">integrations@greentruth.com</a>.
            </p>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default IntegrationHubAccessArticle;
