import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";

const StaffForm = forwardRef(
  ({ initialData, onSave, onCancel, setIsDirty }, ref) => {
    const isEditMode = !!initialData;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      role: "instructor",
      collegeName: "",
      department: "",
    });

    const [errors, setErrors] = useState({});

    const DEPARTMENTS = [
      "IT",
      "CSE",
      "ECE",
      "EEE",
      "ETE",
      "CST",
      "CY",
      "MECH",
      "CIVIL",
      "AIDS",
      "CSBS",
      "CSD",
      "MBA",
      "MCA",
      "MCT",
    ];

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
          name: initialData.name || "",
          email: initialData.email || "",
          password: "", // Don't populate password on edit for security
          role: initialData.role || "instructor",
          collegeName: initialData.collegeName || "",
          department: initialData.department || "",
        });
      }
    }, [initialData]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }
      if (setIsDirty) setIsDirty(true);
    };

    const validate = () => {
      const newErrors = {};
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = "Invalid email format";
      }

      if (!isEditMode && !form.password.trim()) {
        newErrors.password = "Password is required";
      } else if (form.password && form.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!form.role) newErrors.role = "Role is required";
      if (!form.collegeName) newErrors.collegeName = "College is required";
      if (!form.department) newErrors.department = "Department is required";

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
            {isEditMode ? "Edit Staff Details" : "Register New Staff"}
          </h5>
          <p className="text-muted small mb-0 mt-1">
            Fill in the professional details for the staff member.
          </p>
        </div>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="formName">
                  <Form.Label>
                    Full Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter staff name"
                    isInvalid={!!errors.name}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>
                    Email Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="staff@kce.ac.in"
                    isInvalid={!!errors.email}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="formPassword">
                  <Form.Label>
                    {isEditMode ? "Change Password" : "Password"}{" "}
                    {!isEditMode && <span className="text-danger">*</span>}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={
                      isEditMode
                        ? "Leave blank to keep current"
                        : "Enter password"
                    }
                    isInvalid={!!errors.password}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formRole">
                  <Form.Label>
                    Role <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    isInvalid={!!errors.role}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  >
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.role}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

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
                <Form.Group controlId="formDept">
                  <Form.Label>
                    Department <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    isInvalid={!!errors.department}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.department}
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
                    ? "Update Details"
                    : "Register Staff"}
              </button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  },
);

StaffForm.displayName = "StaffForm";

export default StaffForm;
