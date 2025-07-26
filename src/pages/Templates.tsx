import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Eye, Download, Star, Users, Briefcase, Palette, Crown } from 'lucide-react';

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, minimalist design perfect for tech and creative industries',
    category: 'Professional',
    difficulty: 'Easy',
    features: ['Single column', 'Clean typography', 'Subtle accents', 'ATS-friendly'],
    preview: '/templates/modern-preview.png',
    icon: <Briefcase className="h-5 w-5" />,
    color: 'bg-blue-500',
    popular: true
  },
  {
    id: 'classic',
    name: 'Classic Traditional',
    description: 'Traditional two-column layout for conservative industries',
    category: 'Traditional',
    difficulty: 'Easy',
    features: ['Two columns', 'Professional', 'Time-tested', 'Industry standard'],
    preview: '/templates/classic-preview.png',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-gray-600'
  },
  {
    id: 'creative',
    name: 'Creative Showcase',
    description: 'Eye-catching design with color accents for creative professionals',
    category: 'Creative',
    difficulty: 'Medium',
    features: ['Colorful design', 'Creative layout', 'Visual appeal', 'Stand out'],
    preview: '/templates/creative-preview.png',
    icon: <Palette className="h-5 w-5" />,
    color: 'bg-purple-500',
    featured: true
  },
  {
    id: 'executive',
    name: 'Executive Premium',
    description: 'Sophisticated design for C-level and senior management positions',
    category: 'Executive',
    difficulty: 'Advanced',
    features: ['Premium design', 'Executive style', 'Sophisticated', 'Leadership'],
    preview: '/templates/executive-preview.png',
    icon: <Crown className="h-5 w-5" />,
    color: 'bg-amber-600',
    premium: true
  }
];

const categories = ['All', 'Professional', 'Traditional', 'Creative', 'Executive'];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleUseTemplate = (templateId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/resume/new?template=${templateId}`);
  };

  const handlePreviewTemplate = (templateId: string) => {
    // In a real app, this would open a preview modal or page
    console.log('Preview template:', templateId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Resume Templates
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our collection of professionally designed resume templates. 
            Each template is ATS-friendly and optimized for modern hiring practices.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              {/* Badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                {template.popular && (
                  <Badge className="bg-orange-500 text-white flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Popular
                  </Badge>
                )}
                {template.featured && (
                  <Badge className="bg-green-500 text-white">
                    Featured
                  </Badge>
                )}
                {template.premium && (
                  <Badge className="bg-amber-500 text-white flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>

              <CardHeader className="p-0">
                {/* Template Preview */}
                <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 rounded-t-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white mb-3 mx-auto`}>
                        {template.icon}
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-primary/30 rounded w-20 mx-auto"></div>
                        <div className="h-2 bg-muted-foreground/20 rounded w-16 mx-auto"></div>
                        <div className="h-2 bg-muted-foreground/20 rounded w-18 mx-auto"></div>
                        <div className="h-2 bg-muted-foreground/20 rounded w-14 mx-auto"></div>
                        <div className="space-y-1 mt-4">
                          <div className="h-1 bg-muted-foreground/30 rounded w-full"></div>
                          <div className="h-1 bg-muted-foreground/30 rounded w-3/4"></div>
                          <div className="h-1 bg-muted-foreground/30 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePreviewTemplate(template.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.difficulty}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 3).map((feature) => (
                        <span 
                          key={feature}
                          className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {template.features.length > 3 && (
                        <span className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded">
                          +{template.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleUseTemplate(template.id)}
                    className="w-full"
                  >
                    Use This Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">ATS-Friendly</h3>
              <p className="text-sm text-muted-foreground">
                All templates are optimized for Applicant Tracking Systems to ensure your resume gets seen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Customizable</h3>
              <p className="text-sm text-muted-foreground">
                Easily customize colors, fonts, and layouts to match your personal brand and industry.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Professional</h3>
              <p className="text-sm text-muted-foreground">
                Designed by professionals for professionals, ensuring your resume makes the right impression.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}