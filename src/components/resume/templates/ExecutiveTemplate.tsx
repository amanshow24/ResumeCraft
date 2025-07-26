import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface ExecutiveTemplateProps {
  data: ResumeData;
}

export function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  const { personalInfo, education, experience, skills, achievements, customSections } = data;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="font-serif text-gray-800 leading-relaxed">
      {/* Elegant Header */}
      <header className="text-center border-b-2 border-gray-800 pb-6 mb-8">
        <h1 className="text-5xl font-light text-gray-900 mb-3 tracking-wide">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        
        <div className="flex justify-center flex-wrap gap-6 text-sm text-gray-700 mb-4">
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
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
        </div>

        {personalInfo.summary && (
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 leading-relaxed text-lg font-light italic">
              "{personalInfo.summary}"
            </p>
          </div>
        )}
      </header>

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6 text-center tracking-wide border-b border-gray-300 pb-2">
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id} className="border-l-4 border-gray-300 pl-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 tracking-wide">{exp.jobTitle}</h3>
                    <p className="text-gray-700 font-medium text-lg">{exp.company}</p>
                  </div>
                  <div className="text-right text-gray-600">
                    <p className="font-medium">{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                    <p className="italic">{exp.location}</p>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mb-3 leading-relaxed italic">{exp.description}</p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-700 flex items-start leading-relaxed">
                        <span className="text-gray-400 mr-3 mt-1">▪</span>
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

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xl font-light text-gray-900 mb-4 tracking-wide border-b border-gray-300 pb-2">
                EDUCATION
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-semibold text-gray-900 text-lg">{edu.degree}</h3>
                    <p className="text-gray-700 font-medium">{edu.institution}</p>
                    <p className="text-gray-600 italic">{edu.fieldOfStudy}</p>
                    <p className="text-gray-600 text-sm">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                    {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                    {edu.achievements && edu.achievements.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {edu.achievements.map((achievement, index) => (
                          <li key={index} className="text-gray-700 flex items-start text-sm">
                            <span className="text-gray-400 mr-2">▪</span>
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

          {/* Achievements */}
          {achievements.length > 0 && (
            <section>
              <h2 className="text-xl font-light text-gray-900 mb-4 tracking-wide border-b border-gray-300 pb-2">
                HONORS & AWARDS
              </h2>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id}>
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    {achievement.organization && (
                      <p className="text-gray-700 font-medium">{achievement.organization}</p>
                    )}
                    {achievement.date && (
                      <p className="text-gray-600 text-sm">{formatDate(achievement.date)}</p>
                    )}
                    {achievement.description && (
                      <p className="text-gray-700 text-sm italic mt-1">{achievement.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xl font-light text-gray-900 mb-4 tracking-wide border-b border-gray-300 pb-2">
                CORE COMPETENCIES
              </h2>
              <div className="space-y-4">
                {skills.map((skillCategory) => (
                  <div key={skillCategory.id}>
                    <h3 className="font-semibold text-gray-900 mb-2">{skillCategory.category}</h3>
                    <div className="text-gray-700">
                      {skillCategory.items.map((skill, index) => (
                        <span key={index}>
                          {skill.name}
                          {skill.level && skill.level !== 'Intermediate' && (
                            <span className="text-gray-500 text-sm"> ({skill.level})</span>
                          )}
                          {index < skillCategory.items.length - 1 && ' • '}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {customSections.map((section) => (
            <section key={section.id}>
              <h2 className="text-xl font-light text-gray-900 mb-4 tracking-wide border-b border-gray-300 pb-2 uppercase">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      {item.date && (
                        <span className="text-sm text-gray-600">{item.date}</span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-gray-700 font-medium mb-1">{item.subtitle}</p>
                    )}
                    {item.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}