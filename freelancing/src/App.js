import React, { useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
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
import ClientProjects from "./pages/client/ClientProjects";
import ClientProjectDetails from "./pages/client/ClientProjectDetails";
import ClientSearchFreelancers from "./pages/client/ClientSearchFreelancers";

// Freelancer
import FreelancerLayout from "./pages/freelancer/FreelancerLayout";
import FreelancerRegister from "./pages/freelancer/FreelancerRegister";
import FreelancerLogin from "./pages/freelancer/FreelancerLogin";
import FreelancerCompleteProfile from "./pages/freelancer/FreelancerCompleteProfile";
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import FreelancerBrowseProjects from "./pages/freelancer/FreelancerBrowseProjects";
import FreelancerBids from "./pages/freelancer/FreelancerBids";
import FreelancerMessages from "./pages/freelancer/FreelancerMessages";

// Aurora background — copied from lumina.html
function AuroraBackground() {
    return (
        <div className="aurora" aria-hidden="true">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />
        </div>
    );
}

// Full cursor system — copied exactly from lumina.html
function LuminaCursor() {
    const dotRef  = useRef(null);
    const ringRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const dot  = dotRef.current;
        const ring = ringRef.current;
        const glow = glowRef.current;
        if (!dot || !ring || !glow) return;

        const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
        if (!isFinePointer) return;

        document.body.classList.add('cursor-ready');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX  = mouseX;
        let ringY  = mouseY;
        let rafId;

        const onMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left    = e.clientX + 'px';
            dot.style.top     = e.clientY + 'px';
            dot.style.opacity = '1';
            ring.style.opacity = '1';
            glow.style.left   = e.clientX + 'px';
            glow.style.top    = e.clientY + 'px';
        };

        function cursorLoop() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            ring.style.left = ringX + 'px';
            ring.style.top  = ringY + 'px';
            rafId = requestAnimationFrame(cursorLoop);
        }
        cursorLoop();

        const hoverTargets = 'a, button, input, .role-card, .project-card, [data-nav]';
        const onOver = (e) => {
            if (e.target.closest(hoverTargets)) {
                dot.classList.add('is-hover');
                ring.classList.add('is-hover');
            }
        };
        const onOut = (e) => {
            if (e.target.closest(hoverTargets)) {
                dot.classList.remove('is-hover');
                ring.classList.remove('is-hover');
            }
        };
        const onDown = () => ring.classList.add('is-down');
        const onUp   = () => ring.classList.remove('is-down');
        const onLeave = () => { dot.style.opacity = '0'; ring.style.opacity = '0'; };

        window.addEventListener('mousemove',  onMove);
        document.addEventListener('mouseover',  onOver);
        document.addEventListener('mouseout',   onOut);
        document.addEventListener('mousedown',  onDown);
        document.addEventListener('mouseup',    onUp);
        document.addEventListener('mouseleave', onLeave);

        return () => {
            cancelAnimationFrame(rafId);
            document.body.classList.remove('cursor-ready');
            window.removeEventListener('mousemove',  onMove);
            document.removeEventListener('mouseover',  onOver);
            document.removeEventListener('mouseout',   onOut);
            document.removeEventListener('mousedown',  onDown);
            document.removeEventListener('mouseup',    onUp);
            document.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <>
            {/* Large radial glow */}
            <div ref={glowRef} aria-hidden="true" style={{
                position:'fixed', width:480, height:480, borderRadius:'50%',
                background:'radial-gradient(circle, rgba(47,216,238,0.16), rgba(139,107,245,0.07) 45%, transparent 68%)',
                pointerEvents:'none', zIndex:5, transform:'translate(-50%,-50%)',
                left:'50%', top:'50%', mixBlendMode:'screen',
                transition:'opacity .3s',
            }} />
            {/* Small cyan dot */}
            <div ref={dotRef} aria-hidden="true" className="lumina-cursor-dot" style={{
                position:'fixed', left:0, top:0, pointerEvents:'none', zIndex:10000,
                transform:'translate(-50%,-50%)', opacity:0,
                width:7, height:7, borderRadius:'50%',
                background:'#2fd8ee', boxShadow:'0 0 10px 1px rgba(47,216,238,.7)',
                transition:'opacity .25s, width .2s, height .2s',
            }} />
            {/* Ring */}
            <div ref={ringRef} aria-hidden="true" className="lumina-cursor-ring" style={{
                position:'fixed', left:0, top:0, pointerEvents:'none', zIndex:10000,
                transform:'translate(-50%,-50%)', opacity:0,
                width:34, height:34, borderRadius:'50%',
                border:'1.5px solid rgba(47,216,238,.55)',
                transition:'opacity .25s, width .25s, height .25s, border-color .25s, background .25s, transform .12s',
            }} />
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <AuroraBackground />
            <LuminaCursor />
            <div style={{ position: "relative", zIndex: 3 }}>
                <Routes>
                    {/* Home */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/RoleSelect" element={<RoleSelect />} />

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

                    {/* Client Dashboard */}
                    <Route
                        path="/client"
                        element={
                            <ProtectedRoute role="CLIENT" requireProfileComplete>
                                <ClientLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<ClientDashboard />} />
                        <Route path="profile" element={<ClientProfile />} />
                        <Route path="post-project" element={<ClientPostProject />} />
                        <Route path="my-projects" element={<ClientProjects />} />
                        <Route path="project/:id" element={<ClientProjectDetails />} />
                        <Route path="search-freelancers" element={<ClientSearchFreelancers />} />
                        <Route path="messages" element={<ClientMessages />} />
                    </Route>

                    {/* Freelancer Authentication */}
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

                    {/* Freelancer Dashboard */}
                    <Route
                        path="/freelancer"
                        element={
                            <ProtectedRoute role="FREELANCER" requireProfileComplete>
                                <FreelancerLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<FreelancerDashboard />} />
                        <Route path="browse-projects" element={<FreelancerBrowseProjects />} />
                        <Route path="my-bids" element={<FreelancerBids />} />
                        <Route path="messages" element={<FreelancerMessages />} />
                    </Route>

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;