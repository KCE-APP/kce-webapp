import React, { useEffect, useState } from "react";
import { Container, Row, Spinner, Alert, Button } from "react-bootstrap";
import { Plus } from "lucide-react";
import api from "../../api/axios";
import Swal from "sweetalert2";

// Modular Components
import CareerTable from "./components/CareerTable";
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
  const [validated, setValidated] = useState(false);
  const [initialData, setInitialData] = useState(null);


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    careerImage: null,
    imagePreview: null,
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
      setError("Could not load Placement Highlights. Please try again later.");
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
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        careerImage: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", careerImage: null, imagePreview: null });
    setValidated(false);
    setEditingId(null);
    setInitialData(null);
  };



  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };





  const openEditModal = (career) => {
    resetForm();
    setEditingId(career._id);
    const data = {
      title: career.title || career.name || "",
      description: career.description || "",
      careerImage: null,
      imagePreview: career.imageUrl || "",
    };
    setFormData(data);
    setInitialData(data);
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
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setSubmitting(true);


    const data = new FormData();
    // Consolidate name and title as the backend might expect both
    data.append("name", formData.title);
    data.append("title", formData.title);
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
      resetForm();
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
          <h2 className="fw-bold color1 mb-0">Placement Highlights</h2>
          <p className="text-muted small mb-0">Manage and view placement highlights across campuses</p>
        </div>
        <Button 
          style={{ backgroundColor: PRIMARY_ORANGE, borderColor: PRIMARY_ORANGE }} 
          className="d-flex align-items-center gap-2 px-4 shadow-sm py-2"
          onClick={openAddModal}
        >
          <Plus size={18} /> Add Placement Highlight
        </Button>
      </div>

      {error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <CareerTable
          careers={careers}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDelete}
          primaryColor={PRIMARY_ORANGE}
        />
      )}

      {/* Add/Edit Career Modal Component */}
      <CareerModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        submitting={submitting}
        editingId={editingId}
        validated={validated}
        initialData={initialData}
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
