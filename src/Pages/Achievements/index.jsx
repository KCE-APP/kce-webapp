import React, { useState, useMemo } from "react";
import AchieverBoard from "./AchieversBoard";

const initialData = [
  {
    _id: "1",
    name: "STEVE",
    rollNo: "717822F222",
    rewardType: "Best Performer",
    status: "Applied",
  },
  {
    _id: "2",
    name: "ARJUN",
    rollNo: "717822F223",
    rewardType: "Hackathon Winner",
    status: "Approved",
  },
  {
    _id: "3",
    name: "PRIYA",
    rollNo: "717822F224",
    rewardType: "Research Excellence",
    status: "Pending",
  },
  {
    _id: "4",
    name: "RAHUL",
    rollNo: "717822F225",
    rewardType: "Sports Achievement",
    status: "Applied",
  },
];

export default function AchieverBoardContainer() {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  const filteredData = useMemo(() => {
    return data.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleDelete = (id) => {
    const updated = data.filter((student) => student._id !== id);
    setData(updated);
  };

  return (
    <AchieverBoard
      data={paginatedData}
      loading={false}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onDelete={handleDelete}
    />
  );
}
