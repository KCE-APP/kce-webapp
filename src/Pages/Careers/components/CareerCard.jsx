import React from "react";
import { Col, Card, Button } from "react-bootstrap";
import { Edit, Trash2, MapPin, Calendar, MessageSquare } from "lucide-react";
import { formatImageUrl } from "../../../utils/ImageUrlFormat";

const CareerCard = ({ career, onEdit, onDelete, primaryColor }) => {
  const totalReactions = career.reactions 
    ? Object.values(career.reactions).reduce((a, b) => a + b, 0) 
    : 0;

  return (
    <Col xs={12} md={6} lg={4}>
      <Card className="h-100 border-0 shadow-sm hover-shadow transition-all overflow-hidden">
        {career.imageUrl && (
          <Card.Img
            variant="top"
            src={formatImageUrl(career.imageUrl)}
            alt={career.name}
            style={{ height: "180px", objectFit: "cover" }}
          />
        )}
        <Card.Body className="d-flex flex-column p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <Card.Title className="fw-bold fs-5 mb-1">{career.title || career.name}</Card.Title>
              {career.campus && (
                <div className="d-flex align-items-center text-muted small">
                  <MapPin size={14} className="me-1" style={{ color: primaryColor }} /> {career.campus}
                </div>
              )}
            </div>
          </div>

          <Card.Text 
            className="text-muted flex-grow-1 small mb-4" 
            style={{ 
              display: '-webkit-box', 
              WebkitLineClamp: '3', 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden' 
            }}
          >
            {career.description}
          </Card.Text>
          
          <div className="d-flex align-items-center gap-4 text-muted small mb-4">
            <div className="d-flex align-items-center">
              <Calendar size={14} className="me-1" style={{ color: primaryColor }} />
              {new Date(career.createdAt).toLocaleDateString()}
            </div>
            <div className="d-flex align-items-center">
              <MessageSquare size={14} className="me-1" style={{ color: primaryColor }} />
              {totalReactions}
            </div>
          </div>

          <div className="mt-auto d-flex gap-2 pt-3 border-top">
            <Button 
              variant="outline-warning" 
              size="sm" 
              className="flex-fill d-flex align-items-center justify-content-center gap-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
              onClick={() => onEdit(career)}
              onMouseOver={(e) => { e.target.style.backgroundColor = primaryColor; e.target.style.color = 'white'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = primaryColor; }}
            >
              <Edit size={14} /> Edit
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm" 
              className="flex-fill d-flex align-items-center justify-content-center gap-2"
              onClick={() => onDelete(career._id)}
            >
              <Trash2 size={14} /> Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default CareerCard;
