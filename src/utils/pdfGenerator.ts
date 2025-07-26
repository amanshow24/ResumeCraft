import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from '@/types/resume';

export async function generatePDF(resumeData: ResumeData, template: string, title: string): Promise<void> {
  try {
    // Create a temporary div to render the resume
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '8.5in';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '0.5in';
    
    // Import and render the appropriate template
    const { ModernTemplate } = await import('@/components/resume/templates/ModernTemplate');
    const { ClassicTemplate } = await import('@/components/resume/templates/ClassicTemplate');
    const { CreativeTemplate } = await import('@/components/resume/templates/CreativeTemplate');
    const { ExecutiveTemplate } = await import('@/components/resume/templates/ExecutiveTemplate');
    
    let templateHTML = '';
    
    switch (template) {
      case 'classic':
        templateHTML = renderReactToHTML(ClassicTemplate, { data: resumeData });
        break;
      case 'creative':
        templateHTML = renderReactToHTML(CreativeTemplate, { data: resumeData });
        break;
      case 'executive':
        templateHTML = renderReactToHTML(ExecutiveTemplate, { data: resumeData });
        break;
      default:
        templateHTML = renderReactToHTML(ModernTemplate, { data: resumeData });
        break;
    }
    
    tempDiv.innerHTML = templateHTML;
    document.body.appendChild(tempDiv);
    
    // Convert to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 816, // 8.5 inches * 96 DPI
      height: 1056 // 11 inches * 96 DPI
    });
    
    // Create PDF
    const pdf = new jsPDF('p', 'pt', 'letter');
    const imgData = canvas.toDataURL('image/png');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Download the PDF
    const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    pdf.save(fileName);
    
    // Clean up
    document.body.removeChild(tempDiv);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

// Helper function to render React component to HTML string
function renderReactToHTML(Component: any, props: any): string {
  // This is a simplified version - in a real app, you'd use server-side rendering
  // or a more sophisticated approach to convert React components to HTML
  
  const { personalInfo, education, experience, skills, achievements, customSections } = props.data;
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  // Generate a simplified HTML version for PDF
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <header style="margin-bottom: 2rem;">
        <h1 style="font-size: 2rem; margin: 0; color: #2563eb;">
          ${personalInfo.firstName} ${personalInfo.lastName}
        </h1>
        <div style="margin: 1rem 0; font-size: 0.9rem; color: #666;">
          ${personalInfo.email ? `📧 ${personalInfo.email}` : ''}
          ${personalInfo.phone ? ` | 📞 ${personalInfo.phone}` : ''}
          ${personalInfo.location ? ` | 📍 ${personalInfo.location}` : ''}
        </div>
        ${personalInfo.summary ? `<p style="background: #f8f9fa; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">${personalInfo.summary}</p>` : ''}
      </header>
      
      ${experience.length > 0 ? `
        <section style="margin-bottom: 2rem;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem;">Professional Experience</h2>
          ${experience.map(exp => `
            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <div>
                  <h3 style="margin: 0; font-size: 1.1rem;">${exp.jobTitle}</h3>
                  <p style="margin: 0; color: #2563eb; font-weight: bold;">${exp.company}</p>
                </div>
                <div style="text-align: right; font-size: 0.9rem; color: #666;">
                  <p style="margin: 0;">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                  <p style="margin: 0;">${exp.location}</p>
                </div>
              </div>
              ${exp.description ? `<p style="color: #666; margin: 0.5rem 0;">${exp.description}</p>` : ''}
              ${exp.achievements?.length ? `
                <ul style="margin: 0.5rem 0; padding-left: 1rem;">
                  ${exp.achievements.map(achievement => `<li style="margin-bottom: 0.25rem;">${achievement}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}
      
      ${education.length > 0 ? `
        <section style="margin-bottom: 2rem;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem;">Education</h2>
          ${education.map(edu => `
            <div style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between;">
                <div>
                  <h3 style="margin: 0;">${edu.degree}</h3>
                  <p style="margin: 0; color: #2563eb;">${edu.institution}</p>
                  <p style="margin: 0; color: #666;">${edu.fieldOfStudy}</p>
                </div>
                <div style="text-align: right; font-size: 0.9rem; color: #666;">
                  <p style="margin: 0;">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</p>
                  ${edu.gpa ? `<p style="margin: 0;">GPA: ${edu.gpa}</p>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </section>
      ` : ''}
      
      ${skills.length > 0 ? `
        <section style="margin-bottom: 2rem;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem;">Skills</h2>
          ${skills.map(skillCategory => `
            <div style="margin-bottom: 1rem;">
              <h3 style="margin: 0 0 0.5rem 0;">${skillCategory.category}</h3>
              <p style="margin: 0;">${skillCategory.items.map(skill => skill.name).join(', ')}</p>
            </div>
          `).join('')}
        </section>
      ` : ''}
    </div>
  `;
}