# Vocal Coaching Website Backup - April 2024

## Project Overview
This is a complete backup of the Vocal Coaching website project, including all components, animations, and functionality. The project is built using Next.js and includes various custom components and animations.

## Key Components and Features

### 1. Booking System
- Multi-step booking process
- Service selection (Live Jazz Performance, Vocal Coaching, Jazz Workshop)
- Custom form for each service type
- Smooth animations and transitions
- Backdrop blur effects
- Progressive form validation

### 2. Animation Details
- Framer Motion animations for all transitions
- Synchronized animations for modals
- Custom easing curves: [0.4, 0, 0.2, 1]
- Animation durations: 0.8s for smooth transitions
- Coordinated backdrop blur effects

### 3. Key Files and Components

#### Core Components
- `app/components/booking-form.tsx`: Main booking form component
- `app/components/booking/service-selection.tsx`: Service selection step
- `app/components/booking/live-singing-form.tsx`: Live performance booking form
- `app/components/booking/vocal-coaching-form.tsx`: Vocal coaching booking form
- `app/components/booking/workshop-form-new.tsx`: Workshop booking form
- `app/components/booking/confirmation-step.tsx`: Booking confirmation step
- `app/components/ui/google-calendar-picker.tsx`: Calendar picker component
- `app/components/legal-document-modal.tsx`: Legal documents modal

#### Styling
- `app/globals.css`: Global styles
- `tailwind.config.js`: Tailwind configuration

#### Configuration
- `next.config.js`: Next.js configuration
- `package.json`: Project dependencies

### 4. Animation Variants

```typescript
// Modal Variants
const modalVariants = {
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  },
  closed: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  }
}

// Content Variants
const contentVariants = {
  open: {
    opacity: 1,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  },
  closing: {
    opacity: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  }
}

// Backdrop Variants
const backdropVariants = {
  open: {
    opacity: 1,
    backdropFilter: "blur(2px)",
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  },
  closed: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  }
}
```

### 5. Recent Changes and Improvements
- Synchronized modal closing animations
- Fixed backdrop blur persistence
- Corrected booking form titles
- Improved form validation
- Enhanced calendar picker animations
- Added smooth transitions between booking steps

### 6. Dependencies
- Next.js 14
- Framer Motion
- Tailwind CSS
- React
- TypeScript
- i18next for translations

## Restoration Instructions

To restore this backup:

1. Ensure you have Node.js installed (version 16 or higher)
2. Clone the repository
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Important Notes
- All animations are synchronized using Framer Motion variants
- The booking form uses a multi-step process with state management
- Legal document modals use the same animation system as the booking form
- Custom scrollbar styles are defined in globals.css
- Calendar picker has specific weekend handling for different service types

## Contact
For any questions about this backup, please refer to our chat history or contact the development team.

Last Updated: April 2024 