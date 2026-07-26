import type { Resume, AISuggestion, JobDescription, MatchScore } from '@/types/resume';

const actionVerbs = [
  'achieved', 'implemented', 'developed', 'led', 'managed', 'created',
  'designed', 'improved', 'increased', 'reduced', 'optimized', 'built',
  'launched', 'delivered', 'spearheaded', 'orchestrated', 'transformed'
];



export function generateSuggestions(resume: Resume): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  // Check personal info
  if (!resume.personalInfo.summary || resume.personalInfo.summary.length < 100) {
    suggestions.push({
      type: 'content',
      message: 'Add a compelling professional summary (at least 100 characters) to highlight your key strengths and career goals.',
      section: 'Personal Info',
      priority: 'high',
    });
  }

  if (!resume.personalInfo.linkedin) {
    suggestions.push({
      type: 'format',
      message: 'Consider adding your LinkedIn profile to enhance your professional presence.',
      section: 'Personal Info',
      priority: 'medium',
    });
  }

  // Check experience
  if (resume.experience.length === 0) {
    suggestions.push({
      type: 'content',
      message: 'Add your work experience. A resume without experience is highly unlikely to pass ATS systems.',
      section: 'Experience',
      priority: 'high',
    });
    suggestions.push({
      type: 'content',
      message: 'Experience section is completely empty. This severely impacts your score.',
      section: 'Experience',
      priority: 'high',
    });
  } else {
    resume.experience.forEach((exp, index) => {
      if (!exp.description || exp.description.length < 50) {
        suggestions.push({
          type: 'content',
          message: `Experience ${index + 1}: Expand your job description with more details about your responsibilities and achievements.`,
          section: 'Experience',
          priority: 'high',
        });
      }

      const hasActionVerb = actionVerbs.some(verb =>
        exp.description.toLowerCase().includes(verb)
      );
      if (!hasActionVerb) {
        suggestions.push({
          type: 'improvement',
          message: `Experience ${index + 1}: Start bullet points with strong action verbs like "achieved," "implemented," or "developed."`,
          section: 'Experience',
          priority: 'medium',
        });
      }

      if (!exp.achievements || exp.achievements.length === 0) {
        suggestions.push({
          type: 'content',
          message: `Experience ${index + 1}: Add quantifiable achievements (e.g., "Increased sales by 25%").`,
          section: 'Experience',
          priority: 'high',
        });
      }
    });
  }

  // Check skills
  if (resume.skills.length === 0) {
    suggestions.push({
      type: 'content',
      message: 'No skills listed. You must add relevant skills to pass keyword filters.',
      section: 'Skills',
      priority: 'high',
    });
    suggestions.push({
      type: 'content',
      message: 'Skills are critical for ATS optimization. Add at least 5-10.',
      section: 'Skills',
      priority: 'medium',
    });
  } else if (resume.skills.length < 5) {
    suggestions.push({
      type: 'content',
      message: 'Add more skills to your profile. Aim for at least 5-10 relevant skills.',
      section: 'Skills',
      priority: 'medium',
    });
  }

  // Check education
  if (resume.education.length === 0) {
    suggestions.push({
      type: 'content',
      message: 'Add your educational background to complete your profile.',
      section: 'Education',
      priority: 'high',
    });
  }

  // Check projects
  if (resume.projects.length === 0) {
    suggestions.push({
      type: 'content',
      message: 'Consider adding relevant projects to showcase your practical skills.',
      section: 'Projects',
      priority: 'medium',
    });
  }

  return suggestions;
}

