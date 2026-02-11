import React, { useState, useMemo } from "react";
import AchieverBoard from "./AchieversBoard";

const initialData = [
  {
    _id: "1",
    name: "STEVE",
    rollNo: "717822F222",
    rewardType: "Certification Completion",
    status: "Applied",
    createdAt: "2026-02-10T16:16:56.335Z",
  },
  {
    _id: "2",
    name: "ARJUN",
    rollNo: "717822F223",
    rewardType: "Hackathon Winner",
    status: "Approved",
    createdAt: "2026-02-08T11:45:20.120Z",
  },
  {
    _id: "3",
    name: "PRIYA",
    rollNo: "717822F224",
    rewardType: "Competition Finalist",
    status: "Rejected",
    createdAt: "2026-02-05T09:22:10.500Z",
  },
  {
    _id: "4",
    name: "RAHUL",
    rollNo: "717822F225",
    rewardType: "Top Internal Performer",
    status: "Applied",
    createdAt: "2026-02-03T14:30:40.210Z",
  },
  {
    _id: "5",
    name: "DIVYA",
    rollNo: "717822F226",
    rewardType: "Hackathon Participation",
    status: "Approved",
    createdAt: "2026-02-01T18:05:15.900Z",
  },
  {
    _id: "6",
    name: "KARTHIK",
    rollNo: "717822F227",
    rewardType: "Special Recognition Post",
    status: "Applied",
    createdAt: "2026-01-29T10:12:33.420Z",
  },
];

export default function AchieverBoardContainer() {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

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
