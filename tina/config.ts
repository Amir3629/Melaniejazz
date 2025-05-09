import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = "main";

export default defineConfig({
  branch,

  // Client ID from your Tina Cloud project
  clientId: "391cdcc3-31b1-4b98-893b-f505de0faf7d",
  
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
