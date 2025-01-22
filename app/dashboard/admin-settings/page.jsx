"use client";

import React, { useState, useRef, useEffect, Suspense, lazy } from "react";

// Components
import Layout from "@/app/components/Layout";
const Table = lazy(() => import("@/app/components/contents/table/Table"));
import BigModal from "@/app/components/contents/BigModal";
import Button from "@/app/components/smallcomponents/Button";
import Input from "@/app/components/smallcomponents/Input";
import SmallModal from "@/app/components/contents/SmallModal";

// Functions
import getAdmins from "@/app/components/contents/functions/getAdmins";
import createAdmin from "@/app/components/contents/functions/createAdmin";
import updateAdmin from "@/app/components/contents/functions/updateAdmin";
import deleteAdmin from "@/app/components/contents/functions/deleteAdmin";

function page() {
  const activePage = "Manage Admin";
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    username: "",
    id_employee: "",
    password: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmAdd, setShowConfirmAdd] = useState(false);
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const formRef = useRef(null);

  // Fetch admins on initial render
  useEffect(() => {
    const fetchAdmins = async () => {
      const data = await getAdmins();
      setAdmins(data);
    };

    fetchAdmins();
  }, []);

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
    try {
      await createAdmin(newAdmin);
      setAdmins((prev) => [...prev, { ...newAdmin }]);
      setNewAdmin({ name: "", username: "", password: "", id_employee: "" });

      window.location.reload(); // refresh page

      setIsAdding(false);
      setShowConfirmAdd(false);
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  const confirmUpdate = async () => {
    try {
      await updateAdmin(editAdmin);
      setAdmins((prev) =>
        prev.map((admin) => (admin.id === editAdmin.id ? editAdmin : admin))
      );

      window.location.reload(); // refresh page

      setIsEditing(false);
      setEditAdmin(null);
      setShowConfirmUpdate(false);
    } catch (error) {
      console.error("Error updating admin:", error);
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
    try {
      await deleteAdmin(selectedAdmin);
      setAdmins((prev) =>
        prev.filter((admin) => admin.id !== selectedAdmin.id)
      );

      window.location.reload(); // refresh page

      setShowConfirm(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error("Error deleting admin:", error);
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
