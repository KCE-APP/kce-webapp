import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import api from "../../../api/axios";
import Swal from "sweetalert2";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ErrorIcon from "@mui/icons-material/Error";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { formatImageUrl } from "../../../utils/ImageUrlFormat";
import SecureImage from "../../../component/SecureImage";

const ReviewSubmissionModal = ({ show, onHide, submission, onSuccess }) => {
  const [formData, setFormData] = useState({
    status: "pending",
    marks: "",
    reviewRemarks: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showFilePreview, setShowFilePreview] = useState(false);

  useEffect(() => {
    if (submission) {
      setFormData({
        status: submission.status || "pending",
        marks: submission.marks || "",
        reviewRemarks: submission.reviewRemarks || "",
      });
    }
  }, [submission]);

  const getFileUrl = () => {
    if (!submission?.fileUrl) return null;
    return formatImageUrl(submission.fileUrl);
  };

  const getFileExtension = (filePath) => {
    if (!filePath) return "";
    // Extract extension from the original file path, not the formatted URL
    return filePath.split(".").pop().toLowerCase();
  };

  const isImageFile = () => {
    if (!submission?.fileUrl) return false;
    const ext = getFileExtension(submission.fileUrl);
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
  };

  const handleViewSubmission = () => {
    // Handle submissionLink (external URL submission)
    if (submission?.submissionLink && !submission?.fileUrl) {
      window.open(submission.submissionLink, "_blank");
      return;
    }

    // Handle fileUrl (uploaded file submission)
    const fileUrl = getFileUrl();
    if (!fileUrl) {
      setError("No submission file available");
      return;
    }

    // If it's an image, show preview in modal
    if (isImageFile()) {
      setImageError(false); // Reset error state
      setShowFilePreview(true);
    } else {
      // For other file types, open in new tab
      window.open(fileUrl, "_blank");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    setError(null);
    
    if (name === "marks") {
      // Allow empty value
      if (value === "") {
        setFormData((prev) => ({
          ...prev,
          marks: "",
        }));
      } else {
        const numValue = Number(value);
        // Only allow values between 0 and 100
        if (numValue >= 0 && numValue <= 100) {
          setFormData((prev) => ({
            ...prev,
            marks: numValue,
          }));
        }
        // If value is > 100 or < 0, don't update the state (prevents typing)
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.status === "pending") {
      setError("Please select a status (Accepted or Reupload)");
      return;
    }

    // If status is "accepted", marks is mandatory
    if (formData.status === "accepted" && (formData.marks === "" || formData.marks === null)) {
      setError("Marks are required when status is Accepted");
      return;
    }

    // Validate marks range (0-100)
    if (formData.marks !== "" && (formData.marks < 0 || formData.marks > 100)) {
      setError("Marks must be between 0 and 100");
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
    <>
      <Modal show={show} onHide={onHide} centered backdrop="static" className="animate__animated animate__zoomIn">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold h5">Review Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          {submission && (
            <div className="mb-4 bg-light p-3 rounded-3 border-start border-4 border-primary d-flex justify-content-between align-items-center">
              <div>
                <div className="small text-muted mb-1 text-uppercase fw-bold">Student</div>
                <div className="fw-bold text-dark">{submission.studentId?.name}</div>
                <div className="small text-muted">{submission.studentId?.rollNo} • {submission.studentId?.department}</div>
                <div className="d-flex align-items-center gap-1 mt-2 text-muted small">
                  <CalendarMonthIcon style={{ fontSize: "16px" }} />
                  <span className="text-uppercase fw-bold">Submitted:</span>
                  <span>{new Date(submission.submittedAt || submission.createdAt).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                  })}</span>
                </div>
              </div>
              <div>
                {submission.fileUrl || submission.submissionLink ? (
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    className="rounded-pill px-3"
                    onClick={handleViewSubmission}
                    title={submission.fileUrl ? "View uploaded file" : "Open submission link"}
                  >
                    View Submission
                  </Button>
                ) : (
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <ErrorIcon style={{ fontSize: "16px", color: "#dc3545" }} />
                    No submission
                  </div>
                )}
              </div>
            </div>
          )}

          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Status <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={(e) => {
                  handleChange(e);
                  // Also reset error when changing status
                  setError(null);
                }}
                className="bg-light border-0 shadow-none py-2"
                required
              >
                <option value="pending" disabled>Select Status</option>
                <option value="accepted">Accepted</option>
                <option value="reupload">Reupload</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">
                Marks (0-100)
                {formData.status === "accepted" && <span className="text-danger">*</span>}
              </Form.Label>
              <Form.Control
                type="number"
                name="marks"
                min="0"
                max="100"
                placeholder="Enter score..."
                value={formData.marks}
                onChange={handleChange}
                className="bg-light border-0 shadow-none py-2"
                required={formData.status === "accepted"}
              />
              {formData.status === "accepted" && formData.marks === "" && !error?.includes("Marks") && (
                <Form.Text className="text-danger small d-block mt-1">
                  Marks are required for Accepted status
                </Form.Text>
              )}
              {formData.marks > 100 && (
                <Form.Text className="text-danger small d-block mt-1">
                  Marks cannot exceed 100
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold">Review Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="reviewRemarks"
                placeholder="Provide feedback to the student..."
                value={formData.reviewRemarks}
                onChange={(e) => {
                  handleChange(e);
                  setError(null);
                }}
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
                Submit Review
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Image Preview Modal */}
      <Modal show={showFilePreview} onHide={() => setShowFilePreview(false)} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold h5">Submission Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-0 bg-light" style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SecureImage
            src={getFileUrl()}
            alt="Submission preview"
            className="w-100 d-block"
            style={{ maxHeight: "600px", objectFit: "contain" }}
          />
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button 
            variant="outline-primary"
            size="sm"
            className="rounded-pill px-3"
            href={getFileUrl()}
            target="_blank"
            onClick={() => setShowFilePreview(false)}
          >
            <FileDownloadIcon style={{ fontSize: "16px" }} className="me-1" />
            Download
          </Button>
          <Button 
            variant="light" 
            onClick={() => setShowFilePreview(false)}
            className="border-0"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReviewSubmissionModal;
