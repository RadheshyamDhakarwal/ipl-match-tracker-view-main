import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { useTheme } from "./ThemeContext";

const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/cricindia/tableranking.php");
      const data = await response.json();
      if (Array.isArray(data?.matches)) {
        setRankings(data.matches);
      } else {
        console.warn("Unexpected data format:", data);
        setRankings([]);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      setRankings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="w-full sm:w-[90%] md:w-[70%] lg:w-2/3 mx-auto">
      {loading ? (
        <p>
          <Spinner />
        </p>
      ) : (
        <div
          className={`${
            theme === "dark"
              ? "  bg-[#101218]"
              : ""
          }`}
        >
          <div className=" px-4 pb-5 shadow-lg   rounded-lg">
          <div className=" overflow-x-auto w-full ">

            <table className="w-full    ">
            

            <thead >
                <tr
                  className={`${
                    theme === "dark"
                      ? "text-left border-b border-gray-700 text-[#999DA9] text-xs"
                      : "text-left border-b border-[#ddd] text-[#5E5E5E] text-xs"
                  }`}
                >
                  <td className=" pt-4 pb-2 w-2/3">Team</td>
                  <td className="px-4 pt-4  pb-2">M</td>
                  <td className="px-4 pt-4 pb-2">W</td>
                  <td className="px-4 pt-4 pb-2">L</td>
                  <td className="px-4 pt-4 pb-2">NRR</td>
                  <td className="px-4 pt-4 pb-2 font-bold">Pts</td>
                </tr>
              </thead>
              <tbody>
                {rankings.map((team, index) => (
                  <tr
                    key={index}
                    className={`${
                      theme === "dark"
                        ? "border-b border-gray-700 text-[#BDC1C6] hover:bg-[#1A1F2C] transition-colors"
                        : "border-b border-[#dadce0] text-[#202124] hover:bg-[#fafafa] transition-colors text-[14px] "
                    }`}
                  >
                    <td className="px-2 py-2 flex gap-3 items-center">
                      <div>{team.position}</div>
                      <img
                        src={team.team_logo}
                        alt=""
                        width={20}
                        style={{ height: "20px" ,padding:"2px"}}
                      />
                      <div>{team.team}</div>
                    </td>
                    <td className="px-4 py-2">{team.played}</td>
                    <td className="px-4 py-2">{team.won}</td>
                    <td className="px-4 py-2">{team.lost}</td>
                    <td className="px-4 py-2">  {team.nrr > 0 ? `+${team.nrr}` : team.nrr}</td>
                    <td className="px-4 py-2 font-bold">{team.points}</td>
                  </tr>
                ))}
              </tbody>
           
            </table>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rankings;
