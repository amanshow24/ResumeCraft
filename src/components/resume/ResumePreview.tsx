import React from 'react';
import { ResumeData } from '@/types/resume';
import { ModernTemplate } from '@/components/resume/templates/ModernTemplate';
import { ClassicTemplate } from '@/components/resume/templates/ClassicTemplate';
import { CreativeTemplate } from '@/components/resume/templates/CreativeTemplate';
import { ExecutiveTemplate } from '@/components/resume/templates/ExecutiveTemplate';

interface ResumePreviewProps {
  data: ResumeData;
  template: string;
}

export function ResumePreview({ data, template }: ResumePreviewProps) {
  const getTemplateComponent = () => {
    switch (template) {
      case 'classic':
        return <ClassicTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'executive':
        return <ExecutiveTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="w-full max-w-full">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="transform scale-75 origin-top-left w-[133%] h-auto">
          <div className="w-[8.5in] min-h-[11in] bg-white p-8 print:p-0 print:shadow-none">
            {getTemplateComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}