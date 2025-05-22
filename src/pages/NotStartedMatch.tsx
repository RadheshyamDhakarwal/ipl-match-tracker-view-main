import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useParams } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "./ThemeContext";
import Spinner from "./Spinner";

const MatchDetailsLayout = () => {
  const { id } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playerimg, setPlayerImg] = useState([]);
  const { theme } = useTheme();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const { dates, venue, matchnumber, matchstype,teamLogos } = location.state || {};
  const [playerImages, setPlayerImages] = useState<Record<string, string>>({});

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > minSwipeDistance) {
      setActiveTab((prev) => {
        if (distance > 0) {
          // swipe left -> next tab
          return Math.min(prev + 1, 1);
        } else {
          // swipe right -> prev tab
          return Math.max(prev - 1, 0);
        }
      });
    }
  };
  // yeh overwrite kar raha hai upar wali date ko
  const fetchMatchData = async () => {
    try {
      const res = await fetch(
        `https://api.cricapi.com/v1/match_squad?apikey=0019c810-8630-4614-a6ca-14580f56223c&id=${id}`
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
    const checkImageExists = (url: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };
  
    const loadPlayerImage = async (playerName: string, teamIndex: number) => {
      if (playerImages[playerName]) return;
  
      const formattedName = playerName
        .split(" ")
        .map((word) => word.toLowerCase())
        .join("-")
        .replace(/-+$/, "");
  
      const baseUrl = `https://cricindia.com/api/cricindia/images/${formattedName}`;
      const extensions = ["webp", "png", "jpg"];
  
      for (const ext of extensions) {
        const url = `${baseUrl}.${ext}`;
        const exists = await checkImageExists(url);
        if (exists) {
          setPlayerImages((prev) => ({ ...prev, [playerName]: url }));
          return;
        }
      }
  
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        playerName
      )}&background=dddddd`;
      setPlayerImages((prev) => ({ ...prev, [playerName]: avatarUrl }));
    };
  
    if (matchData) {
      const players = [...(matchData[0]?.players || []), ...(matchData[1]?.players || [])];
      players.forEach((player) => {
        const teamIndex = matchData[0]?.players?.some((p) => p.name === player.name) ? 0 : 1;
        loadPlayerImage(player.name, teamIndex);
      });
    }
  }, [matchData]);
  

  useEffect(() => {
    if (id) fetchMatchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
    const interval = setInterval(() => {
      fetchMatchData();
    }, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading)
    return (
      <p>
        <Spinner />
      </p>
    );

  const team1 = matchData?.[0];
  const team2 = matchData?.[1];
  const formatDateAndTime = (dateString: string) => {
    const istDate = new Date(new Date(dateString).getTime() + 330 * 60000);
    const today = new Date(new Date().getTime() + 330 * 60000);

    const matchDay = new Date(istDate.toDateString());
    const todayDay = new Date(today.toDateString());

    const diffDays = Math.round(
      (matchDay.getTime() - todayDay.getTime()) / (1000 * 60 * 60 * 24)
    );

    const label =
      diffDays === 0
        ? "Today"
        : diffDays === 1
        ? "Tomorrow"
        : diffDays === -1
        ? "Yesterday"
        : istDate.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
          });

    return { date: label };
  };

  const { date } = formatDateAndTime(dates);

 
  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-[#0e0e0e] text-white min-h-screen p-4 md:p-8  mx-auto"
          : " text-white min-h-screen    mx-auto shadow-md"
      }`}
      style={{ maxWidth: "660px" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Match Info Header */}
      <p className="text-sm text-gray-400 ps-5 p-6">
        {" "}
        <span
          className={`${
            theme === "dark"
              ? " text-sm text-gray-400"
              : "text-[#223577] text-sm"
          }`}
        >
          {" "}
          IPL ·
        </span>
        {date}
      </p>
      <div className="text-center mb-4">
        <div className="flex justify-between items-center mt-0  px-10 sm:px-20">
          <div className="flex flex-col items-center">
            <img
              src={matchData?.[0]?.img}
              className=" w-8 h-8"
              alt={team1?.name}
            />
            <span
              className={`${theme === "dark" ? "" : " text-[#1F1F1F] pt-4"}`}
            >
              {matchData?.[0]?.shortname}
            </span>
          </div>
          <span className="text-gray-400">vs</span>
          <div className="flex flex-col items-center">
            <img
              src={matchData?.[1]?.img}
              className="w-8 h-8"
              alt={team2?.name}
            />
            <span
              className={`${
                theme === "dark" ? "" : " text-[#1F1F1F] pt-4 text-[14px]"
              }`}
            >
              {matchData?.[1]?.shortname}
            </span>
          </div>
        </div>
        <p
          className={`${
            theme === "dark"
              ? " text-gray-500 mt-1 text-[12px]"
              : " text-[#5E5E5E] mt-1 text-[12px]"
          }`}
        >
          {matchstype} {matchnumber}
        </p>
      </div>

      {/* Win Probability */}
      {theme === "dark" ? (
        <div className="bg-[#141414] p-4 rounded-md mb-4">
          <h4 className="uppercase text-xs font-semibold text-center text-gray-300 mb-2">
            Win Probability
          </h4>
          <div className="flex justify-between text-sm mb-1 px-1">
            <span>
              {team1?.shortname}
              <br />
              <span className="text-purple-400 font-semibold">51%</span>
            </span>
            <span className="text-right">
              {team2?.shortname}
              <br />
              <span className="text-red-400 font-semibold">49%</span>
            </span>
          </div>
          <div className="h-2 flex rounded overflow-hidden">
            <div className="bg-purple-400" style={{ width: "51%" }}></div>
            <div className="bg-red-400" style={{ width: "49%" }}></div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Buttons */}
      {/* <div className="flex gap-3 justify-center mb-6">
        <button
          className={`${
            theme === "dark"
              ? "border border-gray-600 px-4 py-1 rounded-full text-sm"
              : "border border-gray-600 px-4 py-1 rounded-full text-sm text-[#474747]"
          }`}
        >
          TV and streaming
        </button>
        <button
          className={`${
            theme === "dark"
              ? "border border-gray-600 px-4 py-1 rounded-full text-sm"
              : "border border-gray-600 px-4 py-1 rounded-full text-sm text-[#474747]"
          }`}
        >
          Buy tickets
        </button>
      </div> */}

      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Tabs
          value={activeTab.toString()}
          onValueChange={(val) => setActiveTab(Number(val))}
          className="w-full ]"
        >
          <TabsList
            className={`${
              theme === "dark"
                ? "w-full flex p-0 h-auto bg-black border-b border-gray-600 rounded-none text-white mb-3"
                : "w-full flex h-auto  p-0 border-b border-gray-600 rounded-none text-white mb-3 bg-[#f8f9fa]"
            }`}
          >
            <TabsTrigger
              value="0"
              className={`${
                theme === "dark"
                  ? "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-white  data-[state=active]:border-white data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  : "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-[#1F1F1F] data-[state=active]:border-b-2 data-[state=active]:border-[#1F1F1F] data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full sm:w-auto text-center"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span>{team1?.shortname}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="1"
              className={`${
                theme === "dark"
                  ? "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-white  data-[state=active]:border-white  data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  : "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-[#1F1F1F] data-[state=active]:border-b-2 data-[state=active]:border-[#1F1F1F] data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full sm:w-auto text-center"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span>{team2?.shortname}</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Team 1 Squad */}
          <TabsContent value="0">
            <div
              className={`${
                theme === "dark"
                  ? "bg-[#1a1a1a] p-3 rounded-md text-sm space-y-1"
                  : " p-4 rounded-md text-sm space-y-1 pt-2"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                {matchData?.[0]?.players?.map((player: any, idx: number) => {
                
                  return (
                    <div
                      key={idx}
                      className={`${
                        theme === "dark"
                          ? "flex items-center space-x-3 bg-[#1A1F2C] p-3 rounded-lg"
                          : "flex items-center space-x-3   rounded-lg"
                      }`}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                           src={playerImages[player.name]}
                          alt={player.name}
                        />
                      </Avatar>
                      <div className=" ">
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-[#1F1F1F]"
                          }`}
                        >
                          {player.name}
                        </span>
                        <div>
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-[#5E5E5E] text-[12px]"
                            }`}
                          >
                            {player?.battingStyle} . {player?.bowlingStyle}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Team 2 Squad */}
          <TabsContent value="1">
            <div
              className={`${
                theme === "dark"
                  ? "bg-[#1a1a1a] p-4 rounded-md text-sm space-y-1"
                  : " p-4 rounded-md text-sm space-y-1 pt-2"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                {matchData?.[1]?.players?.map((player: any, idx: number) => {
                  const teamIndex = 1;
                  return (
                    <div
                      key={idx}
                      className={`${
                        theme === "dark"
                          ? "flex items-center space-x-3 bg-[#1A1F2C] rounded-lg"
                          : "flex items-center space-x-3   rounded-lg"
                      }`}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={playerImages[player.name]}
                          alt={player.name}
                        />
                      </Avatar>

                     
                      <div className=" ">
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-gray-300"
                              : "text-[#1F1F1F]"
                          }`}
                        >
                          {player.name}
                        </span>
                        <div>
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-[#5E5E5E] text-[12px]"
                            }`}
                          >
                            {player?.battingStyle} . {player?.bowlingStyle}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          {/* Venue and Time Info */}
        </Tabs>
        <div
          className={`${
            theme === "dark"
              ? "bg-[#141414] p-4 rounded-md mt-4"
              : "  rounded-md  p-4 bg-[#f8f9fa] "
          }`}
        >
          <p className="text-sm border-b pb-4">
            <span
              className={`${
                theme === "dark"
                  ? "text-[#70C890] font-medium"
                  : "text-[#0D652D] font-medium"
              }`}
            >
              Venue:
            </span>{" "}
            <span
              className={`${
                theme === "dark" ? "text-[#A8C7FA]" : "text-[#0B57D0]"
              }`}
            >
              {venue}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            All times are in India Standard Time
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsLayout;
