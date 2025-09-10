
import { Beaker, Flame, Leaf, Snowflake } from 'lucide-react';

export const walletChartData = [
  {
    name: 'Jan',
    'Natural Gas': 12500,
    'LNG': 8200,
    'Methanol': 5400,
    'Carbon Credits': 4300,
  },
  {
    name: 'Feb',
    'Natural Gas': 13200,
    'LNG': 10600,
    'Methanol': 5100,
    'Carbon Credits': 6700,
  },
  {
    name: 'Mar',
    'Natural Gas': 12800,
    'LNG': 17800,
    'Methanol': 5300,
    'Carbon Credits': 12500,
  },
  {
    name: 'Apr',
    'Natural Gas': 15200,
    'LNG': 23600,
    'Methanol': 5400,
    'Carbon Credits': 18300,
  },
];

export const chartConfig = {
  'Natural Gas': {
    label: 'Natural Gas',
    color: '#f97316',
    icon: Flame,
  },
  'LNG': {
    label: 'LNG',
    color: '#0ea5e9',
    icon: Snowflake,
  },
  'Methanol': {
    label: 'Methanol',
    color: '#14b8a6',
    icon: Beaker, 
  },
  'Carbon Credits': {
    label: 'Carbon Credits',
    color: '#22c55e',
    icon: Leaf,
  },
};
