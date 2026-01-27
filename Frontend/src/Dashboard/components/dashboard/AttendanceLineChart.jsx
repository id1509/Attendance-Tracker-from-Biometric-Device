import React from "react";
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function AttendanceLineChart({ students }) {
  const sortedStudents = [...students]
    .sort((a, b) => Number(a.enrollment_no) - Number(b.enrollment_no))
    .slice(0, 20);

  const data = {
    labels: sortedStudents.map(student => student.enrollment_no),
    datasets: [
      {
        label: 'Attendance %',
        data: sortedStudents.map(student => Number(student.Attendance || 0)),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            const studentId = context[0].label;
            const student = sortedStudents.find(s => s.enrollment_no === studentId);
            return `Student ID: ${studentId}${student ? ` - ${student.name}` : ''}`;
          },
          label: function(context) {
            return `Attendance: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Student ID',
          font: {
            size: 12,
          },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Attendance Percentage (%)',
          font: {
            size: 12,
          },
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <Card className="animate-slide-up border-0 shadow-md" style={{ animationDelay: "400ms" }}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/10 p-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <CardTitle className="text-xl font-semibold">Attendance Trends</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}