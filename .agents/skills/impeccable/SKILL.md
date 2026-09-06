---
name: impeccable
description: Impeccable Design System and UI/UX Craftsmanship for AI Agents by Paul Bakaus. Provides deterministic design guidance, anti-slop detector rules, typography scales, color harmony, layout precision, and motion polish.
---

# Impeccable Design Skill

## 1. Core Philosophy: Anti-Slop & Craftsmanship
Eliminate generic, repetitive "AI template" aesthetics in favor of purposeful, brand-tailored, production-grade interfaces.

- **No Purple Default Gradients**: Use intentional, curated color harmonies tailored to the product domain.
- **No Uncalibrated Contrast**: Text must meet WCAG AAA / AA contrast ratios against backgrounds (`#0F172A` on `#FFFFFF` or `#F8FAFC`, `#00C853` with dark text / white on dark).
- **Tactile Micro-Interactions**: Active states, smooth spring feedback (`activeOpacity={0.7}`), live pulsing indicators, and meaningful transitions.
- **Strict Visual Hierarchy**: Never compete for attention. Exactly one Primary Action per view, secondary actions clearly subdued.

---

## 2. GlowVAI Design Tokens & Primitives

### Color Palette:
- **Brand Primary (Quick-Commerce Green)**: `#00C853` / `#15803D`
- **Background Slate**: `#F8FAFC` / `#F1F5F9`
- **Surface Card**: `#FFFFFF` (with 1px `#E2E8F0` border and soft elevation `shadowOpacity: 0.04`)
- **Text Headings**: `#0F172A` (`fontWeight: '900' | '800'`)
- **Text Body**: `#334155` (`fontWeight: '600'`)
- **Text Muted / Subtitle**: `#64748B` (`fontWeight: '500'`)
- **Accent Offer / Savings**: `#F0FDF4` (Background) + `#166534` (Text) + `#BBF7D0` (Border)
- **Safety / Action Orange**: `#F97316` / `#EA580C`

### Spacing Scale:
`4px` (xxs) • `8px` (xs) • `12px` (sm) • `16px` (md) • `20px` (lg) • `24px` (xl) • `32px` (xxl)

### Typography Scale:
- **Display**: 22px–26px / 900 weight (LineHeight 28)
- **H1 / Section**: 18px–20px / 900 weight (LineHeight 24)
- **H2 / Card Title**: 14px–15px / 800 weight
- **Body Regular**: 13px / 600 weight
- **Caption / Metadata**: 10px–11px / 700 weight

---

## 3. Impeccable Command Table

| Command | Action |
|---|---|
| `/impeccable polish` | Audit and polish current screen styles, spacing, typography, contrast, and alignment. |
| `/impeccable critique` | Provide a design review highlighting anti-patterns, visual noise, or weak hierarchy. |
| `/impeccable audit` | Run detector checks across color contrast, touch target sizes ($\ge 44\times 44\text{px}$), and layout density. |
| `/impeccable animate` | Add fluid micro-animations, pulsing states, and skeleton loading feedback. |
