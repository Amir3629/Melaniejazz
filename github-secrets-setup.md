# GitHub Secrets Setup Guide

To make TinaCMS work with your GitHub Action workflows, you need to add these secrets to your repository:

## Required Secrets

1. `NEXT_PUBLIC_TINA_CLIENT_ID`: cb9f95e2-759f-482c-a863-7ed5bc3309cb
2. `TINA_TOKEN`: 7d2c087b403f429bf72ddfbcdfe5bda2331f655f

## How to Add Secrets to Your GitHub Repository

1. Go to your GitHub repository (https://github.com/Amir3629/Melaniejazz)
2. Click on "Settings" tab
3. In the left sidebar, click on "Secrets and variables" then "Actions"
4. Click on "New repository secret"
5. Add each secret:
   - Name: `NEXT_PUBLIC_TINA_CLIENT_ID`
   - Secret: `cb9f95e2-759f-482c-a863-7ed5bc3309cb`
   - Click "Add secret"
6. Repeat for the token:
   - Name: `TINA_TOKEN`
   - Secret: `7d2c087b403f429bf72ddfbcdfe5bda2331f655f`
   - Click "Add secret"

## Testing Your Setup

After adding these secrets, your GitHub workflows will have access to them.

To test locally:
1. Create a `.env.local` file with these variables
2. Run `npm run dev` to start the development server

For deployment:
- The GitHub workflow will use these secrets automatically
- You can manually trigger a workflow run to test

## Troubleshooting

If you're still having issues:
1. Make sure the token is properly set (we've updated to use the Content token with value starting with `7d2c087...`)
2. Check that the project ID is correct (`cb9f95e2-759f-482c-a863-7ed5bc3309cb`)
3. Verify that your GitHub repository is properly connected to TinaCMS 