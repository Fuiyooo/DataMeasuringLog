import { useState } from "react";

export default function ManageOperator() {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editOperator, setEditOperator] = useState(null); // State untuk operator yang sedang diedit
  const [operators, setOperators] = useState([
    { id: 1, name: "John Doe", username: "johndoe", password: "123456" },
    { id: 2, name: "Jane Smith", username: "janesmith", password: "abcdef" },
  ]);
  const [newOperator, setNewOperator] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [showConfirm, setShowConfirm] = useState(false); // Confirmation box untuk remove
  const [showConfirmAdd, setShowConfirmAdd] = useState(false); // Confirmation box untuk add
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false); // Confirmation box untuk update
  const [selectedOperator, setSelectedOperator] = useState(null); // Operator yang akan dihapus atau diperbarui

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
    setShowConfirmAdd(true); // Tampilkan confirmation box untuk add
  };

  // Handle submit form untuk mengedit operator
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setShowConfirmUpdate(true); // Tampilkan confirmation box untuk update
  };

  // Konfirmasi penambahan operator
  const confirmAdd = () => {
    const newId = operators.length + 1;
    setOperators((prev) => [
      ...prev,
      { id: newId, ...newOperator },
    ]);
    setNewOperator({ name: "", username: "", password: "" });
    setIsAdding(false);
    setShowConfirmAdd(false); // Sembunyikan confirmation box
  };

  // Konfirmasi pembaruan operator
  const confirmUpdate = () => {
    setOperators((prev) =>
      prev.map((operator) =>
        operator.id === editOperator.id ? editOperator : operator
      )
    );
    setIsEditing(false);
    setEditOperator(null);
    setShowConfirmUpdate(false); // Sembunyikan confirmation box
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
  const confirmRemove = () => {
    setOperators((prev) =>
      prev.filter((operator) => operator.id !== selectedOperator.id)
    );
    setShowConfirm(false); // Sembunyikan confirmation box
    setSelectedOperator(null);
  };

  // Batalkan penghapusan, penambahan, atau pembaruan
  const cancelAction = () => {
    setShowConfirm(false);
    setShowConfirmAdd(false);
    setShowConfirmUpdate(false);
    setSelectedOperator(null);
  };

  return (
    <div className="max-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg mt-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Operator List</h1>
          {!isAdding && !isEditing && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Operator
            </button>
          )}
        </div>

        {/* Tabel atau Form */}
        {!isAdding && !isEditing ? (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#222E43] text-white">
                <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Nama Operator</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Password</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {operators.map((operator, index) => (
                <tr key={operator.id} className="text-gray-700">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{operator.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{operator.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{operator.password}</td>
                  <td className="border border-gray-300 px-4 py-2 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleEdit(operator)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleRemove(operator)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <form
            onSubmit={isEditing ? handleEditSubmit : handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-gray-700 font-bold">Nama Operator</label>
              <input
                type="text"
                name="name"
                value={isEditing ? editOperator.name : newOperator.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 text-black"
                placeholder="Nama Operator"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold">Username</label>
              <input
                type="text"
                name="username"
                value={isEditing ? editOperator.username : newOperator.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 text-black"
                placeholder="Username"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold">Password</label>
              <input
                type="password"
                name="password"
                value={isEditing ? editOperator.password : newOperator.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 text-black"
                placeholder="Password"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                {isEditing ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(false);
                }}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Confirmation Box */}
      {(showConfirm || showConfirmAdd || showConfirmUpdate) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#222E43] text-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">
              {showConfirm && "Are you sure want to remove?"}
              {showConfirmAdd && "Are you sure want to add this operator?"}
              {showConfirmUpdate && "Are you sure want to update this operator?"}
            </h2>
            <div className="flex justify-between">
              <button
                onClick={cancelAction}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={
                  showConfirm
                    ? confirmRemove
                    : showConfirmAdd
                    ? confirmAdd
                    : confirmUpdate
                }
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
