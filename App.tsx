import React, { useState, useCallback } from 'react';
import { ASSIGNEES, DISTRIBUTION_RULES } from './constants';
import { Assignee, DistributedTask, ProcessedTask } from './types';
import FileUpload from './components/FileUpload';
import AssigneeManager from './components/AssigneeManager';
import TaskList from './components/TaskList';
import { extractTextFromPdf } from './services/pdfService';
import { processPdfText } from './services/geminiService';

// Create lookup maps once for efficiency, outside the component
const ruleMap: Record<string, string> = {};
for (const assigneeName in DISTRIBUTION_RULES) {
  for (const ending of DISTRIBUTION_RULES[assigneeName]) {
    ruleMap[ending] = assigneeName;
  }
}

const assigneeMap: Record<string, Assignee> = ASSIGNEES.reduce((acc, assignee) => {
    acc[assignee.name] = assignee;
    return acc;
}, {} as Record<string, Assignee>);

const distributeTasks = (tasks: ProcessedTask[]): DistributedTask[] => {
  return tasks.map((task, index) => {
    const numero = task.taskIdentifier.split('/')[0];
    let assignedAssignee: Assignee | undefined = undefined;

    // Check two-digit rule first
    if (numero.length >= 2) {
      const lastTwoDigits = numero.slice(-2);
      const assigneeName = ruleMap[lastTwoDigits];
      if (assigneeName) {
        assignedAssignee = assigneeMap[assigneeName];
      }
    }

    // If no match, check one-digit rule
    if (!assignedAssignee && numero.length >= 1) {
      const lastDigit = numero.slice(-1);
      const assigneeName = ruleMap[lastDigit];
      if (assigneeName) {
        assignedAssignee = assigneeMap[assigneeName];
      }
    }

    // Fallback to round-robin if no rule matches
    if (!assignedAssignee) {
      console.warn(`No distribution rule found for task "${task.taskIdentifier}". Using fallback.`);
      assignedAssignee = ASSIGNEES[index % ASSIGNEES.length];
    }
    
    return {
      ...task,
      id: `${task.taskIdentifier}-${index}`,
      assignee: assignedAssignee,
    };
  });
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distributedTasks, setDistributedTasks] = useState<DistributedTask[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  
  const handleProcessFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setDistributedTasks([]);
    setSelectedFilter(null); // Reset filter on new file

    try {
      const text = await extractTextFromPdf(file);
      if (!text.trim()) {
        throw new Error("No se pudo extraer texto del PDF o el archivo está vacío.");
      }
      
      const processedTasks = await processPdfText(text);
      if (processedTasks.length === 0) {
        setError("La IA no pudo identificar tareas en el documento. Verifique el contenido del archivo.");
      } else {
        const finalTasks = distributeTasks(processedTasks);
        setDistributedTasks(finalTasks);
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredTasks = selectedFilter
    ? distributedTasks.filter(task => task.assignee.name === selectedFilter)
    : distributedTasks;

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            Distribuidor de Tareas Automatizado
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Cargue un PDF para analizarlo con IA, extraer tareas y asignarlas automáticamente.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 flex flex-col gap-8">
            <FileUpload onProcessFile={handleProcessFile} isLoading={isLoading} disabled={distributedTasks.length > 0} />
            <AssigneeManager selectedFilter={selectedFilter} onSelectFilter={setSelectedFilter} />
          </aside>

          <section className="lg:col-span-2">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            <TaskList tasks={filteredTasks} />
          </section>
        </main>
        <footer className="text-center mt-12 text-sm text-slate-500">
            <p>Diseñado por un Ingeniero de React experto en API de Gemini y UI/UX.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
