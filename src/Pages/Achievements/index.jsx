import React, { useState, useMemo, useEffect, useCallback } from "react";
import AchieverBoard from "./AchieversBoard";
import api from "../../api/axios";

export default function AchieverBoardContainer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchSubmission = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/rewards/submissions");

      const formatted = res.data.data.map((item) => ({
        ...item,
        _id: item.submissionId,
        rewardType: item.category,
        status: item.status
          ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
          : "Pending",
      }));

      setData(formatted);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const filteredData = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    return data.filter(
      (student) =>
        (student.name || "").toLowerCase().includes(lowerSearch) ||
        (student.rollNo || "").toLowerCase().includes(lowerSearch),
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleDelete = async (rollNo, submissionId) => {
    try {
      await api.delete(`/rewards/submission/${submissionId}`);
      const updated = data.filter((student) => student.rollNo !== rollNo);
      setData(updated);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <AchieverBoard
      data={paginatedData}
      loading={loading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onDelete={handleDelete}
      itemsPerPage={itemsPerPage}
      onLimitChange={setItemsPerPage}
      totalCount={filteredData.length}
    />
  );
}
