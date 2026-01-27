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

export function StudentPieChart({ student }) {
  const daysPresent = Number(student.DaysPresent || 0);
  const daysAbsent = Number(student.DaysAbsent || 0);
  const totalDays = daysPresent + daysAbsent;

  const data = {
    labels: ['Days Present', 'Days Absent'],
    datasets: [
      {
        data: [daysPresent, daysAbsent],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // green
          'rgba(239, 68, 68, 0.8)',   // red
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
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
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const percentage = ((context.parsed / totalDays) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} days (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <Card className="animate-slide-up border-0 shadow-md" style={{ animationDelay: "250ms" }}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-500/10 p-2">
            <PieChart className="h-5 w-5 text-purple-500" />
          </div>
          <CardTitle className="text-xl font-semibold">Attendance Breakdown</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Pie data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
