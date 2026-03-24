'use client';

import React from 'react';

export default function BackgroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fixed Background Layer */}
      <div
        className="fixed inset-0 -z-10"
        style={{ background: '#030305' }}
      >
        {/* Animated Gradient Blobs */}
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
        <div className="gradient-blob blob-4"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0">
          <div className="grid-pattern"></div>
        </div>
      </div>

      {/* Scrollable Content Layer */}
      <div className="relative z-0 min-h-screen">
        {children}
      </div>

      <style jsx>{`
        .gradient-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          opacity: 0.32;
          mix-blend-mode: screen;
        }
        .blob-1 {
          width: 720px;
          height: 720px;
          background: radial-gradient(circle, #7c3aed, #9333ea, transparent);
          top: -14%;
          right: -10%;
          animation: float1 18s ease-in-out infinite, pulse1 10s ease-in-out infinite;
        }
        .blob-2 {
          width: 680px;
          height: 680px;
          background: radial-gradient(circle, #a855f7, #c026d3, transparent);
          bottom: -18%;
          left: -14%;
          animation: float2 22s ease-in-out infinite reverse, pulse2 13s ease-in-out infinite;
        }
        .blob-3 {
          width: 620px;
          height: 620px;
          background: radial-gradient(circle, #6d28d9, #7c3aed, transparent);
          top: 36%;
          left: 46%;
          animation: float3 20s ease-in-out infinite, pulse3 15s ease-in-out infinite;
        }
        .blob-4 {
          width: 540px;
          height: 540px;
          background: radial-gradient(circle, #4c1d95, #9333ea, transparent);
          top: 62%;
          right: 20%;
          animation: float2 28s ease-in-out 5s infinite, pulse2 18s ease-in-out infinite reverse;
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-160px, -130px) rotate(72deg); }
          45% { transform: translate(180px, -100px) rotate(162deg); }
          70% { transform: translate(-120px, 160px) rotate(252deg); }
          85% { transform: translate(100px, 80px) rotate(315deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(180px, -120px) rotate(90deg); }
          50% { transform: translate(-150px, 140px) rotate(180deg); }
          75% { transform: translate(120px, 100px) rotate(270deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          30% { transform: translate(-170px, -140px) rotate(108deg); }
          60% { transform: translate(160px, -100px) rotate(216deg); }
          80% { transform: translate(-80px, 150px) rotate(288deg); }
        }

        @keyframes pulse1 {
          0%, 100% { opacity: 0.28; transform: scale(1); }
          50% { opacity: 0.38; transform: scale(1.1); }
        }
        @keyframes pulse2 {
          0%, 100% { opacity: 0.22; transform: scale(1); }
          50% { opacity: 0.32; transform: scale(1.14); }
        }
        @keyframes pulse3 {
          0%, 100% { opacity: 0.28; transform: scale(1); }
          50% { opacity: 0.16; transform: scale(0.9); }
        }

        .grid-pattern {
          background-image: radial-gradient(circle at 1px 1px, rgba(168, 85, 247, 0.09) 1px, transparent 0);
          background-size: 30px 30px;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  );
}
