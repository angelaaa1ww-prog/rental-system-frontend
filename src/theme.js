// Theme configuration for the rental system
// Provides semantic color tokens and spacing scale

export const theme = {
  // Color palette with semantic names
  colors: {
    // Primary brand colors
    primary: {
      50: "#EEF2FF",
      100: "#E0E7FF",
      200: "#C7D2FE",
      300: "#A5B4FC",
      400: "#818CF8",
      500: "#6366F1", // Main primary color
      600: "#4F46E5",
      700: "#4338CA",
      800: "#3730A3",
      900: "#312E81",
    },

    // Secondary colors
    secondary: {
      50: "#ECFEFF",
      100: "#CFFAFE",
      200: "#A5F3FC",
      300: "#67E8F9",
      400: "#22D3EE",
      500: "#06B6D4", // Main secondary color
      600: "#0891B2",
      700: "#0E7490",
      800: "#155E75",
      900: "#164E63",
    },

    // Status colors
    success: {
      50: "#E8F5E8",
      100: "#C8E6C9",
      200: "#A5D6A7",
      300: "#81C784",
      400: "#66BB6A",
      500: "#4CAF50",
      600: "#43A047",
      700: "#388E3C",
      800: "#2E7D32",
      900: "#1B5E20",
    },

    warning: {
      50: "#FFFDE7",
      100: "#FFF9C4",
      200: "#FFF59D",
      300: "#FFF176",
      400: "#FFEE58",
      500: "#FFCD00",
      600: "#FFB300",
      700: "#FFA000",
      800: "#FF8F00",
      900: "#FF6F00",
    },

    error: {
      50: "#FFEBEE",
      100: "#FFCDD2",
      200: "#EF9A9A",
      300: "#E57373",
      400: "#EF5350",
      500: "#F44336",
      600: "#E53935",
      700: "#D32F2F",
      800: "#C62828",
      900: "#B71C1C",
    },

    // Neutral colors
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },

    // Background and surface
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
      elevated: "#F5F5F5",
    },

    // Text colors
    text: {
      primary: "#212121",
      secondary: "#757575",
      disabled: "#9E9E9E",
      hint: "#BDBDBD",
    },
  },

  // Spacing scale (8px grid)
  spacing: (factor) => `${0.25 * factor}rem`, // 0 = 0px, 1 = 2px, 2 = 4px, 3 = 6px, 4 = 8px, etc.

  // Typography
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    fontFamilySecondary: "'Playfair Display', serif",
    fontSize: {
      xs: "0.75rem",   // 12px
      sm: "0.875rem",  // 14px
      base: "1rem",    // 16px
      lg: "1.125rem",  // 18px
      xl: "1.25rem",   // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem",   // 48px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tight: "-0.02em",
      normal: "0em",
      wide: "0.02em",
    },
  },

  // Border radius
  borderRadius: {
    xs: "0.125rem",   // 2px
    sm: "0.25rem",    // 4px
    md: "0.375rem",   // 6px
    lg: "0.5rem",     // 8px
    xl: "0.75rem",    // 12px
    "2xl": "1rem",    // 16px
    full: "9999px",
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -3px rgba(0, 0, 0, 0.05)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },

  // Transitions
  transitions: {
    quick: "150ms ease",
    normal: "200ms ease",
    slow: "300ms ease",
  },
};

// Helper functions to get theme values with theme context
export const useTheme = () => {
  // In a real implementation, this would use React Context
  // For now, we'll return the static theme
  return theme;
};

