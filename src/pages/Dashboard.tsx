import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  FileText, 
  Calendar, 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Trash2, 
  Download, 
  Share2, 
  Eye,
  Loader2 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Resume } from '@/types/resume';

/**
 * Dashboard Component - Main user dashboard after login
 * Shows hero section and comprehensive resume management with CRUD operations
 * Features: Create, Edit, Duplicate, Delete, Download PDF, Share functionality
 */
export function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State management
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteResumeId, setDeleteResumeId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch user's resumes from Supabase
  const fetchResumes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setResumes((data as unknown as Resume[]) || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast({
        title: "Error",
        description: "Failed to load your resumes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load resumes on component mount
  useEffect(() => {
    fetchResumes();
  }, [user]);

  // Get user's display name
  const getUserName = () => {
    const firstName = user?.user_metadata?.first_name;
    return firstName || user?.email?.split('@')[0] || 'there';
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Navigate to templates page to create new resume
  const handleCreateNewResume = () => {
    navigate('/templates');
  };

  // Edit existing resume
  const handleEditResume = (resumeId: string) => {
    navigate(`/resume/${resumeId}`);
  };

  // Duplicate resume - creates a new copy with same data
  const handleDuplicateResume = async (resume: Resume) => {
    if (!user) return;
    
    try {
      setActionLoading(`duplicate-${resume.id}`);
      
      const duplicatedResume = {
        title: `${resume.title} (Copy)`,
        template: resume.template,
        data: resume.data as any,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('resumes')
        .insert([duplicatedResume])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resume duplicated successfully!"
      });

      // Refresh the resumes list
      fetchResumes();
    } catch (error) {
      console.error('Error duplicating resume:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Delete resume with confirmation
  const handleDeleteResume = async (resumeId: string) => {
    if (!user) return;
    
    try {
      setActionLoading(`delete-${resumeId}`);
      
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resume deleted successfully!"
      });

      // Remove from local state
      setResumes(resumes.filter(resume => resume.id !== resumeId));
      setDeleteResumeId(null);
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Download resume as PDF
  const handleDownloadPDF = async (resume: Resume) => {
    try {
      setActionLoading(`download-${resume.id}`);
      
      // In a real implementation, this would generate and download the PDF
      // For now, we'll show a success message
      toast({
        title: "PDF Generation",
        description: "PDF download will be available soon!",
      });
      
      // TODO: Implement actual PDF generation and download
      console.log('Download PDF for resume:', resume.id);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Get shareable link for resume
  const handleGetShareableLink = async (resume: Resume) => {
    try {
      setActionLoading(`share-${resume.id}`);
      
      // Generate shareable link (in real app, this would be a public URL)
      const shareableLink = `${window.location.origin}/resume/view/${resume.id}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareableLink);
      
      toast({
        title: "Link Copied!",
        description: "Shareable link has been copied to your clipboard."
      });
    } catch (error) {
      console.error('Error creating shareable link:', error);
      toast({
        title: "Error",
        description: "Failed to create shareable link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
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
            <Button size="lg" onClick={handleCreateNewResume}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Resume
            </Button>
          </div>
        </div>
      </div>

      {/* Resumes Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Your Resumes</h2>
            <p className="text-muted-foreground">
              {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'} total
            </p>
          </div>
          <Button onClick={handleCreateNewResume}>
            <Plus className="mr-2 h-4 w-4" />
            New Resume
          </Button>
        </div>

        {resumes.length === 0 ? (
          /* Empty State */
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first resume to get started with ResumeCraft
                </p>
                <Button onClick={handleCreateNewResume}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Resumes Table */
          <Card>
            <CardHeader>
              <CardTitle>Resume Library</CardTitle>
              <CardDescription>
                Manage your professional resumes with full editing capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resume Title</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resumes.map((resume) => (
                    <TableRow key={resume.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{resume.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Click Edit to modify
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {resume.template}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatDate(resume.updated_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(resume.created_at)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick Edit Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditResume(resume.id)}
                            disabled={actionLoading === `edit-${resume.id}`}
                          >
                            {actionLoading === `edit-${resume.id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Edit className="h-4 w-4" />
                            )}
                            Edit
                          </Button>

                          {/* More Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => handleEditResume(resume.id)}
                                className="flex items-center gap-2"
                              >
                                <Edit className="h-4 w-4" />
                                Edit Resume
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem
                                onClick={() => handleDuplicateResume(resume)}
                                disabled={actionLoading === `duplicate-${resume.id}`}
                                className="flex items-center gap-2"
                              >
                                {actionLoading === `duplicate-${resume.id}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                                Duplicate
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() => handleDownloadPDF(resume)}
                                disabled={actionLoading === `download-${resume.id}`}
                                className="flex items-center gap-2"
                              >
                                {actionLoading === `download-${resume.id}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                                Download PDF
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleGetShareableLink(resume)}
                                disabled={actionLoading === `share-${resume.id}`}
                                className="flex items-center gap-2"
                              >
                                {actionLoading === `share-${resume.id}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Share2 className="h-4 w-4" />
                                )}
                                Get Shareable Link
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() => setDeleteResumeId(resume.id)}
                                className="flex items-center gap-2 text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Resume
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteResumeId} onOpenChange={() => setDeleteResumeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resume? This action cannot be undone.
              All data associated with this resume will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteResumeId && handleDeleteResume(deleteResumeId)}
              disabled={actionLoading === `delete-${deleteResumeId}`}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading === `delete-${deleteResumeId}` ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Resume'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}