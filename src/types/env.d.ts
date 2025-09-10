
declare global {
  interface Window {
    env: {
      HUBSPOT_API_KEY?: string;
    }
  }
}

export {};
