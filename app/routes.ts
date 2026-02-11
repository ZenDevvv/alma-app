import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

// PPP Office routes
const PPPRoutes: RouteConfig = [];

const authRoutes: RouteConfig = [
	route("/login", "routes/auth/login.tsx"),
	route("/register", "routes/auth/register.tsx"),
];

// Main routes
export default [
	index("routes/landing.tsx"),
	layout("layouts/auth-layout.tsx", authRoutes),
	layout("layouts/admin-layout.tsx", prefix("admin", [
		route("/", "routes/admin/dashboard.tsx"),
		route("/organizations", "routes/admin/organizations.tsx"),
		route("/org-admins", "routes/admin/org-admins.tsx"),
		route("/user-management", "routes/admin/user-management.tsx"),
		route("/announcements", "routes/admin/announcements.tsx"),
		route("/platform-analytics", "routes/admin/platform-analytics.tsx"),
		route("/activity-logs", "routes/admin/activity-logs.tsx"),
		route("/audit-logs", "routes/admin/audit-logs.tsx"),
		route("/feature-flags", "routes/admin/feature-flags.tsx"),
		route("/email-templates", "routes/admin/email-templates.tsx"),
		route("/maintenance", "routes/admin/maintenance.tsx"),
		route("/settings", "routes/admin/settings.tsx"),
	])),
] satisfies RouteConfig;
