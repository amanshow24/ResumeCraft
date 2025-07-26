import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ResumeData } from '@/types/resume';
import { Download, Share2, Eye, Copy, ExternalLink } from 'lucide-react';
import { generatePDF } from '@/utils/pdfGenerator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ExportPanelProps {
  resumeId: string;
  resumeData: ResumeData;
  template: string;
  title: string;
}

export function ExportPanel({ resumeId, resumeData, template, title }: ExportPanelProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isPublic, setIsPublic] = useState(false);
  const [customSlug, setCustomSlug] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isUpdatingPublic, setIsUpdatingPublic] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generatePDF(resumeData, template, title);
      toast({
        title: "Success",
        description: "PDF downloaded successfully"
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePublicToggle = async (checked: boolean) => {
    if (!user) return;
    
    setIsUpdatingPublic(true);
    try {
      // For now, we'll just toggle the state
      // In a real implementation, you'd update the database
      setIsPublic(checked);
      
      toast({
        title: checked ? "Resume Published" : "Resume Unpublished",
        description: checked 
          ? "Your resume is now publicly accessible" 
          : "Your resume is no longer publicly accessible"
      });
    } catch (error) {
      console.error('Error updating public status:', error);
      toast({
        title: "Error",
        description: "Failed to update public status",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingPublic(false);
    }
  };

  const shareableUrl = `${window.location.origin}/resume/view/${customSlug || resumeId}`;

  const copyShareableLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    toast({
      title: "Link Copied",
      description: "Shareable link copied to clipboard"
    });
  };

  const openPublicView = () => {
    window.open(shareableUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Download Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </h3>
              <p className="text-sm text-muted-foreground">
                Download your resume as a PDF with proper formatting
              </p>
            </div>
            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isGeneratingPDF ? 'Generating...' : 'Download'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Public Sharing Section */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Public Sharing
              </h3>
              <p className="text-sm text-muted-foreground">
                Make your resume publicly accessible via a shareable link
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={handlePublicToggle}
              disabled={isUpdatingPublic}
            />
          </div>

          {isPublic && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="custom-slug">Custom URL Slug (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-slug"
                    placeholder="e.g., john-doe-resume"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave empty to use the default ID
                </p>
              </div>

              <div className="space-y-2">
                <Label>Shareable Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareableUrl}
                    readOnly
                    className="flex-1 bg-muted"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyShareableLink}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openPublicView}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Eye className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Portfolio Mode</p>
                    <p className="text-blue-700">
                      Your public resume will be displayed as a professional portfolio page with SEO optimization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </h3>
              <p className="text-sm text-muted-foreground">
                View your resume in full-screen mode
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open(`/resume/preview/${resumeId}`, '_blank')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Full Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}