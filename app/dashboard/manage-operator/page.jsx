"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";

// Components
import Layout from "@/app/components/Layout";
import Table from "@/app/components/contents/table/Table";
import BigModal from "@/app/components/contents/BigModal";
import Button from "@/app/components/smallcomponents/Button";
import Input from "@/app/components/smallcomponents/Input";
import SmallModal from "@/app/components/contents/SmallModal";

// Functions
import getOperators from "@/app/components/contents/functions/getOperators";
import createOperator from "@/app/components/contents/functions/createOperator";
import updateOperator from "@/app/components/contents/functions/updateOperator";
import deleteOperator from "@/app/components/contents/functions/deleteOperator";

function page() {
  const activePage = "Manage Operator";
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editOperator, setEditOperator] = useState(null);
  const [operators, setOperators] = useState([]);
  const [newOperator, setNewOperator] = useState({
    id: "",
    name: "",
    username: "",
    id_employee: "",
    password: "",
  });

  const [showConfirm, setShowConfirm] = useState(false); // Confirmation box untuk remove
  const [showConfirmAdd, setShowConfirmAdd] = useState(false); // Confirmation box untuk add
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false); // Confirmation box untuk update
  const [selectedOperator, setSelectedOperator] = useState(null); // Operator yang akan dihapus atau diperbarui
  const formRef = useRef(null);

  // Fetch operators saat komponen pertama kali di-render
  useEffect(() => {
    const fetchOperators = async () => {
      const data = await getOperators(); // Mengambil data dari API
      setOperators(data); // Set data ke state operators
    };

    fetchOperators();
  }, []);

  // Handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditOperator((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setNewOperator((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle submit form untuk menambahkan operator baru
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formRef.current.checkValidity()) {
      setShowConfirmAdd(true); // Tampilkan confirmation box untuk add
    } else {
      formRef.current.reportValidity(); // Display validation error messages
    }
  };

  // Handle submit form untuk mengedit operator
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (formRef.current.checkValidity()) {
      setShowConfirmUpdate(true); // Tampilkan confirmation box untuk update
    } else {
      formRef.current.reportValidity(); // Display validation error messages
    }
  };

  // Konfirmasi penambahan operator
  const confirmAdd = async () => {
    try {
      const newAddedOperator = await createOperator(newOperator);

      setOperators((prev) => [
        ...prev,
        { id: newAddedOperator.id, ...newOperator },
      ]);
      window.location.reload(); // refresh page
      setNewOperator({ id: "", name: "", username: "", password: "" });
      setIsAdding(false);
      setShowConfirmAdd(false); // Sembunyikan confirmation box
    } catch (error) {
      console.error("Error adding operator:", error);
    }
  };

  // Konfirmasi pembaruan operator
  const confirmUpdate = async () => {
    try {
      await updateOperator(editOperator);

      setOperators((prev) =>
        prev.map((operator) =>
          operator.id === editOperator.id ? editOperator : operator
        )
      );

      window.location.reload(); // refresh page

      setIsEditing(false);
      setEditOperator(null);
      setShowConfirmUpdate(false); // Sembunyikan confirmation box
    } catch (error) {
      console.error("Error updating operator:", error);
    }
  };

  // Handle klik tombol Edit
  const handleEdit = (operator) => {
    setEditOperator(operator);
    setIsEditing(true);
  };

  // Handle klik tombol Remove
  const handleRemove = (operator) => {
    setSelectedOperator(operator); // Simpan operator yang akan dihapus
    setShowConfirm(true); // Tampilkan confirmation box untuk remove
  };

  // Konfirmasi penghapusan operator
  const confirmRemove = async () => {
    try {
      await deleteOperator(selectedOperator);

      setOperators((prev) =>
        prev.filter((operator) => operator.id !== selectedOperator.id)
      );
      window.location.reload(); // refresh page

      setShowConfirm(false);
      setSelectedOperator(null);
    } catch (error) {
      console.error("Error deleting operator:", error);
    }
  };

  // Batalkan penghapusan, penambahan, atau pembaruan
  const cancelAction = () => {
    setShowConfirm(false);
    setShowConfirmAdd(false);
    setShowConfirmUpdate(false);
    setSelectedOperator(null);
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
                      Operator List
                    </h1>
                    <Button
                      title="Add Operator"
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
                    datas={operators}
                    edit={handleEdit}
                    remove={handleRemove}
                    showConfirmPopup={
                      showConfirm || showConfirmAdd || showConfirmUpdate
                    }
                    confirmModal={
                      <SmallModal
                        title={
                          showConfirm
                            ? "Are you sure want to remove?"
                            : showConfirmAdd
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
                  />
                </Suspense>
              ) : (
                <BigModal
                  title="Add Operator"
                  props={
                    <>
                      <Input
                        title="Nama Operator"
                        name="name"
                        type="text"
                        value={isEditing ? editOperator.name : newOperator.name}
                        handleChange={handleChange}
                        placeholder="Nama Operator"
                      />
                      <Input
                        title="Username"
                        name="username"
                        type="text"
                        value={
                          isEditing
                            ? editOperator.username
                            : newOperator.username
                        }
                        handleChange={handleChange}
                        placeholder="Username"
                      />
                      <Input
                        title="ID Employee"
                        name="id_employee"
                        type="text"
                        value={
                          isEditing
                            ? editOperator.id_employee
                            : newOperator.id_employee
                        }
                        handleChange={handleChange}
                        placeholder="ID Employee"
                      />
                      <Input
                        title="Password"
                        name="password"
                        type="password"
                        value={
                          isEditing
                            ? editOperator.password
                            : newOperator.password
                        }
                        handleChange={handleChange}
                        placeholder="Password"
                        require={isEditing ? false : true}
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
                        go={isEditing ? handleEditSubmit : handleSubmit}
                      />
                    </>
                  }
                  formRef={formRef}
                  back={() => setIsAdding(false)}
                  shadow={false}
                  padding="p-1"
                  onSubmit={isEditing ? handleEditSubmit : handleSubmit}
                  showConfirmPopup={
                    showConfirm || showConfirmAdd || showConfirmUpdate
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
