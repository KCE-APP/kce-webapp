import React from "react";
import { Modal, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import SecureImage from "../../../component/SecureImage";


const CareerModal = ({ show, onHide, onSubmit, formData, handleInputChange, handleFileChange, submitting, editingId, validated, initialData, primaryColor }) => {
  const isChanged = () => {
    if (!editingId || !initialData) return true;
    return (
      formData.title?.trim() !== initialData.title?.trim() ||
      formData.description?.trim() !== initialData.description?.trim() ||
      formData.careerImage !== null
    );
  };

  const canSubmit = !editingId || isChanged();


  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-0 px-4 pt-4">
        <Modal.Title className="fw-bold">
          {editingId ? "Edit Placement Highlight" : "Add Placement Highlight"}
        </Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={onSubmit}>


        <Modal.Body className="px-4 pb-4">
          <Row>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-uppercase text-muted letter-spacing-1">
                  Title 
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  isInvalid={validated && !formData.title.trim()}
                  className="py-2 px-3 focus-orange"
                />
                  
               {validated && 
                <Form.Control.Feedback type="invalid">
                  Please provide a title for the placement highlight.
                </Form.Control.Feedback>
               }



              </Form.Group>
            </Col>
            {/* <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-uppercase text-muted letter-spacing-1">
                  Campus / Location
                </Form.Label>
                <Form.Control
                  type="text"
                  name="campus"
                  placeholder="e.g. Main Campus, Coimbatore"
                  value={formData.campus}
                  onChange={handleInputChange}
                  className="py-2 px-3 focus-orange"
                />
              </Form.Group>
            </Col> */}
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-uppercase text-muted letter-spacing-1">
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  placeholder="Provide details about the placement highlight..."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  isInvalid={validated && !formData.description.trim()}
                  className="py-2 px-3 focus-orange"
                />

               {validated && 
                <Form.Control.Feedback type="invalid">
                  Please provide a description.
                </Form.Control.Feedback>}


              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-0">
                <Form.Label className="small fw-bold text-uppercase text-muted letter-spacing-1">
                  Poster Image {editingId && "(Optional)"}
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  name="careerImage"
                  onChange={handleFileChange}
                  required={!editingId}
                  isInvalid={validated && !editingId && !formData.careerImage}
                  className="py-2 px-3"
                />
                {validated && 
                <Form.Control.Feedback type="invalid">
                  Please upload a poster image.
                </Form.Control.Feedback>}
                {formData.imagePreview && !formData.careerImage && editingId && (
                   <div className="text-success small mt-1">Current image will be maintained.</div>
                )}




                <Form.Text className="text-muted tiny">
                  {editingId ? "Leave empty to keep existing image." : "Maximum file size: 5MB. Recommended ratio: 16:9."}
                </Form.Text>
              </Form.Group>
            </Col>

            {formData.imagePreview && (
              <Col md={12} className="mt-4">
                <Form.Label className="small fw-bold text-uppercase text-muted letter-spacing-1 d-block mb-3">
                  Image Preview
                </Form.Label>
                <div 
                  className="preview-container rounded-3 border overflow-hidden bg-light d-flex align-items-center justify-content-center" 
                  style={{ minHeight: "200px" }}
                >
                  <SecureImage
                    src={formatImageUrl(formData.imagePreview)}
                    alt="Preview"
                    className="w-100 h-100"
                    style={{ objectFit: "contain", maxHeight: "300px" }}
                  />
                </div>
              </Col>
            )}

          </Row>
        </Modal.Body>

        <Modal.Footer className="border-0 px-4 pb-4 pt-0 gap-3">
          <Button variant="light" onClick={onHide} disabled={submitting} className="px-4 py-2">
            Cancel
          </Button>
          <Button 
            style={{ backgroundColor: primaryColor, borderColor: primaryColor }} 
            type="submit" 
            disabled={submitting || !canSubmit} 
            className="px-5 py-2 shadow-sm text-white"
          >

            {submitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              editingId ? "Update Highlight" : "Add Highlight"
            )}

          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

const formatImageUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("http") || url.startsWith("https") || url.startsWith("blob:")) return url;
  return `${import.meta.env.VITE_IMAGE_BASE_URL}/${url.replace(/\\/g, "/")}`;
};

export default CareerModal;

