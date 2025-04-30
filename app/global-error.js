'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          padding: '20px',
          backgroundColor: '#0A0A0A',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Something went wrong!</h2>
          <button
            onClick={() => reset()}
            style={{
              padding: '10px 20px', 
              backgroundColor: '#C8A97E',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
} 