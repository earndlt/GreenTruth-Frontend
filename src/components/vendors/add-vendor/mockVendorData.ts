
export const mockVendor = {
  id: 'v1',
  name: 'EcoMethane Solutions',
  walletId: '0x7a14c31bF32eB4CDfA0365D90773a92b33e04baA',
  category: 'Methane Capture & Conversion',
  products: ['Biomethane', 'Carbon Credits', 'RNG Certificates'],
  sustainabilityScore: 92,
  certifications: ['Green-e', 'ISO 14001', 'Carbon Trust Standard'],
  complianceScore: 95,
  location: 'Denver, Colorado',
  description: 'Leading provider of biomethane and renewable natural gas solutions with facilities in the Western US.',
  email: 'contact@ecomethane.example.com',
  phone: '(303) 555-7890',
};

export const mockVendors = [
  mockVendor,
  {
    id: 'v2',
    name: 'EcoGas Solutions',
    category: 'Natural Gas',
    location: 'Texas, USA',
    complianceScore: 95,
    walletId: '0x8b25c31bF32eB4CDfA0365D90773a92b33e04cBb',
    email: 'contact@ecogas.example.com',
    phone: '(512) 555-1234',
  },
  {
    id: 'v3',
    name: 'EcoFuel Technologies',
    category: 'Alternative Fuels',
    location: 'California, USA',
    complianceScore: 88,
    walletId: '0x9c36d31bF32eB4CDfA0365D90773a92b33e04dCc',
    email: 'contact@ecofuel.example.com',
    phone: '(415) 555-5678',
  },
];
