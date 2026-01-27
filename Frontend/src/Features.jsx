import { motion } from "framer-motion";
import {
  Fingerprint,
  Shield,
  Clock,
  Users,
  FileText,
  Building2,
  Zap,
  Bell,
  RefreshCw,
  Lock,
  BarChart3,
  Smartphone,
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

const features = [
  {
    icon: Fingerprint,
    title: "Automated Biometric Sync",
    description:
      "Seamlessly sync attendance data from biometric devices across all entry points. No manual intervention needed.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Real-Time Faculty Validation",
    description:
      "Faculty can instantly validate and verify attendance during live class sessions with one click.",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    icon: RefreshCw,
    title: "Live Classroom Reconciliation",
    description:
      "Automatically reconcile discrepancies between biometric and manual attendance in real-time.",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
  },
  {
    icon: FileText,
    title: "Zero Manual Paperwork",
    description:
      "Eliminate paper registers completely. All records are digital, searchable, and exportable.",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  {
    icon: BarChart3,
    title: "Instant Daily Reports",
    description:
      "Generate comprehensive attendance reports instantly. Filter by department, date, or individual.",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
  },
  {
    icon: Building2,
    title: "Multi-Department Monitoring",
    description:
      "Monitor attendance across all departments from a single unified dashboard.",
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
  },
];

const additionalFeatures = [
  { icon: Bell, text: "Instant Notifications" },
  { icon: Lock, text: "Role-Based Access" },
  { icon: Smartphone, text: "Mobile Responsive" },
  { icon: Zap, text: "Lightning Fast" },
  { icon: Users, text: "Unlimited Users" },
  { icon: Clock, text: "24/7 Availability" },
];

const Features = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badge="Features"
            title="Everything You Need for Modern Attendance"
            description="Powerful features designed to make attendance management effortless, accurate, and transparent."
          />
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <GlassCard key={feature.title} delay={index * 0.1} className="group">
                <div
                  className={`p-3 rounded-xl ${feature.bgColor} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12"
          >
            <h3 className="text-2xl font-bold text-foreground text-center mb-8">And So Much More...</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <feature.icon className="w-6 h-6 text-accent" />
                  <span className="text-sm font-medium text-foreground text-center">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Traditional vs Digital</h2>
            <p className="text-muted-foreground">See the difference modern attendance management makes.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional */}
            <GlassCard className="border-destructive/20">
              <h3 className="text-xl font-semibold text-destructive mb-6">Traditional Methods</h3>
              <ul className="space-y-4">
                {[
                  "Manual paper registers",
                  "Prone to proxy attendance",
                  "Time-consuming data entry",
                  "Delayed report generation",
                  "Risk of data loss",
                  "Limited accessibility",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Digital */}
            <GlassCard className="border-green-400/20 gradient-border">
              <h3 className="text-xl font-semibold text-green-400 mb-6">Digital Attendance Register</h3>
              <ul className="space-y-4">
                {[
                  "Automated biometric tracking",
                  "100% verified attendance",
                  "Instant data synchronization",
                  "Real-time reports & analytics",
                  "Secure cloud backup",
                  "Access from anywhere",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Features;
