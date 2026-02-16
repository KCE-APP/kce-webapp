import { useEffect, useState, useRef } from "react";
import { Container, Nav, Modal, Button } from "react-bootstrap";
import api from "../../api/axios";
import RewardCatalogTable from "./RewardCatalogTable";
import RewardCatalogForm from "./RewardCatalogForm";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

export default function RewardCatalogPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);

  // Dirty State Logic
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nextTab, setNextTab] = useState(null);
  const formRef = useRef();

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/rewards/catalog", {
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
        console.error("Unexpected response data format:", res.data);
        setData([]);
      }
    } catch (error) {
      console.error("Failed to load reward catalog", error);
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

  const handleExport = async () => {
    try {
      const res = await api.get("/rewards/catalog", {
        params: {
          limit: 1000,
          search: searchTerm,
        },
      });

      const data = res.data.data || res.data;

      if (!Array.isArray(data) || data.length === 0) {
        Swal.fire("Info", "No rewards to export", "info");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(
        data.map((item) => ({
          Name: item.name,
          Points_Cost: item.pointsCost,
          Category: item.category,
          Stock: item.stock,
          Status: item.isActive ? "Active" : "Inactive",
          Description: item.description,
        })),
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rewards");
      XLSX.writeFile(workbook, "rewards_catalog.xlsx");
    } catch (error) {
      console.error("Export failed", error);
      Swal.fire("Error", "Failed to export reward catalog", "error");
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleSave = async (payload) => {
    try {
      const config = {
        headers: {},
      };

      if (payload instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      }

      if (editingItem) {
        await api.patch(`/rewards/catalog/${editingItem._id}`, payload, config);
        Swal.fire({
          icon: "success",
          title: "Reward updated successfully!",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        await api.post("/rewards/catalog", payload, config);
        Swal.fire({
          icon: "success",
          title: "New reward added successfully!",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
        });
      }
      setIsDirty(false);
      setActiveTab("list");
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error("Failed to save reward", error);
      Swal.fire("Error", "Failed to save reward", "error");
    }
  };

  const handleEdit = (row) => {
    setEditingItem(row);
    setActiveTab("form");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/rewards/catalog/${id}`);
      loadData();
      Swal.fire({
        icon: "success",
        title: "Reward has been deleted.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "Failed to delete reward", "error");
    }
  };

  const handleCancel = () => {
    setIsDirty(false);
    setActiveTab("list");
    setEditingItem(null);
  };

  const handleTabSelect = (k) => {
    if (activeTab === "form" && isDirty && k !== "form") {
      setNextTab(k);
      setShowConfirmModal(true);
    } else {
      proceedToTab(k);
    }
  };

  const proceedToTab = (k) => {
    setActiveTab(k);
    if (k === "list") setEditingItem(null);
  };

  const handleConfirmDiscard = () => {
    setIsDirty(false);
    setShowConfirmModal(false);
    if (nextTab) {
      proceedToTab(nextTab);
      setNextTab(null);
    }
  };

  const handleConfirmSave = () => {
    if (formRef.current) {
      const submitted = formRef.current.submitForm();
      if (submitted) {
        setShowConfirmModal(false);
        setNextTab(null);
      }
    }
  };

  return (
    <div className="py-4 ps-3">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold color2 mb-0">Reward Catalog</h2>
          <p className="text-muted small mb-0">
            Manage your store rewards and merchandise
          </p>
        </div>
      </div>

      <Nav
        variant="pills"
        className="modern-tabs mb-4"
        activeKey={activeTab}
        onSelect={handleTabSelect}
      >
        <Nav.Item>
          <Nav.Link eventKey="list" className="px-4">
            View Catalog
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="form" className="px-4">
            {editingItem ? "Edit Reward" : "Add New"}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "list" && (
        <RewardCatalogTable
          data={data}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          limit={limit}
          onLimitChange={handleLimitChange}
          onExport={handleExport}
        />
      )}

      {activeTab === "form" && (
        <RewardCatalogForm
          ref={formRef}
          initialData={editingItem}
          onSave={handleSave}
          onCancel={handleCancel}
          setIsDirty={setIsDirty}
        />
      )}

      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="h6 fw-bold">Unsaved Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have unsaved changes in the form. Do you want to save them before
          leaving?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDiscard}>
            Discard Changes
          </Button>
          <Button variant="primary" onClick={handleConfirmSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
