import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import api from "../../../api/axios";
import BusinessIcon from "@mui/icons-material/Business";

const DEPARTMENTS = [
  "IT", "CSE", "ECE", "EEE", "ETE", "CST", "CY", "MECH", "CIVIL", "AIDS", "CSBS", "CSD", "MBA", "MCA", "VLSI"
];

const SECTIONS = ["A", "B", "C", "D"];

const AssignmentForm = forwardRef(({ initialData, onSave, onCancel, setIsDirty }, ref) => {
  const isEditMode = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Batch Calculation
  const getDynamicBatches = () => {
    const currentYear = new Date().getFullYear();
    const batches = [];
    // From currentYear - 6 to currentYear + 4
    for (let i = currentYear - 6; i <= currentYear + 4; i++) {
      batches.push(`${i}-${i + 4}`);
    }
    return batches;
  };

  const dynamicBatches = getDynamicBatches();

  const [form, setForm] = useState({
    title: "",
    description: "",
    instructions: "",
    department: "",
    batch: "",
    semester: "",
    type: "certification",
    resourceLink: "",
    submissionType: "none",
    submissionRequired: true,
    certificateRequired: true,
    dueDate: "",
  });

  const [errors, setErrors] = useState({});

  // Helper function to check if form has changed from initial data
  const hasChangesFromInitial = (currentForm, initial) => {
    if (!initial) {
      // If no initial data (creating new), always return false
      // The form starts empty and should be considered unmodified
      return false;
    }
    
    // For edit mode, compare with initial data
    const initialForm = {
      title: initial.title || "",
      description: initial.description || "",
      instructions: initial.instructions || "",
      department: initial.department || "",
      batch: initial.batch || "",
      semester: initial.semester || "",
      resourceLink: initial.resourceLink || "",
      submissionType: initial.submissionType || "none",
      dueDate: initial.dueDate ? initial.dueDate.split("T")[0] : "",
    };
    
    return (
      currentForm.title !== initialForm.title ||
      currentForm.description !== initialForm.description ||
      currentForm.instructions !== initialForm.instructions ||
      currentForm.department !== initialForm.department ||
      currentForm.batch !== initialForm.batch ||
      currentForm.semester !== initialForm.semester ||
      currentForm.resourceLink !== initialForm.resourceLink ||
      currentForm.submissionType !== initialForm.submissionType ||
      currentForm.dueDate !== initialForm.dueDate
    );
  };

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      if (validate()) {
        try {
          await onSave(form);
          return true;
        } catch (error) {
          console.error("External submit failed", error);
          return false;
        }
      }
      return false;
    },
  }));

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        instructions: initialData.instructions || "",
        department: initialData.department || "",
        batch: initialData.batch || "",
        semester: initialData.semester || "",
        type: "certification",
        resourceLink: initialData.resourceLink || "",
        submissionType: initialData.submissionType || "none",
        submissionRequired: true,
        certificateRequired: true,
        dueDate: initialData.dueDate ? initialData.dueDate.split("T")[0] : "",
      });
    } else {
      // Reset form for create mode
      setForm({
        title: "",
        description: "",
        instructions: "",
        department: "",
        batch: "",
        semester: "",
        type: "certification",
        resourceLink: "",
        submissionType: "none",
        submissionRequired: true,
        certificateRequired: true,
        dueDate: "",
      });
    }
    
    // Always reset dirty state when form initializes/changes
    if (setIsDirty) {
      setIsDirty(false);
    }
    setErrors({});
  }, [initialData, setIsDirty]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.department) newErrors.department = "Department is required";
    if (!form.batch.trim()) newErrors.batch = "Batch is required";
    if (!form.semester) newErrors.semester = "Semester is required";
    if (!form.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(form.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }
    
    const strippedDescription = form.description.replace(/<[^>]+>/g, "").trim();
    if (!strippedDescription) newErrors.description = "Description is required";

    if (!form.resourceLink.trim()) {
      newErrors.resourceLink = "Resource link is required";
    } else {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
      if (!urlPattern.test(form.resourceLink)) {
        newErrors.resourceLink = "Please enter a valid URL (e.g., https://example.com)";
      }
    }

    if (form.submissionType === "none") newErrors.submissionType = "Please select a valid submission type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newForm = {
      ...form,
      [name]: type === "checkbox" ? checked : value,
    };
    setForm(newForm);
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    
    // Update dirty state based on actual changes from initial data
    if (setIsDirty) {
      setIsDirty(hasChangesFromInitial(newForm, initialData));
    }
  };

  const handleEditorChange = (name, value) => {
    const newForm = { ...form, [name]: value };
    setForm(newForm);
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    
    // Update dirty state based on actual changes from initial data
    if (setIsDirty) {
      setIsDirty(hasChangesFromInitial(newForm, initialData));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const submissionData = {
          ...form,
          semester: Number(form.semester),
          dueDate: new Date(form.dueDate).toISOString()
        };
        await onSave(submissionData);
      } catch (error) {
        console.error("Failed to save assignment", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to save assignment details";
        Swal.fire("Error", errorMessage, "error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
      <div className="bg-white border-bottom px-4 py-3">
        <h5 className="mb-0 fw-bold text-dark">{isEditMode ? "Edit Assignment" : "Create New Assignment"}</h5>
        <p className="text-secondary small mb-0 mt-1 opacity-75">Provide task details for the students accurately.</p>
      </div>
      <Card.Body className="p-4 bg-white">
        <Form onSubmit={handleSubmit}>
          {/* Section: Basic Info */}
          <div className="d-flex align-items-center gap-2 mb-4">
            <div className="bg-primary-subtle p-1 rounded-2">
              <BusinessIcon className="text-primary" style={{ fontSize: "20px" }} />
            </div>
            <h6 className="text-uppercase text-primary fw-bold small mb-0" style={{ letterSpacing: "1px" }}>
              Basic Information
            </h6>
          </div>
          
          <Row className="mb-4">
            <Col md={12} className="mb-3">
              <Form.Group controlId="formTitle">
                <Form.Label className="small fw-bold text-secondary text-uppercase mb-2">Assignment Title <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="e.g., Advanced React Hooks Lab"
                  value={form.title}
                  onChange={handleChange}
                  isInvalid={!!errors.title}
                  className="bg-light border-1 shadow-none py-2"
                />
                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Form.Group controlId="formBatch">
                <Form.Label className="small fw-bold text-secondary text-uppercase mb-2">Batch <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="batch"
                  value={form.batch}
                  onChange={handleChange}
                  isInvalid={!!errors.batch}
                  className="bg-light border-1 shadow-none py-2"
                >
                  <option value="">Select Batch</option>
                  {dynamicBatches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.batch}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Group controlId="formDept">
                <Form.Label className="small fw-bold text-secondary text-uppercase mb-2">Department <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  isInvalid={!!errors.department}
                  className="bg-light border-1 shadow-none py-2"
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.department}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Group controlId="formSemester">
                <Form.Label className="small fw-bold text-secondary text-uppercase mb-2">Semester <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  isInvalid={!!errors.semester}
                  className="bg-light border-1 shadow-none py-2"
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.semester}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Group controlId="formDueDate">
                <Form.Label className="small fw-bold text-secondary text-uppercase mb-2">Due Date <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  isInvalid={!!errors.dueDate}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  className="bg-light border-1 shadow-none py-2"
                />
                <Form.Control.Feedback type="invalid">{errors.dueDate}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Section: Content */}
          <h6 className="text-uppercase text-secondary fw-bold small mb-3 border-bottom pb-2 mt-2" style={{ letterSpacing: "1px" }}>
            Task Details
          </h6>
          <Form.Group className="mb-4">
            <Form.Label>Description <span className="text-danger">*</span></Form.Label>
            <ReactQuill
              theme="snow"
              value={form.description}
              onChange={(val) => handleEditorChange("description", val)}
              placeholder="What is this assignment about?"
              style={{ height: "150px", marginBottom: "50px" }}
            />
            {errors.description && <div className="text-danger small mt-1">{errors.description}</div>}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Special Instructions</Form.Label>
            <ReactQuill
              theme="snow"
              value={form.instructions}
              onChange={(val) => handleEditorChange("instructions", val)}
              placeholder="Any specific steps students should follow?"
              style={{ height: "150px", marginBottom: "50px" }}
            />
          </Form.Group>

          {/* Section: Links & Requirements */}
          <h6 className="text-uppercase text-secondary fw-bold small mb-3 border-bottom pb-2 mt-2" style={{ letterSpacing: "1px" }}>
            Requirements & Links
          </h6>
          <Row className="mb-4">
            <Col md={6} className="mb-3">
              <Form.Group controlId="formResourceLink">
                <Form.Label>Resource Link (URL) <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="url"
                  name="resourceLink"
                  placeholder="e.g., https://github.com/docs/..."
                  value={form.resourceLink}
                  onChange={handleChange}
                  isInvalid={!!errors.resourceLink}
                  className="shadow-none"
                />
                <Form.Control.Feedback type="invalid">{errors.resourceLink}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="formSubType">
                <Form.Label>Submission Type <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="submissionType"
                  value={form.submissionType}
                  onChange={handleChange}
                  isInvalid={!!errors.submissionType}
                  className="shadow-none"
                >
                  <option value="none">None</option>
                  <option value="link">Link</option>
                  <option value="file">File Upload</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.submissionType}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <hr className="my-4" />

          <div className="d-flex justify-content-end gap-3">
            <Button variant="light" onClick={onCancel} disabled={isSubmitting} className="px-4">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting} className="px-4">
              {isSubmitting ? "Saving..." : isEditMode ? "Update Assignment" : "Create Assignment"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
});

export default AssignmentForm;
