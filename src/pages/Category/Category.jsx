import React, { useEffect, useMemo, useState } from "react";
import "./Category.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MentalIcon,
  PhysicalIcon,
  FinancialIcon,
  DetoxIcon,
} from "../../components/DomainIcons/DomainIcons";
import { FEATURES } from "../../config/featureFlags";

const Category = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedStreak = parseInt(localStorage.getItem("zen_streak") || "0", 10);
    setStreak(Number.isNaN(savedStreak) ? 0 : savedStreak);
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const firstName = useMemo(() => {
    const rawName = user?.fullname || user?.fullName || user?.name || "";
    return rawName.trim() ? rawName.trim().split(" ")[0] : "there";
  }, [user]);

  const mainCards = useMemo(
    () => [
      {
        key: "mental",
        title: "Mental",
        subtitle: "Mind & Peace",
        path: "mental",
        className: "mental",
        icon: <MentalIcon />,
      },
      {
        key: "physical",
        title: "Physical",
        subtitle: "Body & Vitality",
        path: "physical",
        className: "physical",
        icon: <PhysicalIcon />,
      },
      {
        key: "financial",
        title: "Financial",
        subtitle: "Wealth & Growth",
        path: "financial",
        className: "financial",
        icon: <FinancialIcon />,
      },
    ],
    [],
  );

  const onNav = (path) => {
    navigate(path);
  };

  return (
    <div className="Category">
      <div className="category-hero">
        <div className="hero-topline">
          <span className="hero-eyebrow">Your wellness hub</span>
          <div
            className="streak-pill"
            aria-label={`Current streak ${streak} days`}
          >
            <span className="streak-icon">🔥</span>
            <span>{streak}-day streak</span>
          </div>
        </div>
        <div className="welcome-text">
          {greeting}, {firstName}
        </div>
        <div className="hero-desc">
          Choose the path that fits your energy today — build momentum across
          mind, body, money, and calm.
        </div>
      </div>

      <div className="category-grid">
        {mainCards.map((card) => (
          <div
            key={card.key}
            onClick={() => onNav(card.path)}
            className={`category-card ${card.className} glass-card`}
          >
            {card.icon}
            <span>{card.title}</span>
            <span className="cat-subtitle">{card.subtitle}</span>
          </div>
        ))}

        {FEATURES.DETOX_MODE && (
          <div
            onClick={() => onNav("/detox")}
            className="category-card mindfulness glass-card"
          >
            <DetoxIcon />
            <span>Detox Mode</span>
            <span className="cat-subtitle">Calm & Reset</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
