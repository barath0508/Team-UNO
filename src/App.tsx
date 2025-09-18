import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Impact from './components/Impact';
import Technology from './components/Technology';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import Login from './components/Login';
import Signup from './components/Signup';
import ImpactPledge from './components/ImpactPledge';
import LocationSetup from './components/LocationSetup';

import Dashboard from './components/Dashboard';
import EcoPoints from './components/EcoPoints';
import RewardsHub from './components/RewardsHub';
import EcoTeams from './components/EcoTeams';

const HomePage = () => (
  <>
    <ParticleBackground />
    <Header />
    <Hero />
    <Features />
    <HowItWorks />
    <Impact />
    <Technology />
    <CTA />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pledge" element={<ImpactPledge onComplete={() => window.location.href = '/location-setup'} />} />
          <Route path="/location-setup" element={<LocationSetup onComplete={() => window.location.href = '/dashboard'} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/eco-points" element={<EcoPoints />} />
          <Route path="/rewards" element={<RewardsHub />} />
          <Route path="/teams" element={<EcoTeams />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;