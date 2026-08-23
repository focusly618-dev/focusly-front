export interface UpgradePlanFeature {
  emoji: string;
  /** Plain feature copy. Omit when using boldText/subText instead. */
  text?: string;
  /** Bold lead-in line, paired with a lighter subText line below it. */
  boldText?: string;
  /** Lighter, secondary-colored line rendered under boldText. */
  subText?: string;
  /** True for Pro/Elite feature text treatment (primary color + fontWeight 600). */
  highlighted?: boolean;
}

export interface UpgradePlanCta {
  label: string;
  disabled?: boolean;
  variant: 'contained' | 'outlined';
}

export interface UpgradePlan {
  id: 'free' | 'pro' | 'elite';
  name: string;
  price: string;
  priceSuffix: string;
  /** Shows the "POPULAR" badge next to the plan name. */
  popular?: boolean;
  /** Pro's border/shadow/color treatment. */
  featured?: boolean;
  features: UpgradePlanFeature[];
  cta: UpgradePlanCta;
}

export const UPGRADE_PLANS: UpgradePlan[] = [
  {
    id: 'free',
    name: 'Focusly Free',
    price: '$0',
    priceSuffix: '/ siempre gratis',
    features: [
      { emoji: '📋', text: 'Límite de 4 conversaciones' },
      { emoji: '⚡', text: 'Respuestas básicas del asistente' },
      { emoji: '❌', text: 'Sin IA en el editor de workspaces' },
    ],
    cta: {
      label: 'Plan Actual',
      disabled: true,
      variant: 'outlined',
    },
  },
  {
    id: 'pro',
    name: 'Focusly Pro',
    price: '$8',
    priceSuffix: '/ mes',
    popular: true,
    featured: true,
    features: [
      { emoji: '✨', text: 'Chats ilimitados con IA', highlighted: true },
      {
        emoji: '📝',
        boldText: 'Editor de workspaces con IA',
        subText: '(Genera y expande textos)',
        highlighted: true,
      },
      { emoji: '🧠', text: 'Contexto avanzado de tareas', highlighted: true },
      {
        emoji: '📅',
        boldText: 'Hábitos inteligentes',
        subText: '(Optimización diaria de rutinas)',
        highlighted: true,
      },
      {
        emoji: '📂',
        boldText: 'Exportación rápida',
        subText: '(Descarga notas en Markdown y PDF)',
        highlighted: true,
      },
    ],
    cta: {
      label: 'Pagar y Desbloquear',
      variant: 'contained',
    },
  },
  {
    id: 'elite',
    name: 'Focusly Elite',
    price: '$15',
    priceSuffix: '/ mes',
    features: [
      { emoji: '🚀', text: 'Respuestas rápidas prioritarias', highlighted: true },
      {
        emoji: '🪄',
        boldText: 'IA en Editor ilimitada',
        subText: '(Fórmulas, traducción y bloques)',
        highlighted: true,
      },
      { emoji: '👥', text: 'Trabajo en equipo colaborativo', highlighted: true },
      {
        emoji: '📈',
        text: 'Insights profundos de productividad',
        highlighted: true,
      },
      {
        emoji: '🛡️',
        boldText: 'Historial de versiones',
        subText: '(Respaldos automáticos de workspaces)',
        highlighted: true,
      },
      {
        emoji: '🎙️',
        boldText: 'Notas por voz con IA',
        subText: '(Transcripción de audios a tareas)',
        highlighted: true,
      },
      {
        emoji: '🚀',
        boldText: 'Modelos de IA premium',
        subText: '(Acceso a Claude 3 Opus y Gemini Pro)',
        highlighted: true,
      },
      {
        emoji: '🎨',
        boldText: 'Personalización completa',
        subText: '(Temas y branding a tu medida)',
        highlighted: true,
      },
    ],
    cta: {
      label: 'Mejorar a Elite',
      variant: 'outlined',
    },
  },
];
