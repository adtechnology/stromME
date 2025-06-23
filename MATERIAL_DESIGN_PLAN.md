# Phase 1: Material Design 3 Foundation Plan

## 🎨 Design System Transformation Overview

This document outlines the complete transformation of stromME from a high-contrast "wall display" theme to a modern, accessible Material Design 3 interface following Google's latest design principles.

## Current State Analysis

### Problems with Current Design
- **Neon color scheme** (`#00ff88`, `#ff6b35`) - Not professional or accessible
- **Oversized typography** - Designed for wall mounting, not desktop/mobile use
- **High-contrast only** - No proper light/dark theme system
- **Poor accessibility** - Doesn't meet WCAG guidelines
- **No responsive design** - Fixed for large displays only
- **Flat design** - No elevation or depth hierarchy

### Current CSS Structure
- Single `styles/main.css` file with 417 lines
- Custom CSS variables for colors
- Tailwind-like utility classes
- Wall display optimized sizing

## Material Design 3 Implementation Plan

### 1. Color System Overhaul

#### New Color Palette
```css
/* Light Theme - Material Design 3 */
:root {
  /* Primary Colors */
  --md-sys-color-primary: #1976d2;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #e3f2fd;
  --md-sys-color-on-primary-container: #0d47a1;
  
  /* Secondary Colors */
  --md-sys-color-secondary: #03dac6;
  --md-sys-color-on-secondary: #000000;
  --md-sys-color-secondary-container: #e0f7fa;
  --md-sys-color-on-secondary-container: #00695c;
  
  /* Surface Colors */
  --md-sys-color-surface: #ffffff;
  --md-sys-color-on-surface: #1c1b1f;
  --md-sys-color-surface-variant: #f5f5f5;
  --md-sys-color-on-surface-variant: #49454f;
  
  /* Background */
  --md-sys-color-background: #fefbff;
  --md-sys-color-on-background: #1c1b1f;
  
  /* Error Colors */
  --md-sys-color-error: #ba1a1a;
  --md-sys-color-on-error: #ffffff;
  --md-sys-color-error-container: #ffdad6;
  --md-sys-color-on-error-container: #410002;
  
  /* Success Colors (for energy data) */
  --md-sys-color-success: #2e7d32;
  --md-sys-color-on-success: #ffffff;
  --md-sys-color-success-container: #e8f5e8;
  --md-sys-color-on-success-container: #1b5e20;
  
  /* Warning Colors (for price alerts) */
  --md-sys-color-warning: #f57c00;
  --md-sys-color-on-warning: #ffffff;
  --md-sys-color-warning-container: #fff3e0;
  --md-sys-color-on-warning-container: #e65100;
  
  /* Outline */
  --md-sys-color-outline: #79747e;
  --md-sys-color-outline-variant: #cac4d0;
}

/* Dark Theme */
[data-theme="dark"] {
  --md-sys-color-primary: #90caf9;
  --md-sys-color-on-primary: #0d47a1;
  --md-sys-color-primary-container: #1565c0;
  --md-sys-color-on-primary-container: #e3f2fd;
  
  --md-sys-color-secondary: #4dd0e1;
  --md-sys-color-on-secondary: #00695c;
  --md-sys-color-secondary-container: #00838f;
  --md-sys-color-on-secondary-container: #e0f7fa;
  
  --md-sys-color-surface: #121212;
  --md-sys-color-on-surface: #e6e1e5;
  --md-sys-color-surface-variant: #1e1e1e;
  --md-sys-color-on-surface-variant: #cac4d0;
  
  --md-sys-color-background: #0f0f0f;
  --md-sys-color-on-background: #e6e1e5;
  
  --md-sys-color-error: #ffb4ab;
  --md-sys-color-on-error: #690005;
  --md-sys-color-error-container: #93000a;
  --md-sys-color-on-error-container: #ffdad6;
  
  --md-sys-color-success: #81c784;
  --md-sys-color-on-success: #1b5e20;
  --md-sys-color-success-container: #2e7d32;
  --md-sys-color-on-success-container: #e8f5e8;
  
  --md-sys-color-warning: #ffb74d;
  --md-sys-color-on-warning: #e65100;
  --md-sys-color-warning-container: #f57c00;
  --md-sys-color-on-warning-container: #fff3e0;
  
  --md-sys-color-outline: #938f99;
  --md-sys-color-outline-variant: #49454f;
}
```

