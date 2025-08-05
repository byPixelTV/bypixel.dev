"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BackgroundLayout from "@/components/BackgroundLayout";

export default function Loading() {
  const [timeoutActive, setTimeoutActive] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTimeoutActive(false);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <BackgroundLayout>
      <Navbar />
      {timeoutActive ? (
        <main className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-center font-medium text-xl md:text-2xl text-white">
            Loading...
          </h1>
          <p className="text-center mt-4 font-light text-white">
            Hopefully not for too long :)
          </p>
        </main>
      ) : (
        <main className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-center mt-4 font-light text-white">
            Taking longer than expected. Please try again later. :(
          </p>
        </main>
      )}
    </BackgroundLayout>
  );
}