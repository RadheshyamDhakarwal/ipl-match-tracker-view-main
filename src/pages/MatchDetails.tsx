"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

import ScoreCardTab from "@/components/matchdetails/ScoreCardTab";
import { useLocation, useParams } from "react-router-dom";
import CommentSection from "./CommentSection";
import Spinner from "./Spinner";
import { useTheme } from "./ThemeContext";

export type MatchData = {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  score: { r: number; w: number; o: number; inning: string }[];
  tossWinner: string;
  tossChoice: string;
  matchWinner: string;
  scorecard: {
    batting: {
      batsman: { id: string; name: string };
      "dismissal-text": string;
      playerImg: string;
      r: number;
      b: number;
      "4s": number;
      "6s": number;
      sr: number;
    }[];
    bowling: {
      bowler: { id: string; name: string };
      playerImg: string;
      o: number;
      r: number;
      m: number;
      w: number;
      eco: number;
    }[];
    extras: {
      r: number;
      b: number;
    };
  }[];
  matchStarted: boolean;
  matchEnded: boolean;
};

const MatchCard = () => {
  const { id } = useParams();
  const location = useLocation();
  const { teamLogos, firstBattingTeam, matchnumber, teamInfo, video_url } =
    (location.state || {}) as {
      teamLogos?: string[];
      firstBattingTeam?: number;
      matchnumber?: any;
      teamInfo?: any;
      video_url?: any;
      // data?: any;
    };

  const [activeTab, setActiveTab] = useState("scorecard");
  const [width, setWidth] = useState(window.innerWidth);
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const fetchMatchData = async () => {
    try {
      const res = await fetch(
        `https://api.cricapi.com/v1/match_scorecard?apikey=0019c810-8630-4614-a6ca-14580f56223c&id=${id}`
      );
      const json = await res.json();
      if (json.status === "success" || json.status === true) {
        setMatchData(json.data);
      } else {
        console.error("API error:", json.message || "Unknown error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      fetchMatchData();
      const interval = setInterval(() => {
        fetchMatchData();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [id]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Laptop ke liye 620px, mobile ke liye 370px
  const iframeWidth = width > 768 ? 620 : 370;

  const getShortTeamName = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };

  const formatDateAndTime = (dateString: string) => {
    // Convert UTC date string to IST Date object
    const matchDateIST = new Date(
      new Date(dateString).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const nowIST = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    // Strip time from both dates to compare only by day
    const matchDay = new Date(matchDateIST);
    matchDay.setHours(0, 0, 0, 0);

    const todayIST = new Date(nowIST);
    todayIST.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (matchDay.getTime() - todayIST.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Human-friendly label
    let dateLabel: string = matchDateIST.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

    if (diffDays === 0) dateLabel = "Today";
    else if (diffDays === 1) dateLabel = "Tomorrow";
    else if (diffDays === -1) dateLabel = "Yesterday";

    const time = matchDateIST
      .toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();

    return { date: dateLabel, time: `Starts at ${time}`, diffDays };
  };

  const { date } = formatDateAndTime(matchData?.dateTimeGMT);

  const formatScore = (scoreObj?: { r: number; w: number; o: number }) => {
    if (!scoreObj) return "—";
    return (
      <>
        <span
          className={`${
            theme === "dark" ? "text-[#BDC1C6]" : "text-[#202124]"
          }`}
        >
          {" "}
          {scoreObj.r}/{scoreObj.w}
        </span>
        <br />
        <div
          className={`${
            theme === "dark" ? "text-[#999DA9]" : "text-[#5E5E5E]"
          }`}
        >
          {" "}
          ({scoreObj.o})
        </div>
      </>
    );
  };

  if (loading)
    return (
      <p>
        <Spinner />
      </p>
    );

  const teamName0 = matchData?.score[0]?.inning?.replace(/ Inning \d+$/, "");
  const teamName1 = matchData?.score[1]?.inning?.replace(/ Inning \d+$/, "");

  const firstScoringTeam = matchData?.score[0]?.inning;
  const reorderedTeams =
    matchData?.teams[0] == firstScoringTeam
      ? [matchData?.teams[0], matchData?.teams[1]]
      : [matchData?.teams[1], matchData?.teams[0]];

  // const team = teamInfo.find((t) => t.name == reorderedTeams);

  return (
    <div className="block lg:flex flex-wrap lg:flex-nowrap ">
      {/* <div className="hidden lg:block text-gray-700 w-[25%] mt-2">
        <iframe
          className="ms-2"
          src="https://widget.taggbox.com/2172117"
          style={{ height: "100%", border: "none" }}
        ></iframe>
      </div> */}

      <div
        className={`${
          theme === "dark"
            ? "text-gray-600 bg-[#101218] w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto rounded-lg shadow-md transition"
            : "text-gray-600  w-full sm:w-[90%] md:w-[70%] mx-auto  lg:w-[50%]  rounded-lg shadow-md transition"
        }`}
      >
        <div
          className={`${
            theme === "dark"
              ? "text-sm text-gray-400 mb-2 px-4 pt-6"
              : "text-sm text-[#5E5E5E] mb-2 px-4 pt-6 flex justify-between"
          }`}
        >
          <div>
            <span
              className={`${
                theme === "dark" ? "text-gray-400" : "text-[#223577]"
              }`}
            >
              IPL ·
            </span>{" "}
            {date}
          </div>
          <div className="relative inline-block">
            {/* {matchData.matchStarted && !matchData?.matchWinner  ? (
            <>
              <span className="text-green-600 font-bold">Live</span>
              <div className="absolute left-0 right-0 h-[2px] bg-green-600 animate-pulse bottom-0"></div>
            </>
          ) : (
            ""
          )} */}
            {(() => {
              const matchStart = new Date(matchData?.dateTimeGMT);
              const today = new Date();

              const isToday =
                matchStart.toDateString() === today.toDateString();
              const matchStarted = matchData?.matchStarted;
              const noWinnerYet = !matchData?.matchWinner;

              return matchStarted && noWinnerYet && isToday ? (
                <>
                  <span className="text-green-600 font-bold">Live</span>
                  <div className="absolute left-0 right-0 h-[2px] bg-green-600 animate-pulse bottom-0"></div>
                </>
              ) : (
                ""
              );
            })()}
          </div>
        </div>

        <div className="flex  sm:flex  sm:flex-row justify-between items-center text-center mt-4 px-4 sm:px-28  gap-4">
          {/* Team 1 */}
          {matchData?.matchEnded ? (
            // If match has ended: Show the innings-based team order layout
            matchData?.teams?.length > 0 &&
            (() => {
              const inningTeamOrder = [];
              matchData?.score?.forEach((s) => {
                const teamName = matchData?.teams?.find((team) =>
                  s.inning?.toLowerCase().includes(team.toLowerCase())
                );
                if (teamName) inningTeamOrder.push(teamName);
              });

              const renderedTeams = [];

              inningTeamOrder.forEach((teamName, innerIndex) => {
                const teamLogo =
                  teamInfo?.find((t) => t.name === teamName)?.img ||
                  "default-logo.png";
                const teamScoreObj = matchData?.score?.find((s) =>
                  s.inning?.toLowerCase().includes(teamName.toLowerCase())
                );

                const scoreToShow = teamScoreObj
                  ? `${teamScoreObj.r}/${teamScoreObj.w}\n(${teamScoreObj.o})`
                  : "-";

                const isLeft = innerIndex === 0;

                renderedTeams.push(
                  <div
                    key={teamName}
                    className="flex items-center gap-2 sm:gap-7"
                  >
                    {isLeft ? (
                      <>
                        <div className="flex flex-col items-center">
                          <img
                            src={teamLogo}
                            alt={teamName}
                            className="w-10 h-10 sm:w-8 sm:h-8"
                          />
                          <div
                            className={`mt-2 ${
                              theme === "dark"
                                ? "text-[#ECECEC]"
                                : "text-[#1F1F1F]"
                            } text-sm sm:text-base font-medium`}
                          >
                            {
                              teamInfo?.find((t) => t.name === teamName)
                                ?.shortname
                            }
                          </div>
                        </div>
                        <div
                          className={`${
                            theme === "dark"
                              ? "text-sm text-gray-400 pb-6 sm:pb-10 ml-2 sm:ml-14"
                              : "text-sm text-[#202124] pb-6 sm:pb-10 ml-2"
                          }`}
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {scoreToShow}
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className={`${
                            theme === "dark"
                              ? "text-sm text-gray-400 pb-6 sm:pb-10 ml-2 sm:ml-14"
                              : "text-sm text-[#202124] pb-6 sm:pb-10 ml-2 sm:ml-8"
                          }`}
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {scoreToShow}
                        </div>
                        <div className="flex flex-col items-center">
                          <img
                            src={teamLogo}
                            alt={teamName}
                            className="w-10 h-10 sm:w-8 sm:h-8"
                          />
                          <div
                            className={`mt-2 ${
                              theme === "dark"
                                ? "text-[#ECECEC]"
                                : "text-[#1F1F1F]"
                            } text-sm sm:text-base font-medium`}
                          >
                            {
                              teamInfo?.find((t) => t.name === teamName)
                                ?.shortname
                            }
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              });

              return (
                <div className="flex items-center justify-between w-full px-4">
                  {renderedTeams}
                </div>
              );
            })()
          ) : (
            // If match is live: Show the fixed team 0 and team 1 layout
            <>
              <div className="flex items-center  gap-[100px] sm:gap-36">
                {matchData?.teams?.map((teamName, index) => {
                  // Match score by checking if the inning includes team name
                  const scoreObj = matchData?.score?.find((s) =>
                    s.inning?.toLowerCase().includes(teamName.toLowerCase())
                  );

                  // Match team info by name
                  const team = teamInfo?.find((t) => t.name === teamName);

                  // Format score or fallback
                  const score = scoreObj ? formatScore(scoreObj) : "-";

                  return (
                    <div
                      key={teamName}
                      className="flex items-center justify-between gap-[45px] sm:gap-4"
                    >
                      {/* If it's the first team, show logo then score; if second, reverse */}
                      {index === 0 ? (
                        <>
                          <div>
                            <img
                              src={team?.img || "default-logo.png"}
                              alt={team?.shortname || teamName}
                              className="w-10 h-10 sm:w-8 sm:h-8"
                            />
                            <div
                              className={`mt-2 text-sm sm:text-base font-medium ${
                                theme === "dark"
                                  ? "text-[#ECECEC]"
                                  : "text-[#1F1F1F]"
                              }`}
                            >
                              {team?.shortname || getShortTeamName(teamName)}
                            </div>
                          </div>
                          <div
                            className={`pb-6 sm:pb-10 ml-2 sm:ml-14 text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-[#202124]"
                            }`}
                          >
                            {score}
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={`pb-6 sm:pb-10 mr-2 sm:mr-14 text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-[#202124]"
                            }`}
                          >
                            {score}
                          </div>
                          <div>
                            <img
                              src={team?.img || "default-logo.png"}
                              alt={team?.shortname || teamName}
                              className="w-10 h-10 sm:w-8 sm:h-8"
                            />
                            <div
                              className={`mt-2 text-sm sm:text-base font-medium ${
                                theme === "dark"
                                  ? "text-[#ECECEC]"
                                  : "text-[#1F1F1F]"
                              }`}
                            >
                              {team?.shortname || getShortTeamName(teamName)}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div
          className={`${
            theme === "dark"
              ? "text-sm text-center text-[#BDC1C6]"
              : " text-center text-[#202124] text-[12px] sm:text-[14px] mt-3"
          }`}
        >
          {matchData?.status}
          <br />
        </div>
        <div
          className={`${
            theme === "dark"
              ? "text-xs text-center text-gray-400 mb-2"
              : "text-xs text-center text-[#5E5E5E] mb-2 text-[12px]"
          }`}
        >
          {matchData?.matchType.toUpperCase()} {matchnumber}
        </div>

        <Tabs
          defaultValue="scorecard"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList
            // className="w-full  text-gray-400 h-12  bg-[#101218]  flex"

            className={`${
              theme === "dark"
                ? "w-full  text-white bg-[#0A0A0A] flex  border-b border-gray-600 p-0 h-auto rounded-none sm:flex-row items-center justify-center gap-2 sm:gap-4"
                : "w-full  text-white bg-[#f8f9fa] flex  border-b border-[#AEACAC] p-0 h-auto rounded-none sm:flex-row items-center justify-center gap-2 sm:gap-4"
            }`}
          >
            <TabsTrigger
              value="feeds"
              className={`${
                theme === "dark"
                  ? "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full sm:w-auto text-center"
                  : "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-[#1F1F1F] data-[state=active]:border-b-2 data-[state=active]:border-[#1F1F1F] data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full sm:w-auto text-center"
              }`}
            >
              FEEDS
            </TabsTrigger>
            <TabsTrigger
              value="scorecard"
              className={`${
                theme === "dark"
                  ? "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full sm:w-auto text-center"
                  : "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-[#1F1F1F] data-[state=active]:border-b-2 data-[state=active]:border-[#1F1F1F] data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full sm:w-auto text-center"
              }`}
            >
              SCORECARD
            </TabsTrigger>
            <TabsTrigger
              value="chatRoom"
              className={`${
                theme === "dark"
                  ? "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full sm:w-auto text-center"
                  : "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-[#1F1F1F] data-[state=active]:border-b-2 data-[state=active]:border-[#1F1F1F] data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full sm:w-auto text-center"
              }`}
            >
              CHAT&nbsp;ROOM
            </TabsTrigger>
          </TabsList>
          <TabsContent value="feeds">
            <div className=" text-gray-700  mt-2  ">
              <iframe
                src={video_url}
                style={{ width:"100%", height: "600px", border: "none" }}
                allowFullScreen
              ></iframe>
            </div>
          </TabsContent>
          <TabsContent value="scorecard">
            <ScoreCardTab data={matchData} />
          </TabsContent>
          <TabsContent value="chatRoom">
            {/* <ScoreCardTab data={matchData} /> */}
            <CommentSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MatchCard;
