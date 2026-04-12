import React, { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchDataFromApi } from "../utils/api";
import { FEATURES } from "../config/featureFlags";

const OrgBrandingContext = createContext(null);

/**
 * Converts a hex color to an rgba string with the given opacity.
 */
function hexToRgba(hex, alpha = 0.1) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(79, 70, 229, ${alpha})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Dynamically loads a Google Font by injecting a <link> tag.
 * Reuses an existing tag if already present to avoid duplicates.
 */
function loadGoogleFont(fontFamily) {
  const id = "org-branding-font";
  let link = document.getElementById(id);
  if (!link) {
    link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  const encoded = encodeURIComponent(fontFamily).replace(/%20/g, "+");
  link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;500;600;700&display=swap`;
}

/**
 * Injects (or updates) a <style> tag that applies org border-radius
 * to all common card and button surfaces across the app.
 * This is needed because SCSS compiles border-radius to hardcoded values —
 * setting --org-border-radius alone isn't enough.
 */
function applyBorderRadiusOverrides() {
  const id = "org-branding-overrides";
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement("style");
    style.id = id;
    document.head.appendChild(style);
  }
  style.textContent = `
    /* Org White-Label: border-radius overrides */
    .glass-card,
    .card,
    [class*="-card"]:not([class*="icon"]):not([class*="avatar"]),
    [class*="card-"]:not([class*="icon"]):not([class*="avatar"]),
    .setup-primary-btn,
    .primary-btn,
    .secondary-btn,
    .login-submit-btn,
    .btn-generate,
    .btn-join {
      border-radius: var(--org-border-radius) !important;
    }
  `;
}

/**
 * Applies org branding CSS custom properties to :root,
 * loads the correct Google Font, and injects border-radius overrides.
 */
function applyBrandingToDOM(org) {
  const root = document.documentElement;
  const color = org?.branding?.primaryColor || org?.primaryColor;
  const fontFamily = org?.branding?.fontFamily;
  const borderRadius = org?.branding?.borderRadius;

  if (color) {
    root.style.setProperty("--org-primary", color);
    root.style.setProperty("--org-primary-light", hexToRgba(color, 0.1));
    root.style.setProperty("--accent-glow", hexToRgba(color, 0.4));
  }

  if (fontFamily) {
    root.style.setProperty("--org-font-family", `'${fontFamily}', sans-serif`);
    loadGoogleFont(fontFamily);
  }

  if (borderRadius !== undefined) {
    root.style.setProperty("--org-border-radius", `${borderRadius}px`);
    applyBorderRadiusOverrides();
  }
}

/**
 * Two-path branding resolution:
 *
 * Path A — Subdomain detection ({slug}.fmpire.in / {slug}.fmpire.com)
 *   Fetches public branding for the slug. Works for unauthenticated users on white-label domains.
 *
 * Path B — Authenticated org member on any domain
 *   If user is logged in and has an organizationId, fetches their org's branding via
 *   GET /org/branding/me (auth'd endpoint). This is how employees on the main
 *   domain see the color pushed by their HR admin.
 */
export function OrgBrandingProvider({ children }) {
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);

  // Helper to fetch branding by slug publicly (e.g. for Discovery Gateway)
  const fetchBySlug = async (slug) => {
    if (!FEATURES.B2B_MODE || !slug) return;
    try {
      setLoading(true);
      const res = await fetchDataFromApi(`/org/branding/${slug}`);
      const org = res?.data;
      if (org) {
        setBranding(org);
        applyBrandingToDOM(org);
        return org;
      }
    } catch (err) {
      console.warn(`Public branding fetch failed for slug: ${slug}`);
    } finally {
      setLoading(false);
    }
  };

  // Exposed helper to refresh branding (useful after admin updates branding)
  const refreshBranding = async () => {
    if (!FEATURES.B2B_MODE) return;
    if (!user?._id || !user?.organizationId) return;
    try {
      setLoading(true);
      const res = await fetchDataFromApi("/org/branding/me");
      const org = res?.data;
      if (org) {
        setBranding(org);
        applyBrandingToDOM(org);
      }
    } catch (err) {
      // Silent failure — keep previous branding if any
    } finally {
      setLoading(false);
    }
  };

  // ─── Path A: White-label detection (Subdomain + Path Slug) ───
  useEffect(() => {
    if (!FEATURES.B2B_MODE) return;

    const hostname = window.location.hostname;
    const path = window.location.pathname;
    const reservedSubdomains = ["app", "business", "console", "www", "admin"];
    
    // 1. Check Subdomain (slug.fmpire.com)
    const domainMatch = hostname.match(
      /^([^.]+)\.(fmpire\.in|fmpire\.com|localhost)$/,
    );
    
    let extractedSlug = null;
    if (domainMatch) {
      const subdomain = domainMatch[1];
      if (!reservedSubdomains.includes(subdomain.toLowerCase())) {
        extractedSlug = subdomain;
      }
    }

    // 2. Check Path Slug (/p/acme-corp) -> Higher priority for Pilots
    if (path.startsWith("/p/")) {
      const parts = path.split("/");
      if (parts[2]) extractedSlug = parts[2];
    }

    if (extractedSlug) {
      fetchBySlug(extractedSlug);
    }
  }, []);

  // ─── Path B: Authenticated employee on any domain ───
  useEffect(() => {
    if (!FEATURES.B2B_MODE) return;
    // Only run if user is logged in, has an org, and branding hasn't been set by Path A
    if (!user?._id || !user?.organizationId || branding) return;

    refreshBranding();
  }, [user?._id, user?.organizationId, branding]);

  return (
    <OrgBrandingContext.Provider
      value={{ 
        branding, 
        loading, 
        isWhiteLabel: !!branding, 
        refreshBranding,
        fetchBySlug
      }}
    >
      {children}
    </OrgBrandingContext.Provider>
  );
}

export function useOrgBranding() {
  return useContext(OrgBrandingContext);
}
