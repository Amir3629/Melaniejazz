# Mobile Version - Vocal Coaching Website

This is the mobile-optimized version of the Vocal Coaching website, designed specifically for devices with screen widths below 768px.

## Features

- Optimized for mobile devices
- Touch-friendly interface
- Responsive design
- Simplified navigation
- Optimized images and assets
- Preserved functionality from desktop version

## Technical Details

### Device Detection

The website uses client-side detection to redirect mobile users:

```javascript
if (window.innerWidth <= 768) {
  window.location.href = "/mobile/";
}
```

### Mobile-Specific Features

- Touch-optimized buttons and interactions
- Simplified navigation menu
- Vertically stacked layouts
- Optimized form inputs
- Mobile-friendly animations
- Bandwidth-optimized assets

### Directory Structure

```
mobile-version/
├── app/
│   ├── components/     # Mobile-optimized React components
│   ├── styles/        # Mobile-specific styles
│   ├── lib/           # Utility functions
│   └── hooks/         # Custom React hooks
├── public/
│   ├── images/        # Optimized images for mobile
│   └── locales/       # Translations
└── README.md
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Testing

Test the mobile version on various devices and screen sizes:
- Phones (iOS and Android)
- Small tablets
- Different browsers
- Various network conditions

## Deployment

1. Build the project
2. Deploy to your hosting platform
3. Configure device detection and redirection

## View Desktop Version

Users can switch to the desktop version by clicking the "View Desktop Version" link in the footer.

## Maintenance

When updating the desktop version, ensure corresponding updates are made to the mobile version to maintain content parity. 