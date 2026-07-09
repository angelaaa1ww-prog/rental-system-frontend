// Epic Modern Theme for Rental System
// Dark mode with vibrant gradients, professional typography

export const modernTheme = {
  name: 'epic-modern',
  isDark: true,
  
  // Color palette - Modern & Epic
  colors: {
    // Vibrant Primary (Electric Blue/Purple)
    primary: {
      50: "#F0F4FF",
      100: "#E0E9FF",
      200: "#C1D3FF",
      300: "#A2BDFF",
      400: "#7B9FFF",
      500: "#5581FF", // Main
      600: "#4169E5",
      700: "#3351CC",
      800: "#2639B3",
      900: "#1A259A",
    },

    // Secondary Accent (Cyan/Teal)
    secondary: {
      50: "#F0F7FF",
      100: "#E1EFFE",
      200: "#C3DDFD",
      300: "#A5CBFC",
      400: "#87B9FB",
      500: "#6BA7F9", // Main
      600: "#5395F7",
      700: "#3B83F5",
      800: "#2371F3",
      900: "#0B5FF1",
    },

    // Success (Emerald)
    success: {
      50: "#F0FDF4",
      100: "#DCFCE7",
      200: "#BBF7D0",
      300: "#86EFAC",
      400: "#4ADE80",
      500: "#22C55E",
      600: "#16A34A",
      700: "#15803D",
      800: "#166534",
      900: "#145231",
    },

    // Warning (Amber)
    warning: {
      50: "#FFFBEB",
      100: "#FEF3C7",
      200: "#FDE68A",
      300: "#FCD34D",
      400: "#FBBF24",
      500: "#F59E0B",
      600: "#D97706",
      700: "#B45309",
      800: "#92400E",
      900: "#78350F",
    },

    // Error (Rose)
    error: {
      50: "#FFF1F2",
      100: "#FFE4E6",
      200: "#FECDD3",
      300: "#FDA29B",
      400: "#F97066",
      500: "#F43F5E",
      600: "#E11D48",
      700: "#BE123C",
      800: "#9F1239",
      900: "#881337",
    },

    // Neutral - Dark Mode
    grey: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },

    // Dark backgrounds
    dark: {
      50: "#1E1E2E",  // Very dark blue
      100: "#16213E",
      200: "#0F3460",
      300: "#16C784",
      bg: "#0F172A",   // Almost black
      surface: "#1E293B", // Card background
      surfaceHover: "#334155",
      border: "#475569",
    },

    // Gradients
    gradients: {
      primaryGradient: 'linear-gradient(135deg, #5581FF 0%, #6BA7F9 100%)',
      primaryDeep: 'linear-gradient(135deg, #2639B3 0%, #3B83F5 100%)',
      successGradient: 'linear-gradient(135deg, #22C55E 0%, #10B981 100%)',
      warningGradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      epicGradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      neonGradient: 'linear-gradient(135deg, #00F0FF 0%, #FF00FF 100%)',
    },

    // Backgrounds
    background: {
      default: "#0F172A",
      paper: "#1E293B",
      elevated: "#334155",
      overlay: 'rgba(0, 0, 0, 0.7)',
    },

    // Text
    text: {
      primary: "#F8FAFC",
      secondary: "#CBD5E1",
      disabled: "#64748B",
      hint: "#475569",
    },
  },

  // Premium Typography
  typography: {
    fontFamily: "'Urbanist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFamilySecondary: "'Sora', 'Poppins', sans-serif",
    fontFamilyMono: "'JetBrains Mono', 'Fira Code', monospace",

    fontSize: {
      xs: "0.75rem",    // 12px
      sm: "0.875rem",   // 14px
      base: "1rem",     // 16px
      lg: "1.125rem",   // 18px
      xl: "1.25rem",    // 20px
      "2xl": "1.5rem",  // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem",    // 48px
      "6xl": "3.75rem", // 60px
    },

    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },

    lineHeight: {
      tight: 1.2,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },

    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.02em",
      normal: "0em",
      wide: "0.02em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },

  // Spacing (8px grid)
  spacing: (factor) => `${0.5 * factor}rem`,

  // Border radius
  borderRadius: {
    none: "0",
    xs: "0.25rem",    // 4px
    sm: "0.375rem",   // 6px
    md: "0.5rem",     // 8px
    lg: "0.75rem",    // 12px
    xl: "1rem",       // 16px
    "2xl": "1.5rem",  // 24px
    "3xl": "2rem",    // 32px
    full: "9999px",
  },

  // Shadows - Enhanced for depth
  shadows: {
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    sm: "0 2px 4px 0 rgba(0, 0, 0, 0.4)",
    md: "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
    lg: "0 8px 16px 0 rgba(0, 0, 0, 0.6), 0 4px 8px 0 rgba(0, 0, 0, 0.3)",
    xl: "0 16px 32px 0 rgba(0, 0, 0, 0.7), 0 8px 16px 0 rgba(0, 0, 0, 0.4)",
    "2xl": "0 24px 48px 0 rgba(0, 0, 0, 0.8), 0 12px 24px 0 rgba(0, 0, 0, 0.5)",
    neon: "0 0 20px rgba(85, 129, 255, 0.5), 0 0 40px rgba(107, 167, 249, 0.3)",
    neonError: "0 0 20px rgba(244, 63, 94, 0.5), 0 0 40px rgba(244, 63, 94, 0.2)",
  },

  // Transitions & Animations
  transitions: {
    ultraFast: "50ms ease-in-out",
    fast: "100ms ease-in-out",
    normal: "200ms ease-in-out",
    slow: "300ms ease-in-out",
    slower: "500ms ease-in-out",
    slowest: "700ms ease-in-out",
  },

  // Blur effects
  blur: {
    none: "0",
    sm: "4px",
    base: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
  },

  // Backdrop blur
  backdropBlur: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
};

