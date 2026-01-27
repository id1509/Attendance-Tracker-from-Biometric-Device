import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

function getAttendanceBadge(percentage) {
  if (percentage >= 95) {
    return <Badge variant="outline" className="!bg-green-500/20 !text-green-400 border-0 font-medium">Excellent</Badge>;
  } else if (percentage >= 85) {
    return <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-0 font-medium">Good</Badge>;
  } else if (percentage >= 75) {
    return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-0 font-medium">Fair</Badge>;
  }
  return <Badge variant="outline" className="bg-destructive/10 text-destructive border-0 font-medium">Poor</Badge>;
}

export function StudentTable({ students }) {
  return (
    <Card className="animate-slide-up border-0 shadow-md" style={{ animationDelay: "200ms" }}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold">Student Attendance Records</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground">Student ID</TableHead>
                <TableHead className="font-semibold text-foreground">Name</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Days Present</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Days Absent</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Attendance %</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow
                  key={student.enrollment_no}
                  className="hover:bg-muted/30 transition-colors"
                  style={{ animationDelay: `${300 + index * 50}ms` }}
                >
                  <TableCell className="font-mono text-sm">
                    <Link
                      to={`/dashboard/student/${student.enrollment_no}`}
                      state={{ student }}
                      className="text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors"
                    >
                      {student.enrollment_no}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center min-w-[2.5rem] rounded-full bg-green-500/20 px-2.5 py-1 text-sm font-medium text-green-400">
                      {student.DaysPresent}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center min-w-[2.5rem] rounded-full bg-destructive/10 px-2.5 py-1 text-sm font-medium text-destructive">
                      {student.DaysAbsent}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-semibold">{Number(student.Attendance || 0).toFixed(1)}%</TableCell>
                  <TableCell className="text-center">{getAttendanceBadge(Number(student.Attendance || 0))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}