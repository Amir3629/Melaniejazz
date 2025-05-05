# Email Integration Setup Instructions

This document explains how to set up the EmailJS integration for the website's contact form and booking system to send emails to `info@melanie-wainwright.de` without requiring access to email account settings.

## What is EmailJS?

EmailJS is a third-party service that allows sending emails directly from client-side JavaScript without needing a server or access to the recipient's email account. It uses templates to format emails and handles all email delivery.

## Step 1: Create an EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/) and sign up for a free account
2. The free tier allows for 200 emails per month, which should be sufficient for most small websites
3. Paid plans are available if you need to send more emails

## Step 2: Set Up an Email Service Connection

1. In your EmailJS dashboard, go to "Email Services" 
2. Click "Add New Service"
3. Select a service provider (Gmail, Outlook/Office 365, or another email service you can access)
4. Follow the instructions to connect your service
   - This can be any email account you have access to (doesn't need to be the recipient email)
   - EmailJS will use this account to send the emails
5. Once connected, note down the "Service ID" - you'll need this later

## Step 3: Create Email Templates

You'll need to create two email templates:

### Contact Form Template

1. In your EmailJS dashboard, go to "Email Templates"
2. Click "Create New Template"
3. Give it a name like "Contact Form Template"
4. Set the recipient to: `info@melanie-wainwright.de`
5. Design the template with a subject like: "Neue Kontaktanfrage von {{from_name}}"
6. Design the email body using these variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{message}}` - The message
7. Save the template and note the "Template ID"

### Booking Form Template

1. Create another template named "Booking Form Template"
2. Set the recipient to: `info@melanie-wainwright.de` 
3. Design the template with a subject like: "Neue Buchungsanfrage: {{service_type}} von {{client_name}}"
4. Design the email body using these variables:
   - `{{client_name}}` - Client's name
   - `{{client_email}}` - Client's email
   - `{{client_phone}}` - Client's phone number
   - `{{service_type}}` - Type of service requested
   - `{{booking_details}}` - Formatted details of the booking
   - `{{message}}` - Additional message
5. Save the template and note the "Template ID"

## Step 4: Update Website Configuration

1. Locate the file `app/utils/emailjs-env.js` in the website code
2. Update the following values with the ones you noted down:
   - `SERVICE_ID`: Your EmailJS service ID
   - `CONTACT_TEMPLATE_ID`: Your contact form template ID
   - `BOOKING_TEMPLATE_ID`: Your booking form template ID
   - `PUBLIC_KEY`: Your EmailJS public key (found in Account > API Keys)

The file should look something like this after editing:

```javascript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc123',
  CONTACT_TEMPLATE_ID: 'template_contact456',
  BOOKING_TEMPLATE_ID: 'template_booking789',
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY_HERE',
  RECIPIENT_EMAIL: 'info@melanie-wainwright.de'
};
```

## Step 5: Build and Deploy the Website

1. Run `npm run build` to build the website with your changes
2. Deploy the website to your hosting platform
3. Test both the contact form and booking form to ensure emails are being sent correctly

## Troubleshooting

- If emails are not being received, check your spam folder
- Verify that all IDs in the configuration file are correct
- Check the browser console for any JavaScript errors
- Ensure your EmailJS account is active and not exceeding the free tier limits

## Need Help?

If you need assistance setting up this integration, please contact your web developer. 