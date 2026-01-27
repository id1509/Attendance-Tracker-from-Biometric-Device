import React from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart3 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function AttendanceBarChart({ students }) {
  const topStudents = [...students]
    .sort((a, b) => Number(b.Attendance || 0) - Number(a.Attendance || 0))
    .slice(0, 10);

  const data = {
    labels: topStudents.map(student => 
      `${student.Name} (${student.StudentId})`
    ),
    datasets: [
      {
        label: 'Days Present',
        data: topStudents.map(student => Number(student.DaysPresent || 0)),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Days Absent',
        data: topStudents.map(student => Number(student.DaysAbsent || 0)),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
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
            const label = context[0].label;
            const parts = label.split(' (');
            return `${parts[0]} - ID: ${parts[1]?.replace(')', '') || 'N/A'}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          },
          callback: function(value, index) {
            const label = this.getLabelForValue(value);
            const parts = label.split(' (');
            if (parts[0].length > 15) {
              return parts[0].substring(0, 15) + '...';
            }
            return parts[0];
          }
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Days',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <Card className="animate-slide-up border-0 shadow-md" style={{ animationDelay: "400ms" }}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-orange-500/10 p-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
          </div>
          <CardTitle className="text-xl font-semibold">Top 10 Students Attendance</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
