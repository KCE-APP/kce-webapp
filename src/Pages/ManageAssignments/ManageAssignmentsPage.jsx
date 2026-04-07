import { useEffect, useState, useRef } from "react";
import { Container, Nav, Modal, Button } from "react-bootstrap";
import api from "../../api/axios";
import AssignmentsTable from "./components/AssignmentsTable";
import AssignmentForm from "./components/AssignmentForm";
import SubmissionsList from "./components/SubmissionsList";
import Swal from "sweetalert2";

const ManageAssignmentsPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterSem, setFilterSem] = useState("");

  // View Control
  const [viewMode, setViewMode] = useState("list"); // 'list', 'submissions'
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Dirty State Logic
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nextTab, setNextTab] = useState(null);
  const formRef = useRef();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/assignments/all", {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm,
          department: filterDept,
          batch: filterBatch,
          semester: filterSem,
        },
      });

      // Normalize response according to specifically provided structure
      if (res.data && Array.isArray(res.data.data)) {
        setData(res.data.data);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } else if (Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Failed to load assignments", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, filterDept, filterBatch, filterSem]);

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/assignments/${editingItem._id}`, formData);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Assignment updated!",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        await api.post("/assignments/create", formData);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Assignment created!",
          showConfirmButton: false,
          timer: 3000,
        });
      }
      setIsDirty(false);
      setActiveTab("list");
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error("Failed to save assignment", error);
      Swal.fire("Error", "Failed to save assignment details", "error");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setActiveTab("form");
  };

  const handleDelete = async (id, title) => {
    Swal.fire({
      title: "Confirm Delete",
      text: `Are you sure you want to delete the assignment "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await api.delete(`/assignments/${id}`);
          loadData();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Assignment deleted successfully!",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    });
  };

  const handleViewSubmissions = (item) => {
    setSelectedAssignment(item);
    setViewMode("submissions");
  };

  const handleBackToAssignments = () => {
    setSelectedAssignment(null);
    setViewMode("list");
  };

  const handleTabSelect = (k) => {
    if (activeTab === "form" && isDirty && k !== "form") {
      setNextTab(k);
      setShowConfirmModal(true);
    } else {
      setActiveTab(k);
      if (k === "list") {
        setEditingItem(null);
        setViewMode("list"); // Reset to list when switching back to View Assignments
      } else if (k === "form") {
        setViewMode("list"); // Switch out of submissions if going to Add New
      }
    }
  };

  const handleConfirmDiscard = () => {
    setIsDirty(false);
    setShowConfirmModal(false);
    if (nextTab) {
      setActiveTab(nextTab);
      if (nextTab === "list") setEditingItem(null);
      setNextTab(null);
    }
  };

  return (
    <div className="ps-3 py-3 p-0">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold color2 mb-0">Assignment Management</h2>
          <p className="text-muted small mb-0">
            Create and track student task submissions
          </p>
        </div>
      </div>

      <Nav
        variant="pills"
        className="bg-light p-2 rounded-3 d-inline-flex gap-2 mb-4"
        activeKey={activeTab}
        onSelect={handleTabSelect}
      >
        <Nav.Item>
          <Nav.Link
            eventKey="list"
            className={`px-4 rounded-2 fw-medium ${activeTab === "list" ? "text-white shadow-sm" : "text-secondary"}`}
            style={activeTab === "list" ? { backgroundColor: "#f3773a" } : {}}
          >
            View Assignments
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="form"
            className={`px-4 rounded-2 fw-medium ${activeTab === "form" ? "text-white shadow-sm" : "text-secondary"}`}
            style={activeTab === "form" ? { backgroundColor: "#f3773a" } : {}}
          >
            {editingItem ? "Edit Assignment" : "Create New"}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "list" && (
        viewMode === "submissions" && selectedAssignment ? (
          <SubmissionsList 
            assignment={selectedAssignment} 
            onBack={handleBackToAssignments} 
          />
        ) : (
          <AssignmentsTable
            data={data}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewSubmissions={handleViewSubmissions}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            searchTerm={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            filterDept={filterDept}
            onFilterDeptChange={(val) => {
              setFilterDept(val);
              setCurrentPage(1);
            }}
            filterBatch={filterBatch}
            onFilterBatchChange={(val) => {
              setFilterBatch(val);
              setCurrentPage(1);
            }}
            filterSem={filterSem}
            onFilterSemChange={(val) => {
              setFilterSem(val);
              setCurrentPage(1);
            }}
          />
        )
      )}

      {activeTab === "form" && (
        <AssignmentForm
          ref={formRef}
          initialData={editingItem}
          onSave={handleSave}
          onCancel={() => handleTabSelect("list")}
          setIsDirty={setIsDirty}
        />
      )}

      {/* Unsaved Changes Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="h6 fw-bold">Unsaved Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have unsaved changes in the form. Do you want to discard them?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDiscard}>
            Discard Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageAssignmentsPage;
