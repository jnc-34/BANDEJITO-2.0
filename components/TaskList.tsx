import React from 'react';
import { DistributedTask } from '../types';
import { AlertIcon } from './icons';

interface TaskListProps {
  tasks: DistributedTask[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-md p-8">
        <svg className="w-16 h-16 text-slate-300 mb-4" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75c0-.231-.035-.454-.1-.664M6.75 7.5h1.5v-1.5h-1.5v1.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM6 15a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM6 11.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 5.25v13.5m0 0H18a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H12.75z" />
        </svg>
        <h3 className="text-xl font-semibold text-slate-600">Lista de Tareas Distribuidas</h3>
        <p className="text-slate-400 mt-2">Los resultados aparecerán aquí después de procesar un archivo.</p>
      </div>
    );
  }

  const groupedTasks = tasks.reduce((acc, task) => {
    const assigneeName = task.assignee.name;
    if (!acc[assigneeName]) {
      acc[assigneeName] = [];
    }
    acc[assigneeName].push(task);
    return acc;
  }, {} as Record<string, DistributedTask[]>);

  const sortedAssigneeNames = Object.keys(groupedTasks).sort();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="mb-6 pb-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800">3. Resultados de la Distribución</h2>
        <p className="text-sm text-slate-500 mt-1">
          Total de <span className="font-bold text-slate-700">{tasks.length}</span> tareas distribuidas.
        </p>
      </div>
      <div className="space-y-6">
        {sortedAssigneeNames.map((assigneeName) => (
          <div key={assigneeName}>
            <div className="flex items-center mb-3">
               <div className={`w-6 h-6 rounded-full ${groupedTasks[assigneeName][0].assignee.color} flex items-center justify-center text-white font-bold text-xs mr-2`}>
                  {groupedTasks[assigneeName][0].assignee.initials}
                </div>
              <h3 className="text-lg font-semibold text-slate-700">{assigneeName}</h3>
              <span className="ml-2 bg-slate-200 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {groupedTasks[assigneeName].length} {groupedTasks[assigneeName].length === 1 ? 'tarea' : 'tareas'}
              </span>
            </div>
            <div className="space-y-3">
              {groupedTasks[assigneeName].map((task) => (
                <div key={task.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/80 transition-shadow hover:shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-slate-800 text-base">{task.taskIdentifier}</span>
                  </div>
                  {task.warningMessage && (
                    <div className="mt-2 flex items-center p-2 rounded-md bg-red-100 text-red-700 text-sm">
                      <AlertIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span className="font-semibold">{task.warningMessage.replace('- ADVERTENCIA: ', '')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
