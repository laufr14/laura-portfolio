# Laura Félix — Software Developer Portfolio

> A cinematic, interactive portfolio built to showcase software development, selected projects and technical expertise through a custom 3D web experience.

## Overview

This portfolio is a handcrafted static website that combines frontend development, 3D graphics and product-focused design.

Instead of following a conventional portfolio structure, the experience is built as a collection of immersive digital environments. Each section has its own visual identity while maintaining a consistent design system inspired by dark cinematic interfaces, sci-fi environments and modern digital products.

The portfolio is available in **English and Spanish**, is responsive across desktop and mobile devices, and has been designed both as a professional presentation and as a technical showcase.

---

## ✦ Highlights

- Custom 3D environments powered by Three.js.
- Independent HTML pages for each main portfolio section.
- Bilingual experience: English / Spanish.
- Responsive desktop and mobile layouts.
- Custom mobile navigation.
- Cinematic page-to-page transitions.
- Interactive 3D technology ecosystem.
- Real project screenshots integrated into the Projects experience.
- Custom 3D terminal-based Contact experience.
- Browser-specific fallback for the Firefox Contact experience.
- Custom favicon.
- Open Graph metadata and social sharing image.
- `theme-color` metadata.
- CV links that open in a new browser tab.
- Semantic HTML and ARIA attributes.
- Reduced-motion considerations.
- No frontend framework or bundler required.

---

# ✦ Design Direction

## Concept

**CODE × CREATIVITY**

The visual language of the portfolio combines software development with a cinematic sci-fi aesthetic.

The interface is built around:

- Dark cinematic backgrounds.
- Purple, blue and white lighting.
- 3D architectural environments.
- Futuristic interfaces.
- Glass and metallic materials.
- Editorial typography.
- Minimal but intentional animation.
- Strong contrast and visual hierarchy.

The goal is not to add 3D effects for decoration, but to use them as part of the storytelling and navigation of the portfolio.

---

## Design System

| Element | Value |
|---|---|
| Background | `#060708` |
| Surfaces | `#0B0D11` / `#101218` |
| Primary text | `#F5F5F7` |
| Secondary text | `#969AA3` |
| Purple accent | `#9D8CFF` / `#8B7CFF` |
| Blue accent | `#6ED6FF` |
| Display font | Space Grotesk |
| Body font | Inter |

---

# ✦ Portfolio Experience

## Home

The Home page acts as the central hub of the portfolio.

It introduces the visitor to a cinematic 3D interior environment and provides access to the four main sections:

1. Projects
2. Technologies
3. About
4. Contact

The opening sequence uses a space-inspired narrative involving a spaceship and planet before transitioning into the main portfolio environment.

The intro includes a **Skip Intro** control and uses session-based logic so the introduction is not repeatedly shown during the same browser session.

---

# ✦ Projects

The Projects page presents selected work through large visual cards with project screenshots and interactive reveal behavior.

## 01 — Nalix

### Personal Finance Manager

An Android application designed to help users understand and manage their personal finances through a clear and intuitive experience.

**Technologies**

`Kotlin` · `Android` · `Jetpack Compose` · `Room` · `MVVM`

**Links**

- [Google Play](https://play.google.com/store/apps/details?id=com.nalix.expensetracker)
- [GitHub](https://github.com/laufr14/nalix-expense-tracker)

---

## 02 — LearningPsychix

### Adaptive Learning App

An Android learning application focused on personalized challenges, progress tracking and an evolving learner profile.

**Technologies**

`Kotlin` · `Jetpack Compose` · `Firebase` · `AI`

**Status**

Coming soon.

---

## 03 — Café Aroma

### Web Experience

A responsive web experience created for a local coffee business, focused on atmosphere, clarity and visual identity.

**Technologies**

`HTML` · `CSS` · `JavaScript`

**Links**

- [Live Demo](https://laufr14.github.io/cafe-aroma/)
- [GitHub](https://github.com/laufr14/cafe-aroma)

---

# ✦ Technologies

The Technologies page transforms the technical stack into an interactive Three.js ecosystem.

The scene is built around a central purple planet surrounded by orbital rings and floating glass cubes containing technology logos.

The stack currently presented includes:

| Technology | Focus |
|---|---|
| Kotlin | Android Development |
| Android | Mobile Development |
| Java | Java Development |
| Python | Data & Automation |
| JavaScript | Web Development |
| Jetpack Compose | Modern Android UI |
| PostgreSQL | Database & Backend |
| Spring | Backend Development |

The scene also includes an interactive exploration hint that opens a dedicated stack panel containing the technologies and their development roles.

---

# ✦ About

The About page uses a futuristic command-deck / bridge environment rather than a conventional profile section.

The 3D environment provides the visual context for:

- Professional profile.
- Development focus.
- Personal values.
- Product-oriented approach.
- Software development philosophy.

The experience combines editorial typography with a spatial 3D environment to keep the section consistent with the overall portfolio narrative.

---

# ✦ Contact

The Contact page is built around a custom 3D communication terminal.

Instead of displaying a conventional contact form beside the 3D scene, the entire contact interface is placed directly on the terminal screen.

The experience combines:

- Three.js.
- Custom 3D geometry.
- Lighting and materials.
- CSS3D interface rendering.
- Responsive camera behavior.
- Browser-specific fallback handling.

### Firefox fallback

CSS3D rendering behavior can differ between browsers.

To preserve the Contact interface in Firefox, the implementation includes a DOM-based fallback that projects the interface onto the terminal screen when the CSS3D approach is not suitable.

This allows the visual experience to remain consistent across supported browsers.

---

# ✦ 3D Architecture

The portfolio uses different 3D environments for different experiences.

### Current GLB assets

```text
assets/models/
├── interior-room.glb
├── planet.glb
├── spaceship.glb
├── purple_planet.glb
├── about-bridge.glb
└── terminal.glb