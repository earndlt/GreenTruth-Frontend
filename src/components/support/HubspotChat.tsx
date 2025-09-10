
import React, { useEffect, useState } from 'react';

const HubspotChat = () => {
  const [isHubspotLoaded, setIsHubspotLoaded] = useState(false);

  // Function to load Hubspot chat widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.hsappstatic.net/ChatWidgetShared/static/js/index.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsHubspotLoaded(true);
      console.log('Hubspot chat widget loaded');
    };
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!isHubspotLoaded) {
    return null;
  }

  return (
    <div className="mt-6 text-center text-sm text-gray-500">
      <p>Need immediate assistance? Use the chat widget in the corner to talk to our support team.</p>
    </div>
  );
};

export default HubspotChat;
