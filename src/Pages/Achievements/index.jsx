import React, { useState, useMemo, useEffect, useCallback } from "react";
import AchieverBoard from "./AchieversBoard";
import api from "../../api/axios";

export default function AchieverBoardContainer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterCollege, setFilterCollege] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSubmission = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/rewards/submissions", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          college: filterCollege,
        },
      });

      let fetchedData = [];
      if (res.data && Array.isArray(res.data.data)) {
        fetchedData = res.data.data;
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.totalCount || res.data.data.length);
      } else if (Array.isArray(res.data)) {
        // Fallback for flat array response
        fetchedData = res.data;
        setTotalPages(1);
        setTotalCount(res.data.length);
      } else {
         fetchedData = [];
         setTotalPages(1);
         setTotalCount(0);
      }

      const formatted = fetchedData.map((item) => ({
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
  }, [currentPage, itemsPerPage, searchTerm, filterCollege]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, filterCollege]);


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
      data={data}
      loading={loading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onDelete={handleDelete}
      itemsPerPage={itemsPerPage}
      onLimitChange={setItemsPerPage}
      totalCount={totalCount}
      filterCollege={filterCollege}
      onFilterChange={setFilterCollege}
    />
  );
}
