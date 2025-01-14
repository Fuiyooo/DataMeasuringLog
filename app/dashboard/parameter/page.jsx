"use client";

import React, { useState } from "react";

// Components
import Layout from "@/app/components/layout";
import Parameter from "@/app/components/contents/Parameter";

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
            <Parameter
              addParameter={addParameter}
              removeParameter={removeParameter}
              numParameters={numParameters}
            />
          </div>
        }
      />
    </div>
  );
}

export default page;
