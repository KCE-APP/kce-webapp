import React from "react";
import { Modal, Form, Row, Col, Button, Spinner } from "react-bootstrap";

const CareerModal = ({ show, onHide, onSubmit, formData, handleInputChange, handleFileChange, submitting, editingId, primaryColor }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-0 px-4 pt-4">
        <Modal.Title className="fw-bold">
          {editingId ? "Edit Career Post" : "Post New Career"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body className="px-4 pb-4">
          <Row>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-uppercase text-muted letter-spacing-1">
                  Job Title / Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="py-2 px-3 focus-orange"
                />
              </Form.Group>
            </Col>
            <Col md={12}>
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
            </Col>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-uppercase text-muted letter-spacing-1">
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  placeholder="Provide details about the role, requirements, and benefits..."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="py-2 px-3 focus-orange"
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-0">
                <Form.Label className="small fw-bold text-uppercase text-muted letter-spacing-1">
                  Career Image {editingId && "(Optional)"}
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!editingId}
                  className="py-2 px-3"
                />
                <Form.Text className="text-muted tiny">
                  {editingId ? "Leave empty to keep existing image." : "Maximum file size: 5MB. Recommended ratio: 16:9."}
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4 pb-4 pt-0 gap-3">
          <Button variant="light" onClick={onHide} disabled={submitting} className="px-4 py-2">
            Cancel
          </Button>
          <Button 
            style={{ backgroundColor: primaryColor, borderColor: primaryColor }} 
            type="submit" 
            disabled={submitting} 
            className="px-5 py-2 shadow-sm text-white"
          >
            {submitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              editingId ? "Update Posting" : "Publish Career"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CareerModal;
