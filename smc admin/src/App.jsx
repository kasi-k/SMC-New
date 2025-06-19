import React, { useEffect, useMemo, useState, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./pages/layout/Layout";
import NotFound from "./404";
import Login from "./pages/login/Login";
import axios from "axios";
import { API } from "./Host";
import Policy from "./pages/policy/Policy";
import FAQ from "./pages/faq/FAQ";
import Referral from "./pages/referral/Referral";
import CourseManagement from "./pages/Pre-generated courses/courses management/CourseManagement";
import ViewCourseManagement from "./pages/Pre-generated courses/courses management/ViewCourseManagement";
import CategoryManagement from "./pages/Pre-generated courses/category mangement/CategoryManagement";
import AddCategoryManagement from "./pages/Pre-generated courses/category mangement/AddCategoryManagement";
import GeneratePreGeneratedCourse from "./pages/Pre-generated courses/pregeneratecourses/GeneratePreGeneratedCourses";
import ListPreGenerateCourses from "./pages/Pre-generated courses/pregeneratecourses/ListPreGenerateCourses";
import ContentPreCourses from "./pages/Pre-generated courses/pregeneratecourses/ContentPreCourses";

const ForgotPassword = React.lazy(() => import("./pages/login/ForgotPassword"));
const Package = React.lazy(() => import("./pages/Packages/Package"));
const Dashboard = React.lazy(() => import("./pages/dashboard/Dashboard"));
const AddPackage = React.lazy(() => import("./pages/Packages/AddPackage"));
const AdduserPackage = React.lazy(() =>
  import("./pages/Packages/AdduserPackage")
);
const Courses = React.lazy(() => import("./pages/courses/Courses"));
const GenerateCourse = React.lazy(() =>
  import("./pages/generate courses/GenerateCourse")
);
const Subscription = React.lazy(() =>
  import("./pages/subscription/Subscription")
);
const User = React.lazy(() => import("./pages/users/User"));
const EditUser = React.lazy(() => import("./pages/users/EditUser"));
const Team = React.lazy(() => import("./pages/team/Team"));
const EditTeam = React.lazy(() => import("./pages/team/EditTeam"));
const AddTeam = React.lazy(() => import("./pages/team/AddTeam"));
const Tickets = React.lazy(() => import("./pages/Help and Support/Tickets"));
const Report = React.lazy(() => import("./pages/reports/Report"));
const ViewOwnCourse = React.lazy(() =>
  import("./pages/generate courses/ViewOwnCourse")
);
const AddUser = React.lazy(() => import("./pages/users/AddUser"));
const Setting = React.lazy(() => import("./pages/settings/Setting"));
const ViewTicket = React.lazy(() =>
  import("./pages/Help and Support/ViewTicket")
);
const AddRole = React.lazy(() => import("./pages/settings/AddRole"));
const ResetPassword = React.lazy(() => import("./pages/login/ResetPassword"));
const Category = React.lazy(() => import("./pages/settings/Category"));
const ListTopics = React.lazy(() =>
  import("./pages/generate courses/ListTopics")
);
const Content = React.lazy(() => import("./pages/generate courses/Content"));
const ViewCertificate = React.lazy(() =>
  import("./pages/generate courses/ViewCertificate")
);
const EditPackage = React.lazy(() => import("./pages/Packages/EditPackage"));
const UpdateRole = React.lazy(() => import("./pages/settings/UpdateRole"));
const ChangePassword = React.lazy(() => import("./pages/team/ChangePassword"));

const App = () => {
  const [rolename, setRolename] = useState(localStorage.getItem("role") || "");

  const [features, setFeatures] = useState({});

  const updateRole = () => {
    const role = localStorage.getItem("role") || "";
    setRolename(role);
  };

  useEffect(() => {
    const handleStorageChange = () => updateRole();

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (rolename) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `${API}/api/getrolebyid?role_name=${rolename}`
          );
          const responseData = response.data.role;

          const featuresData = responseData.accessLevels.reduce(
            (acc, current) => {
              acc[current.feature] = current.permissions;
              return acc;
            },
            {}
          );
          setFeatures(featuresData);
        } catch (error) {
          console.error("Error fetching role data:", error);
        }
      };
      fetchUserData();
    } else {
      setFeatures({}); // Clear features if no role is set
    }
  }, [rolename]);

  const memoizedFeatures = useMemo(() => features, [features]);

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/content" element={<Content />} />
            <Route path="/" element={<Layout permissions={memoizedFeatures} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/adduserPackage" element={<AdduserPackage />} />
              <Route path="/create" element={<GenerateCourse />} />
              <Route path="/topics" element={<ListTopics />} />
              <Route path="/viewcourse" element={<ViewOwnCourse />} />
              <Route path="/viewcertificate" element={<ViewCertificate />} />

              <Route path="/addrole" element={<AddRole />} />
              <Route path="/updaterole" element={<UpdateRole />} />
              <Route path="/category" element={<Category />} />
              <Route path="/policy" element={<Policy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/referrals" element={<Referral />} />
              {memoizedFeatures["packages"] && (
                <>
                  <Route
                    path="/packages"
                    element={
                      <Package permissions={memoizedFeatures["packages"]} />
                    }
                  />
                  <Route path="/addpackage" element={<AddPackage />} />
                  <Route path="/editpackage" element={<EditPackage />} />
                </>
              )}
              {memoizedFeatures["courses"] && (
                <>
                  <Route
                    path="/courses"
                    element={
                      <Courses permissions={memoizedFeatures["courses"]} />
                    }
                  />
                </>
              )}
              {memoizedFeatures["subscription"] && (
                <>
                  <Route
                    path="/subscription"
                    element={
                      <Subscription
                        permissions={memoizedFeatures["subscription"]}
                      />
                    }
                  />
                </>
              )}
              {memoizedFeatures["users"] && (
                <>
                  <Route
                    path="/users"
                    element={<User permissions={memoizedFeatures["users"]} />}
                  />
                  <Route path="/adduser" element={<AddUser />} />
                  <Route path="/edituser" element={<EditUser />} />
                </>
              )}
              <Route path="/categorymanagement" >
              <Route index element={<CategoryManagement/>}/>
              <Route path="addcategorymanagement" element={<AddCategoryManagement/>}/>
              </Route>
              <Route path="/coursemanagement" >
              <Route index element={<CourseManagement/>}/>
              <Route path="viewcoursemanagement" element={<ViewCourseManagement/>}/>
              </Route>
              <Route path="/pregeneratecourses" element={<GeneratePreGeneratedCourse/>}/>
              <Route path="/listpregeneratecourses" element={<ListPreGenerateCourses/>}/>
              <Route path="/contentpregenerate" element={<ContentPreCourses/>}/>
              {memoizedFeatures["team"] && (
                <>
                  <Route
                    path="/team"
                    element={<Team permissions={memoizedFeatures["team"]} />}
                  />
                  <Route path="/editteam" element={<EditTeam />} />
                  <Route path="/changepassword" element={<ChangePassword />} />
                  <Route path="/addteam" element={<AddTeam />} />
                </>
              )}
              {memoizedFeatures["support"] && (
                <>
                  <Route
                    path="helpsupport"
                    element={
                      <Tickets permissions={memoizedFeatures["support"]} />
                    }
                  />
                  <Route
                    path="/viewticket"
                    element={
                      <ViewTicket permissions={memoizedFeatures["support"]} />
                    }
                  />
                </>
              )}
              {memoizedFeatures["report"] && (
                <>
                  <Route
                    path="/report"
                    element={
                      <Report permissions={memoizedFeatures["report"]} />
                    }
                  />
                </>
              )}
              {memoizedFeatures["setting"] && (
                <>
                  <Route
                    path="/setting"
                    element={
                      <Setting permissions={memoizedFeatures["setting"]} />
                    }
                  />
                </>
              )}
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default App;
