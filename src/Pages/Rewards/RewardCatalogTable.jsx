import { useState } from "react";
import { Table, Form, Pagination, Placeholder } from "react-bootstrap";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import StarsIcon from "@mui/icons-material/Stars";
import InventoryIcon from "@mui/icons-material/Inventory";
import FileDownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import TablePlaceholder from "../../component/TablePlaceholder";
import SecureImage from "../../component/SecureImage";
import { formatImageUrl } from "../../utils/ImageUrlFormat";

const RewardRow = ({ reward, onEdit, onDelete }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(!reward.imageUrl);

  return (
    <>
      <tr className="align-middle" style={{ display: isImageLoaded ? "table-row" : "none" }}>
        <td className="ps-4 py-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="p-1 rounded bg-light d-flex align-items-center justify-content-center overflow-hidden"
              style={{ width: "40px", height: "40px" }}
            >
              {reward.imageUrl ? (
                <SecureImage
                  src={formatImageUrl(reward.imageUrl)}
                  alt={reward.name}
                  className="w-100 h-100 object-fit-cover"
                  onImageLoaded={() => setIsImageLoaded(true)}
                />
              ) : (
                <InventoryIcon sx={{ color: "#f3773a", fontSize: 20 }} />
              )}
            </div>
            <div className="fw-bold text-dark">{reward.name}</div>
          </div>
        </td>
        <td>
          <div className="d-flex align-items-center gap-2 text-muted small fw-bold">
            <CategoryIcon style={{ fontSize: "14px" }} />
            {reward.category}
          </div>
        </td>
        <td className="text-center">
          <span
            className="modern-badge d-inline-flex align-items-center gap-2 px-3 py-1"
            style={{
              backgroundColor: "#fff7ed",
              color: "#c2410c",
              border: "1px solid #ffedd5",
              borderRadius: "20px",
              fontWeight: "700",
              fontSize: "0.8rem",
            }}
          >
            <StarsIcon style={{ fontSize: "14px" }} />
            {reward.pointsCost}
          </span>
        </td>
        <td className="text-center">
          <span
            className={`fw-bold ${reward.stock < 5 ? "text-danger" : "text-success"}`}
            style={{ fontSize: "0.9rem" }}
          >
            {reward.stock} Units
          </span>
        </td>
        <td className="pe-4 text-end">
          <div className="d-flex justify-content-end gap-1">
            <Tooltip title="Edit">
              <button
                className="action-btn edit text-primary"
                onClick={() => onEdit(reward)}
              >
                <EditIcon fontSize="small" />
              </button>
            </Tooltip>
            <Tooltip title="Delete">
              <button
                className="action-btn delete text-danger"
                onClick={() => onDelete(reward._id, reward.name)}
              >
                <DeleteIcon fontSize="small" />
              </button>
            </Tooltip>
          </div>
        </td>
      </tr>
      {!isImageLoaded && (
        <tr>
          <td className="ps-4 py-3">
            <div className="d-flex align-items-center gap-3">
              <Placeholder as="div" animation="glow" style={{ width: "40px", height: "40px" }} className="rounded">
                <Placeholder xs={12} className="w-100 h-100" />
              </Placeholder>
              <Placeholder as="div" animation="glow" className="w-50">
                <Placeholder xs={8} />
              </Placeholder>
            </div>
          </td>
          <td>
             <Placeholder as="div" animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
          </td>
          <td className="text-center">
             <Placeholder as="div" animation="glow">
                <Placeholder xs={4} />
              </Placeholder>
          </td>
          <td className="text-center">
             <Placeholder as="div" animation="glow">
                <Placeholder xs={4} />
              </Placeholder>
          </td>
          <td className="pe-4 text-end">
             <Placeholder as="div" animation="glow">
                <Placeholder xs={4} />
              </Placeholder>
          </td>
        </tr>
      )}
    </>
  );
};

export default function RewardCatalogTable({
  data,
  loading,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchChange,
  limit,
  onLimitChange,
  onExport,
}) {
  const handleDeleteClick = (id, name) => {
    Swal.fire({
      title: "Confirm Delete",
      text: `Are you sure you want to delete "${name}" from the catalog?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await onDelete(id);
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  // console.log(data);

  return (
    <>
      <div className="toolbar-card mb-3">
        <div className="position-relative" style={{ width: "320px" }}>
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
            <SearchIcon style={{ fontSize: "18px" }} />
          </div>
          <Form.Control
            type="text"
            placeholder="Search by name, category..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input ps-5"
          />
        </div>

        <div className="ms-auto d-flex align-items-center gap-3">
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
                  <th className="ps-4" style={{ width: "35%" }}>
                    Reward Item
                  </th>
                  <th style={{ width: "20%" }}>Category</th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Cost
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Stock
                  </th>
                  <th className="text-end pe-4" style={{ width: "15%" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((reward) => (
                    <RewardRow
                      key={reward._id}
                      reward={reward}
                      onEdit={onEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="d-flex flex-column align-items-center">
                        <h6 className="text-secondary fw-bold mb-1">
                          No rewards found
                        </h6>
                        <p className="text-muted small">
                          Try adjusting your search criteria.
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
