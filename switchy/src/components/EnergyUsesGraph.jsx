import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { Button, Progress } from "@chakra-ui/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function EnergyUsesGraph(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [view, setView] = useState("day");

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://switcyapi.onrender.com/data")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const toggleView = (newView) => {
    setView(newView);
  };

  let filteredData = [];
  if (view === "day") {
    filteredData = data;
  } else if (view === "week") {
    const currentDay = new Date().getDate();
    filteredData = data.filter((item) => {
      const day = new Date(item.time * 1000).getDate();
      return day >= currentDay - 6;
    });
  } else if (view === "month") {
    const groupedData = data.reduce((result, item) => {
      const date = new Date(item.time * 1000);
      const yearMonth = `${date.getFullYear()}-${date.getMonth()}`;
      if (!result[yearMonth]) {
        result[yearMonth] = item;
      }
      return result;
    }, {});

    filteredData = Object.values(groupedData);
  }

  const energyData = filteredData.map((item) => item.energy);
  const timeLabels = filteredData.map((item) => {
    const date = new Date(item.time * 1000);
    if (view === "day") {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } else if (view === "week") {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } else if (view === "month") {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    }
    return date.toLocale;
  });

  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Energy",
        data: energyData,

        backgroundColor: energyData.map((value) => {
          if (value >= 0 && value <= 5) {
            return "blue";
          } else if (value > 5 && value <= 15) {
            return "green";
          } else {
            return "red";
          }
        }),
        borderColor: "rgba(189, 242, 136)",
        borderWidth: 2,
        barPercentage: 10,
        categoryPercentage: 0.2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Energy consumed",
      },
    },
  };

  return (
    <div>
      <div style={{ width: "90vw", margin: "0 auto" }}>
        <div className="buttons">
          <Button colorScheme="purple" onClick={() => toggleView("day")}>
            Day
          </Button>
          <Button colorScheme="purple" onClick={() => toggleView("week")}>
            Week
          </Button>
          <Button colorScheme="purple" onClick={() => toggleView("month")}>
            Month
          </Button>
        </div>
        {!loading ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <Progress size="xl" isIndeterminate />
        )}
      </div>
    </div>
  );
}

export default EnergyUsesGraph;
