import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmojiEventsIcon from "@mui/icons-material/EmojiEventsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function AchievementDetails() {
  const { achievementInfo } = useParams();
  const navigate = useNavigate();

  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Replace this with real API call later
  useEffect(() => {
    const mockData = {
      _id: achievementInfo,
      name: "STEVE",
      rollNo: "717822F222",
      rewardType: "Best Performer",
      status: "Applied",
      title: "Outstanding Academic Excellence",
      description:
        "Awarded for maintaining exceptional academic performance throughout the academic year.",
      appliedDate: "2025-02-01",
      approvedDate: null,
      proofLink: "certificate.pdf",
    };

    setTimeout(() => {
      setAchievement(mockData);
      setLoading(false);
    }, 500);
  }, [achievementInfo]);

  if (loading) {
    return (
      <div className="px-4 py-5 text-center">
        <h5>Loading achievement details...</h5>
      </div>
    );
  }

  return (
    <div className="px-4 px-lg-5 py-4">
      <div className="bg-white rounded-3 shadow-sm p-4">
        {/* Back Button */}
        <button className="btn btn-light mb-3" onClick={() => navigate(-1)}>
          <ArrowBackIcon fontSize="small" /> Back
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

        {/* Student Info */}
        <div className="row mt-4">
          <div className="col-md-6 mb-3">
            <h6 className="text-muted">Student Name</h6>
            <p className="fw-semibold">{achievement.name}</p>
          </div>

          <div className="col-md-6 mb-3">
            <h6 className="text-muted">Roll No</h6>
            <p className="fw-semibold">{achievement.rollNo}</p>
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

        {/* Proof Section */}
        <div className="mt-4">
          <h6 className="text-muted">Proof Document</h6>
          <button className="btn btn-outline-warning btn-sm">
            View Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
