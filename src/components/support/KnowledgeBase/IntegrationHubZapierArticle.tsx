import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";

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

const IntegrationHubZapierArticle = () => {
  const { navigateToArticle } = useKnowledgeBase();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <CardTitle>Integrating GreenTruth with Zapier: Automate Workflows</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <section className="space-y-4 text-base">
          <p>
            <b>Zapier</b> lets you connect GreenTruth's Integration Hub to 6,000+ apps—such as Slack, Gmail, Microsoft Teams, Google Sheets, Salesforce, and more. With Zapier automations ("Zaps"), you can create powerful, no-code integrations that connect your GreenTruth events, documents, and transactions with everyday business tools.
          </p>
          <h3 className="font-semibold mt-4">Popular Use Cases</h3>
          <ul className="pl-6 list-disc space-y-1 text-sm">
            <li>
              <b>Real-time alerts:</b> Get Slack messages or emails when an EAC certificate is issued or a transaction is completed.
            </li>
            <li>
              <b>Automated document routing:</b> Save new GreenTruth certificates in Google Drive or SharePoint.
            </li>
            <li>
              <b>CRM Updates:</b> When a vendor is added/changed in GreenTruth, automatically update your Salesforce or HubSpot CRM.
            </li>
            <li>
              <b>Scheduled reports:</b> Post compliance or holdings reports to Teams channels or email them out automatically.
            </li>
          </ul>
          <h3 className="font-semibold mt-4">How the Integration Works</h3>
          <p>
            GreenTruth supports <b>webhooks</b> and custom API triggers for Integration Hub customers. Zapier provides a simple "<b>Webhooks by Zapier</b>" app that can receive events from GreenTruth or send data into GreenTruth using the API.
          </p>
          <h3 className="font-semibold mt-4">Integration Hub Access Requirements</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
            <h4 className="font-bold mb-1">Integration Hub Add-on Pricing & Plans</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <strong>Team Plan:</strong> Requires add-on at <span className="text-primary font-semibold">$150/month</span>
              </li>
              <li>
                <strong>Business &amp; Enterprise Plans:</strong> Included at no extra cost
              </li>
              <li className="text-red-600">
                <strong>Not Available:</strong> Basic and Pro plans
              </li>
            </ul>
          </div>
          <h3 className="font-semibold mt-4">Step-by-Step: Connect GreenTruth to Zapier</h3>
          <ol className="list-decimal pl-6 space-y-2 text-sm">
            <li>
              <b>Enable Integration Hub Access:</b> Go to <em>Billing & Subscription</em> and ensure your plan includes Integration Hub.
            </li>
            <li>
              <b>Visit the Integration Hub Tab:</b> In the GreenTruth admin, open the <b>Integration Hub</b> section to generate API keys or configure webhooks.
            </li>
            <li>
              <b>Create a Zap in Zapier:</b> Log into Zapier and click <b>"Create Zap"</b>. Choose <b>"Webhooks by Zapier"</b> as the trigger.
            </li>
            <li>
              <b>Set up a Catch Hook:</b> Select <b>"Catch Hook"</b> to receive events from GreenTruth. Zapier will provide you with a unique webhook URL.
            </li>
            <li>
              <b>Configure a Webhook in GreenTruth:</b> In GreenTruth Integration Hub ➜ <em>Webhooks</em>, add the Zapier Catch Hook URL and specify which events (e.g., <em>transaction.completed, certificate.issued</em>) you want to send.
            </li>
            <li>
              <b>Test the Connection:</b> Trigger the relevant event in GreenTruth or use the <em>"Send Test"</em> option. Check Zapier to confirm it received payload data.
            </li>
            <li>
              <b>Finish your Zap:</b> Add an <b>Action</b> step (e.g., "Send channel message in Slack", "Create Spreadsheet Row in Google Sheets"). Map the GreenTruth data to fields as needed.
            </li>
            <li>
              <b>Turn on your Zap:</b> Name the workflow and enable it!
            </li>
          </ol>
          <h4 className="font-semibold mt-4">Integration Guide &amp; Deeper Technical Reference</h4>
          <ul className="pl-6 list-disc space-y-1 text-sm">
            <li>
              Zapier's <a className="underline text-blue-700" href="https://zapier.com/help/create/code-webhooks/use-webhooks-in-zaps" target="_blank" rel="noopener noreferrer">official Webhooks documentation</a>.
            </li>
            <li>
              For team-specific consulting, contact GreenTruth support via the portal.
            </li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
};

export default IntegrationHubZapierArticle;