export function analyzeJobMatch(resume: Resume, jobDescription: JobDescription): MatchScore {
  const resumeText = getResumeText(resume).toLowerCase();
  const jobText = `${jobDescription.description} ${jobDescription.requirements.join(' ')}`.toLowerCase();
  
  // Extract keywords from job description
  const jobKeywords = extractKeywords(jobText);
  
  // Find matching and missing keywords
  const matchingKeywords: string[] = [];
  const missingKeywords: string[] = [];
  
  jobKeywords.forEach(keyword => {
    if (resumeText.includes(keyword.toLowerCase())) {
      matchingKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  // Calculate scores
  const skillsScore = calculateSkillsMatch(resume, jobText);
  const experienceScore = calculateExperienceMatch(resume, jobText);
  const educationScore = calculateEducationMatch(resume, jobText);
  
  const overallScore = Math.round(
    (skillsScore * 0.4 + experienceScore * 0.4 + educationScore * 0.2)
  );

  return {
    overall: overallScore,
    skills: skillsScore,
    experience: experienceScore,
    education: educationScore,
    keywords: matchingKeywords.slice(0, 10),
    missingKeywords: missingKeywords.slice(0, 10),
  };
}

function getResumeText(resume: Resume): string {
  const parts = [
    resume.personalInfo.summary,
    ...resume.experience.map(e => `${e.position} ${e.company} ${e.description}`),
    ...resume.skills.map(s => s.name),
    ...resume.education.map(e => `${e.degree} ${e.field} ${e.institution}`),
    ...resume.projects.map(p => `${p.name} ${p.description} ${p.technologies.join(' ')}`),
  ];
  return parts.join(' ');
}

function extractKeywords(text: string): string[] {
  const commonWords = new Set(['and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));
  
  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });
  
  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);
}

function calculateSkillsMatch(resume: Resume, jobText: string): number {
  if (resume.skills.length === 0) return 0;
  
  const matchedSkills = resume.skills.filter(skill =>
    jobText.includes(skill.name.toLowerCase())
  ).length;
  
  return Math.round((matchedSkills / Math.max(resume.skills.length, 5)) * 100);
}

function calculateExperienceMatch(resume: Resume, jobText: string): number {
  if (resume.experience.length === 0) return 0;
  
  const experienceText = resume.experience.map(e =>
    `${e.position} ${e.description}`.toLowerCase()
  ).join(' ');
  
  const jobWords = jobText.split(/\s+/);
  const matchedWords = jobWords.filter(word =>
    experienceText.includes(word.toLowerCase())
  ).length;
  
  return Math.round((matchedWords / jobWords.length) * 100);
}

function calculateEducationMatch(resume: Resume, jobText: string): number {
  if (resume.education.length === 0) return 50;
  
  const educationText = resume.education.map(e =>
    `${e.degree} ${e.field}`.toLowerCase()
  ).join(' ');
  
  const hasMatch = jobText.split(/\s+/).some(word =>
    educationText.includes(word.toLowerCase())
  );
  
  return hasMatch ? 100 : 70;
}

export function optimizeForATS(resume: Resume): string[] {
  const tips: string[] = [];
  
  if (resume.personalInfo.fullName && resume.personalInfo.fullName.includes(',')) {
    tips.push('Avoid using commas in your name - it can confuse ATS parsers.');
  }
  
  const hasStandardFonts = true; // Assuming standard fonts are used
  if (!hasStandardFonts) {
    tips.push('Use standard fonts (Arial, Calibri, Times New Roman) for better ATS compatibility.');
  }
  
  if (resume.experience.some(e => e.description.includes('|') || e.description.includes('•'))) {
    tips.push('Use standard bullet points (•) instead of special characters.');
  }
  
  tips.push('Save your resume as a .docx or .pdf file for best ATS compatibility.');
  tips.push('Use standard section headings like "Experience," "Education," and "Skills."');
  
  return tips;
}

export function suggestImprovements(_resume: Resume, section: string): string[] {
  const suggestions: string[] = [];
  
  switch (section) {
    case 'summary':
      suggestions.push('Start with your years of experience and key expertise.');
      suggestions.push('Include 2-3 of your most impressive achievements.');
      suggestions.push('Mention your career goals and what you bring to the table.');
      suggestions.push('Keep it concise - 3-5 sentences maximum.');
      break;
    case 'experience':
      suggestions.push('Use the STAR method: Situation, Task, Action, Result.');
      suggestions.push('Quantify achievements with numbers and percentages.');
      suggestions.push('Focus on outcomes, not just responsibilities.');
      suggestions.push('Tailor descriptions to match the job requirements.');
      break;
    case 'skills':
      suggestions.push('Include both hard skills (technical) and soft skills.');
      suggestions.push('Prioritize skills mentioned in the job description.');
      suggestions.push('Group related skills together.');
      suggestions.push('Be specific - instead of "Programming," list specific languages.');
      break;
    case 'education':
      suggestions.push('Include relevant coursework for recent graduates.');
      suggestions.push('Add GPA if it\'s 3.5 or higher.');
      suggestions.push('List academic achievements and honors.');
      suggestions.push('Include certifications in a separate section.');
      break;
  }
  
  return suggestions;
}
