import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, User, UserCheck, UserX, Percent, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";
import { StudentPieChart } from "../components/dashboard/StudentPieChart";
import axios from "axios";

function getAttendanceBadge(percentage) {
  if (percentage >= 95) {
    return <Badge variant="outline" className="!bg-green-500/20 !text-green-400 border-0 font-medium text-base px-4 py-1">Excellent</Badge>;
  } else if (percentage >= 85) {
    return <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-0 font-medium text-base px-4 py-1">Good</Badge>;
  } else if (percentage >= 75) {
    return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-0 font-medium text-base px-4 py-1">Fair</Badge>;
  }
  return <Badge variant="outline" className="bg-destructive/10 text-destructive border-0 font-medium text-base px-4 py-1">Poor</Badge>;
}

const StudentDashboard = () => {
  const { studentId } = useParams();
  const location = useLocation();
  const [student, setStudent] = useState(() =>
    location.state?.student && String(location.state.student.enrollment_no) === String(studentId)
      ? location.state.student
      : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (student) return;

    let filters = null;
    try {
      const raw = sessionStorage.getItem("dashboardFilters");
      filters = raw ? JSON.parse(raw) : null;
    } catch {
      filters = null;
    }

    if (!filters?.courseName || !filters?.dept || !filters?.year || !filters?.section) {
      return;
    }

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("https://attendance-tracker-from-biometric-device.onrender.com/users/dashboard", {
          params: {
            course: filters.courseName,
            dept: filters.dept,
            year: Number(filters.year),
            section: filters.section,
          },
        });

        const found = (res.data.students || []).find(
          (s) => String(s.enrollment_no) === String(studentId)
        );

        if (!found) {
          setError("Student not found for selected filters");
          return;
        }

        setStudent(found);
      } catch (e) {
        setError(e?.response?.data?.error || "Failed to load student");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [student, studentId]);

  if (!student && loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-24">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Loading student...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-24">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className={error ? "text-destructive mb-4" : "text-muted-foreground mb-4"}>
              {error || "Student not found"}
            </p>
            <Link to="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalDays = Number(student.DaysPresent || 0) + Number(student.DaysAbsent || 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-24 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary p-2.5">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{student.name}</h1>
                <p className="text-sm text-muted-foreground">Student ID: {student.enrollment_no}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pt-32">
        <div className="mb-8 flex items-center gap-3">
          <span className="text-muted-foreground">Attendance Status:</span>
          {getAttendanceBadge(Number(student.Attendance || 0))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-md animate-slide-up" style={{ animationDelay: "0ms" }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Days</p>
                  <p className="text-2xl font-bold text-foreground">{totalDays}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md animate-slide-up" style={{ animationDelay: "50ms" }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-green-500/20 p-3">
                  <UserCheck className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Days Present</p>
                  <p className="text-2xl font-bold text-green-400">{student.DaysPresent}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-destructive/10 p-3">
                  <UserX className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Days Absent</p>
                  <p className="text-2xl font-bold text-destructive">{student.DaysAbsent}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md animate-slide-up" style={{ animationDelay: "150ms" }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-yellow-500/20 p-3">
                  <Percent className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                  <p className="text-2xl font-bold text-foreground">{Number(student.Attendance || 0).toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StudentPieChart student={student} />
          <Card className="border-0 shadow-md animate-slide-up" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Student Name</span>
                  <span className="font-medium">{student.name}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Student ID</span>
                  <span className="font-mono text-sm">{student.enrollment_no}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Total School Days</span>
                  <span className="font-medium">{totalDays}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Days Present</span>
                  <span className="font-medium text-green-400">{student.DaysPresent}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Days Absent</span>
                  <span className="font-medium text-destructive">{student.DaysAbsent}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">Attendance Percentage</span>
                  <span className="font-bold text-lg">{Number(student.Attendance || 0).toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