// CSS string generator for global styles
export const generateGlobalStyles = (isDark) => {
  const T = isDark ? {
    // Dark theme values (simplified for now)
    bg: theme.colors.grey[900],
    text: theme.colors.grey[50],
    primary: theme.colors.primary[400],
    secondary: theme.colors.secondary[400],
  } : {
    // Light theme values
    bg: theme.colors.grey[50],
    text: theme.colors.grey[900],
    primary: theme.colors.primary[500],
    secondary: theme.colors.secondary[500],
  };

  return `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

    *,*::before,*::after{
      box-sizing:border-box;
      margin:0;
      padding:0;
    }

    html{
      height:100%;
      height:-webkit-fill-available;
    }

    body{
      min-height:100%;
      min-height:-webkit-fill-available;
      font-family:${theme.typography.fontFamily};
      background:${T.bg};
      color:${T.text};
    }

    /* Utility classes */
    .text-primary{color:${theme.colors.text.primary};}
    .text-secondary{color:${theme.colors.text.secondary};}
    .text-muted{color:${theme.colors.grey[600]};}

    .bg-primary{background:${theme.colors.primary[500]};}
    .bg-secondary{background:${theme.colors.secondary[500]};}
    .bg-success{background:${theme.colors.success[500]};}
    .bg-warning{background:${theme.colors.warning[500]};}
    .bg-error{background:${theme.colors.error[500]};}

    .bg-primary-light{background:${theme.colors.primary[100]};}
    .bg-secondary-light{background:${theme.colors.secondary[100]};}

    .border-primary{border-color:${theme.colors.primary[500]};}
    .border-secondary{border-color:${theme.colors.secondary[500]};}

    .rounded-sm{border-radius:${theme.borderRadius.sm};}
    .rounded-md{border-radius:${theme.borderRadius.md};}
    .rounded-lg{border-radius:${theme.borderRadius.lg};}
    .rounded-xl{border-radius:${theme.borderRadius.xl};}
    .rounded-full{border-radius:${theme.borderRadius.full};}

    .p-0{padding:0;}
    .p-1{padding:${theme.spacing(4)};}
    .p-2{padding:${theme.spacing(8)};}
    .p-3{padding:${theme.spacing(12)};}
    .p-4{padding:${theme.spacing(16)};}

    .m-0{margin:0;}
    .m-1{margin:${theme.spacing(4)};}
    .m-2{margin:${theme.spacing(8)};}
    .m-3{margin:${theme.spacing(12)};}
    .m-4{margin:${theme.spacing(16)};}

    .flex{display:flex;}
    .flex-col{flex-direction:column;}
    .items-center{align-items:center;}
    .justify-center{justify-content:center;}
    .justify-between{justify-content:space-between;}
    .flex-wrap{flex-wrap:wrap;}

    .text-center{text-align:center;}
    .text-left{text-align:left;}
    .text-right{text-align:right;}

    .font-sans{font-family:${theme.typography.fontFamily};}
    .font-serif{font-family:${theme.typography.fontFamilySecondary};}

    .text-xs{font-size:${theme.typography.fontSize.xs};}
    .text-sm{font-size:${theme.typography.fontSize.sm};}
    .text-base{font-size:${theme.typography.fontSize.base};}
    .text-lg{font-size:${theme.typography.fontSize.lg};}
    .text-xl{font-size:${theme.typography.fontSize.xl};}
    .text-2xl{font-size:${theme.typography.fontSize["2xl"]};}
    .text-3xl{font-size:${theme.typography.fontSize["3xl"]};}
    .text-4xl{font-size:${theme.typography.fontSize["4xl"]};}
    .text-5xl{font-size:${theme.typography.fontSize["5xl"]};}

    .font-light{font-weight:${theme.typography.fontWeight.light};}
    .font-normal{font-weight:${theme.typography.fontWeight.regular};}
    .font-medium{font-weight:${theme.typography.fontWeight.medium};}
    .font-semibold{font-weight:${theme.typography.fontWeight.semiBold};}
    .font-bold{font-weight:${theme.typography.fontWeight.bold};}
    .font-extrabold{font-weight:${theme.typography.fontWeight.extraBold};}

    .leading-tight{line-height:${theme.typography.lineHeight.tight};}
    .leading-normal{line-height:${theme.typography.lineHeight.normal};}
    .leading-relaxed{line-height:${theme.typography.lineHeight.relaxed};}

    .tracking-tight{letter-spacing:${theme.typography.letterSpacing.tight};}
    .tracking-normal{letter-spacing:${theme.typography.letterSpacing.normal};}
    .tracking-wide{letter-spacing:${theme.typography.letterSpacing.wide};}
  `;
};