### 2. Typography System

#### Google Fonts Integration
```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;500&display=swap');
```

#### Material Design Type Scale
```css
/* Display Styles */
.display-large {
  font-family: 'Roboto', sans-serif;
  font-size: 57px;
  line-height: 64px;
  font-weight: 400;
  letter-spacing: -0.25px;
}

.display-medium {
  font-family: 'Roboto', sans-serif;
  font-size: 45px;
  line-height: 52px;
  font-weight: 400;
  letter-spacing: 0px;
}

.display-small {
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  line-height: 44px;
  font-weight: 400;
  letter-spacing: 0px;
}

/* Headline Styles */
.headline-large {
  font-family: 'Roboto', sans-serif;
  font-size: 32px;
  line-height: 40px;
  font-weight: 400;
  letter-spacing: 0px;
}

.headline-medium {
  font-family: 'Roboto', sans-serif;
  font-size: 28px;
  line-height: 36px;
  font-weight: 400;
  letter-spacing: 0px;
}

.headline-small {
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  line-height: 32px;
  font-weight: 400;
  letter-spacing: 0px;
}

/* Title Styles */
.title-large {
  font-family: 'Roboto', sans-serif;
  font-size: 22px;
  line-height: 28px;
  font-weight: 500;
  letter-spacing: 0px;
}

.title-medium {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  letter-spacing: 0.15px;
}

.title-small {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: 0.1px;
}

/* Body Styles */
.body-large {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.body-medium {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  letter-spacing: 0.25px;
}

.body-small {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  letter-spacing: 0.4px;
}

/* Label Styles */
.label-large {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: 0.1px;
}

.label-medium {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.label-small {
  font-family: 'Roboto', sans-serif;
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
}
```

### 3. Elevation System

#### Material Design Elevation Levels
```css
.elevation-0 {
  box-shadow: none;
}

.elevation-1 {
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30);
}

.elevation-2 {
  box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30);
}

.elevation-3 {
  box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30);
}

.elevation-4 {
  box-shadow: 0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.30);
}

.elevation-5 {
  box-shadow: 0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.30);
}
```

### 4. Component Library

#### Material Design Cards
```css
.md-card {
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.md-card--elevated {
  box-shadow: var(--md-elevation-1);
}

.md-card--filled {
  background-color: var(--md-sys-color-surface-variant);
  color: var(--md-sys-color-on-surface-variant);
}

.md-card--outlined {
  border: 1px solid var(--md-sys-color-outline-variant);
}

.md-card:hover {
  box-shadow: var(--md-elevation-2);
}
```

#### Material Design Buttons
```css
.md-button {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  border-radius: 20px;
  padding: 10px 24px;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
}

.md-button--filled {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

.md-button--filled:hover {
  box-shadow: var(--md-elevation-1);
}

.md-button--outlined {
  background-color: transparent;
  color: var(--md-sys-color-primary);
  border: 1px solid var(--md-sys-color-outline);
}

.md-button--text {
  background-color: transparent;
  color: var(--md-sys-color-primary);
  padding: 10px 12px;
}

.md-button--fab {
  border-radius: 16px;
  width: 56px;
  height: 56px;
  padding: 0;
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  box-shadow: var(--md-elevation-3);
}
```

#### Material Design Text Fields
```css
.md-text-field {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.md-text-field__input {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 24px;
  padding: 16px;
  border: 1px solid var(--md-sys-color-outline);
  border-radius: 4px;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.md-text-field__input:focus {
  outline: none;
  border-color: var(--md-sys-color-primary);
  border-width: 2px;
}

.md-text-field__label {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant);
  margin-bottom: 4px;
}

.md-text-field__helper-text {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  color: var(--md-sys-color-on-surface-variant);
  margin-top: 4px;
}

.md-text-field--error .md-text-field__input {
  border-color: var(--md-sys-color-error);
}

.md-text-field--error .md-text-field__helper-text {
  color: var(--md-sys-color-error);
}
```

### 5. Theme System Implementation

