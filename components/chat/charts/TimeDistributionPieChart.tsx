import { TimeDistributionByCategory } from "@/lib/tools/schemas";
import { generateColors } from "@/lib/utils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type TimeDistributionPieChartProps = TimeDistributionByCategory;

export const TimeDistributionPieChart = ({
  data,
}: TimeDistributionPieChartProps) => {
  const colors = useMemo(() => generateColors(data.length), [data]);

  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.time),
        backgroundColor: colors.map((color) => color.background),
        borderColor: colors.map((color) => color.border),
        borderWidth: 2,
        label: "Hours spent",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        align: "start" as const,
        labels: {
          padding: 20,
        },
        padding: 20,
      },
    },
    maintainAspectRatio: false,
    cutout: "50%",
    radius: 200,
  };

  return (
    <div className="flex justify-center w-full" style={{ width: "500px" }}>
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};
