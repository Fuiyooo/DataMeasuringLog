"use client";

import React, { useState } from "react";

function HistoryTable({ data = [], onFilterChange }) {
  const [filters, setFilters] = useState({
    date: "",
    operator: "",
    idBarang: "",
    namaBarang: "",
    tipeBarang: "",
    status: "",
    result: "",
  });

  // Fungsi untuk menangani perubahan filter
  const handleFilterChange = (event, key) => {
    const value = event.target.value;
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters); // Kirim filter ke komponen induk
  };

  return (
    <table className="w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr className="bg-[#8fcef2] text-black">
          {["Date", "Operator", "ID Barang", "Nama Barang", "Tipe Barang", "Status/Detail", "Overall Result"].map((header, index) => (
            <th key={index} className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
              {header}
              <input
                type="text"
                placeholder={`Filter ${header}`}
                className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
                onChange={(e) => handleFilterChange(e, Object.keys(filters)[index])}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="7" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
              No data available
            </td>
          </tr>
        ) : (
          data.map((item, index) => (
            <tr key={index} className="text-gray-700">
              <td className="border border-gray-300 px-4 py-2">{item.date}</td>
              <td className="border border-gray-300 px-4 py-2">{item.operator}</td>
              <td className="border border-gray-300 px-4 py-2">{item.idBarang}</td>
              <td className="border border-gray-300 px-4 py-2">{item.namaBarang}</td>
              <td className="border border-gray-300 px-4 py-2">{item.tipeBarang}</td>
              <td className="border border-gray-300 px-4 py-2">{item.status}</td>
              <td className="border border-gray-300 px-4 py-2">{item.result}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default HistoryTable;
