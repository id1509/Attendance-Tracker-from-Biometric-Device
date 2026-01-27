import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Fingerprint,
  Users,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-3 w-full rounded-xl px-6 py-4 text-base font-semibold transition-all duration-300";

export default function Admin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl" />

          <div className="relative glass rounded-3xl p-8 md:p-10">
            {/* Logo and Header */}
            <div className="flex flex-col items-center mb-8">
              {/* Logo */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse-slow" />
                <div className="relative bg-gradient-to-br from-primary to-accent p-4 rounded-xl">
                  <Fingerprint className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>

              {/* Header */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Choose which dashboard you want to manage
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {/* Faculty Dashboard */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/admin/faculty")}
                className={`${BUTTON_BASE} bg-gradient-to-r from-primary to-purple-500 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50`}
              >
                <Users className="w-6 h-6" />
                Faculty Dashboard
                <ArrowRight className="w-5 h-5 ml-auto" />
              </motion.button>

              {/* Student Dashboard */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/admin/student")}
                className={`${BUTTON_BASE} border border-border bg-background hover:bg-accent hover:text-accent-foreground`}
              >
                <GraduationCap className="w-6 h-6" />
                Student Dashboard
                <ArrowRight className="w-5 h-5 ml-auto" />
              </motion.button>
            </div>

            {/* Back */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}