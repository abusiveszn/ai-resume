import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Target, 
  FileText, 
  Zap, 
  Shield, 
  Download,
  Palette,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Improvements',
    description: 'Get intelligent suggestions to enhance your resume content, fix grammar, and add powerful action verbs that catch recruiter attention.',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
  },
  {
    icon: Target,
    title: 'Job Description Matcher',
    description: 'Compare your resume against any job posting. Get a match score and specific recommendations to improve your chances.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: FileText,
    title: 'ATS-Friendly Templates',
    description: 'Choose from 4 professionally designed templates optimized for Applicant Tracking Systems. Modern, Classic, Minimal, and Professional.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Zap,
    title: 'Instant PDF Export',
    description: 'Download your resume as a high-quality PDF in seconds. Print-ready and perfectly formatted for any application.',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
  },
  {
    icon: Shield,
    title: 'Privacy Protected',
    description: 'Your data stays secure. We use industry-standard encryption and never share your personal information with third parties.',
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-50',
  },
  {
    icon: Palette,
    title: 'Easy Customization',
    description: 'Intuitive drag-and-drop interface makes building your resume effortless. No design skills required.',
    color: 'from-indigo-500 to-violet-500',
    bgColor: 'bg-indigo-50',
  },
  {
    icon: BarChart3,
    title: 'Resume Score & Analytics',
    description: 'Get detailed insights on your resume strengths and weaknesses with actionable improvement tips.',
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-50',
  },
  {
    icon: Download,
    title: 'Multiple Export Options',
    description: 'Export your resume in various formats. PDF for applications, and soon Word and plain text options.',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
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
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="text-primary">Land the Job</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform provides all the tools you need to create, 
            optimize, and tailor your resume for any job application.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-6 w-6 bg-gradient-to-br ${feature.color} bg-clip-text`} style={{ color: 'inherit' }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
