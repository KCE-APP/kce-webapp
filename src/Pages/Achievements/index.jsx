import React, { useState, useMemo, useEffect } from "react";
import AchieverBoard from "./AchieversBoard";
import api from "../../api/axios";

export default function AchieverBoardContainer() {
  useEffect(() => {
    fetchSubmission();
  }, []);

  const fetchSubmission = async () => {
    try {
      await api
        .get("/rewards/submissions")
        .then((res) => setData(res.data.data))
        .catch((err) => {
          setData([]);
          console.log(err);
        });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const [data, setData] = useState([]);
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
