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
    }));
    closeModal();
  };

  if (loading) {
    return (
      <div style={{ padding: "80px", textAlign: "center" }}>Loading...</div>
    );
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
    ? `http://localhost:5000/${achievement.evidenceImage}`
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
              <img
                src={imageUrl}
                alt="Evidence"
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                  borderRadius: "16px",
                  marginTop: "10px",
                }}
              />
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
                : "Reject Submission?"}
            </h3>

            <p
              style={{
                fontSize: "15px",
                color: "#6e6e73",
                marginBottom: "40px",
                lineHeight: "1.6",
              }}
            >
              This action cannot be undone. Are you sure you want to{" "}
              {actionType === "accept" ? "approve" : "reject"} this achievement?
            </p>

            <div
              style={{ display: "flex", justifyContent: "center", gap: "18px" }}
            >
              <button
                onClick={closeModal}
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
                style={{
                  padding: "12px 28px",
                  borderRadius: "999px",
                  border: "none",
                  backgroundColor:
                    actionType === "accept" ? "#f97316" : "#d93025",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow:
                    actionType === "accept"
                      ? "0 6px 20px rgba(249,115,22,0.35)"
                      : "0 6px 20px rgba(217,48,37,0.35)",
                }}
              >
                Confirm
              </button>
            </div>
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
