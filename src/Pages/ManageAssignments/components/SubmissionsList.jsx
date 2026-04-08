import React, { useState, useEffect } from "react";
import { Table, Form, Button, Pagination, Badge, Card, Row, Col } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import TablePlaceholder from "../../../component/TablePlaceholder";
import api from "../../../api/axios";
import ReviewSubmissionModal from "./ReviewSubmissionModal";
import Swal from "sweetalert2";
import { formatImageUrl } from "../../../utils/ImageUrlFormat";

const SubmissionsList = ({ assignment, onBack }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  const [reviewModalShow, setReviewModalShow] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/assignments/${assignment._id}/submissions`, {
        params: {
          page: currentPage,
          limit: 15,
          search: searchTerm,
          status: filterStatus === "all" ? undefined : filterStatus,
        },
      });
      setData(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to load submissions", error);
      Swal.fire("Error", "Failed to load submissions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSubmissions();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, filterStatus, assignment._id]);

  const handleReviewClick = (submission) => {
    setSelectedSubmission(submission);
    setReviewModalShow(true);
  };

  const handleReviewSuccess = () => {
    loadSubmissions();
    setReviewModalShow(false);
    setSelectedSubmission(null);
  };

  const handleImageError = (submissionId) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [submissionId]: true,
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return <Badge bg="success-subtle" className="text-success border border-success-subtle px-3 py-2 rounded-pill">Accepted</Badge>;
      case "reupload":
        return <Badge bg="danger-subtle" className="text-danger border border-danger-subtle px-3 py-2 rounded-pill">Reupload</Badge>;
      default:
        return <Badge bg="warning-subtle" className="text-warning border border-warning-subtle px-3 py-2 rounded-pill">Pending</Badge>;
    }
  };

  return (
    <div className="submissions-list-container animate__animated animate__fadeIn">
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button 
          variant="light" 
          onClick={onBack} 
          className="rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center border-0"
          style={{ width: "40px", height: "40px" }}
        >
          <ArrowBackIcon />
        </Button>
        <div>
          <h4 className="fw-bold mb-0 text-dark">Submissions</h4>
          <p className="text-muted small mb-0">Reviewing submissions for: <span className="text-primary fw-medium">{assignment.title}</span></p>
        </div>
      </div>

      {/* Toolbar */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="bg-white px-4 py-3 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="input-group" style={{ maxWidth: "350px" }}>
            <span className="input-group-text bg-light border-end-0 border-0 ps-3">
              <SearchIcon className="text-secondary" style={{ fontSize: "20px" }} />
            </span>
            <Form.Control
              type="text"
              placeholder="Search by student name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-light border-0 shadow-none py-2"
            />
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="small text-uppercase fw-bold text-secondary text-nowrap">Filter Status:</span>
            <Form.Select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-light border-0 shadow-none py-2"
              style={{ width: "160px" }}
            >
              <option value="all">All Submissions</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="reupload">Reupload</option>
            </Form.Select>
          </div>
        </div>

        <div className="table-responsive">
          <Table hover borderless className="align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 text-secondary small fw-bold text-uppercase">Student</th>
                <th className="py-3 text-secondary small fw-bold text-uppercase">Submission</th>
                <th className="py-3 text-secondary small fw-bold text-uppercase">Submission Date</th>
                <th className="py-3 text-secondary small fw-bold text-uppercase">Status</th>
                <th className="py-3 text-secondary small fw-bold text-uppercase">Marks</th>
                <th className="py-3 text-secondary small fw-bold text-uppercase">Remarks</th>
                <th className="px-4 py-3 text-secondary small fw-bold text-uppercase text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-0">
                    <TablePlaceholder />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No submissions found matching your criteria
                  </td>
                </tr>
              ) : (
                data.map((sub) => (
                  <tr key={sub._id}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                          <PersonIcon />
                        </div>
                        <div>
                          <p className="mb-0 fw-bold text-dark">{sub.studentId?.name || "Unknown Student"}</p>
                          <p className="mb-0 text-muted small">{sub.studentId?.rollNo || "-"} • {sub.studentId?.department || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      {sub.fileUrl ? (
                        <div 
                          className="bg-light border rounded p-2 d-inline-block cursor-pointer position-relative" 
                          onClick={() => handleReviewClick(sub)}
                          role="button"
                          title="Click to view submission"
                          style={{ 
                            height: "64px", 
                            width: "64px", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            overflow: "hidden"
                          }}
                        >
                          {imageLoadErrors[sub._id] ? (
                            <ImageIcon style={{ fontSize: "32px", color: "#999" }} />
                          ) : (
                            <img 
                              src={formatImageUrl(sub.fileUrl)} 
                              alt="Submission" 
                              style={{ 
                                height: "100%", 
                                width: "100%", 
                                objectFit: "cover", 
                                borderRadius: "3px" 
                              }}
                              onError={() => handleImageError(sub._id)}
                            />
                          )}
                        </div>
                      ) : sub.submissionLink ? (
                        <Badge 
                          bg="info" 
                          className="px-3 py-2 cursor-pointer text-decoration-none"
                          role="button"
                          title="Click to open submission link"
                          onClick={() => handleReviewClick(sub)}
                          style={{ fontSize: "11px" }}
                        >
                          <LinkIcon style={{ fontSize: "14px", marginRight: "4px", verticalAlign: "middle" }} />
                          Link Submitted
                        </Badge>
                      ) : (
                        <span className="text-muted small">No submission</span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-1 text-muted small">
                        <CalendarMonthIcon style={{ fontSize: "16px" }} />
                        {new Date(sub.submittedAt || sub.createdAt).toLocaleDateString('en-GB', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="py-3">{getStatusBadge(sub.status)}</td>
                    <td className="py-3">
                      <span className={`fw-bold ${sub.marks >= 40 ? "text-success" : "text-danger"}`}>
                        {sub.marks !== null && sub.marks !== undefined ? sub.marks : "-"}
                      </span>
                    </td>
                    <td className="py-3">
                      <p className="mb-0 text-truncate small text-muted" style={{ maxWidth: "200px" }} title={sub.reviewRemarks}>
                        {sub.reviewRemarks || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <Button 
                        variant="link" 
                        className="text-info p-1 border-0" 
                        onClick={() => handleReviewClick(sub)}
                      >
                        <RateReviewIcon style={{ fontSize: "20px" }} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center py-4 border-top">
            <Pagination className="mb-0">
              <Pagination.Prev 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(prev => prev - 1)} 
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item 
                  key={index + 1} 
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(prev => prev + 1)} 
              />
            </Pagination>
          </div>
        )}
      </Card>

      <ReviewSubmissionModal
        show={reviewModalShow}
        onHide={() => setReviewModalShow(false)}
        submission={selectedSubmission}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
};

export default SubmissionsList;
