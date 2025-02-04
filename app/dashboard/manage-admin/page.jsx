"use client";

import React, { useState, useRef, useEffect, Suspense, lazy } from "react";

// Components
import Layout from "@/app/components/Layout";
const Table = lazy(() => import("@/app/components/contents/table/Table"));
import BigModal from "@/app/components/contents/BigModal";
import Button from "@/app/components/smallcomponents/Button";
import Input from "@/app/components/smallcomponents/Input";
import SmallModal from "@/app/components/contents/SmallModal";
import Notification from "@/app/components/smallcomponents/Notification";

// Functions
import getAdmins from "@/app/components/contents/functions/getAdmins";
import createAdmin from "@/app/components/contents/functions/createAdmin";
import updateAdmin from "@/app/components/contents/functions/updateAdmin";
import deleteAdmin from "@/app/components/contents/functions/deleteAdmin";

function page() {
  const activePage = "Manage Admin";
  const [refresh, setRefresh] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    id_employee: "",
    username: "",
    password: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmAdd, setShowConfirmAdd] = useState(false);
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [notification, setNotification] = useState(null);
  const formRef = useRef(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  // Fetch admins on initial render
  useEffect(() => {
    const fetchAdmins = async () => {
      const data = await getAdmins();
      setAdmins(data);
    };

    fetchAdmins();

    // Add SSE listener
    const eventSource = new EventSource("/api/sse?resource=admins");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "refresh") {
        fetchAdmins(); // Re-fetch data on SSE events
      }
    };

    return () => eventSource.close();
  }, [refresh]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditAdmin((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setNewAdmin((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formRef.current.checkValidity()) {
      setShowConfirmAdd(true);
    } else {
      formRef.current.reportValidity();
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (formRef.current.checkValidity()) {
      setShowConfirmUpdate(true);
    } else {
      formRef.current.reportValidity();
    }
  };

  const confirmAdd = async () => {
    const respond = await createAdmin(newAdmin);
    setRefresh((prev) => prev + 1);

    setNewAdmin({ name: "", id_employee: "", username: "", password: "" });
    setIsAdding(false);
    setShowConfirmAdd(false);
    if (respond.success) {
      showNotification(respond.success, "success");
    } else {
      showNotification(respond.error, "error");
    }
  };

  const confirmUpdate = async () => {
    const respond = await updateAdmin(editAdmin);
    setRefresh((prev) => prev + 1);

    setIsEditing(false);
    setEditAdmin(null);
    setShowConfirmUpdate(false);
    if (respond.success) {
      showNotification(respond.success, "success");
    } else {
      showNotification(respond.error, "error");
    }
  };

  const handleEdit = (admin) => {
    setEditAdmin(admin);
    setIsEditing(true);
  };

  const handleRemove = (admin) => {
    setSelectedAdmin(admin);
    setShowConfirm(true);
  };

  const confirmRemove = async () => {
    const respond = await deleteAdmin(selectedAdmin);
    setRefresh((prev) => prev + 1);
    setShowConfirm(false);
    setSelectedAdmin(null);
    if (respond.success) {
      showNotification(respond.success, "success");
    } else {
      showNotification(respond.error, "error");
    }
  };

  const cancelAction = () => {
    setShowConfirm(false);
    setShowConfirmAdd(false);
    setShowConfirmUpdate(false);
    setSelectedAdmin(null);
  };

  return (
    <div className="flex overflow-x-auto">
      <Layout
        activePage={activePage}
        contents={
          <div className="w-full flex flex-col items-center">
            <div className="w-full bg-white rounded-lg shadow-lg p-6">
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
                      Admin List
                    </h1>
                    <Button
                      title="Add Admin"
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
                    datas={admins}
                    edit={handleEdit}
                    remove={handleRemove}
                    showConfirmPopup={
                      showConfirm || showConfirmAdd || showConfirmUpdate
                    }
                    confirmModal={
                      <SmallModal
                        title="Are you sure want to remove?"
                        buttons={
                          <>
                            <Button
                              title="Cancel"
                              bgColor="bg-red-500"
                              hoverBgColor="bg-red-600"
                              textColor="text-white"
                              go={cancelAction}
                            />
                            <Button
                              title="Confirm"
                              bgColor="bg-green-500"
                              hoverBgColor="bg-green-600"
                              textColor="text-white"
                              go={confirmRemove}
                            />
                          </>
                        }
                      />
                    }
                  />
                </Suspense>
              ) : (
                <BigModal
                  title={isEditing ? "Edit Admin" : "Add Admin"}
                  props={
                    <>
                      <Input
                        title="Name"
                        name="name"
                        type="text"
                        value={isEditing ? editAdmin.name : newAdmin.name}
                        handleChange={handleChange}
                      />
                      <Input
                        title="Username"
                        name="username"
                        type="text"
                        value={
                          isEditing ? editAdmin.username : newAdmin.username
                        }
                        handleChange={handleChange}
                      />
                      <Input
                        title="ID Admin"
                        name="id_employee"
                        type="text"
                        value={
                          isEditing
                            ? editAdmin.id_employee
                            : newAdmin.id_employee
                        }
                        handleChange={handleChange}
                      />
                      <Input
                        title="Password"
                        name="password"
                        type="password"
                        value={
                          isEditing ? editAdmin.password : newAdmin.password
                        }
                        handleChange={handleChange}
                        require={isEditing ? false : true}
                      />
                    </>
                  }
                  confirmModal={
                    <SmallModal
                      title={
                        showConfirmAdd
                          ? "Are you sure want to add this operator?"
                          : showConfirmUpdate
                          ? "Are you sure want to update this operator?"
                          : ""
                      }
                      buttons={
                        <>
                          <Button
                            title="Cancel"
                            bgColor="bg-red-500"
                            hoverBgColor="bg-red-600"
                            textColor="text-white"
                            go={cancelAction}
                          />
                          <Button
                            title="Confirm"
                            bgColor="bg-green-500"
                            hoverBgColor="bg-green-600"
                            textColor="text-white"
                            go={
                              showConfirm
                                ? confirmRemove
                                : showConfirmAdd
                                ? confirmAdd
                                : confirmUpdate
                            }
                          />
                        </>
                      }
                      textColor="text-white"
                    />
                  }
                  errorModal={<>ErrorModal</>}
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
                        go={isEditing ? handleEditSubmit : handleSubmit}
                      />
                    </>
                  }
                  showConfirmPopup={
                    showConfirm || showConfirmAdd || showConfirmUpdate
                  }
                  formRef={formRef}
                  onSubmit={isEditing ? handleEditSubmit : handleSubmit}
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
