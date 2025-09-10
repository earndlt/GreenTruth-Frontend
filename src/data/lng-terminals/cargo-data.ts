import { LngCargoData } from './types';

// Mock cargo data for both terminals
export const lngCargoData: LngCargoData[] = [
    // Plaquemines Terminal Cargos
    {
        id: 'PLQ-001',
        terminalName: 'Plaquemines LNG Terminal',
        volume: 165000, // MMBtu per cargo
        deliveryMonth: 'January',
        deliveryYear: 2025,
        price: '$2.85/MMBtu',
        producer: {
            name: 'Antero Resources',
            logo: '/lovable-uploads/12a4b41d-1c3a-4dd4-b06f-9ba1d8f978d2.png'
        },
        processor: {
            name: 'MPLX',
            logo: '/api/placeholder/40/40'
        },
        transporter: {
            name: 'Kinder Morgan',
            logo: '/api/placeholder/40/40'
        },
        available: true,
        vesselName: 'Energy Atlantic',
        loadingDate: '2025-01-15'
    },
    {
        id: 'PLQ-002',
        terminalName: 'Plaquemines LNG Terminal',
        volume: 165000,
        deliveryMonth: 'January',
        deliveryYear: 2025,
        price: '$2.85/MMBtu',
        producer: {
            name: 'Antero Resources',
            logo: '/lovable-uploads/12a4b41d-1c3a-4dd4-b06f-9ba1d8f978d2.png'
        },
        processor: {
            name: 'MPLX',
            logo: '/api/placeholder/40/40'
        },
        transporter: {
            name: 'Kinder Morgan',
            logo: '/api/placeholder/40/40'
        },
        available: true,
        vesselName: 'Energy Explorer',
        loadingDate: '2025-01-18'
    },
    {
        id: 'PLQ-003',
        terminalName: 'Plaquemines LNG Terminal',
        volume: 165000,
        deliveryMonth: 'February',
        deliveryYear: 2025,
        price: '$2.87/MMBtu',
        producer: {
            name: 'Antero Resources',
            logo: '/lovable-uploads/12a4b41d-1c3a-4dd4-b06f-9ba1d8f978d2.png'
        },
        processor: {
            name: 'MPLX',
            logo: '/api/placeholder/40/40'
        },
        transporter: {
            name: 'Kinder Morgan',
            logo: '/api/placeholder/40/40'
        },
        available: true,
        vesselName: 'Energy Pioneer',
        loadingDate: '2025-02-01'
    },
    // Sabine Pass Terminal Cargos
    {
        id: 'SPP-001',
        terminalName: 'Sabine Pass LNG Facility',
        volume: 165000,
        deliveryMonth: 'January',
        deliveryYear: 2025,
        price: '$2.92/MMBtu',
        producer: {
            name: 'Antero Resources',
            logo: '/lovable-uploads/12a4b41d-1c3a-4dd4-b06f-9ba1d8f978d2.png'
        },
        processor: {
            name: 'MPLX',
            logo: '/api/placeholder/40/40'
        },
        transporter: {
            name: 'Kinder Morgan',
            logo: '/api/placeholder/40/40'
        },
        available: true,
        vesselName: 'Sabine Navigator',
        loadingDate: '2025-01-20'
    },
    {
        id: 'SPP-002',
        terminalName: 'Sabine Pass LNG Facility',
        volume: 165000,
        deliveryMonth: 'February',
        deliveryYear: 2025,
        price: '$2.94/MMBtu',
        producer: {
            name: 'Antero Resources',
            logo: '/lovable-uploads/12a4b41d-1c3a-4dd4-b06f-9ba1d8f978d2.png'
        },
        processor: {
            name: 'MPLX',
            logo: '/api/placeholder/40/40'
        },
        transporter: {
            name: 'Kinder Morgan',
            logo: '/api/placeholder/40/40'
        },
        available: true,
        vesselName: 'Sabine Voyager',
        loadingDate: '2025-02-03'
    }
];

export const getCargosByTerminal = (terminalName: string): LngCargoData[] => {
    return lngCargoData.filter(cargo => cargo.terminalName === terminalName);
};

export const getAvailableCargosByTerminal = (terminalName: string): LngCargoData[] => {
    return lngCargoData.filter(cargo => cargo.terminalName === terminalName && cargo.available);
};