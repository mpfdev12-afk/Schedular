import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrgBranding } from "../../context/OrgBrandingContext";
import "./OrgPortal.scss";

function OrgInitials({ name }) {
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";
  return <div className="org-portal__initials">{initials}</div>;
}

export default function OrgPortal() {
  const { branding } = useOrgBranding();

  const orgName = branding?.name || "Your Organisation";
  const orgLogo = branding?.logo;
  const slug = branding?.slug;
  const ssoEnabled = branding?.ssoConfig?.enabled;

  // Build SSO URL only when SSO is actually configured for this org
  const ssoUrl = ssoEnabled && slug
    ? `${import.meta.env.VITE_API_URL}/v1/sso/saml/login/${slug}`
    : null;

  return (
    <div className="org-portal">
      {/* Ambient background using org primary color */}
      <div className="org-portal__glow" />

      <motion.div
        className="org-portal__card"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="org-portal__logo-wrap">
          {orgLogo ? (
            <img
              src={orgLogo}
              alt={`${orgName} logo`}
              className="org-portal__logo-img"
            />
          ) : (
            <OrgInitials name={orgName} />
          )}
        </div>

        {/* Greeting */}
        <div className="org-portal__text">
          <p className="org-portal__eyebrow">Employee Wellness Portal</p>
          <h1 className="org-portal__heading">
            Welcome to<br />
            <span className="org-portal__org-name">{orgName}</span>
          </h1>
          <p className="org-portal__sub">
            Sign in to access your personalised wellness dashboard, sessions, and tools.
          </p>
        </div>

        {/* Actions */}
        <div className="org-portal__actions">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/user/login" className="org-portal__btn org-portal__btn--primary">
              Sign In
            </Link>
          </motion.div>

          {ssoUrl && (
            <>
              <div className="org-portal__divider">
                <span>or</span>
              </div>
              <motion.a
                href={ssoUrl}
                className="org-portal__btn org-portal__btn--sso"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Continue with {orgName} SSO
              </motion.a>
            </>
          )}
        </div>

        {/* Powered by */}
        <p className="org-portal__footer">
          Powered by{" "}
          <a href="https://fmpire.in" target="_blank" rel="noopener noreferrer">
            Fmpire
          </a>
        </p>
      </motion.div>
    </div>
  );
}
