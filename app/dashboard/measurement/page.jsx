"use client";

import React, { useState, Suspense, lazy, useEffect } from "react";

// Components
import Layout from "@/app/components/Layout";
const Measurement = lazy(() => import("@/app/components/contents/Measurement"));

function page() {
  const activePage = "Measurement";

  return (
    <div className="flex overflow-x-auto">
      <Layout
        activePage={activePage}
        contents={
          <div className="flex flex-col w-full h-full p-4 space-y-4">
            <Suspense fallback={<div>Loading...</div>}>
              <Measurement />
            </Suspense>
          </div>
        }
      />
    </div>
  );
}

export default page;
