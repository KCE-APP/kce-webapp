import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import api from "../../../api/axios";
import Swal from "sweetalert2";

const ReviewSubmissionModal = ({ show, onHide, submission, onSuccess }) => {
  const [formData, setFormData] = useState({
    status: "pending",
    marks: "",
    reviewRemarks: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (submission) {
      setFormData({
        status: submission.status || "pending",
        marks: submission.marks || "",
        reviewRemarks: submission.reviewRemarks || "",
      });
    }
  }, [submission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "marks" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.status === "pending") {
      setError("Please select a status (Accepted or Reupload)");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      await api.patch(`/assignments/submissions/${submission._id}/review`, {
        status: formData.status,
        marks: formData.marks || 0,
        reviewRemarks: formData.reviewRemarks,
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Review submitted successfully!",
        showConfirmButton: false,
        timer: 3000,
      });

      onSuccess();
    } catch (err) {
      console.error("Failed to submit review", err);
      setError(err.response?.data?.message || "Failed to update review status");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" className="animate__animated animate__zoomIn">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold h5">Review Submission</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        {submission && (
          <div className="mb-4 bg-light p-3 rounded-3 border-start border-4 border-primary">
            <div className="small text-muted mb-1 text-uppercase fw-bold">Student</div>
            <div className="fw-bold text-dark">{submission.student?.name}</div>
            <div className="small text-muted">{submission.student?.email}</div>
          </div>
        )}

        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Status <span className="text-danger">*</span></Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-light border-0 shadow-none py-2"
              required
            >
              <option value="pending" disabled>Select Status</option>
              <option value="accepted">Accepted</option>
              <option value="reupload">Reupload</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Marks (0-100)</Form.Label>
            <Form.Control
              type="number"
              name="marks"
              min="0"
              max="100"
              placeholder="Enter score..."
              value={formData.marks}
              onChange={handleChange}
              className="bg-light border-0 shadow-none py-2"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold">Review Remarks</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="reviewRemarks"
              placeholder="Provide feedback to the student..."
              value={formData.reviewRemarks}
              onChange={handleChange}
              className="bg-light border-0 shadow-none py-2"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-3 mt-2">
            <Button variant="light" onClick={onHide} disabled={isSubmitting} className="px-4 fw-medium border-0">
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting} 
              className="px-4 fw-medium border-0 shadow-sm"
              style={{ backgroundColor: "#f3773a" }}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ReviewSubmissionModal;
