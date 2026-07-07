import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import RoleSelect from "./pages/RoleSelect";

// Client
import ClientLayout from "./pages/client/ClientLayout";
import ClientRegister from "./pages/client/ClientRegister";
import ClientLogin from "./pages/client/ClientLogin";
import ClientCompleteProfile from "./pages/client/ClientCompleteProfile";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientProfile from "./pages/client/ClientProfile";
import ClientPostProject from "./pages/client/ClientPostProject";
import ClientMessages from "./pages/client/ClientMessages";

// Freelancer
import FreelancerRegister from "./pages/freelancer/FreelancerRegister";
import FreelancerLogin from "./pages/freelancer/FreelancerLogin";
import FreelancerCompleteProfile from "./pages/freelancer/FreelancerCompleteProfile";
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";

function App() {
    return (
        <AuthProvider>
            <Routes>

                {/* Home */}
                <Route path="/" element={<RoleSelect />} />

                {/* Client Authentication */}
                <Route path="/client/register" element={<ClientRegister />} />
                <Route path="/client/login" element={<ClientLogin />} />

                <Route
                    path="/client/complete-profile"
                    element={
                        <ProtectedRoute role="CLIENT">
                            <ClientCompleteProfile />
                        </ProtectedRoute>
                    }
                />

                {/* Client Dashboard Layout */}
                <Route
                    path="/client"
                    element={
                        <ProtectedRoute
                            role="CLIENT"
                            requireProfileComplete
                        >
                            <ClientLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        index
                        element={<Navigate to="dashboard" replace />}
                    />

                    <Route
                        path="dashboard"
                        element={<ClientDashboard />}
                    />

                    <Route
                        path="profile"
                        element={<ClientProfile />}
                    />

                    <Route
                        path="post-project"
                        element={<ClientPostProject />}
                    />

                    <Route
                        path="messages"
                        element={<ClientMessages />}
                    />
                </Route>

                {/* Freelancer */}
                <Route
                    path="/freelancer/register"
                    element={<FreelancerRegister />}
                />

                <Route
                    path="/freelancer/login"
                    element={<FreelancerLogin />}
                />

                <Route
                    path="/freelancer/complete-profile"
                    element={
                        <ProtectedRoute role="FREELANCER">
                            <FreelancerCompleteProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/freelancer/dashboard"
                    element={
                        <ProtectedRoute
                            role="FREELANCER"
                            requireProfileComplete
                        >
                            <FreelancerDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Unknown Route */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </AuthProvider>
    );
}

export default App;