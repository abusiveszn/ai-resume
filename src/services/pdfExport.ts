import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Resume } from '@/types/resume';

export async function exportToPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  // Clone the resume element into an offscreen container before exporting.
  // This avoids capturing any preview transforms or page-scaling artifacts.
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-9999px';
  wrapper.style.top = '-9999px';
  wrapper.style.width = '210mm';
  wrapper.style.backgroundColor = '#ffffff';
  wrapper.style.padding = '0';
  wrapper.style.margin = '0';
  const clone = element.cloneNode(true) as HTMLElement;
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    let position = 0;
    let heightLeft = imgHeight * ratio;
    const pageHeight = pdfHeight;

    pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  } finally {
    document.body.removeChild(wrapper);
  }
}


export function generateResumeHTML(resume: Resume, template: string = 'modern'): string {
  const templates: Record<string, (resume: Resume) => string> = {
    modern: modernTemplate,
    classic: classicTemplate,
    minimal: minimalTemplate,
    professional: professionalTemplate,
  };

  const templateFn = templates[template] || modernTemplate;
  return templateFn(resume);
}

function modernTemplate(resume: Resume): string {
  const { personalInfo, experience, education, skills, projects, certifications } = resume;
  
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333; box-sizing: border-box; white-space: normal; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;">
      <header style="text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="font-size: 32px; margin: 0; color: #1e40af; text-transform: uppercase; letter-spacing: 2px;">
          ${personalInfo.fullName}
        </h1>
        <div style="margin-top: 10px; font-size: 14px; color: #666;">
          ${personalInfo.location} | ${personalInfo.email} | ${personalInfo.phone}
          ${personalInfo.linkedin ? ` | LinkedIn: ${personalInfo.linkedin}` : ''}
          ${personalInfo.website ? ` | ${personalInfo.website}` : ''}
        </div>
      </header>

      ${personalInfo.summary ? `
        <section style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
            Professional Summary
          </h2>
          <p style="line-height: 1.6; margin-top: 10px;">${personalInfo.summary}</p>
        </section>
      ` : ''}

      ${experience.length > 0 ? `
        <section style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
            Work Experience
          </h2>
          ${experience.map(exp => `
            <div style="margin-top: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <h3 style="font-size: 16px; margin: 0; color: #1f2937;">${exp.position}</h3>
                <span style="font-size: 13px; color: #6b7280;">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div style="font-size: 14px; color: #4b5563; margin-top: 3px;">${exp.company}</div>
              <p style="margin-top: 8px; line-height: 1.5; font-size: 14px;">${exp.description}</p>
              ${exp.achievements.length > 0 ? `
                <ul style="margin-top: 5px; padding-left: 20px;">
                  ${exp.achievements.map(ach => `<li style="font-size: 13px; margin-top: 3px;">${ach}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      ${education.length > 0 ? `
        <section style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
            Education
          </h2>
          ${education.map(edu => `
            <div style="margin-top: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <h3 style="font-size: 16px; margin: 0; color: #1f2937;">${edu.institution}</h3>
                <span style="font-size: 13px; color: #6b7280;">${edu.startDate} - ${edu.endDate}</span>
              </div>
              <div style="font-size: 14px; color: #4b5563; margin-top: 3px;">${edu.degree} in ${edu.field}</div>
              ${edu.gpa ? `<div style="font-size: 13px; color: #6b7280; margin-top: 3px;">GPA: ${edu.gpa}</div>` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
            Skills
          </h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
            ${skills.map(skill => `
              <span style="background: #eff6ff; color: #2563eb; padding: 4px 12px; border-radius: 15px; font-size: 13px;">
                ${skill.name}
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${projects.length > 0 ? `
        <section style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
            Projects
          </h2>
          ${projects.map(proj => `
            <div style="margin-top: 15px;">
              <h3 style="font-size: 16px; margin: 0; color: #1f2937;">${proj.name}</h3>
              <p style="margin-top: 5px; line-height: 1.5; font-size: 14px;">${proj.description}</p>
              ${proj.technologies.length > 0 ? `
                <div style="margin-top: 5px; font-size: 13px; color: #6b7280;">
                  Technologies: ${proj.technologies.join(', ')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      ${certifications.length > 0 ? `
        <section style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
            Certifications
          </h2>
          ${certifications.map(cert => `
            <div style="margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-size: 14px; font-weight: 500;">${cert.name}</span>
                <span style="font-size: 13px; color: #6b7280;">${cert.date}</span>
              </div>
              <div style="font-size: 13px; color: #4b5563;">${cert.issuer}</div>
            </div>
          `).join('')}
        </section>
      ` : ''}
    </div>
  `;
}

function classicTemplate(resume: Resume): string {
  const { personalInfo, experience, education, skills } = resume;
  
  return `
    <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #000; box-sizing: border-box; white-space: normal; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;">
      <header style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 28px; margin: 0; font-weight: normal; text-transform: uppercase;">
          ${personalInfo.fullName}
        </h1>
        <div style="margin-top: 8px; font-size: 13px;">
          ${personalInfo.location} • ${personalInfo.email} • ${personalInfo.phone}
        </div>
      </header>

      ${personalInfo.summary ? `
        <section style="margin-bottom: 20px;">
          <h2 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 10px;">
            Summary
          </h2>
          <p style="line-height: 1.5; margin: 0; font-size: 13px;">${personalInfo.summary}</p>
        </section>
      ` : ''}

      ${experience.length > 0 ? `
        <section style="margin-bottom: 20px;">
          <h2 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 10px;">
            Experience
          </h2>
          ${experience.map(exp => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between;">
                <strong style="font-size: 13px;">${exp.company}</strong>
                <span style="font-size: 12px;">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div style="font-size: 13px; font-style: italic;">${exp.position}</div>
              <p style="margin: 5px 0 0 0; line-height: 1.4; font-size: 12px;">${exp.description}</p>
            </div>
          `).join('')}
        </section>
      ` : ''}

      ${education.length > 0 ? `
        <section style="margin-bottom: 20px;">
          <h2 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 10px;">
            Education
          </h2>
          ${education.map(edu => `
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <strong style="font-size: 13px;">${edu.institution}</strong>
                <span style="font-size: 12px;">${edu.startDate} - ${edu.endDate}</span>
              </div>
              <div style="font-size: 13px;">${edu.degree}, ${edu.field}</div>
            </div>
          `).join('')}
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section style="margin-bottom: 20px;">
          <h2 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 10px;">
            Skills
          </h2>
          <p style="margin: 0; font-size: 13px;">${skills.map(s => s.name).join(', ')}</p>
        </section>
      ` : ''}
    </div>
  `;
}

function minimalTemplate(resume: Resume): string {
  const { personalInfo, experience, education, skills } = resume;
  
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 50px; color: #2d3748; box-sizing: border-box; white-space: normal; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;">
      <header style="margin-bottom: 40px;">
        <h1 style="font-size: 36px; margin: 0; font-weight: 300; letter-spacing: -1px;">
          ${personalInfo.fullName}
        </h1>
        <div style="margin-top: 12px; font-size: 14px; color: #718096;">
          ${personalInfo.email} · ${personalInfo.phone} · ${personalInfo.location}
        </div>
      </header>

      ${personalInfo.summary ? `
        <section style="margin-bottom: 35px;">
          <p style="line-height: 1.7; margin: 0; font-size: 15px; color: #4a5568;">${personalInfo.summary}</p>
        </section>
      ` : ''}

      ${experience.length > 0 ? `
        <section style="margin-bottom: 35px;">
          <h2 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #a0aec0; margin-bottom: 20px;">
            Experience
          </h2>
          ${experience.map(exp => `
            <div style="margin-bottom: 25px;">
              <h3 style="font-size: 16px; margin: 0; font-weight: 500;">${exp.position}</h3>
              <div style="font-size: 14px; color: #718096; margin-top: 4px;">${exp.company} · ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
              <p style="margin-top: 10px; line-height: 1.6; font-size: 14px;">${exp.description}</p>
            </div>
          `).join('')}
        </section>
      ` : ''}

      ${education.length > 0 ? `
        <section style="margin-bottom: 35px;">
          <h2 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #a0aec0; margin-bottom: 20px;">
            Education
          </h2>
          ${education.map(edu => `
            <div style="margin-bottom: 15px;">
              <h3 style="font-size: 16px; margin: 0; font-weight: 500;">${edu.institution}</h3>
              <div style="font-size: 14px; color: #718096; margin-top: 4px;">${edu.degree} · ${edu.field}</div>
            </div>
          `).join('')}
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section>
          <h2 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #a0aec0; margin-bottom: 20px;">
            Skills
          </h2>
          <p style="margin: 0; font-size: 14px; line-height: 1.8;">${skills.map(s => s.name).join(' · ')}</p>
        </section>
      ` : ''}
    </div>
  `;
}

function professionalTemplate(resume: Resume): string {
  const { personalInfo, experience, education, skills, certifications } = resume;
  
  return `
    <div style="font-family: 'Calibri', 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 35px; color: #1a202c; box-sizing: border-box; white-space: normal; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;">
      <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; margin: -35px -35px 30px -35px; border-radius: 8px 8px 0 0;">
        <h1 style="font-size: 36px; margin: 0; font-weight: 600;">${personalInfo.fullName}</h1>
        <div style="margin-top: 12px; font-size: 14px; opacity: 0.9;">
          ${personalInfo.location} | ${personalInfo.email} | ${personalInfo.phone}
        </div>
      </header>

      ${personalInfo.summary ? `
        <section style="margin-bottom: 25px; background: #f7fafc; padding: 20px; border-radius: 8px;">
          <h2 style="font-size: 16px; color: #4a5568; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">
            Professional Summary
          </h2>
          <p style="line-height: 1.6; margin: 0; font-size: 14px;">${personalInfo.summary}</p>
        </section>
      ` : ''}

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">
        <div>
          ${experience.length > 0 ? `
            <section style="margin-bottom: 25px;">
              <h2 style="font-size: 16px; color: #667eea; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">
                Work Experience
              </h2>
              ${experience.map(exp => `
                <div style="margin-bottom: 20px;">
                  <h3 style="font-size: 15px; margin: 0; color: #2d3748; font-weight: 600;">${exp.position}</h3>
                  <div style="font-size: 13px; color: #667eea; margin-top: 3px;">${exp.company}</div>
                  <div style="font-size: 12px; color: #718096; margin-top: 2px;">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
                  <p style="margin-top: 8px; line-height: 1.5; font-size: 13px; color: #4a5568;">${exp.description}</p>
                </div>
              `).join('')}
            </section>
          ` : ''}

          ${education.length > 0 ? `
            <section style="margin-bottom: 25px;">
              <h2 style="font-size: 16px; color: #667eea; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">
                Education
              </h2>
              ${education.map(edu => `
                <div style="margin-bottom: 15px;">
                  <h3 style="font-size: 15px; margin: 0; color: #2d3748; font-weight: 600;">${edu.institution}</h3>
                  <div style="font-size: 13px; color: #4a5568;">${edu.degree} in ${edu.field}</div>
                  <div style="font-size: 12px; color: #718096; margin-top: 2px;">${edu.startDate} - ${edu.endDate}</div>
                </div>
              `).join('')}
            </section>
          ` : ''}
        </div>

        <div>
          ${skills.length > 0 ? `
            <section style="margin-bottom: 25px;">
              <h2 style="font-size: 16px; color: #667eea; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">
                Skills
              </h2>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${skills.map(skill => `
                  <div style="font-size: 13px; color: #4a5568;">
                    <div style="font-weight: 500;">${skill.name}</div>
                    <div style="font-size: 11px; color: #718096;">${skill.level}</div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          ${certifications.length > 0 ? `
            <section>
              <h2 style="font-size: 16px; color: #667eea; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">
                Certifications
              </h2>
              ${certifications.map(cert => `
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 13px; font-weight: 500; color: #4a5568;">${cert.name}</div>
                  <div style="font-size: 11px; color: #718096;">${cert.issuer} · ${cert.date}</div>
                </div>
              `).join('')}
            </section>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}
