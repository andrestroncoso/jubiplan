# Jubiplan - Product Definition

## Register
**Product** — design serves the product. App UI, dashboard, tool for pension calculations.

## Target Users & Context
- **Primary users**: Adults 55-80 years old in Chile
- **Secondary users**: Financial advisors, family members helping with retirement planning
- **Context**: Desktop & mobile browsing at home, calm environment, may need accessibility support
- **Job to get done**: Calculate estimated retirement pension based on personal parameters; understand AFPs and Isapres; explore different scenarios

## Purpose & Outcome
Jubiplan is an intelligent pension calculator that demystifies Chile's complex AFP-Isapre system. Users input their financial parameters and receive clear, personalized estimates of their retirement income. The goal is financial clarity and confidence, not entertainment.

## Brand Personality
- **Trustworthy**: Finance is serious; convey stability and expertise
- **Clear**: Demystify complexity; every field, label, result is immediately understandable
- **Human-centered**: Designed for non-technical users, especially older adults

## Strategic Design Principles
1. **Accessibility first**: WCAG AAA compliance (7:1 contrast, 52px+ touch targets, visible focus, keyboard nav)
2. **Clarity over cleverness**: Use space, hierarchy, and straightforward language
3. **Progressive disclosure**: Show only what's needed at each step; reveal complexity only when requested
4. **Fintech with warmth**: Professional and secure, but not corporate-cold

## Anti-References
- Avoid: Corporate fintech clichés (navy + gold, gradient text, hero metrics)
- Avoid: Over-animated interfaces (motion should serve, not distract)
- Avoid: Tiny gray text or placeholder-only labels
- Avoid: Nested cards or visual clutter

## Color Palette
- **Primary**: Oro #F59E0B (trust, warmth, finance)
- **Secondary**: Púrpura #8B5CF6 (technology, modern)
- **Accent**: Azul Profesional #0369A1
- **Success**: Verde #10B981 (positive outcomes)
- **Backgrounds**: Oscuro profesional #0F172A (dark mode for fatigue reduction)
- **Text**: Blanco puro #F8FAFC (7:1 contrast minimum)

## Typography
- **Font**: IBM Plex Sans (professional, trusted in financial services)
- **Scale**: 18px base for readability (especially for older adults)
- **Hierarchy**: Weight contrast (300 light → 700 bold), never color alone

## Accessibility Requirements
- **WCAG AAA compliance**: 7:1+ color contrast on all text
- **Touch targets**: Minimum 52px tabs, 56px buttons
- **Focus indicators**: 4px visible outline, high contrast
- **Keyboard navigation**: All features accessible without mouse
- **Labels**: Every input has visible associated label (not placeholder-only)
- **Reduced motion**: All animations respect prefers-reduced-motion

## Platform & Devices
- **Primary**: Desktop (1920×1080, 1366×768)
- **Secondary**: Tablet (iPad Air 5, 1024×1366)
- **Tertiary**: Mobile (iPhone 14, 390×844)
- **Dark mode**: Default and primary (reduces eye strain for older users)

## Success Metrics
- **Usability**: First-time users can calculate a pension without help
- **Clarity**: All results understood correctly by target demographic
- **Trust**: Users feel confident in the numbers and recommendations
- **Performance**: Page loads in <2s, calculations <500ms
- **Accessibility**: 100% keyboard navigable, 0 WCAG violations

## Visual System Status
- **Colors**: Implemented with CSS variables (Oro/Púrpura/Verde palette)
- **Typography**: IBM Plex Sans from Google Fonts, 18px base
- **Components**: Tabs, forms, cards, badges, charts (Chart.js)
- **Spacing**: Systematic (16px base unit)
- **Dark mode**: Active, responsive to system preference

## Next Steps
Ready for `/impeccable audit` to identify refinements, or `/impeccable polish` to finalize edge cases and error states.
