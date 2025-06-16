import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#00F0FF", "#FFFFFF", "#B834C2"];
const STATUS_COLORS = ["#FFFFFF", "#B834C2"];

const planData = [
  { name: "Seek Lite", value: 10 },
  { name: "Seek Pro", value: 40 },
  { name: "Seek Master", value: 50 },
];

const subscriptionData = [
  { name: "Cancelled", value: 30 },
  { name: "Active", value: 70 },
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const data = [
  { month: "Jan", value: 50 },
  { month: "Feb", value: 70 },
  { month: "Mar", value: 55 },
  { month: "Apr", value: 45 },
  { month: "May", value: 60 },
  { month: "Jun", value: 80 },
  { month: "Jul", value: 40 },
  { month: "Aug", value: 50 },
  { month: "Sep", value: 60 },
  { month: "Oct", value: 75 },
  { month: "Nov", value: 50 },
  { month: "Dec", value: 40 },
];
const revenueData = months.map((month) => ({
  name: month,
  "Seek Lite": Math.floor(Math.random() * 100),
  "Seek Pro": Math.floor(Math.random() * 100),
  "Seek Master": Math.floor(Math.random() * 100),
}));

const churnRateData = months.map((month) => ({
  name: month,
  Cancelled: Math.floor(Math.random() * 100),
  Active: Math.floor(Math.random() * 100),
}));

const Dashboard = () => {
  return (
    <div className="min-h-screen  text-white p-4 grid grid-cols-12 gap-4 font-sans">
      {/* KPI Cards */}
      <div className="col-span-3 bg-darkest-blue grid  grid-cols-2 gap-4 p-4 rounded-xl shadow">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className=" bg-[#200098] p-3  text-xs text-white">
            <p className="text-xs">KPI {i + 1}</p>
            <h2 className="text-lg font-bold text-[#00F0FF]">10005400</h2>
          </div>
        ))}
      </div>

      {/* Pie Chart - User by Plan */}
      <div className="col-span-3 bg-darkest-blue rounded-xl shadow">
        <h2 className="text-sm mb-2">User by Plan</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={planData}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={70}
              dataKey="value"
              label
              stroke="#000"
              strokeWidth={1}
            >
              {planData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Revenue by Plan */}
      <div className="col-span-6 bg-darkest-blue p-4 rounded-xl shadow">
        <h2 className="text-sm mb-2">Revenue by Plan</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueData} barGap={1}>
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Seek Lite" fill="#00F0FF" />
            <Bar dataKey="Seek Pro" fill="#FFFFFF" />
            <Bar dataKey="Seek Master" fill="#B834C2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-4 bg-darkest-blue text-white p-4 rounded-xl shadow-lg ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="italic text-sm">Current Year</p>
        </div>
        <div className="flex items-end justify-between h-52 ">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center ">
              <div className="h-full flex items-end justify-center">
                <div className="relative w-4 h-40 bg-white rounded-full overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 w-full bg-purple-600 rounded-full"
                    style={{ height: `${item.value}%` }}
                  />
                </div>
              </div>
              <span className="mt-2 text-xs ">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Status */}
      <div className="col-span-4 bg-darkest-blue p-4 rounded-xl shadow">
        <h2 className="text-sm mb-2">Subscription Status</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={subscriptionData}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={70}
              dataKey="value"
              label
              stroke="#000"
              strokeWidth={1}
            >
              {subscriptionData.map((entry, index) => (
                <Cell
                  key={`cell-status-${index}`}
                  fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-4 bg-darkest-blue text-white p-4 rounded-xl shadow-lg ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Customer Churn Rate </h2>
          <p className="italic text-sm">Current Year</p>
        </div>
        <div className="flex items-end justify-between h-52 ">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center ">
              <div className="h-full flex items-end justify-center">
                <div className="relative w-4 h-40 bg-white rounded-full overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 w-full bg-purple-600 rounded-full"
                    style={{ height: `${item.value}%` }}
                  />
                </div>
              </div>
              <span className="mt-2 text-xs ">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
