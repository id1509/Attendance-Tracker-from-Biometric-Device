import { motion } from "framer-motion";
import {
  Fingerprint,
  Server,
  UserCheck,
  RefreshCw,
  BarChart3,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <main className="relative">{children}</main>
    </div>
  );
}

function SectionHeader({ badge, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">{title}</h2>
      {description && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
      )}
    </motion.div>
  );
}

function GlassCard({ children, className, hover = true, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      className={[
        "glass rounded-2xl p-6 transition-all duration-300",
        hover ? "hover:shadow-lg hover:shadow-primary/10" : "",
        className || "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </motion.div>
  );
}

const steps = [
  {
    number: "01",
    icon: Fingerprint,
    title: "Student Scans Biometric",
    description:
      "Students scan their fingerprint or face at designated biometric terminals when entering the campus or classroom.",
    details: ["Multi-point verification", "Anti-spoofing technology", "< 1 second recognition"],
  },
  {
    number: "02",
    icon: Server,
    title: "Data Syncs to Server",
    description:
      "Attendance data is instantly transmitted to our secure cloud servers via encrypted connections.",
    details: ["256-bit encryption", "Real-time sync", "99.99% uptime"],
  },
  {
    number: "03",
    icon: UserCheck,
    title: "Faculty Validates",
    description:
      "Faculty members can verify and validate attendance during class sessions through the dashboard.",
    details: ["One-click validation", "Override capabilities", "Reason logging"],
  },
  {
    number: "04",
    icon: RefreshCw,
    title: "Real-Time Update",
    description:
      "All changes are reflected instantly across the system. Students and administrators see live updates.",
    details: ["Live notifications", "Instant sync", "Conflict resolution"],
  },
  {
    number: "05",
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Access comprehensive analytics, generate reports, and gain insights into attendance patterns.",
    details: ["Custom reports", "Trend analysis", "Export options"],
  },
];

const HowItWorks = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badge="How It Works"
            title="Simple. Automated. Reliable."
            description="Our streamlined process ensures accurate attendance tracking from entry to analytics."
          />
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary/20 hidden md:block" />

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-start gap-6 mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <GlassCard hover={false} className="inline-block w-full max-w-md">
                    <div
                      className={`flex items-center gap-4 mb-4 ${
                        index % 2 === 0 ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      <div className="p-3 rounded-xl bg-primary/10">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm text-accent font-medium">Step {step.number}</span>
                        <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <ul
                      className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}
                    >
                      {step.details.map((detail) => (
                        <li
                          key={detail}
                          className="inline-flex items-center gap-1.5 text-xs text-foreground bg-secondary/50 px-3 py-1.5 rounded-full"
                        >
                          <CheckCircle2 className="w-3 h-3 text-accent" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </div>

                {/* Center Node */}
                <div className="hidden md:flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/30"
                  >
                    {step.number}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className="my-4"
                    >
                      <ArrowDown className="w-5 h-5 text-accent animate-bounce" />
                    </motion.div>
                  )}
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { value: "< 1s", label: "Scan Time" },
                { value: "Real-time", label: "Data Sync" },
                { value: "100%", label: "Accuracy" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;
