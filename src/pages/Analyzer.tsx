import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { analyzeResumeMatch } from '@/utils/aiHelpers';
import { Search, TrendingUp, AlertCircle, CheckCircle, FileText, Zap } from 'lucide-react';

const analyzerSchema = z.object({
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters long'),
  resumeText: z.string().min(100, 'Resume text must be at least 100 characters long')
});

type AnalyzerForm = z.infer<typeof analyzerSchema>;

interface AnalysisResult {
  score: number;
  missingKeywords: string[];
  suggestions: string[];
}

export default function AnalyzerPage() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);

  const form = useForm<AnalyzerForm>({
    resolver: zodResolver(analyzerSchema),
    defaultValues: {
      jobDescription: '',
      resumeText: ''
    }
  });

  const onSubmit = async (data: AnalyzerForm) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeResumeMatch(data.resumeText, data.jobDescription);
      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete!",
        description: `Your resume scored ${result.score}% match with the job description.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Search className="h-10 w-10 text-primary" />
              AI Resume Analyzer
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get instant feedback on how well your resume matches a specific job description. 
              Our AI analyzes keywords, skills, and content to give you actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Upload Content for Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="jobDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Description *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Paste the job description here. Include requirements, responsibilities, and desired skills..."
                                className="min-h-[150px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="resumeText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Resume Content *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Paste your resume content here. Include your experience, skills, education, and achievements..."
                                className="min-h-[200px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={isAnalyzing}
                        className="w-full flex items-center gap-2"
                      >
                        <Zap className="h-4 w-4" />
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Resume Match'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* How it Works */}
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <p className="text-sm">Paste the job description and your resume content</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <p className="text-sm">Our AI analyzes keyword match and content relevance</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <p className="text-sm">Get your match score and improvement suggestions</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {analysisResult ? (
                <>
                  {/* Score Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Match Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysisResult.score)}`}>
                          {analysisResult.score}%
                        </div>
                        <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getScoreBackground(analysisResult.score)} ${getScoreColor(analysisResult.score)}`}>
                          {analysisResult.score >= 80 ? 'Excellent Match' : 
                           analysisResult.score >= 60 ? 'Good Match' : 'Needs Improvement'}
                        </div>
                        <Progress value={analysisResult.score} className="mt-4" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Missing Keywords */}
                  {analysisResult.missingKeywords.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                          Missing Keywords
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Consider adding these keywords from the job description:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.missingKeywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="border-orange-300 text-orange-700">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Suggestions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Improvement Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysisResult.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                    <p className="text-muted-foreground">
                      Enter your job description and resume content to get started with the AI analysis.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Keyword Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Identify important keywords and phrases that are missing from your resume.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Match Score</h3>
                <p className="text-sm text-muted-foreground">
                  Get a percentage score showing how well your resume matches the job requirements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Actionable Tips</h3>
                <p className="text-sm text-muted-foreground">
                  Receive specific suggestions to improve your resume's relevance and impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}