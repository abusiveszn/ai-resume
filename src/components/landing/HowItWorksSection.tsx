import { motion } from 'framer-motion';
import { UserPlus, Edit3, Sparkles, FileCheck, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Sign up for free and enter your personal information, work experience, education, and skills.',
    color: 'bg-blue-500',
  },
  {
    number: '02',
    icon: Edit3,
    title: 'Build Your Resume',
    description: 'Use our intuitive builder to add your details. Choose from multiple professional templates.',
    color: 'bg-purple-500',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Get AI Suggestions',
    description: 'Our AI analyzes your resume and provides personalized tips to improve content and formatting.',
    color: 'bg-amber-500',
  },
  {
    number: '04',
    icon: FileCheck,
    title: 'Match with Jobs',
    description: 'Paste any job description to see how well your resume matches and get improvement suggestions.',
    color: 'bg-green-500',
  },
  {
    number: '05',
    icon: Rocket,
    title: 'Export & Apply',
    description: 'Download your polished resume as a PDF and start applying to your dream jobs with confidence.',
    color: 'bg-pink-500',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
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
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Build Your Resume in{' '}
            <span className="text-primary">5 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process makes creating a professional resume quick and easy. 
            No design skills needed.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 1 ? 'lg:text-right' : ''}`}>
                  <div className={`inline-flex items-center gap-3 mb-3 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <span className="text-5xl font-bold text-primary/20">{step.number}</span>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground max-w-md mx-auto lg:mx-0">
                    {step.description}
                  </p>
                </div>

                {/* Icon Circle */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  {/* Pulse Effect */}
                  <div className={`absolute inset-0 ${step.color} rounded-full animate-ping opacity-20`} />
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
