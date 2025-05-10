// Server component for admin routes
export function generateStaticParams() {
  return [
    { slug: [] },           // /admin
    { slug: ['index'] },    // /admin/index
    { slug: ['index.html'] } // /admin/index.html
  ]
}

export const metadata = {
  title: 'Mel Jazz Admin',
  description: 'Admin panel for Mel Jazz website'
}

export default function AdminPage() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="refresh" content="0;url=https://app.tina.io/signin" />
        <title>Redirecting to Tina Cloud CMS...</title>
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #000;
            color: #fff;
            text-align: center;
          }
          .container {
            max-width: 500px;
            padding: 2rem;
          }
          .spinner {
            width: 40px;
            height: 40px;
            margin: 100px auto;
            background-color: #C8A97E;
            border-radius: 100%;  
            animation: sk-scaleout 1.0s infinite ease-in-out;
          }
          @keyframes sk-scaleout {
            0% { 
              transform: scale(0);
            } 100% {
              transform: scale(1.0);
              opacity: 0;
            }
          }
          a {
            color: #C8A97E;
            text-decoration: none;
            font-weight: bold;
          }
          a:hover {
            text-decoration: underline;
          }
        `}} />
      </head>
      <body>
        <div className="container">
          <h1>Redirecting to Tina CMS...</h1>
          <div className="spinner"></div>
          <p>If you are not redirected automatically, <a href="https://app.tina.io/signin">click here</a></p>
        </div>
      </body>
    </html>
  )
} 