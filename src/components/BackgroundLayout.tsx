import React from 'react';

export default function BackgroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="background-layout fixed inset-0 z-0 overflow-hidden pointer-events-none" style={{ background: '#030305' }}>
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
        <div className="gradient-blob blob-4"></div>

        <div className="absolute inset-0">
          <div className="grid-pattern"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </>
  );
}