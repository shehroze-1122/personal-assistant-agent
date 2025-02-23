import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { TimeDistributionPerDay } from "@/lib/tools/schemas";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type EventFrequencyByDayChartProps = TimeDistributionPerDay;

const EventFrequencyByDayChart = ({ data }: EventFrequencyByDayChartProps) => {
  // Initialize an array to store the number of events per day of the week (Sunday to Saturday)
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const eventCountsMap = Object.fromEntries(
    data.map((event) => [event.day, event.count])
  );

  // Data for the bar chart
  const barChartDataset = {
    labels: daysOfWeek,
    datasets: [
      {
        label: "Number of Events",
        data: daysOfWeek.map((day) => eventCountsMap[day]),
        backgroundColor: "#4CAF50", // Color of the bars
        borderColor: "#388E3C", // Border color of the bars
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Event Frequency by Day of Week",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="flex justify-center w-full" style={{ width: "500px" }}>
      <Bar data={barChartDataset} options={barChartOptions} />
    </div>
  );
};

export default EventFrequencyByDayChart;
