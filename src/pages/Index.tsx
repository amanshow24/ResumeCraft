import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Zap, Download, Share } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center bg-gradient-hero">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            Create Professional Resumes with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Build stunning resumes in minutes with AI-powered tools. Get instant summaries, 
            bullet points, and export to PDF or shareable links.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/auth?tab=signup">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">What ResumeCraft Does</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI Summaries</h3>
              <p className="text-muted-foreground text-sm">Generate professional summaries with 3 variants</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">ATS-Friendly</h3>
              <p className="text-muted-foreground text-sm">AI-generated bullet points that pass ATS filters</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">PDF Export</h3>
              <p className="text-muted-foreground text-sm">Download professional PDFs with proper formatting</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Share className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Share Online</h3>
              <p className="text-muted-foreground text-sm">Get shareable links and portfolio pages</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
