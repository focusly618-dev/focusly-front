import type { Step } from 'react-joyride';

export const getOnboardingSteps = (): Step[] => [
  {
    target: '#joyride-logo',
    content: '¡Bienvenido a Focusly! Tu nuevo centro de control para la productividad y el enfoque.',
    disableBeacon: true,
    placement: 'right',
  },
  {
    target: '#joyride-add-task',
    content: 'Comienza creando tu primera tarea. Puedes asignar duraciones, prioridades y etiquetas.',
    placement: 'right',
  },
  {
    target: '#joyride-daily-plan',
    content: 'El Plan Diario muestra tu agenda. Arrastra y suelta tareas para organizar tu jornada.',
    placement: 'right',
  },
  {
    target: '#joyride-tasks',
    content: 'Haz clic aquí para gestionar todas tus tareas con herramientas avanzadas.',
    placement: 'right',
  },
  // --- TASKS TAB ---
  {
    target: '#joyride-tasks-list',
    content: 'Aquí es donde se mostrarán todas tus tareas organizadas. Puedes ver detalles haciendo clic en ellas.',
    placement: 'bottom',
  },
  {
    target: '#joyride-tasks-search',
    content: 'Usa el buscador para localizar rápidamente tareas por título, etiqueta o proyecto.',
    placement: 'bottom',
  },
  {
    target: '#joyride-tasks-filters',
    content: 'Filtra y ordena tus tareas para enfocarte en lo más importante en cada momento.',
    placement: 'bottom',
  },
  {
    target: '#joyride-tasks-completed',
    content: 'Usa este botón para mostrar u ocultar las tareas que ya has completado.',
    placement: 'bottom',
  },
  {
    target: '#joyride-tasks-view-toggle',
    content: 'Cambia la visualización (Lista, Cuadrícula o Tablero) según cómo prefieras trabajar.',
    placement: 'bottom',
  },
  // --- WORKSPACE TAB ---
  {
    target: '#joyride-workspace',
    content: 'Workspace es el lugar para tus planes estratégicos y documentos colaborativos.',
    placement: 'right',
  },
  {
    target: '#joyride-workspace-search',
    content: 'Busca planes de trabajo específicos o filtra entre tus documentos y carpetas.',
    placement: 'bottom',
  },
  {
    target: '#joyride-workspace-folders',
    content: 'Organiza tus notas en carpetas personalizadas para mantener todo en orden.',
    placement: 'top',
  },
  {
    target: '#joyride-workspace-create-note',
    content: 'Crea una nueva nota estratégica para profundizar en tus proyectos.',
    placement: 'right',
  },
  // --- INSIGHTS TAB ---
  {
    target: '#joyride-insights',
    content: 'Insights te ayuda a entender tus patrones de trabajo y rendimiento.',
    placement: 'right',
  },
  {
    target: '#joyride-insights-stats',
    content: 'Visualiza tus métricas clave: horas de enfoque, tareas completadas y puntuación de energía.',
    placement: 'bottom',
  },
  {
    target: '#joyride-insights-trends',
    content: 'Este gráfico muestra tus tendencias de productividad a lo largo de la semana.',
    placement: 'top',
  },
  {
    target: '#joyride-insights-distribution',
    content: 'Analiza en qué categorías de trabajo estás invirtiendo la mayor parte de tu tiempo.',
    placement: 'top',
  },
  {
    target: '#joyride-insights-heatmap',
    content: 'El Mapa de Actividad revela tus "Horas Doradas" de máximo rendimiento diario.',
    placement: 'top',
  },
  // --- GENERAL TOOLS ---
  {
    target: '#joyride-energy',
    content: 'Predecimos tus niveles de energía según tus hábitos para ayudarte a evitar el agotamiento.',
    placement: 'top',
  },
];
