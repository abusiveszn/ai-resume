import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeProvider } from '@/context/ResumeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PersonalInfoForm } from '@/components/resume/PersonalInfoForm';
import { ExperienceForm } from '@/components/resume/ExperienceForm';
import { EducationForm } from '@/components/resume/EducationForm';
import { SkillsForm } from '@/components/resume/SkillsForm';
import { ProjectsForm } from '@/components/resume/ProjectsForm';
import { CertificationsForm } from '@/components/resume/CertificationsForm';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { AISuggestionsPanel } from '@/components/resume/AISuggestionsPanel';
import { JobMatcher } from '@/components/resume/JobMatcher';
import { ResumeEnhancer } from '@/components/resume/ResumeEnhancer';
import { LandingPage } from '@/components/landing/LandingPage';
import { AuthPage } from '@/components/auth/AuthPage';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import {
  FileText,
  Sparkles,
  Target,
  Download,
  Menu,
  Home,
  Shield,
  LogOut,
  User,
  Wand2,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

// Main App Component
function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/auth" element={<AuthPageWrapper />} />
        <Route path="/app/*" element={<ResumeBuilderApp />} />
        <Route path="/admin/*" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Landing Page Wrapper
function LandingPageWrapper() {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }
  
  return <LandingPage />;
}

// Auth Page Wrapper
function AuthPageWrapper() {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to={isAdmin() ? '/admin' : '/app'} replace />;
  }
  
  return <AuthPage />;
}

// Resume Builder App
function ResumeBuilderApp() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('editor');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const navItems = [
    { value: 'editor', label: 'Resume Editor', icon: FileText },
    { value: 'ai', label: 'AI Suggestions', icon: Sparkles },
    { value: 'matcher', label: 'Job Matcher', icon: Target },
    { value: 'enhancer', label: 'AI Enhancer', icon: Wand2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* App Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold hidden sm:block">AI Resume Assistant</h1>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.value}
                variant={activeTab === item.value ? 'default' : 'ghost'}
                onClick={() => setActiveTab(item.value)}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {/* Admin Link */}
            {isAdmin() && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/admin'}
                className="hidden sm:flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            )}
            
            {/* User Dropdown */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-medium text-primary">
                        {user?.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'} className="mt-1">
                        {user?.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/'}>
                      <Home className="h-4 w-4 mr-2" />
                      Back to Home
                    </Button>
                    {isAdmin() && (
                      <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/admin'}>
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Button>
                    )}
                    <Button variant="outline" className="w-full justify-start text-destructive" onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => (
                    <Button
                      key={item.value}
                      variant={activeTab === item.value ? 'default' : 'ghost'}
                      onClick={() => {
                        setActiveTab(item.value);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 justify-start"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                  <div className="border-t my-2" />
                  {isAdmin() && (
                    <Button
                      variant="ghost"
                      onClick={() => window.location.href = '/admin'}
                      className="flex items-center gap-2 justify-start"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => window.location.href = '/'}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Home className="h-4 w-4" />
                    Back to Home
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="flex items-center gap-2 justify-start text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Resume Editor Tab */}
          <TabsContent value="editor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Forms */}
              <ScrollArea className="h-[calc(100vh-140px)]">
                <div className="space-y-6 pr-4">
                  <PersonalInfoForm />
                  <ExperienceForm />
                  <EducationForm />
                  <SkillsForm />
                  <ProjectsForm />
                  <CertificationsForm />
                </div>
              </ScrollArea>

              {/* Right Column - Preview */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <ResumePreview />
                </div>
              </div>
            </div>

            {/* Mobile Preview Button */}
            <div className="lg:hidden fixed bottom-6 right-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="lg" className="rounded-full shadow-lg">
                    <Download className="h-5 w-5 mr-2" />
                    Preview & Export
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[90vh]">
                  <ResumePreview />
                </SheetContent>
              </Sheet>
            </div>
          </TabsContent>

          {/* AI Suggestions Tab */}
          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <AISuggestionsPanel />
              </div>
              <div className="lg:col-span-2">
                <ResumePreview />
              </div>
            </div>
          </TabsContent>

          {/* Job Matcher Tab */}
          <TabsContent value="matcher" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <JobMatcher />
              <div>
                <ResumePreview />
              </div>
            </div>
          </TabsContent>

          {/* AI Enhancer Tab */}
          <TabsContent value="enhancer" className="h-full">
            <ResumeEnhancer />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              AI Resume Assistant - Build professional resumes with AI-powered insights
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                AI-Powered
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                ATS-Optimized
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ResumeProvider>
        <AppContent />
        <Toaster position="bottom-right" />
      </ResumeProvider>
    </AuthProvider>
  );
}

export default App;
