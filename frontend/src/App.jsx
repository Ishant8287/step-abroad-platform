import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { getToken } from "./lib/auth";
import ApplicationsPage from "./pages/ApplicationsPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProgramsPage from "./pages/ProgramsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import UniversitiesPage from "./pages/UniversitiesPage";

function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="universities" element={<UniversitiesPage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
      </Route>
    </Routes>
  );
}
