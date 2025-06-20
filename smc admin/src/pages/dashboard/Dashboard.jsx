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

import Logo from "../../assets/Courses.jpeg";

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
    <div className="min-h-screen  text-white p-4 grid grid-cols-12  gap-4 font-sans">
      <div className="col-span-3 bg-darkest-blue grid  grid-cols-2 gap-4 p-4 rounded-xl shadow">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className=" bg-[#200098] p-3 flex flex-col justify-between rounded-lg border-pink-800 border text-xs text-white"
          >
            <p className="text-xs text-end">KPI {i + 1}</p>
            <h2 className="text-base text-center  text-[#00F0FF]">10005400</h2>
          </div>
        ))}
      </div>

      <div className="col-span-3  bg-darkest-blue p-2 rounded-xl shadow">
        <h2 className="text-sm mb-2">User by Plan</h2>

        <div className="flex flex-col p-4 gap-2 ">
          {planData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span
                className="w-4 h-4 inline-block "
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>

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
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-col p-4 gap-2 ">
          {planData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span
                className="w-4 h-4 inline-block "
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-6 bg-darkest-blue p-2 rounded-xl shadow">
        <h2 className="text-sm mb-2">Revenue by Plan</h2>
        <ResponsiveContainer width="100%" height={400} className=" ">
          <BarChart data={revenueData} barGap={1}>
            <XAxis dataKey="name" stroke="#fff" />
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

      <div className=" col-span-12 grid grid-cols-12  gap-4">
        <div className="col-span-4 row-span-2 h-fit bg-darkest-blue p-4 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <p className="text-sm">Pre-Generated Courses</p>
            <p className="text-sm">Lifetime</p>
          </div>
          <div className="grid grid-cols-2 gap-2 py-2 rounded-xl shadow">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="bg-[#230088] border-pink-800 border p-3 text-xs flex flex-col justify-center rounded-lg text-white "
              >
                <p className="text-xs text-end">KPI {i + 1}</p>
                <h2 className="text-lg text-center text-[#00F0FF]">10005400</h2>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4 row-span-2  bg-darkest-blue p-4 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <p className="text-sm">Quizzes</p>
            <p className="text-sm">Lifetime</p>
          </div>
          <div className="grid grid-cols-2  gap-2 py-2  rounded-xl shadow">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="bg-[#230088] p-3 text-xs flex flex-col border-pink-800 border justify-between text-white rounded-md"
              >
                <p className="text-xs text-end">KPI {i + 1}</p>
                <h2 className="text-lg text-center text-[#00F0FF]">10005400</h2>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4 row-span-12 bg-darkest-blue h-fit p-4 rounded-xl shadow">
          <p className="text-lg pb-2">Recent Courses</p>
          <div className=" overflow-auto  gap-2 rounded-xl h-[700px] shadow">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="bg-[#2A0E4A] p-3 flex gap-2 text-xs text-white rounded-md"
              >
                <img src={Logo} alt="ai" className="w-24 object-contain" />
                <div className="flex flex-col justify-between">
                  <span>
                    <p>CCNA Security For starters</p>
                    <p>Date : 06-June-2025</p>
                  </span>
                  <button className="text-start px-3 mt-2 bg-[#d320ef] text-[#2A0E4A] border rounded-md w-fit">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4 row-span-8 bg-darkest-blue h-fit p-4 rounded-xl shadow">
          <p className="text-lg pb-2">Recent Courses</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 h-[467px] overflow-auto gap-2 rounded-xl shadow">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="bg-[#2A0E4A] p-3 flex gap-2 text-xs  text-white rounded-md"
              >
                <img src={Logo} alt="ai" className="w-24  object-contain" />
                <div className="flex flex-col justify-between">
                  <span>
                    <p>CCNA Security For starters</p>
                    <p>Date : 06-June-2025</p>
                  </span>
                  <button className="text-start px-3 mt-2 bg-[#d320ef] text-[#2A0E4A] border rounded-md w-fit">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-4 row-span-8 bg-darkest-blue h-fit p-4 rounded-xl shadow">
          <p className="text-lg pb-2">Recent Courses</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 h-[467px] overflow-auto gap-2 rounded-xl shadow">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="bg-[#2A0E4A] p-3 flex gap-2 text-xs  text-white rounded-md"
              >
                <img
                  src={Logo}
                  alt="ai"
                  className="w-24 h-auto object-contain"
                />
                <div className="flex flex-col justify-between">
                  <span>
                    <p>CCNA Security For starters</p>
                    <p>Date : 06-June-2025</p>
                  </span>
                  <button className="text-start px-3 mt-2 bg-[#d320ef] text-[#2A0E4A] border rounded-md w-fit">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
