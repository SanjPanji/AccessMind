import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Login from './app/components/Login';
import Register from './app/components/Register';
import Dashboard from './app/components/Dashboard';
import Accessibility from './app/components/Accessibility';
import AIAssistant from './app/components/AIAssistant';
import Assignments from './app/components/Assignments';
import VoiceNavigation from './app/components/VoiceNavigation';
import Attendance from './app/components/Attendance';
import Grades from './app/components/Grades';
import Profile from './app/components/Profile';
import Notifications from './app/components/Notifications';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/voice-navigation" element={<VoiceNavigation />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  );
}