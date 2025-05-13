import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

// For local development, use the hardcoded values
// For production, use environment variables 
const clientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "cb9f95e2-759f-482c-a863-7ed5bc3309cb";
const token = process.env.TINA_TOKEN || "7d2c087b403f429bf72ddfbcdfe5bda2331f655f";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: clientId,
  // Get this from tina.io
  token: token,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
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
        ],
        ui: {
          // This is an DEMO router. You can remove this to fit your site
          router: ({ document }) => `/demo/blog/${document._sys.filename}`,
        },
      },
    ],
  },
});
