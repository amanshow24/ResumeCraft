import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface CreativeTemplateProps {
  data: ResumeData;
}

export function CreativeTemplate({ data }: CreativeTemplateProps) {
  const { personalInfo, education, experience, skills, achievements, customSections } = data;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="font-sans text-gray-800 leading-relaxed">
      {/* Header with Gradient */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-4xl font-bold mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-sm mb-4 opacity-90">
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
          <p className="text-white/90 leading-relaxed text-lg">{personalInfo.summary}</p>
        )}
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-1 space-y-6">
          {/* Skills */}
          {skills.length > 0 && (
            <section className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-bold text-purple-700 mb-3 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-2"></div>
                Skills
              </h2>
              <div className="space-y-4">
                {skills.map((skillCategory) => (
                  <div key={skillCategory.id}>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">{skillCategory.category}</h3>
                    <div className="flex flex-wrap gap-1">
                      {skillCategory.items.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-xs font-medium"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-purple-700 mb-3 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-2"></div>
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-3 border-purple-300 pl-4">
                    <h3 className="font-semibold text-gray-900 text-sm">{edu.degree}</h3>
                    <p className="text-purple-600 font-medium text-sm">{edu.institution}</p>
                    <p className="text-gray-600 text-sm">{edu.fieldOfStudy}</p>
                    <p className="text-gray-500 text-xs">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                    {edu.gpa && <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-purple-700 mb-3 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-2"></div>
                Awards
              </h2>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="border-l-3 border-purple-300 pl-4">
                    <h3 className="font-semibold text-gray-900 text-sm">{achievement.title}</h3>
                    {achievement.organization && (
                      <p className="text-purple-600 text-sm">{achievement.organization}</p>
                    )}
                    {achievement.date && (
                      <p className="text-gray-500 text-xs">{formatDate(achievement.date)}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-2 space-y-6">
          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
                <div className="w-3 h-8 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-3"></div>
                Professional Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={exp.id} className="relative">
                    {index > 0 && (
                      <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-purple-300 to-blue-300"></div>
                    )}
                    <div className="bg-white border border-purple-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{exp.jobTitle}</h3>
                          <p className="text-purple-600 font-semibold">{exp.company}</p>
                        </div>
                        <div className="text-right text-sm">
                          <div className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </div>
                          <p className="text-gray-600 mt-1">{exp.location}</p>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 mb-3 italic">{exp.description}</p>
                      )}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="text-gray-700 flex items-start">
                              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {customSections.map((section) => (
            <section key={section.id}>
              <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
                <div className="w-3 h-8 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-3"></div>
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map((item, index) => (
                  <div key={index} className="bg-white border border-purple-100 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      {item.date && (
                        <div className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                          {item.date}
                        </div>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-purple-600 font-semibold mb-2">{item.subtitle}</p>
                    )}
                    {item.description && (
                      <p className="text-gray-700">{item.description}</p>
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