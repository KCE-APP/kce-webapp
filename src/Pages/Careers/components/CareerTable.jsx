import React, { useState } from "react";
import { Table, Form, Spinner } from "react-bootstrap";
import { Search as SearchIcon } from "lucide-react";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { Tooltip } from "@mui/material";
import SecureImage from "../../../component/SecureImage";
import TablePlaceholder from "../../../component/TablePlaceholder";
import { formatImageUrl } from "../../../utils/ImageUrlFormat";


const REACTION_TYPES = [
  {
    id: "clap",
    image: "https://cdn-icons-png.flaticon.com/512/1961/1961454.png",
    color: "#f2dbb0ff",
    label: "Clap",
  },
  {
    id: "trophy",
    image: "https://cdn-icons-png.flaticon.com/512/419/419952.png",
    color: "#feffa9ff",
    label: "Trophy",
  },
  {
    id: "respect",
    image: "https://cdn-icons-png.flaticon.com/512/11252/11252520.png",
    color: "#b6ffcbff",
    label: "Respect",
  },
  {
    id: "goat",
    image: "https://cdn-icons-png.flaticon.com/512/616/616714.png",
    color: "#ffeec1ff",
    label: "Goat",
  },
  {
    id: "finger_heart",
    image: "https://cdn-icons-png.flaticon.com/512/9812/9812568.png",
    color: "#f1c0d9ff",
    label: "Lovely",
  },
];

export default function CareerTable({ 
  careers, 
  loading, 
  onEdit, 
  onDelete, 
  primaryColor 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleViewImage = (title, imageUrl) => {
    setPreviewTitle(title);
    setPreviewImage(imageUrl);
    setShowPreview(true);
  };

  const filteredCareers = careers.filter(career => 
    career.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      <div className="toolbar-card d-flex align-items-center justify-content-between mb-4">
        <div className="position-relative w-100" style={{ maxWidth: "450px" }}>
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
            <SearchIcon size={18} />
          </div>
          <Form.Control
            type="text"
            placeholder="Search by name ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input ps-5 py-2"
          />
        </div>
      </div>

      <div className="modern-card">
        {loading ? (
          <TablePlaceholder />
        ) : (
          <div className="table-responsive">
            <Table className="custom-table mb-0 align-middle">
              <thead>
                <tr>
                  <th className="ps-4" style={{ width: "35%" }}>
                    Placement Details
                  </th>
                  <th style={{ width: "30%" }}>Reactions</th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Images
                  </th>
                  <th className="text-end pe-4" style={{ width: "20%" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCareers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <div className="text-muted d-flex flex-column align-items-center">
                        <SearchIcon size={32} className="opacity-25 mb-2" />
                        <h6>No Placement Highlights found</h6>
                        <p className="small mb-0">
                          Try adjusting your search criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCareers.map((career) => (
                    <tr key={career._id}>
                      <td className="ps-4">
                        <div className="profile-cell-container">
                          {/* {career.imageUrl ? (
                            <SecureImage
                              src={formatImageUrl(career.imageUrl)}
                              alt=""
                              className="rounded-3 border shadow-sm"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              className="rounded-3 bg-light border d-flex align-items-center justify-content-center text-muted"
                              style={{ width: "50px", height: "50px" }}
                            >
                              <small>No Image</small>
                            </div>
                          )} */}
                          <div className="profile-info">
                            <span
                              className="profile-name text-truncate"
                              style={{ maxWidth: "300px" }}
                            >
                              {career.title || career.name}
                            </span>
                            <span
                              className="profile-subtitle text-truncate"
                              style={{ maxWidth: "250px" }}
                              title={career.description}
                            >
                              {career.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {REACTION_TYPES.map((reaction, index) => (
                            <div
                              key={reaction.id}
                              className="d-flex align-items-center gap-1"
                              title={reaction.label}
                            >
                              <img
                                src={reaction.image}
                                alt={reaction.label}
                                style={{ width: "22px", height: "22px" }}
                              />
                              <span className="fw-bold text-muted small">
                                {career.reactions?.[`r${index + 1}`] || 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="text-center">
                        {career.imageUrl ? (
                          <Tooltip title="View Poster">
                            <button
                              className="action-btn mx-auto"
                              onClick={() =>
                                handleViewImage(
                                  career.title || career.name,
                                  career.imageUrl,
                                )
                              }
                            >
                              <VisibilityIcon fontSize="small" />
                            </button>
                          </Tooltip>
                        ) : (
                          <span className="text-muted small">-</span>
                        )}
                      </td>
                      <td className="pe-4 text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Tooltip title="Edit" className="text-primary">
                            <button
                              className="action-btn edit"
                              onClick={() => onEdit(career)}
                            >
                              <EditIcon fontSize="small" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete" className="text-danger">
                            <button
                              className="action-btn delete"
                              onClick={() => onDelete(career._id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}
      </div>


      <style>{`
        .text-orange { color: #f97316; }
      `}</style>

      {/* Image Preview Modal */}
      {showPreview && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={() => setShowPreview(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content border-0 shadow-lg overflow-hidden"
              style={{ borderRadius: "16px" }}
            >
              <div className="modal-body p-0 position-relative">
                <button
                  className="btn-close position-absolute top-0 end-0 m-3 bg-white shadow-sm"
                  onClick={() => setShowPreview(false)}
                  style={{ opacity: 1, zIndex: 10 }}
                ></button>
                <SecureImage
                  src={formatImageUrl(previewImage)}
                  alt={previewTitle}
                  className="w-100 d-block"
                  style={{ maxHeight: "80vh", objectFit: "contain" }}
                />
                <div className="p-3 bg-white text-center border-top">
                  <h6 className="fw-bold mb-0">{previewTitle}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
