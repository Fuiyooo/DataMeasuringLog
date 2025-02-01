"use client";

import React, { useState, useEffect, Suspense } from "react";
import Layout from "@/app/components/Layout";
import HistoryTable from "@/app/components/contents/table/HistoryTable";
import SearchBar from "@/app/components/contents/table/SearchBar";
import Notification from "@/app/components/smallcomponents/Notification";
import getOperators from "@/app/components/contents/functions/getOperators";

function Page() {
  const activePage = "History Table";
  const [refresh, setRefresh] = useState(0);
  const [operators, setOperators] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  const recapData = [
    { date: "2025-01-30", operator: "John Doe", idBarang: "A001", namaBarang: "Laptop", tipeBarang: "Electronics", status: "Added", result: "Successful" },
    { date: "2025-01-29", operator: "Jane Smith", idBarang: "A002", namaBarang: "Printer", tipeBarang: "Office Supplies", status: "Updated", result: "Pending" },
    { date: "2025-01-28", operator: "Mike Johnson", idBarang: "A003", namaBarang: "Monitor", tipeBarang: "Electronics", status: "Deleted", result: "Failed" },
    { date: "2024-01-28", operator: "Matt Rife", idBarang: "A004", namaBarang: "Monitor", tipeBarang: "Electronics", status: "Added", result: "Failed" },
    { date: "2024-01-28", operator: "Matt Rife", idBarang: "A004", namaBarang: "Monitor", tipeBarang: "Electronics", status: "Added", result: "Failed" },
    { date: "2024-01-28", operator: "Matt Rife", idBarang: "A004", namaBarang: "Monitor", tipeBarang: "Electronics", status: "Added", result: "Failed" },

  ];

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  useEffect(() => {
    const fetchData = async () => {
      const operatorsData = await getOperators();
      setOperators(operatorsData);
    };

    fetchData();
  }, [refresh]);

  // Filter data berdasarkan searchQuery dan filter table head
  const filteredData = recapData.filter((item) => {
    // Filter berdasarkan pencarian umum
    const searchMatch = Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter berdasarkan input table head
    const filterMatch = Object.keys(filters).every((key) =>
      filters[key] ? item[key].toLowerCase().includes(filters[key].toLowerCase()) : true
    );

    return searchMatch && filterMatch;
  });

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

              {/* Search Bar */}
              <div className="w-full mb-4">
                <SearchBar placeholder="Search history..." onSearch={setSearchQuery} />
              </div>

              {/* Table */}
              <div className="w-full mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-bold text-gray-800">History</h1>
                </div>
                <Suspense fallback={<div>Loading Operator Table...</div>}>
                  <HistoryTable data={filteredData} onFilterChange={setFilters} />
                </Suspense>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default Page;
