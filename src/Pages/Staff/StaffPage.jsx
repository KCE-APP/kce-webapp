import { useEffect, useState, useRef } from "react";
import { Container, Nav, Modal, Button } from "react-bootstrap";
import api from "../../api/axios";
import StaffTable from "./StaffTable";
import StaffForm from "./StaffForm";
import Swal from "sweetalert2";

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCollege, setFilterCollege] = useState("");

  // Dirty State Logic
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nextTab, setNextTab] = useState(null);
  const formRef = useRef();

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/staff", {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm,
          collegeName: filterCollege,
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
      console.error("Failed to load staff data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, filterCollege]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (college) => {
    setFilterCollege(college);
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

  const handleSave = async (payload) => {
    try {
      if (editingItem) {
        // Construct refined payload as per user's curl example
        const updatePayload = {
          name: payload.name,
          role: payload.role,
          department: payload.department,
          collegeName: payload.collegeName,
        };

        // If password was changed (not the mask), include it
        if (
          payload.password &&
          payload.password.trim() !== "" &&
          payload.password !== "*********"
        ) {
          updatePayload.password = payload.password;
        }

        await api.patch(`/staff/${editingItem._id}`, updatePayload);
        Swal.fire({
          icon: "success",
          title: "Staff details updated successfully!",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        await api.post("/staff", payload);
        Swal.fire({
          icon: "success",
          title: "New staff added successfully!",
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
      console.error("Failed to save staff information", error);
      Swal.fire("Error", "Failed to save staff information", "error");
    }
  };

  const handleEdit = (row) => {
    setEditingItem(row);
    setActiveTab("form");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/staff/${id}`);
      loadData();
      Swal.fire({
        icon: "success",
        title: "Staff record has been deleted.",
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
          <h2 className="fw-bold color2 mb-0">Staff Management</h2>
          <p className="text-muted small mb-0">
            Register and manage campus staff and instructors
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
            View Staff
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="form" className="px-4">
            {editingItem ? "Edit Staff" : "Add New"}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "list" && (
        <StaffTable
          data={data}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filterCollege={filterCollege}
          onFilterChange={handleFilterChange}
        />
      )}

      {activeTab === "form" && (
        <StaffForm
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