// Global Styles Generator
export const generateModernGlobalStyles = () => {
  const T = modernTheme;
  
  return `
    @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;800;900&family=Sora:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');

    *,
    *::before,
    *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html,
    body,
    #root {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100%;
      min-height: -webkit-fill-available;
      font-family: ${T.typography.fontFamily};
      background: ${T.colors.background.default};
      color: ${T.colors.text.primary};
      line-height: ${T.typography.lineHeight.normal};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden;
    }

    /* Scrollbar styling */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: ${T.colors.dark.surface};
    }

    ::-webkit-scrollbar-thumb {
      background: ${T.colors.dark.border};
      border-radius: ${T.borderRadius.lg};
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${T.colors.primary[500]};
    }

    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      font-weight: ${T.typography.fontWeight.bold};
      line-height: ${T.typography.lineHeight.tight};
      margin: 0;
    }

    h1 {
      font-size: ${T.typography.fontSize["5xl"]};
      font-weight: ${T.typography.fontWeight.extrabold};
    }

    h2 {
      font-size: ${T.typography.fontSize["4xl"]};
      font-weight: ${T.typography.fontWeight.bold};
    }

    h3 {
      font-size: ${T.typography.fontSize["3xl"]};
      font-weight: ${T.typography.fontWeight.bold};
    }

    h4 {
      font-size: ${T.typography.fontSize["2xl"]};
      font-weight: ${T.typography.fontWeight.semibold};
    }

    h5 {
      font-size: ${T.typography.fontSize.xl};
      font-weight: ${T.typography.fontWeight.semibold};
    }

    h6 {
      font-size: ${T.typography.fontSize.lg};
      font-weight: ${T.typography.fontWeight.medium};
    }

    p {
      margin: 0;
    }

    a {
      color: ${T.colors.primary[400]};
      text-decoration: none;
      transition: color ${T.transitions.fast};
    }

    a:hover {
      color: ${T.colors.primary[300]};
      text-decoration: underline;
    }

    /* Form Elements */
    input,
    textarea,
    select {
      font-family: inherit;
      font-size: inherit;
      color: inherit;
      background: ${T.colors.dark.surface};
      border: 1px solid ${T.colors.dark.border};
      border-radius: ${T.borderRadius.md};
      padding: 0.75rem 1rem;
      transition: all ${T.transitions.fast};
    }

    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
      border-color: ${T.colors.primary[500]};
      box-shadow: 0 0 0 3px rgba(85, 129, 255, 0.1);
      background: ${T.colors.dark.surfaceHover};
    }

    input::placeholder {
      color: ${T.colors.text.disabled};
    }

    /* Buttons Base */
    button {
      font-family: inherit;
      font-size: inherit;
      cursor: pointer;
      border: none;
      border-radius: ${T.borderRadius.lg};
      transition: all ${T.transitions.normal};
      font-weight: ${T.typography.fontWeight.semibold};
      letter-spacing: ${T.typography.letterSpacing.wide};
      text-transform: uppercase;
      font-size: 0.875rem;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Utility Classes */
    .text-primary { color: ${T.colors.text.primary}; }
    .text-secondary { color: ${T.colors.text.secondary}; }
    .text-disabled { color: ${T.colors.text.disabled}; }
    .text-hint { color: ${T.colors.text.hint}; }

    .bg-primary { background: ${T.colors.primary[500]}; }
    .bg-secondary { background: ${T.colors.secondary[500]}; }
    .bg-success { background: ${T.colors.success[500]}; }
    .bg-warning { background: ${T.colors.warning[500]}; }
    .bg-error { background: ${T.colors.error[500]}; }
    .bg-dark { background: ${T.colors.background.default}; }

    .text-xs { font-size: ${T.typography.fontSize.xs}; }
    .text-sm { font-size: ${T.typography.fontSize.sm}; }
    .text-base { font-size: ${T.typography.fontSize.base}; }
    .text-lg { font-size: ${T.typography.fontSize.lg}; }
    .text-xl { font-size: ${T.typography.fontSize.xl}; }
    .text-2xl { font-size: ${T.typography.fontSize["2xl"]}; }
    .text-3xl { font-size: ${T.typography.fontSize["3xl"]}; }
    .text-4xl { font-size: ${T.typography.fontSize["4xl"]}; }
    .text-5xl { font-size: ${T.typography.fontSize["5xl"]}; }

    .font-light { font-weight: ${T.typography.fontWeight.light}; }
    .font-normal { font-weight: ${T.typography.fontWeight.normal}; }
    .font-medium { font-weight: ${T.typography.fontWeight.medium}; }
    .font-semibold { font-weight: ${T.typography.fontWeight.semibold}; }
    .font-bold { font-weight: ${T.typography.fontWeight.bold}; }
    .font-extrabold { font-weight: ${T.typography.fontWeight.extrabold}; }

    .rounded-xs { border-radius: ${T.borderRadius.xs}; }
    .rounded-sm { border-radius: ${T.borderRadius.sm}; }
    .rounded-md { border-radius: ${T.borderRadius.md}; }
    .rounded-lg { border-radius: ${T.borderRadius.lg}; }
    .rounded-xl { border-radius: ${T.borderRadius.xl}; }
    .rounded-2xl { border-radius: ${T.borderRadius["2xl"]}; }
    .rounded-full { border-radius: ${T.borderRadius.full}; }

    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-wrap { flex-wrap: wrap; }
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }
    .items-end { align-items: flex-end; }
    .justify-center { justify-content: center; }
    .justify-start { justify-content: flex-start; }
    .justify-end { justify-content: flex-end; }
    .justify-between { justify-content: space-between; }
    .justify-around { justify-content: space-around; }
    .gap-1 { gap: 0.25rem; }
    .gap-2 { gap: 0.5rem; }
    .gap-3 { gap: 0.75rem; }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }

    .shadow-sm { box-shadow: ${T.shadows.sm}; }
    .shadow-md { box-shadow: ${T.shadows.md}; }
    .shadow-lg { box-shadow: ${T.shadows.lg}; }
    .shadow-xl { box-shadow: ${T.shadows.xl}; }
    .shadow-2xl { box-shadow: ${T.shadows["2xl"]}; }
    .shadow-neon { box-shadow: ${T.shadows.neon}; }

    .transition-fast { transition: all ${T.transitions.fast}; }
    .transition-normal { transition: all ${T.transitions.normal}; }
    .transition-slow { transition: all ${T.transitions.slow}; }

    /* Backdrop blur glass effect */
    .glass {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(${T.backdropBlur.md});
      -webkit-backdrop-filter: blur(${T.backdropBlur.md});
      border: 1px solid rgba(107, 167, 249, 0.2);
    }

    .glass-lg {
      background: rgba(30, 41, 59, 0.85);
      backdrop-filter: blur(${T.backdropBlur.lg});
      -webkit-backdrop-filter: blur(${T.backdropBlur.lg});
      border: 1px solid rgba(107, 167, 249, 0.3);
    }

    /* Gradient text */
    .gradient-text {
      background: ${T.colors.gradients.primaryGradient};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .gradient-text-epic {
      background: ${T.colors.gradients.epicGradient};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Gradient buttons */
    .btn-primary {
      background: ${T.colors.gradients.primaryGradient};
      color: white;
      padding: 0.75rem 1.5rem;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: ${T.shadows.lg};
    }

    .btn-secondary {
      background: ${T.colors.gradients.epicGradient};
      color: white;
      padding: 0.75rem 1.5rem;
    }

    .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: ${T.shadows.neon};
    }

    /* Loading animation */
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @keyframes shimmer {
      0% { background-position: -1200px 0; }
      100% { background-position: 1200px 0; }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes glow {
      0%, 100% { text-shadow: 0 0 10px rgba(85, 129, 255, 0.5); }
      50% { text-shadow: 0 0 20px rgba(85, 129, 255, 0.8); }
    }

    .animate-spin { animation: spin 1s linear infinite; }
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    .animate-shimmer { animation: shimmer 2s infinite; }
    .animate-slideInUp { animation: slideInUp ${T.transitions.normal} ease-out; }
    .animate-fadeIn { animation: fadeIn ${T.transitions.normal} ease-out; }
    .animate-glow { animation: glow 2s ease-in-out infinite; }
  `;
};

export const useModernTheme = () => modernTheme;
