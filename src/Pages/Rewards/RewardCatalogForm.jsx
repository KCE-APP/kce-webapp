import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";

const RewardCatalogForm = forwardRef(
  ({ initialData, onSave, onCancel, setIsDirty }, ref) => {
    const isEditMode = !!initialData;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
      name: "",
      pointsCost: "",
      stock: "",
      category: "",
    });

    const [errors, setErrors] = useState({});

    const CATEGORIES = [
      "Merchandise",
      "Coupons",
      "Experience",
      "Vouchers",
      "Electronics",
      "Other",
    ];

    useImperativeHandle(ref, () => ({
      submitForm: async () => {
        if (validate()) {
          setIsSubmitting(true);
          try {
            await onSave({
              ...form,
              pointsCost: Number(form.pointsCost),
              stock: Number(form.stock),
            });
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
          pointsCost: initialData.pointsCost || "",
          stock: initialData.stock || "",
          category: initialData.category || "Merchandise",
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
      if (!form.name.trim()) newErrors.name = "Item name is required";
      if (!form.pointsCost || form.pointsCost <= 0)
        newErrors.pointsCost = "Valid points cost is required";
      if (form.stock === "" || form.stock < 0)
        newErrors.stock = "Valid stock count is required";
      if (!form.category) newErrors.category = "Category is required";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validate()) {
        setIsSubmitting(true);
        try {
          await onSave({
            ...form,
            pointsCost: Number(form.pointsCost),
            stock: Number(form.stock),
          });
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
            {isEditMode ? "Edit Reward Item" : "Add New Reward Item"}
          </h5>
          <p className="text-muted small mb-0 mt-1">
            Configure the details for your store merchandise.
          </p>
        </div>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={12}>
                <Form.Group controlId="formName">
                  <Form.Label>
                    Reward Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. KCE Branding Hoodie"
                    isInvalid={!!errors.name}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="formPoints">
                  <Form.Label>
                    Points Cost <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="pointsCost"
                    value={form.pointsCost}
                    onChange={handleChange}
                    placeholder="Enter points required"
                    isInvalid={!!errors.pointsCost}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pointsCost}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formStock">
                  <Form.Label>
                    Initial Stock <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Enter available quantity"
                    isInvalid={!!errors.stock}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.stock}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Form.Group controlId="formCategory">
                  <Form.Label>
                    Category <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    isInvalid={!!errors.category}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
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
                    ? "Update Reward"
                    : "Add to Catalog"}
              </button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  },
);

RewardCatalogForm.displayName = "RewardCatalogForm";

export default RewardCatalogForm;
