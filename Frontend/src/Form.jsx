import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Fingerprint,
  GraduationCap,
  Layers,
  ListChecks,
} from "lucide-react";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const BUTTON_VARIANTS = {
  hero: "bg-gradient-to-r from-primary to-purple-500 text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 hover:brightness-110",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
};

const BUTTON_SIZES = {
  lg: "h-12 rounded-xl px-8 text-base",
};

const Button = ({ children, variant, size, className = "", ...props }) => (
  <button
    className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ className = "", ...props }) => (
  <label className={`text-sm font-medium leading-none ${className}`} {...props} />
);

export default function Form() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseName: "",
    dept: "",
    year: "",
    section: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    navigate("/view", {
      state: {
        courseName: formData.courseName,
        dept: formData.dept,
        year: formData.year,
        section: formData.section,
      },
    });
  };

  const handleViewAll = () => {
    navigate("/view", {
      state: {
        courseName: "",
        dept: "",
        year: "",
        section: "",
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl" />

          <div className="relative glass rounded-3xl p-8 md:p-10">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse-slow" />
                <div className="relative bg-gradient-to-br from-primary to-accent p-4 rounded-2xl">
                  <Fingerprint className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Filter Students</h1>
              <p className="text-muted-foreground">Select class details to load the student list</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="courseName" className="text-foreground">
                  Course Name
                </Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="courseName"
                    type="text"
                    name="courseName"
                    placeholder="Enter course name"
                    value={formData.courseName}
                    onChange={handleChange}
                    className="pl-11 h-12 bg-secondary/50 border-border focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dept" className="text-foreground">
                  Department
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="dept"
                    type="text"
                    name="dept"
                    placeholder="Enter department"
                    value={formData.dept}
                    onChange={handleChange}
                    className="pl-11 h-12 bg-secondary/50 border-border focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" className="text-foreground">
                  Year
                </Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="flex w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-11 h-12 border-border focus:border-primary"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section" className="text-foreground">
                  Section
                </Label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="section"
                    type="text"
                    name="section"
                    placeholder="Enter section (e.g., A, B, C)"
                    value={formData.section}
                    onChange={handleChange}
                    className="pl-11 h-12 bg-secondary/50 border-border focus:border-primary"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Edit Attendance
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
              </div>
            </form>
            
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setIsLoading(true);
                navigate("/dashboard", {
                  state: {
                    courseName: formData.courseName,
                    dept: formData.dept,
                    year: formData.year,
                    section: formData.section,
                  },
                });
              }}
              className="
    w-full inline-flex items-center justify-center gap-2
    rounded-lg px-6 py-3 text-sm font-medium
    transition-all duration-300
    bg-primary text-primary-foreground
    hover:opacity-90
    disabled:opacity-60 disabled:cursor-not-allowed
  "
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                  Loading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Show Attendance Record
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    courseName: "",
                    dept: "",
                    year: "",
                    section: "",
                  })
                }
                className="text-sm text-accent hover:text-accent/80 transition-colors"
              >
                Clear filters
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}