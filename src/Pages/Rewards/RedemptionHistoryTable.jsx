import { Table, Form, Pagination, Button } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import PersonIcon from "@mui/icons-material/Person";
import StarsIcon from "@mui/icons-material/Stars";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TimerIcon from "@mui/icons-material/Timer";
import TablePlaceholder from "../../component/TablePlaceholder";

export default function RedemptionHistoryTable({
  data,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchChange,
  limit,
  onLimitChange,
  onExport,
  onFulfill,
  activeTab,
  filterCollege,
  onFilterChange,
}) {
  const isFulfilledTab = activeTab === "fulfilled";
  return (
    <>
      <div className="toolbar-card mb-3">
        <div className="position-relative" style={{ width: "320px" }}>
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
            <SearchIcon style={{ fontSize: "18px" }} />
          </div>
          <Form.Control
            type="text"
            placeholder="Search by student or reward..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input ps-5"
          />
        </div>

        <div className="ms-auto d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="toolbar-label">CAMPUS:</span>
            <Form.Select
              value={filterCollege}
              onChange={(e) => onFilterChange(e.target.value)}
              className="filter-select"
              style={{ width: "auto", minWidth: "150px" }}
            >
              <option value="">All Campuses</option>
              <option value="KCE">KCE</option>
              <option value="KIT">KIT</option>
              <option value="KAHE">KAHE</option>
            </Form.Select>
          </div>

          <div className="toolbar-separator"></div>

          <div className="d-flex align-items-center gap-2">
            <span className="toolbar-label">LIMIT:</span>
            <Form.Select
              value={limit}
              onChange={(e) => onLimitChange(e.target.value)}
              className="filter-select"
              style={{ width: "auto", minWidth: "80px" }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Form.Select>
          </div>

          <button
            onClick={onExport}
            className="export-btn export-btn-excel"
            title="Export to Excel"
          >
            <FileDownloadIcon style={{ fontSize: "18px" }} />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {loading ? (
        <TablePlaceholder />
      ) : (
        <>
          <div className="modern-card table-responsive">
            <Table className="custom-table mb-0 align-middle">
              <thead>
                <tr>
                  <th className="ps-4" style={{ width: "25%" }}>
                    Student
                  </th>
                  <th style={{ width: "25%" }}>Reward Item</th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Points
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Date
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Status
                  </th>
                  {!isFulfilledTab && (
                    <th className="text-end pe-4" style={{ width: "15%" }}>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item._id} className="align-middle">
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="p-2 rounded-circle bg-light d-flex align-items-center justify-content-center"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <PersonIcon
                              sx={{ color: "#64748b", fontSize: 20 }}
                            />
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {item.studentId.name}
                            </div>
                            <div className="text-muted small">
                              {item.studentId.rollNo} •{" "}
                              {item.studentId.department} •{" "}
                              {item.studentId.batch}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold text-primary">
                          {item.rewardId.name}
                        </div>
                        <div className="text-muted small">
                          {item.rewardId.category} • ID:{" "}
                          {item.rewardId._id.substring(0, 8)}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center gap-1">
                          <StarsIcon
                            sx={{
                              color: "#FFD700",
                              fontSize: 24,
                              filter:
                                "drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))",
                              animation: "pulse 2s infinite ease-in-out",
                            }}
                          />
                          <span
                            style={{
                              fontWeight: "800",
                              fontSize: "1.1rem",
                              background:
                                "linear-gradient(45deg, #FFD700, #FFA500)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              textShadow: "0 0 10px rgba(255, 215, 0, 0.3)",
                            }}
                          >
                            {item.rewardId.pointsCost}
                          </span>
                        </div>
                      </td>
                      <td className="text-center text-muted small">
                        {item.redeemedAt
                          ? new Date(item.redeemedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="text-center">
                        {item.status === "fulfilled" ? (
                          <span className="badge bg-success-soft text-success px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1">
                            <CheckCircleOutlineIcon
                              style={{ fontSize: "14px" }}
                            />
                            FULFILLED
                          </span>
                        ) : (
                          <span className="badge bg-warning-soft text-warning px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1">
                            <TimerIcon style={{ fontSize: "14px" }} />
                            PENDING
                          </span>
                        )}
                      </td>
                      {!isFulfilledTab && (
                        <td className="pe-4 text-end">
                          {item.status !== "fulfilled" && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="color-bg border-0 rounded-pill px-3"
                              onClick={() => onFulfill(item._id)}
                            >
                              Mark Fulfilled
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={isFulfilledTab ? "5" : "6"}
                      className="text-center py-5"
                    >
                      <div className="d-flex flex-column align-items-center">
                        <h6 className="text-secondary fw-bold mb-1">
                          No redemptions found
                        </h6>
                        <p className="text-muted small">
                          All student redemptions will appear here.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => onPageChange(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </>
  );
}
