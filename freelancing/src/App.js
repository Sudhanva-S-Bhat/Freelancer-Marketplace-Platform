import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import RoleSelect from "./pages/RoleSelect";

import ClientRegister from "./pages/client/ClientRegister";
import ClientLogin from "./pages/client/ClientLogin";
import ClientCompleteProfile from "./pages/client/ClientCompleteProfile";
import ClientDashboard from "./pages/client/ClientDashboard";

import FreelancerRegister from "./pages/freelancer/FreelancerRegister";
import FreelancerLogin from "./pages/freelancer/FreelancerLogin";
import FreelancerCompleteProfile from "./pages/freelancer/FreelancerCompleteProfile";
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<RoleSelect />} />

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
                <Route
                    path="/client/dashboard"
                    element={
                        <ProtectedRoute role="CLIENT" requireProfileComplete>
                            <ClientDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="/freelancer/register" element={<FreelancerRegister />} />
                <Route path="/freelancer/login" element={<FreelancerLogin />} />
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
                        <ProtectedRoute role="FREELANCER" requireProfileComplete>
                            <FreelancerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
