import { Assignee } from './types';

export const ASSIGNEES: Assignee[] = [
  { id: 1, name: 'CATERINA', initials: 'CA', color: 'bg-red-500' },
  { id: 2, name: 'ROMINA', initials: 'RO', color: 'bg-blue-500' },
  { id: 3, name: 'CLARISA', initials: 'CL', color: 'bg-green-500' },
  { id: 4, name: 'MARISA', initials: 'MA', color: 'bg-purple-500' },
  { id: 5, name: 'SUSANA', initials: 'SU', color: 'bg-orange-500' },
  { id: 6, name: 'FRANCISCO', initials: 'FR', color: 'bg-pink-500' },
  { id: 7, name: 'LUCIANA', initials: 'LU', color: 'bg-teal-500' },
  { id: 8, name: 'JUAN', initials: 'JU', color: 'bg-yellow-500' },
];

export const DISTRIBUTION_RULES: Record<string, string[]> = {
  'CATERINA': ['1'],
  'ROMINA': ['2'],
  'CLARISA': ['3'],
  'MARISA': ['4', '00', '10', '20', '30', '40'],
  'SUSANA': ['5', '50', '60', '70', '80'],
  'FRANCISCO': ['6', '08', '18', '28'],
  'LUCIANA': ['7', '38', '48', '58'],
  'JUAN': ['9', '68', '78', '88', '98'],
};
