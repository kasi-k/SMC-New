import { formatDate } from "../../../Host";

const TableQuizManagement = ({ userData }) => {
  return (
    <>
      <div className=" font-poppins ">
        <div className="mx-2 my-2 overflow-auto no-scrollbar  ">
          <table className=" w-full">
            <thead className="text-slate-300">
              <tr className="text-sm font-medium text-nowrap text-black  bg-cyan-300 ">
                <th className="p-1.4 border border-slate-100">User Id</th>
                <th className=" border border-slate-100 text-nowrap">
                  First Name
                </th>
                <th className=" border border-slate-100 text-nowrap">
                  Last Name
                </th>
                <th className=" border border-slate-100">Email</th>
                <th className="border border-slate-100">Phone Number</th>
                <th className=" border border-slate-100">Quiz Status</th>
                <th className=" border border-slate-100">Quiz Marks</th>
                <th className=" border border-slate-100">User Type</th>
                {/* <th className=" border border-slate-100">Associated Entity</th> */}
                <th className="border border-slate-100">Start Date</th>
                <th className=" ">Completed Date</th>
              </tr>
            </thead>
            <tbody className=" ">
              {userData &&
                userData.map((user, index) => (
                  <tr
                    className=" text-nowrap text-center bg-white text-black"
                    key={index}
                  >
                    <td className="border border-slate-100">
                      {user.userId._id}
                    </td>
                    <td className="border border-slate-100 capitalize">
                      {user.userId.fname}
                    </td>
                    <td className="border border-slate-100 capitalize">
                      {user.userId.lname}
                    </td>
                    <td className="border border-slate-100">
                      {" "}
                      {user.userId.email}
                    </td>
                    <td className="border border-slate-100">
                      {" "}
                      {user.userId.phone}
                    </td>
                    <td className="border border-slate-100  capitalize">
                      {user.quizPassed === true ? "Completed" : "Not Completed"}
                    </td>
                    <td className="border border-slate-100 capitalize">
                      {" "}
                      {user.quizMarks ===""?"-":user.quizMarks}
                    </td>
                    <td className="border border-slate-100 capitalize">
                      {" "}
                      {user.userId.type}
                    </td>
                    {/* <td className="border border-slate-100 capitalize">
                      {" "}
                      ABC Company
                    </td> */}
                    <td className="border border-slate-100 ">
                      {formatDate(user.startDate)}
                    </td>
                    <td className="border border-slate-100">
                      {user.endDate === null
                        ? "Yet To be Completed"
                        : formatDate(user.endDate)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TableQuizManagement;
