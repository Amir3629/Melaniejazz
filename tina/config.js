import { defineConfig } from 'tinacms'

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main'

export default defineConfig({
  branch,
  clientId: '391cdcc3-31b1-4b98-893b-f505de0faf7d', // Get this from tina.io
  token: 'NOT_NEEDED_FOR_LOCAL_MODE',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
    basePath: process.env.NODE_ENV === 'production' ? '/Melaniejazz' : '',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },
  // Enable local mode for GitHub Pages deployment
  localMode: true,
  schema: {
    collections: [
      {
        name: 'post',
        label: 'Posts',
        path: 'content/posts',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
      {
        name: 'service',
        label: 'Services',
        path: 'content/services',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'image',
            name: 'image',
            label: 'Image',
          },
          {
            type: 'string',
            name: 'price',
            label: 'Price',
          },
          {
            type: 'boolean',
            name: 'featured',
            label: 'Featured Service',
          },
        ],
      },
      {
        name: 'testimonial',
        label: 'Testimonials',
        path: 'content/testimonials',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'name',
            label: 'Name',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'quote',
            label: 'Quote',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'image',
            name: 'avatar',
            label: 'Avatar Image',
          },
          {
            type: 'string',
            name: 'title',
            label: 'Job Title/Description',
          },
        ],
      },
      {
        name: 'page',
        label: 'Pages',
        path: 'content/pages',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'image',
            name: 'heroImage',
            label: 'Hero Image',
          },
          {
            type: 'string',
            name: 'heroHeading',
            label: 'Hero Heading',
          },
          {
            type: 'string',
            name: 'heroSubheading',
            label: 'Hero Subheading',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'rich-text',
            name: 'content',
            label: 'Page Content',
            isBody: true,
          },
        ],
      },
      {
        name: 'settings',
        label: 'Settings',
        path: 'content/settings',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'siteTitle',
            label: 'Site Title',
          },
          {
            type: 'string',
            name: 'siteDescription',
            label: 'Site Description',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'image',
            name: 'logo',
            label: 'Site Logo',
          },
          {
            type: 'string',
            name: 'contactEmail',
            label: 'Contact Email',
          },
          {
            type: 'string',
            name: 'contactPhone',
            label: 'Contact Phone',
          },
          {
            type: 'string',
            name: 'address',
            label: 'Business Address',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'object',
            name: 'socialMedia',
            label: 'Social Media',
            list: true,
            fields: [
              {
                type: 'string',
                name: 'platform',
                label: 'Platform',
                options: ['Facebook', 'Instagram', 'Twitter', 'YouTube', 'LinkedIn'],
              },
              {
                type: 'string',
                name: 'url',
                label: 'URL',
              },
            ],
          },
        ],
      },
    ],
  },
}) 