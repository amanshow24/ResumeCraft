import { PersonalInfo, Experience } from '@/types/resume';

// Mock AI functions - in a real app, these would call actual AI APIs
export async function generateAISummary(personalInfo: PersonalInfo): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const summaries = [
    `Experienced professional with strong background in ${personalInfo.fullName ? 'technology and innovation' : 'business development'}, bringing expertise in strategic planning, team leadership, and project management. Proven track record of delivering results and driving organizational growth.`,
    
    `Dynamic ${personalInfo.fullName ? 'professional' : 'individual'} with comprehensive experience in cross-functional collaboration and process optimization. Skilled at identifying opportunities for improvement and implementing solutions that enhance operational efficiency and customer satisfaction.`,
    
    `Results-driven professional with demonstrated ability to manage complex projects and lead high-performing teams. Strong analytical skills combined with excellent communication abilities, with a focus on achieving measurable business outcomes and fostering collaborative work environments.`
  ];
  
  // Return a random summary for variety
  return summaries[Math.floor(Math.random() * summaries.length)];
}

export async function generateAIBulletPoints(experience: Experience): Promise<string[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  const bulletPointTemplates = [
    `Led cross-functional initiatives at ${experience.company}, resulting in improved operational efficiency and team productivity`,
    `Collaborated with stakeholders to develop and implement strategic solutions, contributing to organizational growth and success`,
    `Managed key projects and deliverables, ensuring timely completion and adherence to quality standards`,
    `Analyzed performance metrics and data to identify opportunities for process optimization and cost reduction`,
    `Mentored team members and facilitated knowledge sharing, fostering a culture of continuous learning and development`,
    `Participated in client meetings and presentations, building strong relationships and ensuring customer satisfaction`,
    `Contributed to the development of best practices and standard operating procedures, improving overall team efficiency`,
    `Supported budget planning and resource allocation, helping to optimize project outcomes and financial performance`
  ];
  
  // Return 3-5 random bullet points
  const numBullets = Math.floor(Math.random() * 3) + 3;
  const shuffled = bulletPointTemplates.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numBullets);
}

export async function analyzeResumeMatch(resumeData: any, jobDescription: string): Promise<{
  score: number;
  missingKeywords: string[];
  suggestions: string[];
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock analysis - in a real app, this would use NLP/AI to analyze the match
  const mockKeywords = ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Git', 'Agile', 'Leadership'];
  const mockMissingKeywords = mockKeywords.slice(0, Math.floor(Math.random() * 4) + 1);
  const mockScore = Math.floor(Math.random() * 40) + 60; // Score between 60-100
  
  const mockSuggestions = [
    'Add more specific technical skills mentioned in the job description',
    'Include quantifiable achievements with numbers and percentages',
    'Emphasize leadership and team collaboration experience',
    'Highlight relevant certifications or training',
    'Use more action verbs to describe your accomplishments'
  ];
  
  return {
    score: mockScore,
    missingKeywords: mockMissingKeywords,
    suggestions: mockSuggestions.slice(0, Math.floor(Math.random() * 3) + 2)
  };
}