import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Is AI Resume Assistant free to use?',
    answer: 'Yes! Our basic resume builder is completely free. You can create, edit, and download your resume without any cost. We also offer premium features like advanced AI suggestions and unlimited resume versions for power users.',
  },
  {
    question: 'How does the AI improvement feature work?',
    answer: 'Our AI analyzes your resume content and provides personalized suggestions to improve clarity, add powerful action verbs, quantify achievements, and optimize for ATS systems. It acts like having a professional resume writer guide you through the process.',
  },
  {
    question: 'What is ATS and why does it matter?',
    answer: 'ATS stands for Applicant Tracking System - software used by employers to filter resumes. Our templates are specifically designed to be ATS-friendly, ensuring your resume gets past automated filters and into the hands of recruiters.',
  },
  {
    question: 'Can I customize the templates?',
    answer: 'Absolutely! While our templates provide a professional foundation, you have full control over content, sections, and layout. You can add, remove, or rearrange sections to best showcase your unique experience.',
  },
  {
    question: 'How accurate is the job description matcher?',
    answer: 'Our job matcher analyzes both your resume and the job description to identify keyword matches, skill gaps, and provide a compatibility score. While not perfect, it gives you valuable insights to tailor your application.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take data security seriously. All information is encrypted, and we never share your personal data with third parties. You can also delete your account and all associated data at any time.',
  },
  {
    question: 'Can I create multiple resumes?',
    answer: 'Yes! You can create unlimited resumes for different job applications. This allows you to tailor each resume to specific roles and industries without starting from scratch.',
  },
  {
    question: 'What file formats can I export to?',
    answer: 'Currently, we support PDF export which is the industry standard for job applications. We\'re working on adding Word (.docx) and plain text export options in the near future.',
  },
  {
    question: 'Do you offer cover letter generation?',
    answer: 'Cover letter generation is on our roadmap! Soon you\'ll be able to generate personalized cover letters that match your resume and target specific job postings.',
  },
  {
    question: 'How do I get started?',
    answer: 'Simply click the "Get Started" button, fill in your personal information, work experience, education, and skills. Our AI will guide you with suggestions along the way. You can preview and export your resume in minutes!',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked{' '}
            <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. If you can't find what you're looking for, 
            feel free to contact us.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-lg border px-6"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
