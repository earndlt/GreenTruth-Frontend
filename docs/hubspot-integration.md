
# HubSpot Integration Guide: Knowledge Base & Ticketing

This guide walks you through integrating HubSpot services for the following:
- Displaying your HubSpot Knowledge Base/Help Center in GreenTruth
- Enabling HubSpot support ticket submission and live chat widgets

---

## 1. Embed HubSpot Knowledge Base

You can use HubSpot's knowledge base to provide help articles directly from your GreenTruth platform. There are two main approaches:

### Option 1: Link Out to Knowledge Base

The easiest way is to add links to your HubSpot Help Center or individual articles.

```tsx
// Example: Linking out in a React component
<a
  href="https://yourdomain.hubspot.com/knowledge"
  target="_blank"
  rel="noopener noreferrer"
>
  Open Help Center
</a>
```

### Option 2: Embed Articles via iframe

To embed a specific article or the full knowledge base:

```tsx
<iframe
  src="https://yourdomain.hubspot.com/knowledge"
  width="100%"
  height="600"
  style={{ border: 'none' }}
  title="Help Center"
/>
```

**Note:** Embedding via iframe requires that your HubSpot knowledge base settings allow embedding on your app’s domain.

---

## 2. Integrate HubSpot Support Ticketing & Live Chat

### A. Support Ticket Form

You can embed a HubSpot ticket form so users can create tickets without leaving the platform.

**Step 1:** In HubSpot, go to Service > Tickets > Create Ticket Pipeline  
**Step 2:** Set up a support form (Service > Support Forms)  
**Step 3:** Click ‘Embed’, and copy the JavaScript embed code provided by HubSpot.

**Example:**

```html
<!-- Paste the embed script in your app (e.g., in the footer or a support page) -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js.hsforms.net/forms/v2.js"></script>
<script>
  hbspt.forms.create({
    portalId: "YOUR_PORTAL_ID",
    formId: "YOUR_FORM_ID",
    target: "#hubspotSupportForm"
  });
</script>
<div id="hubspotSupportForm"></div>
```

You can wrap this embed in a modal or dialog using your app's UI components for a seamless experience.

### B. HubSpot Live Chat Widget

**Step 1:** In HubSpot, navigate to ‘Conversations’ > ‘Chatflows’  
**Step 2:** Configure your chat widget, set targeting rules as needed  
**Step 3:** Copy the HubSpot chat embed script

**Example:**

```html
<!-- Place this before the closing </body> tag of your app -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js-na1.hs-scripts.com/YOUR_PORTAL_ID.js"></script>
```

For React apps, you can inject this using a `useEffect` when mounting a component (see `/src/components/support/HubspotChat.tsx` for reference).

---

## 3. Best Practices

- **Security:** Only embed HubSpot forms/widgets from your own portal; do not expose admin panel links.
- **Branding:** Customize the HubSpot appearance to match your platform branding.
- **Testing:** Verify on staging with valid HubSpot credentials and test on all platforms for responsive design.

---

## 4. Useful Links

- [HubSpot Knowledge Base](https://knowledge.hubspot.com/knowledge-base)
- [HubSpot Ticketing Setup](https://knowledge.hubspot.com/service-tools/create-tickets)
- [HubSpot Chat Widget](https://knowledge.hubspot.com/conversations/set-up-live-chat)
- [Embed forms](https://knowledge.hubspot.com/forms/use-hubspot-forms-on-external-sites)

---

## 5. Example Implementations in GreenTruth

- `src/components/support/HubspotChat.tsx`: Loads and initializes the HubSpot chat widget on the Support page.
- `src/components/support/SupportTicket.tsx`: Links out to the HubSpot helpdesk for tickets (can be replaced with embedded forms for tighter integration).
- `src/components/support/KnowledgeBase/KnowledgeBaseArticles.tsx`: Links to HubSpot-hosted knowledge articles.

Update the links in these components to point to your production HubSpot knowledge base and support portal as needed.

---

