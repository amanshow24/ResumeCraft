import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Calendar, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Dashboard Component - Main user dashboard after login
 * Shows hero section and list of user's resumes
 */
export function Dashboard() {
  const { user } = useAuth();
  const [resumes] = useState([
    {
      id: '1',
      title: 'Software Engineer Resume',
      updated_at: '2025-01-20T10:30:00Z',
    },
    {
      id: '2', 
      title: 'Frontend Developer CV',
      updated_at: '2025-01-18T15:45:00Z',
    }
  ]);

  const getUserName = () => {
    const firstName = user?.user_metadata?.first_name;
    return firstName || user?.email?.split('@')[0] || 'there';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {getUserName()}!
        </h1>
        <p className="text-muted-foreground mb-6">
          Create and manage your professional resumes with AI-powered tools
        </p>
        
        <div className="bg-gradient-hero rounded-lg p-6 mb-8">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-2">Ready to create your next resume?</h2>
            <p className="text-muted-foreground mb-4">
              Get started with our AI-powered resume builder featuring instant summaries, 
              ATS-friendly bullet points, and professional PDF exports.
            </p>
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Create New Resume
            </Button>
          </div>
        </div>
      </div>

      {/* Resumes Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Resumes</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Resume
          </Button>
        </div>

        {resumes.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first resume to get started
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <Card key={resume.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-medium line-clamp-1">
                        {resume.title}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Calendar className="mr-1 h-3 w-3" />
                        Last edited {formatDate(resume.updated_at)}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Duplicate
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}