#### Theme Toggle Functionality
```typescript
interface ThemeService {
  currentTheme: 'light' | 'dark' | 'auto';
  setTheme(theme: 'light' | 'dark' | 'auto'): void;
  getEffectiveTheme(): 'light' | 'dark';
  onThemeChange(callback: (theme: 'light' | 'dark') => void): void;
}
```

#### CSS Theme Implementation
```css
/* Theme transition */
* {
  transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1),
              color 0.2s cubic-bezier(0.2, 0, 0, 1),
              border-color 0.2s cubic-bezier(0.2, 0, 0, 1);
}

/* System preference detection */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* Apply dark theme variables */
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
```

### 6. Responsive Design System

#### Breakpoint System
```css
/* Material Design Breakpoints */
:root {
  --md-breakpoint-xs: 0px;
  --md-breakpoint-sm: 600px;
  --md-breakpoint-md: 905px;
  --md-breakpoint-lg: 1240px;
  --md-breakpoint-xl: 1440px;
}

/* Responsive utilities */
@media (max-width: 599px) {
  .hide-on-mobile { display: none; }
  .show-on-mobile { display: block; }
}

@media (min-width: 600px) and (max-width: 904px) {
  .hide-on-tablet { display: none; }
  .show-on-tablet { display: block; }
}

@media (min-width: 905px) {
  .hide-on-desktop { display: none; }
  .show-on-desktop { display: block; }
}
```

### 7. Accessibility Improvements

#### Focus Management
```css
/* Focus indicators */
.md-focus-ring {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .md-card {
    border: 2px solid var(--md-sys-color-outline);
  }
  
  .md-button {
    border: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Implementation Steps

### Step 1: CSS Architecture Overhaul
1. **Backup current styles**: Save current `styles/main.css`
2. **Create new CSS structure**:
   - `styles/tokens.css` - Design tokens and variables
   - `styles/typography.css` - Typography system
   - `styles/components.css` - Component styles
   - `styles/utilities.css` - Utility classes
   - `styles/main.css` - Main imports and base styles

### Step 2: Color System Migration
1. **Replace color variables** in CSS
2. **Update HTML classes** to use new color tokens
3. **Implement theme switching** functionality
4. **Test contrast ratios** for accessibility

### Step 3: Typography Implementation
1. **Import Google Fonts** (Roboto family)
2. **Replace current typography classes**
3. **Update HTML elements** with new typography classes
4. **Ensure responsive typography scaling**

### Step 4: Component Updates
1. **Redesign cards** with Material Design elevation
2. **Update buttons** with new Material Design styles
3. **Enhance form inputs** with Material Design text fields
4. **Add loading states** and micro-interactions

### Step 5: Layout Adjustments
1. **Implement responsive grid system**
2. **Update spacing** to use 8dp grid
3. **Add proper elevation hierarchy**
4. **Ensure mobile-first responsive design**

## Expected Outcomes

### Visual Improvements
- **Professional appearance** following Google's design standards
- **Better accessibility** with WCAG AA compliance
- **Responsive design** that works on all screen sizes
- **Consistent visual hierarchy** with proper elevation

### User Experience Improvements
- **Familiar interface patterns** users already know
- **Better readability** with proper typography scale
- **Smooth animations** and micro-interactions
- **Proper focus management** for keyboard navigation

### Technical Benefits
- **Maintainable CSS architecture** with clear separation
- **Design system consistency** across all components
- **Future-proof foundation** for new features
- **Better performance** with optimized CSS

## Success Metrics

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Proper color contrast ratios (4.5:1 minimum)
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility

### Responsive Design
- [ ] Mobile-first approach
- [ ] Proper breakpoint handling
- [ ] Touch-friendly interface elements
- [ ] Readable typography on all screen sizes

### Performance
- [ ] Optimized CSS bundle size
- [ ] Smooth animations (60fps)
- [ ] Fast theme switching
- [ ] Minimal layout shifts

### User Experience
- [ ] Intuitive navigation
- [ ] Clear visual hierarchy
- [ ] Consistent interaction patterns
- [ ] Professional appearance

## Next Steps After Phase 1

Once the design system foundation is complete, we'll proceed to:

1. **Phase 2**: Layout restructure with Material Design app shell
2. **Phase 3**: Configuration system implementation
3. **Phase 4**: Enhanced data visualization
4. **Phase 5**: Advanced features and polish

This foundation will make all subsequent phases much easier and more consistent.