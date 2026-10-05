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
  id: 'free' | 'pro';
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
      { emoji: '📋', text: 'Prueba gratuita de 10 mensajes con IA' },
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
    price: '$9.99',
    priceSuffix: '/ mes',
    popular: true,
    featured: true,
    features: [
      { emoji: '✨', text: 'Chats ilimitados con IA', highlighted: true },
      {
        emoji: '📝',
        boldText: 'Editor de workspaces con IA',
        subText: '(Genera y expande textos en tus notas)',
        highlighted: true,
      },
      { emoji: '🧠', text: 'Contexto avanzado de tareas', highlighted: true },
      {
        emoji: '📅',
        boldText: 'Calendario y reuniones sincronizadas',
        subText: '(Google Calendar y enlaces de Meet)',
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
];
