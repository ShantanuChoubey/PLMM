import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  MessageSquare,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/common/Container'
import { SectionHeading } from '@/components/common/SectionHeading'
import { ROUTES } from '@/constants/routes'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const features = [
  {
    icon: Users,
    title: 'Smart Mentor Matching',
    description:
      'Connect with peer and faculty mentors aligned to your goals, skills, and learning pace.',
  },
  {
    icon: MessageSquare,
    title: 'Structured Peer Learning',
    description:
      'Collaborate through guided sessions, feedback loops, and measurable learning milestones.',
  },
  {
    icon: Target,
    title: 'Goal-Oriented Growth',
    description:
      'Set learning objectives, track progress, and stay accountable with mentor support.',
  },
  {
    icon: BookOpen,
    title: 'Academic-Ready Workflows',
    description:
      'Built for institutions with scalable roles, permissions, and mentor program operations.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Create your profile',
    description: 'Tell us your role, interests, and what you want to learn or teach.',
  },
  {
    step: '02',
    title: 'Get matched',
    description: 'Our platform surfaces mentors and peers based on compatibility and availability.',
  },
  {
    step: '03',
    title: 'Learn together',
    description: 'Schedule sessions, exchange feedback, and grow through structured collaboration.',
  },
]

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.18),_transparent_45%)]"
        />
        <Container className="relative py-20 sm:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.12 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="secondary" className="mb-6">
                <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Peer Learning & Mentor Matching
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-semibold tracking-tight sm:text-6xl sm:leading-[1.05]"
            >
              Find The Right Mentor.
              <br />
              Learn Faster.
              <br />
              Grow Together.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
            >
              PLMM helps learners, peer mentors, and faculty mentors collaborate in a
              modern, scalable platform designed for meaningful academic growth.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button asChild size="lg">
                <Link to={ROUTES.REGISTER}>
                  Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to={ROUTES.REGISTER}>Become A Mentor</Link>
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="features-heading">
        <Container>
          <SectionHeading
            id="features-heading"
            eyebrow="Features"
            title="Everything you need to scale mentorship"
            description="A polished foundation for peer learning programs — from onboarding to ongoing collaboration."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <Card className="h-full border-border/70 bg-card/60 backdrop-blur">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                      <feature.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section
        className="border-y border-border/60 bg-card/20 py-20 sm:py-24"
        aria-labelledby="how-it-works-heading"
      >
        <Container>
          <SectionHeading
            id="how-it-works-heading"
            eyebrow="How It Works"
            title="A simple path from signup to growth"
            description="PLMM is designed to reduce friction and help mentorship programs launch quickly."
          />

          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((item, index) => (
              <motion.li
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="list-none"
              >
                <Card className="h-full">
                  <CardHeader>
                    <p className="text-sm font-medium text-muted-foreground">{item.step}</p>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="cta-heading">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-background p-8 sm:p-12"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="relative max-w-2xl">
              <h2 id="cta-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to build your mentorship journey?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Join PLMM today and start connecting with mentors who help you learn with
                clarity, confidence, and momentum.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link to={ROUTES.REGISTER}>Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to={ROUTES.ABOUT}>Learn More</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
