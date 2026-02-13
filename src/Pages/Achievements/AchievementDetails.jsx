import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmojiEventsIcon from "@mui/icons-material/EmojiEventsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../../api/axios";

export default function AchievementDetails() {
  const { achievementInfo } = useParams();
  const navigate = useNavigate();

  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/rewards/submission/${achievementInfo}`);

        const item = res.data.data;

        const formatted = {
          _id: item.submissionId,
          name: item.name,
          rollNo: item.rollNo,
          rewardType: item.category,
          status: item.status?.toLowerCase() || "pending",
          title: item.title,
          description: item.description || "No description provided.",
          appliedDate: item.appliedDate || "N/A",
          approvedDate: item.approvedDate || null,
          proofLink: item.proofLink || "",
        };

        setAchievement(formatted);
      } catch (error) {
        console.error("Error fetching achievement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAPI();
  }, [achievementInfo]);

  const openModal = (type) => {
    setActionType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActionType("");
  };

  const confirmAction = () => {
    setAchievement((prev) => ({
      ...prev,
      status: actionType === "accept" ? "approved" : "rejected",
      approvedDate:
        actionType === "accept" ? new Date().toISOString().split("T")[0] : null,
    }));

    closeModal();
  };

  if (loading) {
    return (
      <div className="px-4 py-5 text-center">
        <h5>Loading achievement details...</h5>
      </div>
    );
  }

  if (!achievement) {
    return (
      <div className="px-4 py-5 text-center">
        <h5>No achievement found.</h5>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 px-lg-5 py-4">
        <div className="bg-white rounded-3 shadow-sm p-4">
          {/* Back Button */}
          <button
            className="btn btn-light mb-3 d-flex align-items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon fontSize="small" />
            Back
          </button>

          {/* Header */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <EmojiEventsIcon style={{ fontSize: "40px", color: "#f97316" }} />
            <div>
              <h4 className="fw-bold mb-1">{achievement.title}</h4>
              <span className="text-muted small">
                Applied on {achievement.appliedDate}
              </span>
            </div>
          </div>

          <hr />

          {/* Details */}
          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <h6 className="text-muted">Student Name</h6>
              <p className="fw-semibold">{achievement.name}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="text-muted">Roll No</h6>
              <p className="fw-semibold">{achievement.rollNo || "-"}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="text-muted">Reward Type</h6>
              <p className="fw-semibold">{achievement.rewardType}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="text-muted">Status</h6>
              <p className="fw-semibold text-uppercase">{achievement.status}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <h6 className="text-muted">Description</h6>
            <p className="text-secondary">{achievement.description}</p>
          </div>

          {/* Proof */}
          <div className="mt-4">
            <h6 className="text-muted">Proof Document</h6>
            <button
              className="px-3 py-1 rounded-3 border fw-medium"
              style={{
                borderColor: "#f97316",
                color: "#f97316",
                backgroundColor: "transparent",
              }}
            >
              View Certificate
            </button>
          </div>

          <hr className="my-4" />

          {/* Action Buttons */}
          <div className="d-flex justify-content-end gap-3">
            <button
              onClick={() => openModal("accept")}
              disabled={achievement.status !== "pending"}
              className="px-4 py-2 rounded-3 border-0 text-white fw-semibold"
              style={{
                backgroundColor: "#f97316",
                opacity: achievement.status !== "pending" ? 0.5 : 1,
              }}
            >
              Accept
            </button>

            <button
              onClick={() => openModal("reject")}
              disabled={achievement.status !== "pending"}
              className="px-4 py-2 rounded-3 border fw-semibold"
              style={{
                backgroundColor: "#f5f5f7",
                color: "#1d1d1f",
                borderColor: "#e5e5ea",
                opacity: achievement.status !== "pending" ? 0.5 : 1,
              }}
            >
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0"
              style={{
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
            >
              <div className="modal-header border-0">
                <h5 className="modal-title fw-semibold">
                  {actionType === "accept"
                    ? "Confirm Acceptance"
                    : "Confirm Rejection"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>

              <div className="modal-body pt-0">
                <p className="text-muted">
                  Are you sure you want to{" "}
                  {actionType === "accept" ? "accept" : "reject"} this
                  achievement?
                </p>
              </div>

              <div className="modal-footer border-0">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-3 border fw-semibold"
                  style={{
                    backgroundColor: "#f5f5f7",
                    color: "#1d1d1f",
                    borderColor: "#e5e5ea",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={confirmAction}
                  className="px-4 py-2 rounded-3 border-0 text-white fw-semibold"
                  style={{ backgroundColor: "#f97316" }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
