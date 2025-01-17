"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";

// Components
import Layout from "@/app/components/layout";
import Table from "@/app/components/contents/table/ToolsTable";
import BigModal from "@/app/components/contents/BigModal";
import Button from "@/app/components/smallcomponents/Button";
import Input from "@/app/components/smallcomponents/Input";

function page() {
  const activePage = "Manage Tools";
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTool, setEditTool] = useState(null);
  const [newTool, setNewTool] = useState({
    name: "",
  });

  const tools = [
    { id: 1, name: "Hammer" },
    { id: 2, name: "Screwdriver" },
    { id: 3, name: "Wrench" },
  ];

  const handleEdit = (tool) => {
    setEditTool(tool);
    setIsEditing(true);
  };

  const handleRemove = (tool) => {
    console.log("Remove tool:", tool);
  };

  return (
    <div className="flex overflow-x-auto">
      <Layout
        activePage={activePage}
        contents={
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                {!isAdding && !isEditing && (
                  <>
                    <h1 className="text-xl font-bold text-gray-800">
                      Tools List
                    </h1>
                    <Button
                      title="Add Tool"
                      go={() => setIsAdding(true)}
                      bgColor="bg-green-500"
                      hoverBgColor="bg-green-600"
                      textColor="text-white"
                    />
                  </>
                )}
              </div>

              {!isAdding && !isEditing ? (
                <Suspense fallback={<div>Loading Table...</div>}>
                  <Table
                    datas={tools}
                    edit={handleEdit}
                    remove={handleRemove}
                  />
                </Suspense>
              ) : (
                <BigModal
                  title={isEditing ? "Edit Tool" : "Add Tool"}
                  props={
                    <>
                      <Input
                        title="Tool Name"
                        name="name"
                        type="text"
                        value={isEditing ? editTool?.name : newTool.name}
                        handleChange={(e) => {
                          const { value } = e.target;
                          if (isEditing) {
                            setEditTool((prev) => ({ ...prev, name: value }));
                          } else {
                            setNewTool((prev) => ({ ...prev, name: value }));
                          }
                        }}
                        placeholder="Tool Name"
                      />
                    </>
                  }
                  buttons={
                    <>
                      <Button
                        title="Cancel"
                        bgColor="bg-red-500"
                        hoverBgColor="bg-red-600"
                        textColor="text-white"
                        go={() => {
                          setIsAdding(false);
                          setIsEditing(false);
                        }}
                      />
                      <Button
                        type="submit"
                        title={isEditing ? "Update" : "Add"}
                        bgColor="bg-green-500"
                        hoverBgColor="bg-green-600"
                        textColor="text-white"
                        go={() => {
                          if (isEditing) {
                            console.log("Updated tool:", editTool);
                            setIsEditing(false);
                          } else {
                            console.log("Added tool:", newTool);
                            setIsAdding(false);
                          }
                        }}
                      />
                    </>
                  }
                />
              )}
            </div>
          </div>
        }
      />
    </div>
  );
}

export default page;
