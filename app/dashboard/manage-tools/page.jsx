"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";

// Components
import Layout from "@/app/components/Layout";
import Table from "@/app/components/contents/table/ToolsTable";
import BigModal from "@/app/components/contents/BigModal";
import Button from "@/app/components/smallcomponents/Button";
import Input from "@/app/components/smallcomponents/Input";
import Notification from "@/app/components/smallcomponents/Notification";

// Functions
import getTools from "@/app/components/contents/functions/getTools";
import createTool from "@/app/components/contents/functions/createTool";
import removeTool from "@/app/components/contents/functions/removeTool";
import updateTool from "@/app/components/contents/functions/updateTool";

function page() {
  const activePage = "Manage Tools";
  const [refresh, setRefresh] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTool, setEditTool] = useState(null);
  const [newTool, setNewTool] = useState({
    name: "",
  });
  const [tools, setTools] = useState([]);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  // Fetch tools saat komponen pertama kali di-render
  useEffect(() => {
    const fetchTools = async () => {
      const data = await getTools(); // Mengambil data Tools
      setTools(data);
    };

    fetchTools();

    const eventSource = new EventSource("/api/sse?resource=tools");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "refresh") {
        fetchTools();
      }
    };

    return () => eventSource.close();
  }, [refresh]);

  const handleEdit = (tool) => {
    setEditTool(tool);
    setIsEditing(true);
  };

  const handleAddSubmit = async (data) => {
    const respond = await createTool(data);
    setRefresh((prev) => prev + 1);
    if (respond.success) {
      showNotification(respond.success, "success");
    } else {
      showNotification(respond.error, "error");
    }
  };

  const handleEditSubmit = async (tool) => {
    const respond = await updateTool(tool);
    setRefresh((prev) => prev + 1);
    if (respond.success) {
      showNotification(respond.success, "success");
    } else {
      showNotification(respond.error, "error");
    }
  };

  const handleRemove = async (data) => {
    const respond = await removeTool(data);
    setRefresh((prev) => prev + 1);
    if (respond.success) {
      showNotification(respond.success, "success");
    } else {
      showNotification(respond.error, "error");
    }
  };

  return (
    <div className="flex overflow-x-auto">
      <Layout
        activePage={activePage}
        contents={
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
              {notification && (
                <Notification
                  message={notification.message}
                  type={notification.type}
                  onClose={() => setNotification(null)}
                />
              )}
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
