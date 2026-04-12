import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrgBranding } from "../../context/OrgBrandingContext";
import Loader from "../../components/Loader/Loader";

/**
 * DiscoveryGateway [/p/:slug]
 * 
 * This is the entry point for B2B Pilots. 
 * It extracts the organization slug from the URL, triggers the 
 * branding fetch in the global context, and redirects to the 
 * branded login experience.
 */
export default function DiscoveryGateway() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { branding, fetchBySlug, loading } = useOrgBranding();

  useEffect(() => {
    if (slug) {
      console.log(`[Pilot Discovery] Initializing gateway for: ${slug}`);
      fetchBySlug(slug).then((org) => {
        if (org) {
          console.log(`[Pilot Discovery] Branding applied for ${org.name}. Redirecting...`);
          // Smooth delay to show some discovery excitement (optional)
          setTimeout(() => {
            navigate("/user/login");
          }, 800);
        } else {
            console.error(`[Pilot Discovery] No organization found for slug: ${slug}`);
            navigate("/"); // Fallback to main landing
        }
      });
    }
  }, [slug, navigate, fetchBySlug]);

  return (
    <div className="discovery-gateway" style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f8fafc' 
    }}>
      <Loader />
      <div style={{ marginTop: 20, color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>
        Preparing your wellness workspace...
      </div>
    </div>
  );
}
