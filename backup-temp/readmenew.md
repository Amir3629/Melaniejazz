# Vocal Coaching Website - Project Documentation

## Overview

This project is a modern, responsive website for a vocal coach based in Berlin, built using Next.js. It serves as an online presence, offering information about services, showcasing testimonials and media, and providing contact/booking functionality. The site is designed for static export, making it suitable for hosting on platforms like GitHub Pages.

## Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/) (v14+) with App Router
*   **Language:** TypeScript
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) with `tailwind-merge` and `clsx` for utility classes. Custom CSS is used for specific fixes and theming (`app/styles/`).
*   **UI Components:** [Shadcn/ui](https://ui.shadcn.com/) (using Radix UI primitives) for foundational components like Buttons, Dialogs, Forms, etc.
*   **Animation:** [Framer Motion](https://www.framer.com/motion/) for page transitions and interactive animations.
*   **Internationalization (i18n):** [i18next](https://www.i18next.com/) with `react-i18next` and `i18next-http-backend` for multi-language support (English & German). Locale files are in `locales/`.
*   **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.
*   **Deployment:** Static Export (`output: 'export'`) hosted on GitHub Pages (`gh-pages` branch).

## Project Structure

```
.
├── app/                  # Next.js App Router directory
│   ├── (main)/           # Main route group (example)
│   │   └── page.tsx      # Main landing page component
│   ├── components/       # Reusable UI components (Header, Footer, Cards, Forms, etc.)
│   │   ├── ui/           # Shadcn/ui components
│   │   └── ...           # Custom components
│   ├── legal/            # Static pages for legal documents (AGB, Impressum, etc.)
│   │   ├── agb/
│   │   │   └── page.tsx
│   │   └── ...
│   ├── styles/           # Global and specific CSS files
│   ├── lib/              # Utility functions, hooks, constants
│   ├── layout.tsx        # Root layout component
│   ├── globals.css       # Global Tailwind styles
│   └── ...               # Other pages, route groups, loading/error files
├── public/               # Static assets (images, fonts, icons)
│   ├── images/
│   │   ├── backgrounds/
│   │   ├── cards/
│   │   ├── logo/
│   │   └── ...
│   ├── audio/
│   ├── videos/
│   └── ...
├── locales/              # Internationalization (i18n) JSON files
│   ├── en/
│   │   └── translation.json
│   └── de/
│       └── translation.json
├── scripts/              # Build/utility scripts (e.g., post-build.js)
├── next.config.js        # Next.js configuration file
├── package.json          # Project dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── readmenew.md          # This file
└── ...                   # Other configuration files (.gitignore, .eslintrc.json, etc.)
```

## Core Functionalities

1.  **Static Site Generation (SSG):**
    *   The `output: 'export'` setting in `next.config.js` instructs Next.js to generate fully static HTML, CSS, and JavaScript files during the build process (`npm run build`).
    *   This makes the site highly performant and easily deployable on any static hosting provider.
    *   The `post-build.js` script likely handles adjustments needed for static export, such as creating a `.nojekyll` file for GitHub Pages.

2.  **Routing:**
    *   Uses the Next.js App Router convention (`app/` directory).
    *   File and folder names within `app/` define the routes (e.g., `app/booking/page.tsx` maps to `/booking`).
    *   `app/layout.tsx` defines the root layout shared across all pages.

3.  **Styling:**
    *   Primarily uses Tailwind CSS for rapid UI development with utility classes.
    *   `tailwind.config.ts` configures theme extensions (colors, fonts) and plugins.
    *   `app/globals.css` includes Tailwind's base styles and directives.
    *   Additional custom CSS files in `app/styles/` handle specific overrides, theming, or complex styles not easily achieved with Tailwind alone.

4.  **Component-Based UI:**
    *   The UI is built using reusable React components located in `app/components/`.
    *   Shadcn/ui provides accessible and unstyled component primitives, customized within the project.
    *   Key custom components include Navigation, Footer, Service Cards, Testimonial Slider, Booking Form, Legal Document Modals, etc.

5.  **Internationalization (i18n):**
    *   `i18next` is configured to load translation strings from JSON files in `locales/en` and `locales/de`.
    *   The `TranslatedText` component (or similar hook/utility) likely handles displaying text in the currently selected language.
    *   Language switching logic might be present in the Header or a dedicated language switcher component.

6.  **Dynamic Content Loading (Modals):**
    *   Legal documents (Impressum, AGB, Datenschutz) are implemented as separate static pages (`app/legal/...`).
    *   When a legal link in the Footer is clicked, a modal (`LegalDocumentModal`) dynamically imports and renders the *content* of the corresponding legal page, using an `isModal` prop to conditionally render only the necessary parts (avoiding duplicate headers/footers inside the modal).

7.  **Booking Interaction:**
    *   The main page (`app/page.tsx`) manages the state for the booking modal (`isBookingModalOpen`).
    *   Clicking the "Jetzt Buchen" button on a `ServiceCard` triggers a function (`openBookingModal`) passed down from the main page to open the `BookingForm` modal.

## Build Process

1.  **Installation:** `npm install` installs all dependencies listed in `package.json`.
2.  **Build:** `npm run build` triggers the Next.js production build.
    *   Sets `NODE_ENV=production`.
    *   Increases Node.js memory limit (`--max-old-space-size=4096`).
    *   Runs `next build`.
    *   Performs static export, generating files in the `out/` directory.
    *   Runs the `postbuild` script (`scripts/post-build.js`) for any necessary post-processing.

## Deployment (GitHub Pages)

*   **Target Branch:** `gh-pages`
*   **Source Directory:** `out/` (contains the static build output)
*   **Method:** The `deploy-to-melaniejazz.ps1` script (or potentially `npx gh-pages -d out -b gh-pages`) is used to push the contents of the `out/` directory to the `gh-pages` branch of the specified repository (`https://github.com/Amir3629/Melaniejazz.git` in this case).
*   **Configuration:**
    *   `next.config.js` must have the correct `basePath` and `assetPrefix` set to match the repository name (e.g., `/Melaniejazz`). This ensures assets are loaded correctly when hosted in a subdirectory on GitHub Pages.
    *   A `.nojekyll` file is needed in the root of the `gh-pages` branch to prevent GitHub from trying to process the site with Jekyll.
    *   GitHub Repository Settings need to be configured to deploy from the `gh-pages` branch, using the `/ (root)` folder.

## Getting Started Locally

1.  **Clone the repository:** `git clone <repository_url>`
2.  **Navigate to the project directory:** `cd <project_directory>`
3.  **Install dependencies:** `npm install`
4.  **Run the development server:** `npm run dev`
5.  **Open your browser:** Navigate to `http://localhost:3000` (or the specified port).

**Note:** Ensure environment variables (if any, e.g., for APIs like EmailJS or PayPal) are set up correctly, potentially in a `.env.local` file (which should be added to `.gitignore`). 