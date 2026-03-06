'use client';

export default function DebugSentryPage() {
  const triggerError = () => {
    throw new Error('Sentry Debug Error: Ini adalah pesan kesalahan buatan untuk mengetes integrasi Sentry!');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Sentry Debug Page</h1>
      <p>Klik tombol di bawah ini untuk memicu error dan mengetes apakah Sentry sudah terhubung ke dashboard Anda.</p>
      <button
        onClick={triggerError}
        style={{
          padding: '10px 20px',
          backgroundColor: '#e0284f',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Trigger Client-Side Error
      </button>
    </div>
  );
}
