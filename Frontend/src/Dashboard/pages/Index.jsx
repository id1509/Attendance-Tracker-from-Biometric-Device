import React, { useEffect, useMemo, useState } from "react";
import { StatCard } from "../components/dashboard/StatCard";
import { StudentTable } from "../components/dashboard/StudentTable";
import { AttendancePieChart } from "../components/dashboard/AttendancePieChart";
import { AttendanceLineChart } from "../components/dashboard/AttendanceLineChart";
import { Users, UserCheck, UserX, Percent, GraduationCap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Index = () => {
  const location = useLocation();

  const [filters, setFilters] = useState(() => {
    if (location.state) return location.state;
    try {
      const raw = sessionStorage.getItem("dashboardFilters");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (location.state) {
      setFilters(location.state);
      sessionStorage.setItem("dashboardFilters", JSON.stringify(location.state));
    }
  }, [location.state]);

  const hasFilters = Boolean(
    filters?.courseName && filters?.dept && filters?.year && filters?.section
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalPresent: 0,
    totalAbsent: 0,
    avgAttendance: 0,
  });

  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!hasFilters) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          "https://attendance-tracker-from-biometric-device.onrender.com/users/attendance-summary",
          {
            params: {
              course: filters.courseName,
              dept: filters.dept,
              year: Number(filters.year),
              section: filters.section,
            },
          }
        );

        setMetrics(res.data.summary);
        setStudents(res.data.students);
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to load attendance");
        setMetrics({
          totalStudents: 0,
          totalPresent: 0,
          totalAbsent: 0,
          avgAttendance: 0,
        });
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, hasFilters]);

  const subtitle = useMemo(() => {
    if (!hasFilters) return "";
    return `${filters.courseName} • ${filters.dept} • Year ${filters.year} • ${filters.section}`;
  }, [filters, hasFilters]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <div className="rounded-xl bg-primary p-2.5">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Class Attendance Dashboard</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pt-32">
        {!hasFilters ? (
          <div className="rounded-xl border p-6">
            <p>Select filters to view attendance</p>
            <Link to="/form" className="text-primary underline">
              Go to Filters
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-lg border border-destructive p-3 text-destructive">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Students"
                value={loading ? "…" : metrics.totalStudents}
                icon={Users}
              />
              <StatCard
                title="Total Present Days"
                value={loading ? "…" : metrics.totalPresent}
                icon={UserCheck}
              />
              <StatCard
                title="Total Class Days"
                value={loading ? "…" : metrics.maxDaysPresent}
                icon={UserX}
              />
              <StatCard
                title="Average Attendance"
                value={loading ? "…" : `${metrics.avgAttendance}%`}
                icon={Percent}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <AttendancePieChart students={students} />
              <AttendanceLineChart students={students} />
            </div>

            <StudentTable students={students} />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
