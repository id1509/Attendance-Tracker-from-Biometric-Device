import React from "react";
import { Pie } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PieChart } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function AttendancePieChart({ students }) {
  const attendanceData = students.reduce((acc, student) => {
    const attendance = Number(student.Attendance || 0);
    if (attendance >= 95) acc.excellent++;
    else if (attendance >= 85) acc.good++;
    else if (attendance >= 75) acc.fair++;
    else acc.poor++;
    return acc;
  }, { excellent: 0, good: 0, fair: 0, poor: 0 });

  const data = {
    labels: ['Excellent (95%+)', 'Good (85-94%)', 'Fair (75-84%)', 'Poor (<75%)'],
    datasets: [
      {
        data: [attendanceData.excellent, attendanceData.good, attendanceData.fair, attendanceData.poor],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // green
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(250, 204, 21, 0.8)',  // yellow
          'rgba(239, 68, 68, 0.8)',   // red
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(250, 204, 21, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} students (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <Card className="animate-slide-up border-0 shadow-md" style={{ animationDelay: "300ms" }}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-500/10 p-2">
            <PieChart className="h-5 w-5 text-purple-500" />
          </div>
          <CardTitle className="text-xl font-semibold">Attendance Distribution</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Pie data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
