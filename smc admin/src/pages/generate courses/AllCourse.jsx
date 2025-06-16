import React from "react";
import { formatDate1 } from "../../Host";

const AllCourse = ({ courses, handleCourse, handleCertificate }) => {
  return (
    <div className="grid grid-cols-12 gap-4 mx-4 mt-6">
      {courses &&
        courses.map((course, index) => (
          <div
            className="lg:col-span-3 md:col-span-4 col-span-12 bg-[#110038] shadow-lg font-poppins font-light rounded-lg overflow-hidden flex flex-col justify-between"
            key={index}
          >
            <img className="w-full h-40 object-cover" src={course.photo} alt="Course" />
            <div className="px-4 py-3">
              <div className="text-lg font-semibold truncate">{course.mainTopic}</div>
              <p className="text-sm pt-1">{course.type}</p>
              <p className="text-sm">{formatDate1(course.date)}</p>
            </div>
            <div className="flex">
              <button
                className="flex-1 text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] py-2.5 font-normal text-center"
                onClick={() =>
                  handleCourse(
                    course.content,
                    course.mainTopic,
                    course.type,
                    course._id,
                    course.completed,
                    course.end
                  )
                }
              >
                Continue
              </button>
              {course.completed && (
                <button
                  className="flex-1 text-lg bg-white text-black py-2.5 font-normal text-center"
                  onClick={() => handleCertificate(course.mainTopic, course.end)}
                >
                  Certificate
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AllCourse;
