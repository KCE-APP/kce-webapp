import { useEffect, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import api from "../../api/axios";
import RedemptionHistoryTable from "./RedemptionHistoryTable";
import Swal from "sweetalert2";

export default function RedemptionHistoryPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/rewards/admin/redemptions", {
        params: {
          page: currentPage,
          limit: limit,
          search: searchTerm,
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
  }, [currentPage, searchTerm, limit]);

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

  const handleExport = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    window.open(
      `${baseUrl}/rewards/export/redemptions?search=${searchTerm}`,
      "_blank",
    );
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
        onSelect={setActiveTab}
      >
        <Nav.Item>
          <Nav.Link eventKey="list" className="px-4">
            View All
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "list" && (
        <RedemptionHistoryTable
          data={data}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          limit={limit}
          onLimitChange={handleLimitChange}
          onExport={handleExport}
          onFulfill={handleFulfill}
        />
      )}
    </Container>
  );
}
