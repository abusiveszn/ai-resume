import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    company: 'Google',
    image: 'SJ',
    rating: 5,
    text: 'The AI suggestions were incredibly helpful. I went from zero callbacks to three interviews in just two weeks. The job matcher feature helped me tailor my resume perfectly for each application.',
  },
  {
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'Microsoft',
    image: 'MC',
    rating: 5,
    text: 'I was skeptical at first, but this tool exceeded my expectations. The templates look professional and the AI recommendations really improved my resume quality. Highly recommended!',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Director',
    company: 'Adobe',
    image: 'ER',
    rating: 5,
    text: 'As someone who has reviewed thousands of resumes, I can say this tool creates resumes that actually stand out. The ATS optimization is a game-changer.',
  },
  {
    name: 'David Park',
    role: 'Data Scientist',
    company: 'Netflix',
    image: 'DP',
    rating: 5,
    text: 'The job description matcher is brilliant. It showed me exactly what keywords I was missing and helped me improve my match score from 45% to 89%. Landed my dream job!',
  },
  {
    name: 'Lisa Thompson',
    role: 'UX Designer',
    company: 'Airbnb',
    image: 'LT',
    rating: 5,
    text: 'Clean interface, easy to use, and the results are fantastic. I love how I can switch between templates and see my resume in different styles instantly.',
  },
  {
    name: 'James Wilson',
    role: 'Financial Analyst',
    company: 'Goldman Sachs',
    image: 'JW',
    rating: 5,
    text: 'The resume score feature gave me actionable insights. Within a week of implementing the AI suggestions, I started getting interview calls. Best investment for my career.',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-background">
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
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Loved by{' '}
            <span className="text-primary">Job Seekers</span> Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who have successfully landed their dream jobs 
            using our AI-powered resume builder.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">Trusted by professionals from</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix'].map((company) => (
              <span key={company} className="text-xl font-bold text-muted-foreground">
                {company}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
