import { useEffect, useState, useRef } from "react";
import { Container, Nav, Modal, Button } from "react-bootstrap";
import api from "../../api/axios";
import PointRulesTable from "./PointRulesTable";
import PointRulesForm from "./PointRulesForm";
import Swal from "sweetalert2";

export default function PointRulesPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Dirty State Logic
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nextTab, setNextTab] = useState(null);
  const formRef = useRef();

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/rewards/rules", {
        params: {
          page: currentPage,
          limit: 10,
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
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
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

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.patch(`/rewards/rules/${editingItem._id}`, formData);
        Swal.fire({
          icon: "success",
          title: "Point rule updated successfully!",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        await api.post("/rewards/rules", formData);
        Swal.fire({
          icon: "success",
          title: "New point rule added successfully!",
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
      console.error("Failed to save point rule", error);
      Swal.fire("Error", "Failed to save point rule", "error");
    }
  };

  const handleEdit = (row) => {
    setEditingItem(row);
    setActiveTab("form");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/rewards/rules/${id}`);
      loadData();
      Swal.fire({
        icon: "success",
        title: "Record has been deleted.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "Failed to delete record", "error");
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
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold color2 mb-0">Point Rules Management</h2>
          <p className="text-muted small mb-0">
            Define point categories and their values
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
            View Rules
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="form" className="px-4">
            {editingItem ? "Edit Rule" : "Add New"}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "list" && (
        <PointRulesTable
          data={data}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      )}

      {activeTab === "form" && (
        <PointRulesForm
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
    </Container>
  );
}
