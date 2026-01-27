import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const teacherName = localStorage.getItem("teacherName");
  const isAdmin = localStorage.getItem("admin") === "true";

  // Admin-only pages
  if (role === "admin" && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Faculty-only pages
  if (role === "faculty" && !teacherName) {
    return <Navigate to="/login" replace />;
  }

  // Any authenticated user
  if (!role && !teacherName && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}