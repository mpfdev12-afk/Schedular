// ============================================================
// 🔌 FEATURE FLAGS — Plug & Play Control Center
// ============================================================
// Toggle any feature ON/OFF by setting true/false.
// Or simply comment out the line to disable.
// Everything behind a flag will gracefully disappear from:
//   → Routes, Sidebar tabs, Category page, Dashboard
// ============================================================

export const FEATURES = {
  // 🌿 Zen Zone — DEPRECATED: consolidated into Detox Mode
  ZEN_ZONE: false,

  // 🧘 Mindfulness Zone — DEPRECATED: consolidated into Detox Mode
  MINDFULNESS_ZONE: false,

  // 🧘‍♀️ Detox Mode — Full wellness toolkit (replaces Zen Zone + Mindfulness Zone)
  DETOX_MODE: true,

  // ============================================================
  // 🏢 B2B Features — all off by default, enable as built
  // ============================================================
  B2B_MODE: true,              // Master switch for all B2B functionality
  HR_CONSOLE: true,            // HR Admin Console UI
  ORG_LEADERBOARD: true,       // Org-scoped leaderboards
  CORPORATE_HEALTH: true,      // Health checkup campaigns
  WHITE_LABEL: true,           // Org branding/theming
};
