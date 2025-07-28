import { Suspense } from 'react';
import TetrisClient from './TetrisClient'; // Impor komponen yang baru dibuat

// Komponen Loading sederhana
function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#0d1117',
      color: 'white',
      fontFamily: 'monospace'
    }}>
      Loading Game...
    </div>
  );
}

export default function TetrisPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TetrisClient />
    </Suspense>
  );
}