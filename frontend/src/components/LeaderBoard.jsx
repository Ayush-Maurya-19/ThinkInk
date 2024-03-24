import React from "react";

const LeaderBoard = () => {
  return (
    <div className=" mt-5">
      <h1 className="text-center	text-amber-300">LeaderBoard</h1>
      <div className="text-center flex justify-center  mt-3">
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-16 py-3">Rank</th>
              <th className="px-16 py-2">Name</th>
              <th className="px-16 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-3">1</td>
              <td className="border px-4 py-2">John Doe</td>
              <td className="border px-4 py-2">100</td>
            </tr>
            <tr>
              <td className="border px-4 py-3">2</td>
              <td className="border px-4 py-2">Jane Doe</td>
              <td className="border px-4 py-2">90</td>
            </tr>
            <tr>
              <td className="border px-4 py-3">3</td>
              <td className="border px-4 py-2">John Smith</td>
              <td className="border px-4 py-2">80</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderBoard;
