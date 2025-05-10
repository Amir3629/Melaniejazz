import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.NEXT_PUBLIC_TINA_BRANCH || "backup-before-tina-cms";

export default defineConfig({
  branch,

  // Client ID from your Tina Cloud project
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "adc5bb99-664c-49e1-9761-b23bc62ec5f9",
  token: process.env.TINA_TOKEN,
  
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "pages",
        label: "Pages",
        path: "content/pages",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
          {
            type: "string",
            name: "description",
            label: "Meta Description",
          }
        ],
      },
      {
        name: "testimonials",
        label: "Testimonials",
        path: "content/testimonials",
        format: "json",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
            required: true,
          },
          {
            type: "string",
            name: "text",
            label: "Testimonial Text",
            required: true,
            ui: {
              component: "textarea"
            }
          },
          {
            type: "image",
            name: "image",
            label: "Profile Image"
          }
        ],
      },
      {
        name: "services",
        label: "Services",
        path: "content/services",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Service Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Short Description",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Full Description",
            isBody: true,
          },
          {
            type: "image",
            name: "image",
            label: "Service Image"
          },
          {
            type: "number",
            name: "price",
            label: "Price"
          }
        ],
      }
    ],
  },
});
