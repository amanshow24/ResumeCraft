import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoForm } from '@/components/resume/PersonalInfoForm';
import { EducationForm } from '@/components/resume/EducationForm';
import { ExperienceForm } from '@/components/resume/ExperienceForm';
import { SkillsForm } from '@/components/resume/SkillsForm';
import { AchievementsForm } from '@/components/resume/AchievementsForm';
import { CustomSectionsForm } from '@/components/resume/CustomSectionsForm';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { TemplateSelector } from '@/components/resume/TemplateSelector';
import { ExportPanel } from '@/components/resume/ExportPanel';
import { ResumeData } from '@/types/resume';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, Download, Share2 } from 'lucide-react';

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: ''
  },
  education: [],
  experience: [],
  skills: [],
  achievements: [],
  customSections: [],
  theme: {
    fontFamily: 'inter',
    primaryColor: '#2563eb',
    headingSize: 'md',
    template: 'modern'
  }
};

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [template, setTemplate] = useState('modern');
  const [title, setTitle] = useState('My Resume');
  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);

  // Load existing resume if editing
  useEffect(() => {
    if (id && user) {
      loadResume();
    }
  }, [id, user]);

  const loadResume = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setResumeData(data.data as unknown as ResumeData);
        setTemplate(data.template);
        setTitle(data.title);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      toast({
        title: "Error",
        description: "Failed to load resume",
        variant: "destructive"
      });
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const saveResume = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const resumePayload = {
        title,
        template,
        data: resumeData as any,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      if (id) {
        // Update existing resume
        const { error } = await supabase
          .from('resumes')
          .update(resumePayload)
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new resume
        const { data, error } = await supabase
          .from('resumes')
          .insert([resumePayload])
          .select()
          .single();

        if (error) throw error;
        
        // Navigate to edit mode with the new ID
        navigate(`/resume/${data.id}`, { replace: true });
      }

      toast({
        title: "Success",
        description: "Resume saved successfully"
      });
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error",
        description: "Failed to save resume",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-0 p-0"
                  placeholder="Resume Title"
                />
                <p className="text-sm text-muted-foreground">
                  {id ? 'Editing resume' : 'Creating new resume'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden lg:flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
              <Button
                onClick={saveResume}
                disabled={isSaving}
                size="sm"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Editor Panel */}
          <div className={`${showPreview ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6`}>
            {/* Template Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Template</CardTitle>
              </CardHeader>
              <CardContent>
                <TemplateSelector
                  selectedTemplate={template}
                  onTemplateChange={setTemplate}
                />
              </CardContent>
            </Card>

            {/* Resume Builder Tabs */}
            <Card>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                    <TabsTrigger value="personal" className="text-xs">Personal</TabsTrigger>
                    <TabsTrigger value="education" className="text-xs">Education</TabsTrigger>
                    <TabsTrigger value="experience" className="text-xs">Experience</TabsTrigger>
                    <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
                    <TabsTrigger value="achievements" className="text-xs">Achievements</TabsTrigger>
                    <TabsTrigger value="custom" className="text-xs">Custom</TabsTrigger>
                  </TabsList>

                  <div className="p-6">
                    <TabsContent value="personal" className="mt-0">
                      <PersonalInfoForm
                        data={resumeData.personalInfo}
                        onChange={(data) => updateResumeData('personalInfo', data)}
                      />
                    </TabsContent>

                    <TabsContent value="education" className="mt-0">
                      <EducationForm
                        data={resumeData.education}
                        onChange={(data) => updateResumeData('education', data)}
                      />
                    </TabsContent>

                    <TabsContent value="experience" className="mt-0">
                      <ExperienceForm
                        data={resumeData.experience}
                        onChange={(data) => updateResumeData('experience', data)}
                      />
                    </TabsContent>

                    <TabsContent value="skills" className="mt-0">
                      <SkillsForm
                        data={resumeData.skills}
                        onChange={(data) => updateResumeData('skills', data)}
                      />
                    </TabsContent>

                    <TabsContent value="achievements" className="mt-0">
                      <AchievementsForm
                        data={resumeData.achievements}
                        onChange={(data) => updateResumeData('achievements', data)}
                      />
                    </TabsContent>

                    <TabsContent value="custom" className="mt-0">
                      <CustomSectionsForm
                        data={resumeData.customSections}
                        onChange={(data) => updateResumeData('customSections', data)}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>

            {/* Export Panel */}
            {id && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Export & Share
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ExportPanel
                    resumeId={id}
                    resumeData={resumeData}
                    template={template}
                    title={title}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResumePreview
                      data={resumeData}
                      template={template}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}