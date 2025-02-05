"use client";

import React, { useState, Suspense, lazy, useEffect } from "react";

// Components
import Layout from "@/app/components/Layout";
const Parameter = lazy(() => import("@/app/components/contents/Parameter"));

function page() {
  const activePage = "Parameter";


  return (
    <div className="flex overflow-x-auto">
      <Layout
        activePage={activePage}
        contents={
          <div className="flex flex-col w-full h-full p-4 space-y-4">
            <Suspense fallback={<div>Loading...</div>}>
              <Parameter />
            </Suspense>
          </div>
        }
      />
    </div>
  );
}

export default page;
