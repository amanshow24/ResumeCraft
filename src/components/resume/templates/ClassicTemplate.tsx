import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface ClassicTemplateProps {
  data: ResumeData;
}

export function ClassicTemplate({ data }: ClassicTemplateProps) {
  const { personalInfo, education, experience, skills, achievements, customSections } = data;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="font-serif text-gray-800 leading-relaxed grid grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="col-span-1 space-y-6">
        {/* Contact Info */}
        <section className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Contact
          </h2>
          <div className="space-y-2 text-sm">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-gray-600" />
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-gray-600" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-gray-600" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-gray-600" />
                <span className="break-all">{personalInfo.website}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-3 w-3 text-gray-600" />
                <span className="break-all">{personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        </section>

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Skills
            </h2>
            <div className="space-y-3">
              {skills.map((skillCategory) => (
                <div key={skillCategory.id}>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{skillCategory.category}</h3>
                  <div className="space-y-1">
                    {skillCategory.items.map((skill, index) => (
                      <div key={index} className="text-sm text-gray-700">
                        {skill.name}
                        {skill.level && skill.level !== 'Intermediate' && (
                          <span className="text-gray-500 ml-1">({skill.level})</span>
                        )}
                      </div>
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
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="text-sm">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700 font-medium">{edu.institution}</p>
                  <p className="text-gray-600">{edu.fieldOfStudy}</p>
                  <p className="text-gray-600">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                  {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="mt-1 space-y-1">
                      {edu.achievements.map((achievement, index) => (
                        <li key={index} className="text-gray-700 flex items-start">
                          <span className="text-gray-400 mr-1">•</span>
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
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Awards
            </h2>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="text-sm">
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  {achievement.organization && (
                    <p className="text-gray-700">{achievement.organization}</p>
                  )}
                  {achievement.date && (
                    <p className="text-gray-600">{formatDate(achievement.date)}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right Column */}
      <div className="col-span-2 space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          {personalInfo.summary && (
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          )}
        </header>

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-gray-700 font-semibold">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="font-semibold">{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                      <p>{exp.location}</p>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 mb-2 italic">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, index) => (
                        <li key={index} className="text-gray-700 flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
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

        {/* Custom Sections */}
        {customSections.map((section) => (
          <section key={section.id}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-1">
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.items.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    {item.date && (
                      <span className="text-sm text-gray-600 font-semibold">{item.date}</span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="text-gray-700 font-semibold mb-1">{item.subtitle}</p>
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
  );
}