
import React from 'react';

const PipelineMapArticle = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Understanding the EAC Map Feature</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <p>The EAC Map is an interactive visualization tool that displays major natural gas pipelines, LNG terminals, and their associated Environmental Attribute Certificates (EACs). This feature enables users to discover and purchase EACs directly from specific delivery points along pipeline routes, as well as reserve LNG cargos with complete environmental certificates from major export terminals.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Key Features</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Pipeline Selection</h3>
            <ul className="list-disc pl-5">
              <li>Toggle between multiple pipeline systems</li>
              <li>Color-coded pipeline segments for easy identification</li>
              <li>Interactive labels for pipeline segments and delivery points</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium">LNG Terminal Integration</h3>
            <ul className="list-disc pl-5">
              <li>Interactive markers for major LNG export terminals</li>
              <li>Real-time cargo availability and scheduling</li>
              <li>Complete supply chain transparency (producer, processor, transporter)</li>
              <li>Cargo reservation with environmental attribute certificates</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium">Delivery Points</h3>
            <ul className="list-disc pl-5">
              <li>Interactive markers showing key delivery points</li>
              <li>Detailed information on EAC availability</li>
              <li>Real-time pricing information</li>
              <li>Connected entities and systems information</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium">EAC Discovery</h3>
            <ul className="list-disc pl-5">
              <li>View available EACs at each delivery point</li>
              <li>Filter by pipeline segment and emission source</li>
              <li>Access detailed producer information</li>
              <li>Initiate EAC purchases directly from the map</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Using the EAC Map</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Select one or more pipelines or LNG terminals from the sidebar</li>
          <li>Navigate the map using pan and zoom controls</li>
          <li>Click on delivery points to view available EACs</li>
          <li>Click on LNG terminals to view available cargo reservations</li>
          <li>Review connected entities and systems</li>
          <li>Access detailed EAC information or cargo details</li>
          <li>Initiate purchase workflows or cargo reservations</li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Available Pipeline Systems</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Rockies Express Pipeline (REX)</strong>
            <p className="text-sm text-muted-foreground">1,700 miles from Colorado to Ohio with three distinct zones</p>
          </li>
          <li>
            <strong>Ruby Pipeline</strong>
            <p className="text-sm text-muted-foreground">675 miles from Wyoming to Oregon, connecting Rocky Mountain gas to West Coast markets</p>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Available LNG Terminals</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Plaquemines LNG Terminal</strong>
            <p className="text-sm text-muted-foreground">Located in Plaquemines Parish, Louisiana - Major export facility serving international markets with 10 cargos per month</p>
          </li>
          <li>
            <strong>Sabine Pass LNG Facility</strong>
            <p className="text-sm text-muted-foreground">Located in Jefferson County, Texas - Leading LNG export terminal on the Gulf Coast with 3 cargos per month</p>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Benefits</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Visual discovery of EAC opportunities across pipelines and LNG terminals</li>
          <li>Real-time availability and pricing information</li>
          <li>Streamlined purchase workflow for EACs and cargo reservations</li>
          <li>Comprehensive delivery point and terminal details</li>
          <li>Complete supply chain transparency with producer, processor, and transporter information</li>
          <li>Integrated with K# matching system</li>
          <li>International cargo reservation capabilities</li>
        </ul>
      </section>

      <p className="italic text-muted-foreground">
        For technical details about pipeline integrations and LNG terminal API specifications, please refer to our developer documentation.
      </p>
    </div>
  );
};

export default PipelineMapArticle;
