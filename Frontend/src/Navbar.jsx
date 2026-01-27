import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Fingerprint } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const BUTTON_VARIANTS = {
  hero: "bg-gradient-to-r from-primary to-purple-500 text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 hover:brightness-110",
  glass: "bg-secondary/30 border border-border backdrop-blur-xl text-foreground hover:bg-secondary/50 hover:scale-105",
};

const BUTTON_SIZES = {
  sm: "h-9 rounded-md px-3",
};

const buttonClassName = ({ variant, size, className = "" }) =>
  `${BUTTON_BASE} ${BUTTON_VARIANTS[variant] || ""} ${
    BUTTON_SIZES[size] || ""
  } ${className}`;

const ButtonLink = ({
  to,
  children,
  variant,
  size,
  className = "",
  onClick,
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={buttonClassName({ variant, size, className })}
  >
    {children}
  </Link>
);

const Button = ({
  children,
  variant,
  size,
  className = "",
  onClick,
  type = "button",
}) => (
  <button
    type={type}
    onClick={onClick}
    className={buttonClassName({ variant, size, className })}
  >
    {children}
  </button>
);

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/features" },
  { name: "How It Works", path: "/how-it-works" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const teacherName = localStorage.getItem("teacherName");
  const isAdmin = localStorage.getItem("admin") === "true";

  // Logged in if either faculty OR admin
  const isLoggedIn = Boolean(teacherName || isAdmin);

  const handleLogout = () => {
    localStorage.removeItem("teacherName");
    localStorage.removeItem("admin");   // 👈 admin logout
    setIsOpen(false);
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative px-4 py-4"
    >
      <div className="mx-auto max-w-7xl">
        <div className="glass rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full group-hover:bg-primary/50 transition-all duration-300" />
                <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-xl">
                  <Fingerprint className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <span className="text-xl font-bold text-foreground">
                <span className="gradient-text">DAR</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    location.pathname === link.path
                      ? "text-accent bg-secondary/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <div className="px-3 h-9 inline-flex items-center rounded-md bg-secondary/30 border border-border text-sm font-medium text-foreground">
                    {isAdmin ? "Admin" : teacherName}
                  </div>

                  <Button
                    size="sm"
                    onClick={handleLogout}
                    className="bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <ButtonLink to="/login" variant="glass" size="sm">
                    Login
                  </ButtonLink>
                  <ButtonLink to="/signup" variant="hero" size="sm">
                    Sign Up
                  </ButtonLink>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                        location.pathname === link.path
                          ? "text-accent bg-secondary/50"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <div className="pt-2 space-y-2">
                    {isLoggedIn ? (
                      <>
                        <div className="w-full px-4 py-3 rounded-lg text-sm font-medium bg-secondary/30 border border-border text-foreground">
                          {teacherName}
                        </div>

                        <Button
                          size="sm"
                          className="w-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30"
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <ButtonLink
                          to="/login"
                          variant="glass"
                          size="sm"
                          className="w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          Login
                        </ButtonLink>
                        <ButtonLink
                          to="/signup"
                          variant="hero"
                          size="sm"
                          className="w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          Sign Up
                        </ButtonLink>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;