"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";

// Components
import Layout from "@/app/components/layout";
import Table from "@/app/components/contents/table/ToolsTable";
import BigModal from "@/app/components/contents/BigModal";
import Button from "@/app/components/smallcomponents/Button";
import Input from "@/app/components/smallcomponents/Input";

// Functions
import getTools from "@/app/components/contents/functions/getTools";
import createTool from "@/app/components/contents/functions/createTool";
import removeTool from "@/app/components/contents/functions/removeTool";
import updateTool from "@/app/components/contents/functions/updateTool";

function page() {
  const activePage = "Manage Tools";
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTool, setEditTool] = useState(null);
  const [newTool, setNewTool] = useState({
    name: "",
  });

  const [tools, setTools] = useState([]);

  // Fetch tools saat komponen pertama kali di-render
  useEffect(() => {
    const fetchTools = async () => {
      const data = await getTools(); // Mengambil data Tools
      setTools(data);
    };

    fetchTools();
  }, []);

  const handleEdit = (tool) => {
    setEditTool(tool);
    setIsEditing(true);
  };

  const handleEditSubmit = async (tool) => {
    try {
      const updatedTool = await updateTool(tool);
      setTools((prev) =>
        prev.map((t) => (t.id === updatedTool.id ? updatedTool : t))
      );

      window.location.reload(); // refresh page
    } catch (error) {
      console.error("Error updating tool:", error);
    }
  };

  const handleAddSubmit = async (data) => {
    try {
      const newTool = await createTool(data);
      setTools((prev) => [...prev, newTool]);

      window.location.reload(); // refresh page
    } catch (error) {
      console.error("Error adding tool:", error);
    }
  };

  const handleRemove = async (data) => {
    try {
      await removeTool(data);
      setTools((prev) => prev.filter((t) => t.id !== data.id));

      window.location.reload(); // refresh page
    } catch (error) {
      console.error("Error removing tool:", error);
    }
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
                            setIsEditing(false);
                            handleEditSubmit(editTool);
                          } else {
                            setIsAdding(false);
                            handleAddSubmit(newTool);
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
