import React, { useState } from 'react'
import User from '../users/User';
import Subscription from '../subscription/Subscription';
import Tickets from '../Help and Support/Tickets';
import Team from '../team/Team';
import Courses from '../courses/Courses';

const Report = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const userPerm = ["create","edit","delete"]
  const subPerm = ["view"]
  const ticketPerm = ["view","reply"]
  const teamPerm = ["create","edit","delete"]
  const coursePerm = ["view","delete"]
  
  return (
    <>
    <div className="overflow-auto my-6 -z-10 ">
      <div className='flex justify-between mt-8 mx-4 flex-wrap  font-poppins'>
        <div className='flex gap-4 flex-wrap my-2'>
       <div class="relative inline-block">
            <button
              className={`text-lg py-1.5 w-36  ${
                activeTab === "tab1"
                  ? "text-white bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]"
                  : "text-black bg-white"
              }`}
              onClick={() => setActiveTab("tab1")}
            >
              Users
            </button>
            <div class="absolute -top-9 -right-10 w-8 h-8 bg-[#110038] transform rotate-45 -translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div class="relative inline-block">
            <button
              className={`text-lg py-1.5 w-36  ${
                activeTab === "tab2"
                  ? "text-white bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]"
                  : "text-black bg-white"
              }`}
              onClick={() => setActiveTab("tab2")}
            >
             Subscriptions
            </button>
            <div class="absolute -top-9 -right-10 w-8 h-8 bg-[#110038] transform rotate-45 -translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div class="relative inline-block">
            <button
              className={`text-lg py-1.5 w-36  ${
                activeTab === "tab3"
                  ? "text-white bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]"
                  : "text-black bg-white"
              }`}
              onClick={() => setActiveTab("tab3")}
            >
              Tickets
            </button>
            <div class="absolute -top-9 -right-10 w-8 h-8 bg-[#110038] transform rotate-45 -translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div class="relative inline-block">
            <button
              className={`text-lg py-1.5 w-36  ${
                activeTab === "tab4"
                  ? "text-white bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]"
                  : "text-black bg-white"
              }`}
              onClick={() => setActiveTab("tab4")}
            >
              Team
            </button>
            <div class="absolute -top-9 -right-10 w-8 h-8 bg-[#110038] transform rotate-45 -translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div class="relative inline-block">
            <button
              className={`text-lg py-1.5 w-36  ${
                activeTab === "tab5"
                  ? "text-white bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]"
                  : "text-black bg-white"
              }`}
              onClick={() => setActiveTab("tab5")}
            >
              Courses
            </button>
            <div class="absolute -top-9 -right-10 w-8 h-8 bg-[#110038] transform rotate-45 -translate-x-1/2 translate-y-1/2"></div>
          </div>
          </div>
          </div>
          <hr />
    </div>
    {activeTab === "tab1" && <User permissions={userPerm}/>}
    {activeTab === "tab2" && <Subscription permissions={subPerm}/>}
    {activeTab === "tab3" && <Tickets permissions={ticketPerm}/>}
    {activeTab === "tab4" && <Team permissions={teamPerm}/>}
    {activeTab === "tab5" && <Courses permissions={coursePerm}/>}
    </>
  )
}

export default Report