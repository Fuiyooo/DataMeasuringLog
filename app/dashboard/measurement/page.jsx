"use client";

import React from "react";
import Layout from "@/app/components/layout";

function page() {
  const activePage = "Measurement";
  return (
    <div>
      <Layout
        activePage={activePage}
        contents={
          <div>
            <div>Measurement</div>
            <div>Measurement</div>
            <div>Measurement</div>
          </div>
        }
      />
    </div>
  );
}

export default page;
