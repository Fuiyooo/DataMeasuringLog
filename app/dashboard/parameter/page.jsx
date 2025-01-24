"use client";

import React, { useState, Suspense, lazy, useEffect } from "react";

// Components
import Layout from "@/app/components/Layout";
const Parameter = lazy(() => import("@/app/components/contents/Parameter"));

// FunctionssS
import getTools from "@/app/components/contents/functions/getTools";

function page() {
  const activePage = "Parameter";
  const [tools, setTools] = useState([]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const tools = await getTools();
        setTools(tools);
      } catch (error) {
        console.error("Failed to fetch tools:", error);
      }
    };

    fetchTools();
  }, []);

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
                tools={tools}
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
