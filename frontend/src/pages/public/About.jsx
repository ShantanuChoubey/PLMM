import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/common/Container'
import { SectionHeading } from '@/components/common/SectionHeading'

const values = [
  {
    title: 'Accessibility',
    description:
      'Mentorship should be discoverable and inclusive for every learner, regardless of background.',
  },
  {
    title: 'Quality Connections',
    description:
      'We prioritize meaningful matches over volume, helping learners find mentors who truly fit.',
  },
  {
    title: 'Institutional Scale',
    description:
      'PLMM is architected to support universities and programs with multiple mentor roles and workflows.',
  },
]

export default function About() {
  return (
    <Container className="py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-3xl text-center"
      >
        <Badge variant="secondary" className="mb-4">
          About PLMM
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Building better peer learning experiences
        </h1>
        <p className="mt-6 text-base text-muted-foreground sm:text-lg">
          The Peer Learning & Mentor Matching Platform (PLMM) connects learners with peer
          mentors and faculty mentors through a modern SaaS experience. Our mission is to
          make mentorship programs easier to launch, manage, and scale across academic
          institutions.
        </p>
      </motion.div>

      <div className="mt-16">
        <SectionHeading
          align="left"
          title="Why PLMM exists"
          description="Traditional mentorship programs often rely on spreadsheets, email threads, and manual coordination. PLMM provides a dedicated foundation for structured learning relationships."
        />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <section className="mt-16 rounded-2xl border border-border bg-card/40 p-8 sm:p-10">
        <h2 className="text-2xl font-semibold tracking-tight">What&apos;s next</h2>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Sprint 1 establishes the frontend foundation — routing, theming, UI primitives,
          and public pages. Future sprints will introduce authentication, role-based
          dashboards, mentor workflows, learner experiences, and admin tooling on top of
          this scalable architecture.
        </p>
      </section>
    </Container>
  )
}
