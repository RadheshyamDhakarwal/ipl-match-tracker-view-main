import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import { useTheme } from "./ThemeContext";

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [livematches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const todayRef = useRef<HTMLAnchorElement | null>(null);
  const hasSetTodayRef = useRef(false);
  const { theme } = useTheme();
  const setTodayMatchRef = useCallback((node: HTMLAnchorElement | null) => {
    if (node && !hasSetTodayRef.current) {
      todayRef.current = node;
      hasSetTodayRef.current = true;
    }
  }, []);
  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/cricindia/getmatches.php");
      const data = await response.json();
      hasSetTodayRef.current = false;
      setMatches(data.matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchliveMatches = async () => {
    //  if (!isLive) return;
    try {
      const response = await fetch(
        "https://api.cricapi.com/v1/cricScore?apikey=0019c810-8630-4614-a6ca-14580f56223c"
      );
      const data = await response.json();
      hasSetTodayRef.current = false;
      // setLiveMatches(data);
      setLiveMatches(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMatches(); // Initial fetch
    fetchliveMatches();
    const interval = setInterval(() => {
      fetchliveMatches();
    }, 10000); // 10000ms = 10 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  useEffect(() => {
    if (!loading && todayRef.current) {
      setTimeout(() => {
        todayRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100); // delay ensures DOM is ready
    }
  }, [loading]);

  const formatScore = (scoreObj: { r: number; w: number; o: number }) =>
    `${scoreObj.r}/${scoreObj.w} (${scoreObj.o})`;

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

  const istOffset = 5.5 * 60 * 60 * 1000;

  // Date range
  const startDate = new Date("2025-03-22T00:00:00Z").getTime() + istOffset;
const endDate = new Date("2025-06-03T23:59:59Z").getTime() + istOffset;

  const sortedMatches = [...matches]
    // 1. Filter only matches between 22 March and 25 May
    .filter((match) => {
      const matchTime = new Date(match.dateTimeGMT).getTime() + istOffset;
      return matchTime >= startDate && matchTime <= endDate;
    })
    // 2. Sort purely by match date
    .sort((a, b) => {
      const timeA = new Date(a.dateTimeGMT).getTime();
      const timeB = new Date(b.dateTimeGMT).getTime();
      return timeA - timeB;
    });

  const addISTOffsetToTime = (timeStr: string): string => {
    const today = new Date();
    const [timePart, meridian] = timeStr.trim().split(" ");
    const [hourStr, minuteStr] = timePart.split(":");

    let hours = parseInt(hourStr);
    const minutes = parseInt(minuteStr);

    if (meridian.toLowerCase() === "pm" && hours < 12) hours += 12;
    if (meridian.toLowerCase() === "am" && hours === 12) hours = 0;

    const dateWithTime = new Date(today);
    dateWithTime.setHours(hours, minutes, 0, 0);

    // Add 5.5 hours
    const newTime = new Date(dateWithTime.getTime() + 5.5 * 60 * 60 * 1000);

    return newTime
      .toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  };

  const getShortTeamName = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };

  const renderMatchCard = (match: any, index: number) => {
    const { date, time, diffDays } = formatDateAndTime(match.dateTimeGMT);
    const isToday = diffDays === 0;
    const matchWinner = match?.extra?.matchWinner;
    const matchStarted = match?.matchStarted;
    const totalCount = 74;

    const liveMatch = livematches?.find((live: any) => {
      return (
        live.id === match.id ||
        match.name.includes(live.t1) ||
        match.name.includes(live.t2)
      );
    });

    const isLive = matchStarted && !matchWinner && liveMatch;
    const matchCardContent = (
      <div className="p-3 sm:p-4">
        {/* Date, type, etc */}
        <div className="mb-1">
          <div
            className={`${
              theme === "dark" ? "text-gray-600" : "text-[#5E5E5E]"
            } flex justify-between text-[12px]`}
          >
            <div>
              {match?.matchType?.toUpperCase()}{" "}
              {` ${index + 1} of ${totalCount}`}
            </div>
            <div>
              {/* {isLive ? (
                <span className="text-green-600 font-bold">Live</span>
              ) : (
                dateLabel
                date
              )} */}

              {(() => {
                const { date: dateLabel, diffDays } = formatDateAndTime(
                  match.dateTimeGMT
                );

                const now = new Date();
                const matchStart = new Date(match.dateTimeGMT);
                const isToday = diffDays === 0;
                const hasStarted = now >= matchStart;

                const isLive =
                  isToday &&
                  hasStarted &&
                  match?.matchEnded === false &&
                  match?.score?.length > 0;

                return isLive ? (
                  <span className="text-green-600 font-bold">Live</span>
                ) : (
                  <span>{date}</span>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Team names and scores */}
        {isLive && liveMatch ? (
          <div className="space-y-2">
            {[
              {
                name: liveMatch.t1,
                score: liveMatch.t1s,
                img: liveMatch.t1img,
              },
              {
                name: liveMatch.t2,
                score: liveMatch.t2s,
                img: liveMatch.t2img,
              },
            ].map((team, i) => {
              const cleanTeamName = team.name.replace(/\s*\[.*?\]/g, "");
              return (
                <div className="flex items-center justify-between mb-2" key={i}>
                  <div className="flex items-center">
                    <img
                      src={team.img}
                      alt={team.name}
                      className="w-6 h-6 mr-2 rounded-full"
                    />
                    <span className="text-[14px] text-[#202124]">
                      {getShortTeamName(cleanTeamName)}
                    </span>
                  </div>
                  <span className="text-[14px] font-medium text-[#202124]">
                    {team.score}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          match?.teams?.map((team: string, i: number) => {
            const scores = match?.extra?.score || [];
            const isWinningTeam = team === matchWinner;
            const teamFirstScore = parseInt(scores[0]?.r);
            const teamSecondScore = parseInt(scores[1]?.r);
            const hightscore = teamFirstScore > teamSecondScore;

            return (
              <div
                className={`flex items-center  mb-2 text-[14px] ${
                  theme === "dark" ? "text-[#BDC1C2]" : "text-[#202124]"
                }`}
                key={i}
              >
                <img
                  src={match.teamLogos?.[i]}
                  alt=""
                  className="w-6 h-6 mr-3"
                />
                <div
                  className={`text-[14px]   ${
                    !isWinningTeam && match?.matchEnded === true
                      ? "text-[#999DA9]"
                      : "text-[#202124]"
                  } `}
                >
                  {match?.hasSquad ? getShortTeamName(team) : team}
                </div>
                {scores[i] && (
                  <div
                    className={`ml-auto text-[14px]  ${
                      !isWinningTeam && match?.matchEnded === true
                        ? "text-[#999DA9]"
                        : "text-[#202124]"
                    }`}
                  >
                    {formatScore(scores[i])}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Status or start time */}
        {match.matchStarted === false && (
          <div
            className={`${
              theme === "dark" ? "text-[#BDC1C2]" : "text-[#202124]"
            } mt-2 text-[12px] sm:text-[14px]`}
          >
            {/* {time} */}
            {`Starts at ${addISTOffsetToTime(time.replace("Starts at ", ""))}`}
          </div>
        )}
        {match.matchStarted === true && (
          <div
            className={`${
              theme === "dark" ? "text-[#BDC1C2]" : "text-[#202124]"
            } mt-2 text-[12px] sm:text-[14px]`}
          >
            {match.status}
          </div>
        )}
      </div>
    );

    if (loading) return <Spinner />;

    return match?.hasSquad  && !(match.matchStarted && (!match?.extra?.score || match?.extra?.score.length === 0)) ? (
      <Link
        key={match.id}
        to={
          match.matchStarted
            ? `/match-preview/${match.slug}/${match.id}`
            : `/notstarted/${match.slug}/${match.id}`
        }
        state={{
          teamLogos: match.teamLogos,
          dates: match.dateTimeGMT,
          venue: match.venue,
          status: match.status,
          tossWinner: match.tossWinner,
          firstBattingTeam: match?.extra?.score?.[0]?.r,
          matchnumber: `${index + 1} of ${totalCount}`,
          matchstype: `${match?.matchType?.toUpperCase()}`,
          teamInfo: match.teamInfo,
        }}
        ref={isToday ? setTodayMatchRef : null}
        className={`${
          theme === "dark"
            ? "block bg-[#101218] border sm:border-t-0 border-[#3c4043] hover:bg-[#303134]  shadow-lg hover:shadow-xl transition-shadow "
            : "block  hover:bg-[#fafafa] border sm:border-t-0 border-[#ebebeb] mt-2  rounded-lg   sm:rounded-none transition-shadow sm:mt-0"
        }`}
      >
        {matchCardContent}
      </Link>
    ) : (
      <div
        key={match.id}
        className={`${
          theme === "dark"
            ? " border  border-t-0 border-[#3c4043]  hover:bg-[#303134] shadow-md opacity-70 cursor-not-allowed"
            : " border  border-[#ebebeb]  sm:border-t-0  rounded-lg   sm:rounded-none  mt-2 sm:mt-0 opacity-70 cursor-not-allowed"
        }`}
      >
        {matchCardContent}
      </div>
    );
  };

  return (
    <div className=" mx-auto ">
      {/* <h1 className="text-2xl font-bold mb-6 ms-20">Indian Permier League</h1> */}
      {loading ? (
        <p>
          <Spinner />
        </p>
      ) : (
        <div className="grid grid-cols-1 w-full md:max-w-[760px] px-2 mx-auto md:grid-cols-2 lg:grid-cols-2 pt-1">
          {sortedMatches.map((match, index) => renderMatchCard(match, index))}
        </div>
      )}
    </div>
  );
};

export default MatchList;
