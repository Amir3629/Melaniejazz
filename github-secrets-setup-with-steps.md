# Adding TinaCMS Secrets to GitHub Repository

## Step 1: Go to your GitHub repository settings

1. Open your browser and go to: https://github.com/Amir3629/Melaniejazz
2. Click on the "Settings" tab in the top navigation bar

## Step 2: Navigate to Secrets and Variables section

1. In the left sidebar, scroll down to find "Secrets and variables"
2. Click on the dropdown arrow next to it
3. Select "Actions"

## Step 3: Add the Client ID Secret

1. Click on the green "New repository secret" button
2. Fill in the form:
   - Name: `NEXT_PUBLIC_TINA_CLIENT_ID`
   - Secret: `cb9f95e2-759f-482c-a863-7ed5bc3309cb`
3. Click the "Add secret" button

## Step 4: Add the Token Secret

1. Click on the green "New repository secret" button again
2. Fill in the form:
   - Name: `TINA_TOKEN`
   - Secret: `7d2c087b403f429bf72ddfbcdfe5bda2331f655f`
3. Click the "Add secret" button

## Step 5: Verify the secrets were added

1. You should now see both secrets listed on the page:
   - NEXT_PUBLIC_TINA_CLIENT_ID
   - TINA_TOKEN

## Step 6: Trigger a workflow run to test

1. Go back to the main repository page
2. Click on the "Actions" tab
3. Click on the "Deploy with PagesCMS" workflow
4. Click on the "Run workflow" dropdown button
5. Make sure "main" branch is selected
6. Click the green "Run workflow" button

This will start a new workflow run using the secrets you just added. You can monitor the progress by clicking on the workflow run that appears in the list.

## Troubleshooting

If you see issues with the workflow:

1. Click on the failed workflow run
2. Expand the step that failed to see the error message
3. Check that the secrets are being properly accessed
4. Make sure there are no typos in the secret names 