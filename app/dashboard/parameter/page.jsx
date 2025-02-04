"use client";

import React, { useState, Suspense, lazy, useEffect } from "react";

// Components
import Layout from "@/app/components/Layout";
const Parameter = lazy(() => import("@/app/components/contents/Parameter"));

function page() {
  const activePage = "Parameter";

  const [numParameters, setNumParameters] = useState(12); // Jumlah parameter awal dan state

  // Fungsi untuk menambah parameter
  const addParameter = () => {
    setNumParameters(numParameters + 1);
  };

  // Fungsi untuk mengurangi parameter
  const removeParameter = () => {
    if (numParameters > 1) {
      setNumParameters(numParameters - 1);
    }
  };

  return (
    <div className="flex overflow-x-auto">
      <Layout
        activePage={activePage}
        contents={
          <div className="flex flex-col w-full h-full p-4 space-y-4">
            <Suspense fallback={<div>Loading...</div>}>
              <Parameter
                addParameter={addParameter}
                removeParameter={removeParameter}
                numParameters={numParameters}
              />
            </Suspense>
          </div>
        }
      />
    </div>
  );
}

export default page;
