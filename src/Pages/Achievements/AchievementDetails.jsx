import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmojiEventsIcon from "@mui/icons-material/EmojiEventsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../../api/axios";
import AchievementDetailsPlaceholder, { SkeletonBox } from "../../component/AchievementDetailsPlaceholder";

export default function AchievementDetails() {
  const [processing, setProcessing] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(false);
  const { achievementInfo } = useParams();
  const navigate = useNavigate();

  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const res = await api.get(`/rewards/submission/${achievementInfo}`);
        setAchievement(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAPI();
  }, [achievementInfo]);

  const confirmAction = async () => {
    if (actionType === "reject" && !rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      setProcessing(true);

      if (actionType === "delete") {
        await api.delete(`/rewards/submission/${achievementInfo}`);
        // No achievement update needed for delete as we will redirect
      } else {
        const statusValue = actionType === "accept" ? "approved" : "rejected";
        const payload = {
          status: statusValue,
        };

        if (actionType === "reject") {
          payload.reason = rejectionReason;
        }

        await api.patch(`/rewards/verify/${achievementInfo}`, payload);

        setAchievement((prev) => ({
          ...prev,
          status: statusValue,
        }));
      }

      setApiSuccess(true);
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  const openModal = (type) => {
    setActionType(type);
    setRejectionReason("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActionType("");
    setRejectionReason("");
  };


  if (loading) {
   return <AchievementDetailsPlaceholder/>
  }

  if (!achievement) {
    return (
      <div style={{ padding: "80px", textAlign: "center" }}>No data found</div>
    );
  }




  const statusColors = {
    pending: { bg: "#fff4ec", text: "#f97316" },
    approved: { bg: "#e6f7ee", text: "#1e7e34" },
    rejected: { bg: "#fdecec", text: "#d93025" },
  };

  const statusStyle = statusColors[achievement.status] || statusColors.pending;

  const imageUrl = achievement.evidenceImage
    ? `${import.meta.env.VITE_IMAGE_BASE_URL}/${achievement.evidenceImage}`
    : null;


  return (
    <>
      <div style={{ minHeight: "100vh", padding: "20px 100px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "none",
            color: "#6e6e73",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
            marginBottom: "40px",
            cursor: "pointer",
          }}
        >
          <ArrowBackIcon fontSize="small" />
          Back
        </button>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
          }}
        >
          <EmojiEventsIcon style={{ fontSize: "44px", color: "#f97316" }} />
          <h1 style={{ marginTop: "20px", fontSize: "32px" }}>
            {achievement.title}
          </h1>

          <p style={{ color: "#6e6e73", marginBottom: "40px" }}>
            Submitted on {new Date(achievement.createdAt).toDateString()}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              marginBottom: "40px",
            }}
          >
            <Info label="Student Name" value={achievement.studentId?.name} />
            <Info
              label="Roll Number"
              value={achievement.studentId?.rollNo || "-"}
            />
            <Info
              label="Department"
              value={achievement.studentId?.department}
            />
            <Info label="College" value={achievement.studentId?.collegeName} />
            <Info label="Category" value={achievement.category} />
            <Info label="Points Awarded" value={achievement.pointsAwarded} />

            <div>
              <Label>Status</Label>
              <div
                style={{
                  padding: "6px 18px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 600,
                  display: "inline-block",
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.text,
                  textTransform: "uppercase",
                }}
              >
                {achievement.status}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <Label>Description</Label>
            <p style={{ marginTop: "8px" }}>{achievement.description}</p>
          </div>

          {imageUrl && (
            <div style={{ marginBottom: "50px" }}>
              <Label>Evidence</Label>
              {imageLoading && (
                <div style={{ marginTop: "10px" }}>
                  <SkeletonBox height="400px" width="100%" radius="16px" />
                </div>
              )}
              <img
                src={imageUrl}
                alt="Evidence"
                onLoad={() => setImageLoading(false)}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                  borderRadius: "16px",
                  marginTop: "10px",
                  display: imageLoading ? "none" : "block",
                }}
              />
              {!imageLoading && (
                <div style={{ marginTop: "15px" }}>
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#f97316",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    View Full Image →
                  </a>
                </div>
              )}
            </div>
          )}

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}
          >
            <button
              disabled={achievement.status !== "pending"}
              onClick={() => openModal("accept")}
              style={{
                padding: "12px 28px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: "#f97316",
                color: "#fff",
                fontWeight: 600,
                opacity: achievement.status !== "pending" ? 0.4 : 1,
                cursor: "pointer",
              }}
            >
              Accept
            </button>

            <button
              disabled={achievement.status !== "pending"}
              onClick={() => openModal("reject")}
              style={{
                padding: "12px 28px",
                borderRadius: "999px",
                border: "1px solid #d2d2d7",
                backgroundColor: "#fff",
                fontWeight: 600,
                opacity: achievement.status !== "pending" ? 0.4 : 1,
                cursor: "pointer",
              }}
            >
              Reject
            </button>


            <button
              onClick={() => openModal("delete")}
              style={{
                padding: "12px 28px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: "#d93025",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "28px",
              padding: "50px 40px",
              width: "420px",
              textAlign: "center",
              boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
            }}
          >
            {!apiSuccess ? (
              <>
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    marginBottom: "16px",
                    color: "#1d1d1f",
                  }}
                >
                  {actionType === "accept"
                    ? "Approve Submission?"
                    : actionType === "reject"
                    ? "Reject Submission?"
                    : "Delete Submission?"}
                </h3>

                <p
                  style={{
                    fontSize: "15px",
                    color: "#6e6e73",
                    marginBottom: actionType === "accept" ? "40px" : "20px",
                    lineHeight: "1.6",
                  }}
                >
                  Are you sure you want to{" "}
                  {actionType === "accept"
                    ? "approve"
                    : actionType === "reject"
                    ? "reject"
                    : "delete"}{" "}
                  this submission?
                </p>

                {actionType === "reject" && (
                  <textarea
                    placeholder="Reason for rejection required..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    style={{
                      width: "100%",
                      height: "100px",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid #d2d2d7",
                      marginBottom: "30px",
                      fontSize: "14px",
                      resize: "none",
                      outline: "none",
                    }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "18px",
                  }}
                >
                  <button
                    onClick={closeModal}
                    disabled={processing}
                    style={{
                      padding: "12px 28px",
                      borderRadius: "999px",
                      border: "1px solid #d2d2d7",
                      backgroundColor: "#ffffff",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmAction}
                    disabled={processing}
                    style={{
                      padding: "12px 28px",
                      borderRadius: "999px",
                      border: "none",
                      backgroundColor:
                        actionType === "accept"
                          ? "#f97316"
                          : "#d93025",
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: "pointer",
                      opacity: processing ? 0.6 : 1,
                    }}
                  >
                    {processing ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    marginBottom: "16px",
                    color: "#1d1d1f",
                  }}
                >
                  Success 🎉
                </h3>

                <p
                  style={{
                    fontSize: "15px",
                    color: "#6e6e73",
                    marginBottom: "40px",
                  }}
                >
                  Submission has been {actionType === "delete" ? "DELETED" : achievement.status.toUpperCase()}{" "}
                  successfully.
                </p>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setApiSuccess(false);
                    navigate(-1);
                  }}
                  style={{
                    padding: "12px 28px",
                    borderRadius: "999px",
                    border: "none",
                    backgroundColor: "#f97316",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const Label = ({ children }) => (
  <div style={{ fontSize: "13px", color: "#6e6e73", marginBottom: "6px" }}>
    {children}
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <Label>{label}</Label>
    <div style={{ fontSize: "16px", fontWeight: 500 }}>{value}</div>
  </div>
);
