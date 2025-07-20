'use client';

import React from 'react';

export default function BackgroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 bg-black -z-10">
        {/* Animated Gradient Blobs */}
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
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
          filter: blur(60px);
          opacity: 0.6;
          mix-blend-mode: screen;
        }
        .blob-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #4f46e5, #3b82f6, transparent);
          top: 20%;
          right: 10%;
          animation: float1 12s ease-in-out infinite, pulse1 8s ease-in-out infinite;
        }
        .blob-2 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, #6366f1, #8b5cf6, transparent);
          bottom: 20%;
          left: 15%;
          animation: float2 16s ease-in-out infinite reverse, pulse2 10s ease-in-out infinite;
        }
        .blob-3 {
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, #3b82f6, #6366f1, transparent);
          top: 45%;
          left: 60%;
          animation: float3 14s ease-in-out infinite, pulse3 12s ease-in-out infinite;
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-80px, -100px) rotate(90deg); }
          50% { transform: translate(70px, -80px) rotate(180deg); }
          75% { transform: translate(-40px, 90px) rotate(270deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(100px, -60px) rotate(120deg); }
          66% { transform: translate(-80px, 80px) rotate(240deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          30% { transform: translate(-90px, -70px) rotate(108deg); }
          70% { transform: translate(85px, -90px) rotate(252deg); }
        }

        @keyframes pulse1 {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes pulse2 {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
        @keyframes pulse3 {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.9); }
        }

        .grid-pattern {
          background-image: radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.08) 1px, transparent 0);
          background-size: 30px 30px;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  );
}
