import React, { useEffect, useState } from "react";
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

import { HiAdjustments } from "react-icons/hi";
import Logo from "../../assets/Courses.jpeg";
import axios from "axios";
import { API } from "../../Host";
import { useNavigate } from "react-router-dom";

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
  const navigate= useNavigate();
  const [dashboard, setDashboard] = useState({});
  const [courses, setCourses] = useState([]);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API}/api/aggregate`);
      const response = res.data;
      setDashboard(response);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/api/getcourses`);
      const response = res.data;
      setCourses(response);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchCourses();
  }, []);

  const handleCourse = (content, mainTopic, type, courseId, completed, end) => {
  const jsonData = JSON.parse(content)
  localStorage.setItem('courseId', courseId);
  localStorage.setItem('first', completed);
  localStorage.setItem('jsonData', JSON.stringify(jsonData));
  let ending = '';
  if (completed) {
      ending = end;
  }
  navigate('/content', { state: { jsonData: jsonData, mainTopic: mainTopic.toUpperCase(), type: type.toLowerCase(), courseId: courseId, end: ending } });
}

  return (
    <div className="">
      <div className="  text-white p-4 grid grid-cols-12   gap-4 font-sans">
        <div className="col-span-4 row-span-6 space-y-5 bg-darkest-blue p-4 order-1 rounded-xl shadow">
          <div className="flex justify-between gap-3 items-center">
            <p className="text-xs">
              Key Performance Indicators <span className="text-xs">(KPIs)</span>
            </p>
            <p className="text-xs flex gap-2 items-center justify-start">
              <span>Lifetime </span>
              <span style={{ transform: "rotate(90deg)" }}>
                <HiAdjustments size={16} />
              </span>
            </p>
          </div>
          <div className="grid grid-cols-2 content-center  gap-2 py-2 rounded-xl shadow">
            {dashboard &&
              [
                {
                  label: "Total Registered Users",
                  value: dashboard?.kPIs?.totalUsers,
                },
                {
                  label: "Total Active Users",
                  value: dashboard?.kPIs?.activeUsers,
                },
                {
                  label: "Total Courses Completed",
                  value: dashboard?.kPIs?.courseCompleted,
                },
                {
                  label: "Total Quizzes Attempted",
                  value: dashboard?.kPIs?.quizessAttempted,
                },
                {
                  label: "New Signups",
                  value: dashboard?.kPIs?.newRegistrations,
                },
                {
                  label: "Total Courses Generated",
                  value: dashboard?.kPIs?.courseGenerated,
                },
                {
                  label: "Total Study Groups",
                  value: dashboard?.kPIs?.totalStudyGroups,
                },
                {
                  label: "Total Recurring Revenue",
                  value: dashboard?.kPIs?.recurringRevenue,
                  currency: true,
                },
                {
                  label: "Referral Signups",
                  value: dashboard?.kPIs?.referaalSignUps,
                },
                {
                  label: "Commissions Paid",
                  value: dashboard?.kPIs?.commisionsPaid,
                  currency: true,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-[#230088] border-pink-800 border p-2 text-xs flex flex-col gap-3  justify-between rounded-lg text-white "
                >
                  <p className="text-xs w-full text-end">{item.label}</p>
                  <p className=" text-center text-lg text-[#00F0FF]">
                    {item.value}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div className="col-span-2 row-span-3 bg-darkest-blue p-2 order-2 rounded-xl shadow">
          <div className=" flex justify-between ">
            <h2 className="text-sm mb-2">User by Plan</h2>
            <p className="text-xs flex gap-2 items-center justify-start">
              <span>Lifetime </span>
              <span style={{ transform: "rotate(90deg)" }}>
                <HiAdjustments size={16} />
              </span>
            </p>
          </div>
          <div className="flex flex-col p-4 gap-2 ">
            {planData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span
                  className="w-4 h-4 border inline-block "
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={planData}
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={70}
                dataKey="value"
                stroke="#000"
                strokeWidth={1}
                labelLine={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) / 2;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#000000"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={20}
                    >
                      {` ${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
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

        <div className="col-span-6 row-span-3  bg-darkest-blue order-3 rounded-xl shadow">
          <div className=" flex justify-between">
            <h2 className="text-sm mb-2">Revenue by Plan</h2>
            <p className="text-xs flex gap-2 items-center justify-start">
              <span>Current Year </span>
              <span style={{ transform: "rotate(90deg)" }}>
                <HiAdjustments size={16} />
              </span>
            </p>
          </div>
          <ResponsiveContainer width="100%" height={350} className="">
            <BarChart data={revenueData} barGap={1}>
              <XAxis dataKey="name" stroke="#fff" />
              /
              <Tooltip />
              <Legend />
              <Bar dataKey="Seek Lite" fill="#00F0FF" />
              <Bar dataKey="Seek Pro" fill="#FFFFFF" />
              <Bar dataKey="Seek Master" fill="#B834C2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-4 row-span-4 bg-darkest-blue order-6  text-white p-4 rounded-xl shadow-lg ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Total Revenue</h2>
            <p className="text-xs flex gap-2 items-center justify-start">
              <span>Current Year </span>
              <span style={{ transform: "rotate(90deg)" }}>
                <HiAdjustments size={16} />
              </span>
            </p>
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

        <div className="col-span-4 row-span-7 bg-darkest-blue order-4 p-4  rounded-xl shadow">
          <div className="flex justify-between mt-3">
            <h2 className="text-xl mb-2 font-semibold">Subscription Status</h2>
            <p className="text-xs flex gap-2 items-center justify-start">
              <span>Lifetime </span>
              <span style={{ transform: "rotate(90deg)" }}>
                <HiAdjustments size={16} />
              </span>
            </p>
          </div>
          <div className=" content-center  h-full">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={70}
                  dataKey="value"
                  stroke="#000"
                  strokeWidth={1}
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                    index,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius =
                      innerRadius + (outerRadius - innerRadius) / 2;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#000000"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={20}
                      >
                        {` ${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex  justify-center gap-5 p-4 ">
              {subscriptionData.map((item, index) => (
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
        </div>

        <div className="col-span-4 row-span-7 bg-darkest-blue order-5  text-white p-4 rounded-xl shadow-lg ">
          <div className="flex justify-between items-center mt-4">
            <h2 className="text-lg font-semibold">Customer Churn Rate </h2>
            <p className="text-xs flex gap-2 items-center justify-start">
              <span>Current Year </span>
              <span style={{ transform: "rotate(90deg)" }}>
                <HiAdjustments size={16} />
              </span>
            </p>
          </div>
          <div className="flex   items-center justify-between h-full ">
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
      <div className=" col-span-12 grid grid-cols-12  gap-4">
        <div className="col-span-4 row-span-2 h-fit bg-darkest-blue p-4 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <p className="text-sm">Pre-Generated Courses</p>
            <p className="text-xs flex gap-2 items-center justify-start">
              <span>Lifetime </span>
              <span style={{ transform: "rotate(90deg)" }}>
                <HiAdjustments size={16} />
              </span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 py-2 rounded-xl shadow">
            {dashboard &&
              [
                {
                  title: "Total Courses",
                  value: dashboard?.preGenratedCourses?.totalCourses,
                },
                { title: "Total Sub-Category 1", value: 10005400 },
                { title: "Total Categories", value: 10005400 },
                { title: "Total Sub-Category 2", value: 10005400 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-[#230088] border-pink-800 border p-3 text-xs flex flex-col justify-center rounded-lg text-white "
                >
                  <p className="text-xs text-end">{item.title}</p>
                  <h2 className="text-lg text-center text-[#00F0FF]">
                    {item.value}
                  </h2>
                </div>
              ))}
          </div>
        </div>

        <div className="col-span-4 row-span-2  bg-darkest-blue p-4 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <p className="text-sm">Quizzes</p>
            <p className="text-xs flex gap-2 items-center justify-start">
              <span>Lifetime </span>
              <span style={{ transform: "rotate(90deg)" }}>
                <HiAdjustments size={16} />
              </span>
            </p>
          </div>
          <div className="grid grid-cols-2  gap-2 py-2  rounded-xl shadow">
            {dashboard &&
              [
                {
                  title: "Total quizzes",
                  value: dashboard?.Quiz?.totalQuizzes,
                },
                { title: "Total Sub-Category 1", value: 10005400 },
                { title: "Total Categories", value: 10005400 },
                { title: "Total Sub-Category 2", value: 10005400 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-[#230088] border-pink-800 border p-3 text-xs flex flex-col justify-center rounded-lg text-white "
                >
                  <p className="text-xs text-end">{item.title}</p>
                  <p className="text-lg text-center text-[#00F0FF]">
                    {item.value}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div className="col-span-4 row-span-12 bg-darkest-blue h-fit p-4 rounded-xl shadow">
          <p className="text-lg pb-2">Recent Courses</p>
          <div className=" overflow-auto  gap-2 rounded-xl h-[700px] shadow">
            {courses&&courses.slice(0, 10).map((items, index) => (
              <div
                key={index}
                className="bg-[#2A0E4A] p-3 flex gap-2 text-xs text-white rounded-md"
              >
                <img
                  src={items.photo}
                  alt="ai"
                  className="w-24 p-1 object-contain rounded-xl"
                />
                <div className="flex flex-col justify-between">
                  <span>
                    <p>{items.mainTopic}</p>
                    <p>Date : {items.date}</p>
                  </span>
                  <button
                    className="text-start px-3 mt-2 bg-[#d320ef] text-[#2A0E4A] border rounded-md w-fit"
                onClick={() =>
                  handleCourse(
                    items.content,
                    items.mainTopic,
                    items.type,
                    items._id,
                    items.completed,
                    items.end
                  )
                }
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4 row-span-8 bg-darkest-blue h-fit p-4 rounded-xl shadow">
          <p className="text-lg pb-2">Top Accessed Pre-Generated Courses</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 h-[467px] overflow-auto gap-2 rounded-xl shadow">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="bg-[#2A0E4A] p-3 flex gap-2 text-xs  text-white rounded-md"
              >
                <img
                  src={Logo}
                  alt="ai"
                  className="w-32 p-1 rounded-xl  object-contain"
                />
                <div className="flex flex-col justify-between">
                  <span>
                    <p>CCNA Security For starters</p>
                    <p> Category : Technology</p>
                    <p>Accessed Count : 10</p>
                    <p>Competed Count : 25</p>
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
          <p className="text-lg pb-2">Top Accessed Quizzes</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 h-[467px] overflow-auto gap-2 rounded-xl shadow">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="bg-[#2A0E4A] p-3 flex gap-2 text-xs  text-white rounded-md"
              >
                <img
                  src={Logo}
                  alt="ai"
                  className="w-32 p-1   rounded-xl object-contain"
                />
                <div className="flex flex-col justify-between">
                  <span className="text-xs">
                    <p>CCNA Security For starters</p>
                    <p> Category : Technology</p>
                    <p>Accessed Count : 10</p>
                    <p>Competed Count : 25</p>
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
