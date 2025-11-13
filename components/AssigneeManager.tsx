import React from 'react';
import { ASSIGNEES } from '../constants';
import { AssigneeManagerProps } from '../types';

const AssigneeManager: React.FC<AssigneeManagerProps> = ({ selectedFilter, onSelectFilter }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">2. Equipo de Responsables</h2>
        <button 
          onClick={() => onSelectFilter(null)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:text-slate-400"
          disabled={!selectedFilter}
        >
          Mostrar Todos
        </button>
      </div>
      <ul className="space-y-2">
        {ASSIGNEES.map((assignee) => {
          const isSelected = selectedFilter === assignee.name;
          return (
            <li 
              key={assignee.id} 
              onClick={() => onSelectFilter(assignee.name)}
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'hover:bg-slate-100'}`}
            >
              <div className={`w-8 h-8 rounded-full ${assignee.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {assignee.initials}
              </div>
              <span className="text-slate-700 font-medium">{assignee.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AssigneeManager;
