import React, { useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const BUTTON_VARIANTS = {
  hero: "bg-gradient-to-r from-primary to-purple-500 text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 hover:brightness-110",
  success:
    "bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:scale-[1.02]",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
};

const BUTTON_SIZES = {
  md: "h-12 rounded-xl px-6 text-base",
  lg: "h-12 rounded-xl px-8 text-base",
};

const Button = ({
  children,
  variant = "outline",
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function AttendanceSummary() {
  const location = useLocation();
  const { courseName, dept, year, section } = location.state || {};

  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState([]);
  const [attendanceChanges, setAttendanceChanges] = useState({});

  // ======================
  // LOAD STUDENTS
  // ======================
  const handleLoad = async () => {
    try {
      const res = await axios.get("https://attendance-tracker-from-biometric-device.onrender.com/users/students", {
        params: {
          course: courseName,
          dept,
          year: Number(year),
          section,
        },
      });

      const { summary, details } = res.data;

      setSummary(summary);
      setDetails(details);

      const initial = {};
      details.forEach((s) => {
        initial[s.enrollment_no] = s.status === "Present";
      });
      setAttendanceChanges(initial);
    } catch (err) {
      console.error(err);
      alert("Failed to load students");
    }
  };

  // ======================
  // TOGGLE CHECKBOX
  // ======================
  const handleCheckboxChange = (enrollment_no) => {
    setAttendanceChanges((prev) => ({
      ...prev,
      [enrollment_no]: !prev[enrollment_no],
    }));
  };

  // ======================
  // SUBMIT ATTENDANCE
  // ======================
  const handleSubmitAttendance = async () => {
    try {
      const updates = details.map((student) => ({
        enrollment_no: student.enrollment_no,
        status: attendanceChanges[student.enrollment_no]
          ? "Present"
          : "Absent",
      }));

      const marked_by_name = localStorage.getItem("teacherName");

      await axios.post("https://attendance-tracker-from-biometric-device.onrender.com/users/update-attendance", {
        updates,
        marked_by_name,
      });

      alert("Attendance finalized successfully");

      // OPTIONAL: clear UI after submit
      setSummary(null);
      setDetails([]);
      setAttendanceChanges({});
    } catch (err) {
      console.error(err);
      alert("Failed to update attendance");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="min-h-screen px-6 pt-32 pb-16">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-6xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl" />

          <div className="relative glass rounded-3xl p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse-slow" />
                  <div className="relative bg-gradient-to-br from-primary to-accent p-3 rounded-2xl">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Attendance Summary
                  </h1>
                  <p className="text-muted-foreground">
                    {courseName && dept && year && section
                      ? `${courseName} - ${dept} Year ${year} Section ${section}`
                      : "All Students"}
                  </p>
                </div>
              </div>

              <Link to="/form">
                <Button variant="outline" size="lg">
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </Button>
              </Link>
            </div>

            <Button
              onClick={handleLoad}
              variant="hero"
              size="lg"
              className="w-full"
            >
              <RefreshCw className="w-5 h-5" />
              Load Students
            </Button>

            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-3 gap-6 mt-8"
              >
                <div className="glass rounded-2xl p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">
                    {summary.totalStudents}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Students
                  </p>
                </div>

                <div className="glass rounded-2xl p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-green-500/20 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-green-400">
                    {summary.present}
                  </p>
                  <p className="text-sm text-muted-foreground">Present</p>
                </div>

                <div className="glass rounded-2xl p-6 text-center">
                  <div className="inline-flex p-3 rounded-xl bg-red-500/20 mb-4">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-3xl font-bold text-red-400">
                    {summary.absent}
                  </p>
                  <p className="text-sm text-muted-foreground">Absent</p>
                </div>
              </motion.div>
            )}

            {details.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8"
              >
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border">
                          <th className="p-4 text-left text-sm font-medium text-foreground">
                            Enrollment No
                          </th>
                          <th className="p-4 text-left text-sm font-medium text-foreground">
                            Name
                          </th>
                          <th className="p-4 text-center text-sm font-medium text-foreground">
                            Status
                          </th>
                          <th className="p-4 text-center text-sm font-medium text-foreground">
                            Mark Present
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {details.map((s, index) => (
                          <motion.tr
                            key={s.enrollment_no}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05,
                            }}
                            className="border-b border-border hover:bg-secondary/20 transition-colors"
                          >
                            <td className="p-4">
                              <span className="font-mono text-sm">
                                {s.enrollment_no}
                              </span>
                            </td>

                            <td className="p-4">
                              <span className="font-medium text-foreground">
                                {s.name}
                              </span>
                            </td>

                            <td className="p-4 text-center">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                                  attendanceChanges[s.enrollment_no]
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {attendanceChanges[s.enrollment_no] ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3" />
                                    Present
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3" />
                                    Absent
                                  </>
                                )}
                              </span>
                            </td>

                            <td className="p-4 text-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!attendanceChanges[s.enrollment_no]}
                                  onChange={() =>
                                    handleCheckboxChange(s.enrollment_no)
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                              </label>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-8"
                >
                  <Button
                    onClick={handleSubmitAttendance}
                    variant="success"
                    size="lg"
                    className="w-full"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Submit Attendance
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
