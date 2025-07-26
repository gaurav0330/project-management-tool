/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'caption': ['Inter', 'system-ui', 'sans-serif'],
        'button': ['Poppins', 'Inter', 'sans-serif'],
        'brand': ['Poppins', 'system-ui', 'sans-serif'],
      },
      
      // ✅ Modern Color System with Better Contrast
      colors: {
        // Background Colors - Softer, More Modern
        'bg-primary': {
          light: '#ffffff',
          dark: '#0f172a'  // Deeper, richer dark blue
        },
        'bg-secondary': {
          light: '#f8fafc',  // Subtle blue-gray tint
          dark: '#1e293b'    // Lighter than primary for layering
        },
        'bg-accent': {
          light: '#f1f5f9',  // Very light blue-gray
          dark: '#334155'    // Medium gray-blue for cards
        },
        
        // Text Colors - Better Readability
        'txt-primary': {
          light: '#1e293b',  // Softer black with blue undertone
          dark: '#f8fafc'    // Warm white
        },
        'txt-secondary': {
          light: '#64748b',  // Modern gray-blue
          dark: '#cbd5e1'    // Light gray for dark mode
        },
        'txt-muted': {
          light: '#94a3b8',  // Lighter gray
          dark: '#94a3b8'    // Same for both modes
        },
        
        // Heading Colors - More Vibrant
        'heading-primary': {
          light: '#0f172a',  // Rich dark blue
          dark: '#ffffff'    // Pure white for contrast
        },
        'heading-accent': {
          light: '#3b82f6',  // Vibrant blue
          dark: '#60a5fa'    // Lighter blue for dark mode
        },
        
        // Brand Colors - Modern Gradient-Ready Palette
        'brand-primary': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',   // Main brand blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'brand-secondary': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',   // Purple accent
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        'brand-accent': {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',   // Green success
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        
        // Interactive Colors - Vibrant and Accessible
        'interactive-primary': {
          light: '#3b82f6',  // Vibrant blue
          dark: '#60a5fa'    // Lighter for dark mode
        },
        'interactive-hover': {
          light: '#2563eb',  // Darker blue on hover
          dark: '#3b82f6'    // Different shade for dark mode
        },
        
        // Status Colors - Modern and Clear
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'info': '#3b82f6',  
      }
    },
  },
  plugins: [],
}
