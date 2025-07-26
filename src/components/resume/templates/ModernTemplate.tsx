import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface ModernTemplateProps {
  data: ResumeData;
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  const { personalInfo, education, experience, skills, achievements, customSections } = data;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="font-sans text-gray-800 leading-relaxed">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {personalInfo.fullName}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>{personalInfo.website}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>{personalInfo.github}</span>
            </div>
          )}
        </div>

        {personalInfo.summary && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}
      </header>

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                    <p>{exp.location}</p>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mb-2">{exp.description}</p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="space-y-1">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-blue-600 font-medium">{edu.institution}</p>
                    <p className="text-gray-600">{edu.field}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul className="space-y-1">
                    {edu.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
            Skills
          </h2>
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id} className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{skill.name}</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {skill.category}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < skill.level ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
            Achievements & Awards
          </h2>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  {achievement.date && (
                    <span className="text-sm text-gray-600">{formatDate(achievement.date)}</span>
                  )}
                </div>
                {achievement.organization && (
                  <p className="text-blue-600 font-medium mb-1">{achievement.organization}</p>
                )}
                {achievement.description && (
                  <p className="text-gray-700">{achievement.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {customSections.map((section) => (
        <section key={section.id} className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
            {section.title}
          </h2>
          <div className="text-gray-700">
            <p className="mb-2">{section.content}</p>
            {section.items && section.items.length > 0 && (
              <ul className="space-y-1">
                {section.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}