# Melanie Jazz - Vocal Coaching Website

## Current Setup & Architecture

### Technology Stack
- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Internationalization**: i18next
- **Deployment**: GitHub Pages
- **Build Output**: Static HTML/CSS/JS

### Current Architecture
Our website is currently a statically generated site built with Next.js. This means:
- All pages are pre-rendered at build time
- Content is hardcoded in the components
- No server-side operations
- No database connections
- Deployment generates static files in the `out` directory

## CMS Integration Possibilities

### Option 1: Headless CMS with Git-based Workflow (Recommended)
This option maintains GitHub Pages hosting while adding CMS capabilities.

#### Recommended Solutions:
1. **Tina CMS**
   - Git-based
   - Works with Next.js
   - Maintains static output
   - Visual editing interface
   - Setup steps:
     ```bash
     npm install tinacms @tinacms/cli
     # Initialize Tina
     npx @tinacms/cli init
     ```
   - Configuration needed in `tina/config.ts`

2. **Netlify CMS/Decap CMS**
   - Git-based
   - Simple setup
   - Works with static sites
   - Setup steps:
     ```bash
     # Add admin folder in public directory
     mkdir public/admin
     # Create config.yml and index.html
     ```

### Option 2: Headless CMS with API (Alternative)

1. **Contentful**
   - Requires build hook setup
   - Content fetched at build time
   - Maintains static output
   - More complex setup but powerful
   - Setup steps:
     ```bash
     npm install contentful
     # Setup environment variables
     CONTENTFUL_SPACE_ID=your_space_id
     CONTENTFUL_ACCESS_TOKEN=your_access_token
     ```

2. **Strapi**
   - Self-hosted option
   - Requires separate hosting for Strapi
   - Content fetched at build time
   - Setup steps:
     ```bash
     # Create Strapi project
     npx create-strapi-app@latest my-project
     # Install Strapi client
     npm install @strapi/client
     ```

## Implementation Guide

### 1. Content Structure
Current content types that need CMS management:
- Services (Vocal Coaching, Live Performance, Workshops)
- Testimonials
- Blog Posts/News
- FAQ
- Contact Information
- Pricing
- Workshop Schedules

### 2. Required Changes

#### File Structure Updates
```
├── content/           # New directory for markdown/JSON content
│   ├── services/
│   ├── testimonials/
│   └── blog/
├── public/
│   └── admin/        # CMS admin interface
├── app/
│   └── [...]/        # Existing Next.js components
└── tina/             # If using Tina CMS
    └── config.ts
```

#### Component Modifications
1. Convert hardcoded content to dynamic imports:
   ```typescript
   // Before
   const services = [
     { title: "Vocal Coaching", ... }
   ];

   // After
   import { getServices } from '@/lib/content';
   const services = await getServices();
   ```

2. Add content fetching utilities:
   ```typescript
   // lib/content.ts
   import { createClient } from 'tinacms/dist/client';

   export async function getServices() {
     const client = createClient({
       branch: process.env.NEXT_PUBLIC_TINA_BRANCH || '',
       clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '',
       token: process.env.TINA_TOKEN || '',
     });
     
     return await client.queries.services();
   }
   ```

### 3. Build & Deployment Process

1. **Current Process**:
   ```bash
   npm run build    # Generates static files
   npm run deploy   # Pushes to gh-pages branch
   ```

2. **New Process with CMS**:
   ```bash
   # If using Tina CMS
   npm run tina:build  # Generate Tina schema
   npm run build      # Build static site
   npm run deploy     # Deploy to GitHub Pages
   ```

### 4. CMS Setup Instructions

#### Using Tina CMS (Recommended)

1. Install dependencies:
   ```bash
   npm install tinacms @tinacms/cli
   ```

2. Initialize Tina:
   ```bash
   npx @tinacms/cli init
   ```

3. Configure content schema in `tina/config.ts`:
   ```typescript
   import { defineConfig } from 'tinacms';

   export default defineConfig({
     schema: {
       collections: [
         {
           name: 'service',
           label: 'Services',
           path: 'content/services',
           fields: [
             {
               type: 'string',
               name: 'title',
               label: 'Title',
               required: true,
             },
             {
               type: 'rich-text',
               name: 'description',
               label: 'Description',
               required: true,
             },
             // Add more fields as needed
           ],
         },
         // Add more collections
       ],
     },
   });
   ```

4. Update `package.json` scripts:
   ```json
   {
     "scripts": {
       "dev": "tinacms dev -c \"next dev\"",
       "build": "tinacms build && next build",
       "deploy": "type nul > out/.nojekyll && xcopy /E /I /Y public\\* out\\ && npx push-dir --dir=out --branch=gh-pages --cleanup --force"
     }
   }
   ```

## Feasibility Analysis

### Is our website static?
Yes, your website is currently a static site:
- All pages are pre-rendered during build time
- No server-side operations
- Content is served as static HTML/CSS/JS
- Perfect for GitHub Pages hosting

### Requirements for CMS Integration

#### Already Have:
- Next.js setup
- Static output
- GitHub Pages deployment
- TypeScript support
- Component structure

#### Need to Add:
- CMS package/setup
- Content schema definitions
- Dynamic content fetching
- Build process updates
- Environment variables configuration

### Limitations & Considerations

1. **Content Updates**:
   - Changes require rebuild and redeploy
   - Can be automated with GitHub Actions
   - Not real-time like traditional CMS

2. **Media Handling**:
   - Images/media need to be in repository
   - Consider using CDN for large media files
   - Git LFS might be needed for large repositories

3. **User Management**:
   - Limited to GitHub authentication
   - Access control through repository permissions
   - No built-in user roles

## Conclusion

Implementing a CMS while maintaining GitHub Pages hosting is definitely possible. The recommended approach is using Tina CMS or Netlify CMS/Decap CMS as they:
- Maintain static output
- Work with GitHub Pages
- Provide user-friendly interfaces
- Keep content in your repository
- Require minimal infrastructure changes

## Next Steps

1. Choose and implement preferred CMS solution
2. Migrate current content to CMS format
3. Update components to fetch from CMS
4. Set up automated build/deploy process
5. Test content management workflow
6. Document content update procedures

## Support & Resources

- [Tina CMS Documentation](https://tina.io/docs/)
- [Netlify CMS Documentation](https://decapcms.org/docs/intro/)
- [Next.js Static Export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages) 