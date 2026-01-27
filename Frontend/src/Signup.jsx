import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Fingerprint, ArrowRight, User } from "lucide-react";

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

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/users/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      console.log("Server Response:", response.data);
      alert("Signup successful!");
      navigate("/login");

    } catch (error) {
      console.log("🔥 FULL AXIOS ERROR:", error);

      if (error.response) {
        console.log("➡️ status:", error.response.status);
        console.log("➡️ data:", error.response.data);
        alert(JSON.stringify(error.response.data));
      } else {
        alert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
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

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Create Account</h1>
              <p className="text-muted-foreground">Join and start tracking attendance</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-11 h-12 bg-secondary/50 border-border focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="faculty@institution.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-11 h-12 bg-secondary/50 border-border focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-11 pr-11 h-12 bg-secondary/50 border-border focus:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Button */}
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading} onClick={() => navigate("/login")}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign Up
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
              </div>

              <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => navigate("/login")}>
                <span className="flex items-center gap-2">Sign in to your account</span>
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-accent hover:text-accent/80 transition-colors">
                Already have an account? Login
              </Link>
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