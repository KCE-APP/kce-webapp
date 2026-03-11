import React, { useEffect, useState } from "react";
import { Container, Row, Spinner, Alert, Button } from "react-bootstrap";
import { Plus } from "lucide-react";
import api from "../../api/axios";
import Swal from "sweetalert2";

// Modular Components
import CareerCard from "./components/CareerCard";
import CareerModal from "./components/CareerModal";

export default function CareersPage() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme constants
  const PRIMARY_ORANGE = "#f97316";

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    campus: "",
    description: "",
    careerImage: null,
  });

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/career/get-career");
      if (response.data && response.data.data) {
        setCareers(response.data.data);
      } else {
        setCareers([]);
      }
    } catch (err) {
      console.error("Failed to fetch careers:", err);
      setError("Could not load career opportunities. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, careerImage: e.target.files[0] }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", title: "", campus: "", description: "", careerImage: null });
    setShowModal(true);
  };

  const openEditModal = (career) => {
    setEditingId(career._id);
    setFormData({
      name: career.name || "",
      title: career.title || career.name || "",
      campus: career.campus || "",
      description: career.description || "",
      careerImage: null,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will remove the career opportunity from the listing.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/career/delete-career/${id}`);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Career opportunity has been removed.",
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: PRIMARY_ORANGE
        });
        fetchCareers();
      } catch (err) {
        console.error("Failed to delete career:", err);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete career posting.",
          confirmButtonColor: PRIMARY_ORANGE
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("title", formData.title || formData.name);
    data.append("campus", formData.campus);
    data.append("description", formData.description);
    if (formData.careerImage) {
      data.append("careerImage", formData.careerImage);
    }

    try {
      if (editingId) {
        await api.put(`/career/update-career/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/career/create-career", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      Swal.fire({
        icon: "success",
        title: editingId ? "Updated Successfully" : "Created Successfully",
        text: `The career opportunity has been ${editingId ? "updated" : "added"}.`,
        timer: 2000,
        showConfirmButton: false,
      });

      setShowModal(false);
      setFormData({ name: "", title: "", campus: "", description: "", careerImage: null });
      setEditingId(null);
      fetchCareers();
    } catch (err) {
      console.error("Failed to save career:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again or check your network connection.",
        confirmButtonColor: PRIMARY_ORANGE
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold color1 mb-0">Career Opportunities</h2>
          <p className="text-muted small mb-0">Manage and view job postings across campuses</p>
        </div>
        <Button 
          style={{ backgroundColor: PRIMARY_ORANGE, borderColor: PRIMARY_ORANGE }} 
          className="d-flex align-items-center gap-2 px-4 shadow-sm py-2"
          onClick={openAddModal}
        >
          <Plus size={18} /> Add Career
        </Button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" style={{ color: PRIMARY_ORANGE }} />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">{error}</Alert>
      ) : careers.length === 0 ? (
        <div className="text-center py-5 text-muted border rounded bg-light">
          <p className="mb-0">No career opportunities found.</p>
        </div>
      ) : (
        <Row className="g-4">
          {careers.map((career) => (
            <CareerCard
              key={career._id}
              career={career}
              onEdit={openEditModal}
              onDelete={handleDelete}
              primaryColor={PRIMARY_ORANGE}
            />
          ))}
        </Row>
      )}

      {/* Add/Edit Career Modal Component */}
      <CareerModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        submitting={submitting}
        editingId={editingId}
        primaryColor={PRIMARY_ORANGE}
      />

      <style>{`
        .focus-orange:focus {
          border-color: #f97316 !important;
          box-shadow: 0 0 0 0.25rem rgba(249, 115, 22, 0.25) !important;
        }
        .color1 { color: #f97316; }
      `}</style>
    </Container>
  );
}
