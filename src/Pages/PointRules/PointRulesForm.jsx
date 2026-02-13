import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";

const PointRulesForm = forwardRef(
  ({ initialData, onSave, onCancel, setIsDirty }, ref) => {
    const isEditMode = !!initialData;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
      category: "",
      points: "",
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
          category: initialData.category || "",
          points: initialData.points || "",
        });
      }
    }, [initialData]);

    const handleChange = (e) => {
      const { name, value } = e.target;

      if (name === "points" && !/^\d*$/.test(value)) {
        return;
      }

      setForm({
        ...form,
        [name]: value,
      });

      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }
      if (setIsDirty) setIsDirty(true);
    };

    const validate = () => {
      const newErrors = {};
      if (!form.category.trim()) newErrors.category = "Category is required";
      if (!form.points.toString().trim()) {
        newErrors.points = "Points are required";
      } else if (
        isNaN(parseInt(form.points, 10)) ||
        parseInt(form.points, 10) < 0
      ) {
        newErrors.points = "Points must be a positive number";
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
            {isEditMode ? "Edit Point Rule" : "New Point Rule"}
          </h5>
          <p className="text-muted small mb-0 mt-1">
            Specify the category and its associated point value.
          </p>
        </div>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={8}>
                <Form.Group controlId="formCategory">
                  <Form.Label>
                    Category <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g., Special recognition post"
                    isInvalid={!!errors.category}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formPoints">
                  <Form.Label>
                    Points <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="points"
                    value={form.points}
                    onChange={handleChange}
                    placeholder="e.g., 150"
                    isInvalid={!!errors.points}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.points}
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
                    ? "Update Rule"
                    : "Add Rule"}
              </button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  },
);

PointRulesForm.displayName = "PointRulesForm";

export default PointRulesForm;
