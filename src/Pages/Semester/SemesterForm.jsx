import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";

const SemesterForm = forwardRef(
  ({ initialData, onSave, onCancel, setIsDirty }, ref) => {
    const isEditMode = !!initialData;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
      collegeName: "",
      batch: "",
      semester: "",
      startDate: "",
      endDate: "",
    });

    const [errors, setErrors] = useState({});

    useImperativeHandle(ref, () => ({
      submitForm: async () => {
        if (validate()) {
          setIsSubmitting(true);
          try {
            await onSave(form);
            return true;
          } catch (error) {
            console.error("Submit failed", error);
            return false;
          } finally {
            setIsSubmitting(false);
          }
        }
        return false;
      },
    }));

    useEffect(() => {
      if (initialData) {
        setForm({
          collegeName: initialData.collegeName || "",
          batch: initialData.batch || "",
          semester: initialData.semester || "",
          startDate: initialData.startDate
            ? initialData.startDate.split("T")[0]
            : "",
          endDate: initialData.endDate ? initialData.endDate.split("T")[0] : "",
        });
      }
    }, [initialData]);

    const handleChange = (e) => {
      const { name, value } = e.target;

      if (name === "semester" && !/^\d*$/.test(value)) {
        return;
      }

      setForm({ ...form, [name]: value });
      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }
      if (setIsDirty) setIsDirty(true);
    };

    const validate = () => {
      const newErrors = {};
      if (!form.collegeName) newErrors.collegeName = "College is required";
      if (!form.batch.trim()) newErrors.batch = "Batch is required";
      if (!form.semester.toString().trim()) {
        newErrors.semester = "Semester is required";
      }
      if (!form.startDate) newErrors.startDate = "Start date is required";
      if (!form.endDate) newErrors.endDate = "End date is required";

      if (
        form.startDate &&
        form.endDate &&
        new Date(form.startDate) > new Date(form.endDate)
      ) {
        newErrors.endDate = "End date cannot be before start date";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validate()) {
        setIsSubmitting(true);
        try {
          await onSave(form);
        } catch (error) {
          console.error("Error submitting form:", error);
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    return (
      <Card
        className="shadow border-0 mb-4"
        style={{ borderRadius: "12px", overflow: "hidden" }}
      >
        <div className="bg-white border-bottom p-4">
          <h5 className="mb-0 fw-bold text-dark">
            {isEditMode ? "Edit Semester" : "Add New Semester Configuration"}
          </h5>
          <p className="text-muted small mb-0 mt-1">
            Define the academic period for a specific batch.
          </p>
        </div>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="formCollege">
                  <Form.Label>
                    College <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="collegeName"
                    value={form.collegeName}
                    onChange={handleChange}
                    isInvalid={!!errors.collegeName}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  >
                    <option value="">Select College</option>
                    <option value="KCE">KCE</option>
                    <option value="KIT">KIT</option>
                    <option value="KAHE">KAHE</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.collegeName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formBatch">
                  <Form.Label>
                    Batch <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="batch"
                    value={form.batch}
                    onChange={handleChange}
                    placeholder="e.g., 2024-2028"
                    isInvalid={!!errors.batch}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.batch}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={4}>
                <Form.Group controlId="formSemester">
                  <Form.Label>
                    Semester <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    placeholder="e.g., 1"
                    isInvalid={!!errors.semester}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.semester}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formStartDate">
                  <Form.Label>
                    Start Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    onClick={(e) =>
                      e.target.showPicker && e.target.showPicker()
                    }
                    isInvalid={!!errors.startDate}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.startDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formEndDate">
                  <Form.Label>
                    End Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    onClick={(e) =>
                      e.target.showPicker && e.target.showPicker()
                    }
                    isInvalid={!!errors.endDate}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.endDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light px-4"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 color-bg"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                    ? "Update Semester"
                    : "Add Semester"}
              </button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  },
);

SemesterForm.displayName = "SemesterForm";

export default SemesterForm;
