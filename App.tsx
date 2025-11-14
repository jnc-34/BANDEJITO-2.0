import React, { useState, useCallback } from 'react'; // Eliminamos 'useEffect'
import { DistributedTask, ProcessedTask } from './types'; 
import FileUpload from './components/FileUpload';
import AssigneeManager from './components/AssigneeManager';
import TaskList from './components/TaskList';
import { extractTextFromPdf } from './services/pdfService';
import { processPdfText } from './services/geminiService'; // Eliminamos loadConfiguration

// ----------------------------------------------------
// Lógica de Asignación Numérica (Regla de tu negocio)
// ----------------------------------------------------
function getResponsable(rawNumero: string, config: any): string {
    const numeroStr = rawNumero.trim();
    
    // Validar si el campo Número es un string válido con dígitos
    if (numeroStr.length === 0 || !/^\d+$/.test(numeroStr)) {
        return "ERROR: Número inválido o vacío"; 
    }

    const lastDigit = numeroStr.slice(-1);
    const lastTwoDigits = numeroStr.slice(-2);

    const asignacion = config.asignacion_por_digito;

    if (lastDigit === '0' || lastDigit === '8') {
        // Caso de Excepción: Dígitos 0 y 8 (revisar dos dígitos)
        const reglasExcepcion = asignacion.regla_excepcion_0_8[lastDigit];
        
        for (const regla of reglasExcepcion) {
            if (regla.digitos.includes(lastTwoDigits)) {
                return regla.responsable;
            }
        }
        // Manejo de Error: El número termina en 0 u 8, pero no coincide con las reglas específicas
        return `ERROR: Regla ${lastDigit} no mapeada para ${lastTwoDigits}`;
        
    } else {
        // Caso de Regla General: 1, 2, 3, 4, 5, 6, 7, 9
        const responsable = asignacion.regla_un_digito[lastDigit];
        
        if (responsable) {
            return responsable;
        }
        // Manejo de Error: Dígito no mapeado
        return "ERROR: Último dígito no mapeado";
    }
}
// ----------------------------------------------------

// ----------------------------------------------------
// Componente principal de la aplicación
// ----------------------------------------------------
const App: React.FC = () => {
    // 🟢 ESTADO FORZADO: Inicializamos config con datos simulados
    const [config, setConfig] = useState<any>({
        responsables: ['Mesa de Entradas', 'Juzgado', 'Cámara'],
        asignacion_por_digito: {
            regla_un_digito: { '1': 'Juzgado', '2': 'Cámara' },
            regla_excepcion_0_8: { '0': [], '8': [] }
        }
    }); 
    
    // 🟢 ESTADO FORZADO: Inicializamos isLoading en false
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState<string | null>(null);
    const [distributedTasks, setDistributedTasks] = useState<DistributedTask[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    
    // ❌ ELIMINAMOS EL useEffect COMPLETO (que llamaba a loadConfiguration)

    const handleProcessFile = useCallback(async (file: File) => {
        if (!config) {
          setError("La configuración de responsables aún no se ha cargado. Intente recargar.");
          return;
        }

        setIsLoading(true); 
        setError(null);
        setDistributedTasks([]);
        setSelectedFilter(null); 

        try {
          const text = await extractTextFromPdf(file);
          if (!text.trim()) {
            throw new Error("No se pudo extraer texto del PDF o el archivo está vacío.");
          }
          
          // NOTA: processPdfText sigue activo, pero FALLARÁ sin la API Key
          const rawTasks = await processPdfText(text, config); 
          
          const finalTasks = rawTasks.map((task: any, index: number) => {
              const responsable = getResponsable(task.raw_numero, config);

              return {
                  taskIdentifier: task.taskIdentifier, 
                  expediente: task.expediente, 
                  numero: task.numero, 
                  descripcion: task.descripcion, 
                  id: `${task.taskIdentifier}-${index}`,
                  assignee: { name: responsable }, 
              };
          });

          if (finalTasks.length === 0) {
            setError("La IA no pudo identificar tareas en el documento. Verifique el contenido del archivo.");
          } else {
            setDistributedTasks(finalTasks as DistributedTask[]);
          }
        } catch (err: any) {
          setError(err.message || 'Ocurrió un error inesperado durante el procesamiento.');
        } finally {
          setIsLoading(false); 
        }
    }, [config]);

    const filteredTasks = selectedFilter
      ? distributedTasks.filter(task => task.assignee.name === selectedFilter)
      : distributedTasks;
    
    // ❌ ELIMINAMOS TODOS LOS RENDERS CONDICIONALES (Carga/Error Crítico)

    return (
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
              Bandejito <span className="text-xl font-normal text-slate-500">(v2.0)</span>
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              Bandejito es un aplicativo que busca automatizar la distribución de los escritos subidos a la **bandeja de escritos** del juzgado entre el personal.
            </p>
              <p className="mt-4 text-base text-slate-500 italic">
                Descargá el PDF de la "Bandeja de Escritos para agregar" y subilo en el recuadro. Bandejito lo analiza con IA y te dice a quién corresponde cada expediente. Si haces click en tu nombre, podés filtrar por los tuyos.
              </p>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <aside className="lg:col-span-1 flex flex-col gap-8">
              <FileUpload 
                  onProcessFile={handleProcessFile} 
                  isLoading={isLoading} 
                  // Ahora 'config' es válido, solo se deshabilita si hay tareas
                  disabled={distributedTasks.length > 0} 
              />
              {/* 'config' ya está inicializado, este componente se renderiza */}
              {config && <AssigneeManager 
                  selectedFilter={selectedFilter} 
                  onSelectFilter={setSelectedFilter} 
                  assignees={config.responsables} 
              />}
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
              <p>Bandejito v.2.0</p>
              <p>Creado por JC con ayuda de Gemini</p>
          </footer>
        </div>
      </div>
    );
};

export default App;