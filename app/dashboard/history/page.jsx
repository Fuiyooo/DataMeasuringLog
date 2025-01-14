"use client";

import React from "react";
import Layout from "@/app/components/layout";

function page() {
  const activePage = "History";
  return (
    <div>
      <Layout
        activePage={activePage}
        contents={
          <div>
            <div>History</div>
            <div>History</div>
            <div>History</div>
          </div>
        }
      />
    </div>
  );
}

export default page;
