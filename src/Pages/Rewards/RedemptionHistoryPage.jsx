import { useEffect, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import api from "../../api/axios";
import RedemptionHistoryTable from "./RedemptionHistoryTable";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

export default function RedemptionHistoryPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCollege, setFilterCollege] = useState("");
  const [limit, setLimit] = useState(10);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/rewards/admin/redemptions", {
        params: {
          page: currentPage,
          limit: limit,
          search: searchTerm,
          status: activeTab, // "pending" or "fulfilled"
          college: filterCollege,
        },
      });

      if (res.data && Array.isArray(res.data.data)) {
        setData(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } else if (Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Failed to load redemption history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, limit, activeTab, filterCollege]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(Number(newLimit));
    setCurrentPage(1);
  };

  const handleFilterChange = (val) => {
    setFilterCollege(val);
    setCurrentPage(1);
  };

  const handleFulfill = async (id) => {
    try {
      await api.patch(`/rewards/admin/redemptions/${id}`, {
        status: "fulfilled",
      });
      Swal.fire({
        icon: "success",
        title: "Marked as fulfilled!",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
      loadData();
    } catch (error) {
      console.error("Failed to update status", error);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get("/rewards/admin/redemptions", {
        params: {
          limit: 1000,
          search: searchTerm,
          status: activeTab,
          college: filterCollege,
        },
      });

      const data = res.data.data || res.data; // Handle potential different response structures

      if (!Array.isArray(data) || data.length === 0) {
        Swal.fire("Info", "No data to export", "info");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(
        data.map((item) => ({
          Student_Name: item.studentId?.name || "N/A",
          Roll_No: item.studentId?.rollNo || "N/A",
          Department: item.studentId?.department || "N/A",
          Batch: item.studentId?.batch || "N/A",
          College: item.studentId?.collegeName || "N/A",
          Reward_Name: item.rewardId?.name || "N/A",
          Category: item.rewardId?.category || "N/A",
          Points_Cost: item.rewardId?.pointsCost || 0,
          Status: item.status,
          Redeemed_At: item.redeemedAt
            ? new Date(item.redeemedAt).toLocaleDateString()
            : "",
        })),
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Redemptions");
      XLSX.writeFile(workbook, "redemption_history.xlsx");
    } catch (error) {
      console.error("Export failed", error);
      Swal.fire("Error", "Failed to export data", "error");
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold color2 mb-0">Redemption History</h2>
          <p className="text-muted small mb-0">
            Track and fulfill reward redemptions from students
          </p>
        </div>
      </div>

      <Nav
        variant="pills"
        className="modern-tabs mb-4"
        activeKey={activeTab}
        onSelect={(k) => {
          setActiveTab(k);
          setCurrentPage(1); // Reset page on tab change
        }}
      >
        <Nav.Item>
          <Nav.Link eventKey="pending" className="px-4">
            Pending Requests
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="fulfilled" className="px-4">
            Fulfilled History
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <RedemptionHistoryTable
        data={data}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filterCollege={filterCollege}
        onFilterChange={handleFilterChange}
        limit={limit}
        onLimitChange={handleLimitChange}
        onExport={handleExport}
        onFulfill={handleFulfill}
        activeTab={activeTab}
      />
    </Container>
  );
}
