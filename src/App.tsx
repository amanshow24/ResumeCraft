import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import ResumeBuilder from '@/pages/ResumeBuilder';
import ContactPage from '@/pages/Contact';
import TemplatesPage from '@/pages/Templates';
import AnalyzerPage from '@/pages/Analyzer';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resume/new"
                  element={
                    <ProtectedRoute>
                      <ResumeBuilder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resume/:id"
                  element={
                    <ProtectedRoute>
                      <ResumeBuilder />
                    </ProtectedRoute>
                  }
                />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/analyzer" element={<AnalyzerPage />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
        </Router>
      </DndProvider>
    </QueryClientProvider>
  );
}

export default App;
