import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { Upload as UploadIcon, X as XIcon } from "lucide-react";
import SecureImage from "../../component/SecureImage";
import { formatImageUrl } from "../../utils/ImageUrlFormat";

const RewardCatalogForm = forwardRef(
  ({ initialData, onSave, onCancel, setIsDirty }, ref) => {
    const isEditMode = !!initialData;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
      name: "",
      pointsCost: "",
      stock: "",
      category: "",
      image: null,
      imageUrl: "", // For preview
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

    const processSubmit = async () => {
      if (validate()) {
        setIsSubmitting(true);
        try {
          const formData = new FormData();
          formData.append("name", form.name);
          formData.append("pointsCost", form.pointsCost);
          formData.append("stock", form.stock);
          formData.append("category", form.category);

          if (form.image) {
            formData.append("image", form.image);
          }

          // Log to debug what is being sent
          console.log("Submitting FormData", form);

          await onSave(formData);
          return true;
        } catch (error) {
          console.error("Submit failed", error);
          return false;
        } finally {
          setIsSubmitting(false);
        }
      }
      return false;
    };

    useImperativeHandle(ref, () => ({
      submitForm: processSubmit,
    }));

    useEffect(() => {
      if (initialData) {
        setForm({
          name: initialData.name || "",
          pointsCost: initialData.pointsCost || "",
          stock: initialData.stock || "",
          category: initialData.category || "Merchandise",
          image: null,
          imageUrl: initialData.imageUrl || "",
        });
      }
    }, [initialData]);

    const handleChange = (e) => {
      const { name, value, files } = e.target;

      if (name === "image") {
        const file = files[0];
        if (file) {
          setForm({
            ...form,
            image: file,
            imageUrl: URL.createObjectURL(file),
          });
        }
      } else {
        setForm({ ...form, [name]: value });
      }

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
      await processSubmit();
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
              <Col md={8}>
                <Row className="mb-3">
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

                <Row className="mb-3">
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

                <Row>
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
              </Col>

              <Col md={4}>
                <Form.Group controlId="formImage" className="h-100">
                  <Form.Label>Reward Image</Form.Label>
                  <div
                    className="border rounded p-3 d-flex flex-column align-items-center justify-content-center text-center bg-light"
                    style={{
                      borderStyle: "dashed !important",
                      borderWidth: "2px",
                      borderColor: errors.image ? "#dc3545" : "#dee2e6",
                      height: "calc(100% - 30px)",
                      minHeight: "200px",
                    }}
                  >
                    {form.imageUrl ? (
                      <div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center">
                        {form.imageUrl.startsWith("blob:") ? (
                          <img
                            src={form.imageUrl}
                            alt="Preview"
                            className="img-fluid rounded"
                            style={{ maxHeight: "200px", objectFit: "contain" }}
                          />
                        ) : (
                          <SecureImage
                            src={formatImageUrl(form.imageUrl)}
                            alt="Preview"
                            className="img-fluid rounded"
                            style={{ maxHeight: "200px", objectFit: "contain" }}
                          />
                        )}
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1"
                          style={{
                            width: "24px",
                            height: "24px",
                            lineHeight: 1,
                          }}
                          onClick={() => {
                            setForm({ ...form, image: null, imageUrl: "" });
                            if (setIsDirty) setIsDirty(true);
                          }}
                        >
                          <XIcon size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <UploadIcon size={32} className="text-muted mb-2" />
                        <p className="small text-muted mb-2">
                          Click to upload image
                          <br />
                          <span className="text-xs">(JPG, PNG max 2MB)</span>
                        </p>
                        <Form.Control
                          type="file"
                          name="image"
                          onChange={handleChange}
                          accept="image/*"
                          className="d-none"
                        />
                        <label
                          htmlFor="formImage"
                          className="btn btn-sm btn-outline-primary"
                        >
                          Choose File
                        </label>
                      </>
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
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
