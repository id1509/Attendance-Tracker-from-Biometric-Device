import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Fingerprint, 
  Shield, 
  Clock, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Zap,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Fingerprint,
    title: "Biometric Sync",
    description: "Seamless integration with biometric devices",
  },
  {
    icon: Clock,
    title: "Real-Time Updates",
    description: "Instant attendance synchronization",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade data protection",
  },
];

const stats = [
  { value: "99.9%", label: "Accuracy Rate" },
  { value: "500+", label: "Institutions" },
  { value: "1M+", label: "Students Tracked" },
  { value: "24/7", label: "System Uptime" },
];

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const BUTTON_VARIANTS = {
  hero: "bg-gradient-to-r from-primary to-purple-500 text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 hover:brightness-110",
  glass: "bg-secondary/30 border border-border backdrop-blur-xl text-foreground hover:bg-secondary/50 hover:scale-105",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
};

const BUTTON_SIZES = {
  lg: "h-12 rounded-xl px-8 text-base",
  xl: "h-14 rounded-xl px-10 text-lg",
};

const Button = ({ children, variant, size, className = "", ...props }) => (
  <button
    className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

const GlassCard = ({ children, className = "", hover = true, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
    className={`glass rounded-2xl p-6 transition-all duration-300 ${hover ? "hover:shadow-lg hover:shadow-primary/10" : ""} ${className}`}
  >
    {children}
  </motion.div>
);

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-8">
              <Zap className="w-4 h-4" />
              Next-Gen Attendance Management
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
          >
            Digital Attendance
            <br />
            <span className="gradient-text">Register</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Smart, Automated & Real-Time Attendance Management. 
            Transform how your institution tracks and validates attendance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button variant="hero" size="xl" onClick={() => navigate("/form")}>
              Enter Details
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="xl" onClick={() => navigate("/features")}>
              Learn More
            </Button>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative mx-auto max-w-4xl"
          >
            <div className="glass rounded-3xl p-8 overflow-hidden">
              {/* Mock Dashboard Preview */}
              <div className="relative bg-card/80 rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                
                {/* Mock Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Present Today", value: "847", color: "text-green-400" },
                    { label: "Absent", value: "23", color: "text-destructive" },
                    { label: "Pending", value: "12", color: "text-yellow-400" },
                  ].map((stat) => (
                    <div key={stat.label} className="glass rounded-xl p-4 text-center">
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Mock Table */}
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Student {i}</p>
                          <p className="text-xs text-muted-foreground">ID: STU00{i}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        Present
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 glass rounded-2xl p-4 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Sync Complete</p>
                  <p className="text-xs text-muted-foreground">847 records updated</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Attendance Rate</p>
                  <p className="text-xs text-accent">97.3% today</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-border bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose DAR?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built for modern educational institutions that demand accuracy and efficiency.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <GlassCard key={feature.title} delay={index * 0.1}>
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </GlassCard>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg" onClick={() => navigate("/features")} className="flex items-center gap-2">
              Explore All Features
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="text-center py-12 px-8" hover={false}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Transform Attendance?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join hundreds of institutions already using Digital Attendance Register 
                for seamless, accurate attendance management.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="lg" onClick={() => navigate("/login")}>
                  Get Started Today
                </Button>
                <Button variant="glass" size="lg" onClick={() => navigate("/how-it-works")}>
                  See How It Works
                </Button>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}