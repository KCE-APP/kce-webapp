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
  }, [searchTerm]);

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
  }, [filteredData, currentPage]);

  const handleDelete = async (id) => {
    try {
      const updated = data.filter((student) => student._id !== id);
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
    />
  );
}
