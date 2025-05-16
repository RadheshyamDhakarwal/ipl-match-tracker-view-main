"use client";

import { useEffect, useRef, useState } from "react";
import { MatchData } from "@/pages/MatchDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/pages/ThemeContext";

type Props = {
  data: MatchData;
  teamLogos?: string[];
};

const ScoreCardTab = ({ data, teamLogos }: Props) => {
  const [inningIdx, setInningIdx] = useState(0);
  const [playerimg, setPlayerImg] = useState([]);
  const [playerImages, setPlayerImages] = useState<Record<string, string>>({});

  const { theme } = useTheme();
  const fetchPlayerimg = async () => {
    try {
      const response = await fetch("/api/cricindia/get_players.php");
      const data = await response.json();
      setPlayerImg(data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerimg();
  }, []);

  const formatScore = (scoreObj: { r: number; w: number; o: number }) =>
    `${scoreObj.r} (${scoreObj.w} wkts, ${scoreObj.o} ov)`;

  const getShortTeamName = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swipe Left → Next Tab
        if (inningIdx < data.scorecard.length - 1) {
          setInningIdx((prev) => prev + 1);
        }
      } else {
        // Swipe Right → Previous Tab
        if (inningIdx > 0) {
          setInningIdx((prev) => prev - 1);
        }
      }
    }
  };
  // const getPlayerImage = (playerName: string, teamIndex: number) => {
  //   const teamName = data.teams?.[teamIndex]; // Ensure teams exists and access team name
  //   if (!teamName) {
  //     return { webp: "", png: "" }; // Return empty values if teamName is invalid
  //   }

  //   const formattedName = playerName
  //     .split(" ")
  //     .map((word) => word.toLowerCase())
  //     .join("-");

  //   const webpImage = `https://cric-india.com/images/${formattedName}.webp`;
  //   const pngImage = `https://cric-india.com/images/${formattedName}.png`;

  //   return { webp: webpImage, png: pngImage };
  // };

  const checkImageExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const loadPlayerImage = async (playerName: string) => {
    if (playerImages[playerName]) return;
    const formattedName = playerName
      .split(" ")
      .map((w) => w.toLowerCase())
      .join("-")
      .replace(/-+$/, "");
    const extensions = ["webp", "png", "jpg"];
    const baseUrl = `https://cric-india.com/images/${formattedName}`;

    for (const ext of extensions) {
      const url = `${baseUrl}.${ext}`;
      const exists = await checkImageExists(url);
      if (exists) {
        setPlayerImages((prev) => ({ ...prev, [playerName]: url }));
        return;
      }
    }

    // Fallback to initials avatar if none found
    setPlayerImages((prev) => ({
      ...prev,
      [playerName]: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        playerName
      )}&background=dddddd`,
    }));
  };

  useEffect(() => {
    const allPlayers: string[] = [];

    data.scorecard.forEach((inning) => {
      inning.batting?.forEach((b) => {
        if (b?.batsman?.name) allPlayers.push(b.batsman.name);
      });
      inning.bowling?.forEach((b) => {
        if (b?.bowler?.name) allPlayers.push(b.bowler.name);
      });
    });

    [...new Set(allPlayers)].forEach((name) => loadPlayerImage(name));
  }, [data]);


  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-full h-full"
    >
      <Tabs
        defaultValue="0"
        value={inningIdx.toString()}
        onValueChange={(val) => setInningIdx(Number(val))}
        className="w-full h-full "
      >
        {/* Tab List based on innings */}
        <TabsList
          className={`${
            theme === "dark"
              ? "w-full  text-white bg-[#0A0A0A] flex  border-b border-gray-600 p-0 h-auto rounded-none sm:flex-row items-center justify-center gap-2 sm:gap-4"
              : "w-full  text-white bg-[#f8f9fa] flex  border-b border-[#AEACAC] p-0 h-auto rounded-none sm:flex-row items-center justify-center gap-2 sm:gap-4"
          }`}
        >
          <>
            {data?.matchStarted && !data?.matchWinner && data.score.length == 1
              ? // Show teams based on first inning team match
                (() => {
                  const firstScoringTeam = data?.score[0]?.inning?.replace(
                    / Inning \d+$/,
                    ""
                  );
                  const reorderedTeams =
                    data.teams[0] == firstScoringTeam
                      ? [data?.teams[0], data?.teams[1]]
                      : [data?.teams[1], data?.teams[0]];
              
                  return reorderedTeams.map((team, index) => (
                    <TabsTrigger
                      key={index}
                      value={index.toString()}
                      className={`${
                        theme === "dark"
                          ? "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full sm:w-auto text-center"
                          : "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-[#1F1F1F] data-[state=active]:border-b-2 data-[state=active]:border-[#1F1F1F] data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full sm:w-auto text-center"
                      }`}
                    >
                      {team}
                    </TabsTrigger>
                  ));
                })()
              : data?.matchStarted &&
                !data?.matchWinner &&
                data.score.length > 1
              ? // Match started, no winner, multiple innings — show teams as per original order
                data.teams.map((team, index) => {
                  const teamName = data.score[index].inning?.replace(
                    / Inning \d+$/,
                    ""
                  );
                  return (
                    <TabsTrigger
                      key={index}
                      value={index.toString()}
                      className={`${
                        theme === "dark"
                          ? "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full sm:w-auto text-center"
                          : "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-[#1F1F1F] data-[state=active]:border-b-2 data-[state=active]:border-[#1F1F1F] data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full sm:w-auto text-center"
                      }`}
                    >
                      {teamName}
                    </TabsTrigger>
                  );
                })
              : // Match completed or not started — show based on actual scorecard
                data?.scorecard.map((inning, index) => {
                  const teamName = data.score[index].inning?.replace(
                    / Inning \d+$/,
                    ""
                  );
                  return (
                    <TabsTrigger
                      key={index}
                      value={index.toString()}
                      className={`${
                        theme === "dark"
                          ? "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full sm:w-auto text-center"
                          : "flex-1 py-3 rounded-none text-gray-600 data-[state=active]:text-[#1F1F1F] data-[state=active]:border-b-2 data-[state=active]:border-[#1F1F1F] data-[state=active]:bg-transparent data-[state=active]:shadow-none w-full sm:w-auto text-center"
                      }`}
                    >
                      {teamName}
                    </TabsTrigger>
                  );
                })}
          </>
        </TabsList>

        {/* Tab Panels */}
        {/* {data?.scorecard.map((inning, i) => {
          const battingData = inning?.batting || [];
          const bowlingData = inning?.bowling || [];
          const teamName = data?.teams[inning?.[i]];

          return (
            <TabsContent key={i} value={i.toString()} className="px-4">
              Team Info and Score
              <div className="flex items-center justify-between w-full px-2 sm:px-4  ">
                <div className="flex items-center gap-2">
                  {teamLogos?.[inning?.[i]] && (
                    <img
                      src={teamLogos[inning?.[i]]}
                      className="w-6 h-6"
                      alt={teamName}
                    />
                  )}
                  <span className="text-white font-medium">{teamName}</span>
                </div>

                
              </div>

              Batting Table
              <div className="overflow-x-auto  whitespace-nowrap mb-4">
                <table className="min-w-full sm:text-sm text-[12px]">
                  <thead
                    className={`${
                      theme === "dark"
                        ? "text-left text-xs text-[#999DA9] border-b border-gray-600"
                        : "text-left text-xs text-[#5E5E5E] border-b border-[#ddd]"
                    }`}
                  >
                    <tr>
                      <td className="pt-2  pb-2 sm:w-3/4 w-60">Batting</td>
                      <td className="pt-2 w-6 pb-2 ">R</td>
                      <td className="pt-2 w-6 pb-2">B</td>
                      <td className="pt-2 w-6 pb-2">4s</td>
                      <td className="pt-2 w-6 pb-2">6s</td>
                      <td className="pt-2 w-6 pb-2">S/R</td>
                    </tr>
                  </thead>
                  <tbody>
                    {battingData.map((b, bi) => (
                      <tr
                        key={bi}
                        className={`${
                          theme === "dark"
                            ? "border-b text-[#BDC1C6]"
                            : "border-b text-[#202124]"
                        }`}
                      >
                        <td className="p-2 ps-0">
                          <div className="flex gap-2 items-center">
                            <Avatar
                              className=""
                              style={{ width: "42px", height: "42px" }}
                            >
                              <AvatarImage
                                src={playerImages[b.batsman.name]}
                                alt={b.batsman.name}
                              />
                            </Avatar>
                            <div>
                              <span>{b.batsman.name}</span>
                              <div
                                className={`${
                                  theme === "dark"
                                    ? "text-[#999DA9]"
                                    : "text-[#5E5E5E]"
                                }`}
                              >
                                {b["dismissal-text"]}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="m-2">{b.r}</td>
                        <td className="m-2">{b.b}</td>
                        <td className="m-2">{b["4s"]}</td>
                        <td className="m-2">{b["6s"]}</td>
                        <td className="m-2">{b.sr.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>

                  <tr
                    className={`${
                      theme === "dark"
                        ? "text-[#BDC1C6] border-b border-[#3c4043]"
                        : "text-[#BDC1C6] border-b border-[#0000000D]"
                    }`}
                  >
                    <td
                      className={`${
                        theme === "dark"
                          ? "p-2 font-medium "
                          : "p-2 font-medium text-[#202124]"
                      }`}
                    >
                      Extras
                    </td>
                    <td
                      colSpan={5}
                      className={`${theme === "dark" ? "" : "text-[#1F1F1F]"}`}
                    >
                      {data.scorecard[0]?.extras?.r}{" "}
                      <span
                        className={`${
                          theme === "dark"
                            ? "text-[#999DA9] text-xs"
                            : "text-[#1F1F1F] text-xs"
                        }`}
                      >
                        (B:{data.scorecard[inningIdx]?.extras?.b})
                      </span>
                    </td>
                  </tr>

                  <tr
                    className={`${
                      theme === "dark"
                        ? "text-[#BDC1C6] border-b border-[#3c4043]"
                        : "text-[#BDC1C6] border-b border-[#0000000D]"
                    }`}
                  >
                    <td
                      className={`${
                        theme === "dark"
                          ? "p-2 font-medium  "
                          : "p-2 font-medium text-[#202124] "
                      }`}
                    >
                      Total runs
                    </td>
                    <td
                      colSpan={5}
                      className={`${theme === "dark" ? "" : "text-[#1F1F1F] "}`}
                    >
                      {formatScore(data.score?.[inningIdx])}
                    </td>
                  </tr>
                </table>
              </div>

              {i === 0 ||
              (i === 1 && (!data?.matchStarted || data?.matchWinner)) ? (
                <div className="overflow-x-auto whitespace-nowrap mb-4">
                  <table className="min-w-full sm:text-sm text-[12px]">
                    <thead
                      className={`${
                        theme === "dark"
                          ? "text-left text-xs text-[#999DA9] border-b border-gray-600"
                          : "text-left text-xs text-[#5E5E5E] border-b border-[#ddd]"
                      }`}
                    >
                      <tr>
                        <td className="pt-2  pb-2 sm:w-3/4 w-60">Batting</td>
                        <td className="pt-2 w-6 pb-2 ">R</td>
                        <td className="pt-2 w-6 pb-2">B</td>
                        <td className="pt-2 w-6 pb-2">4s</td>
                        <td className="pt-2 w-6 pb-2">6s</td>
                        <td className="pt-2 w-6 pb-2">S/R</td>
                      </tr>
                    </thead>
                    <tbody>
                      {battingData.map((b, bi) => (
                        <tr
                          key={bi}
                          className={`${
                            theme === "dark"
                              ? "border-b text-[#BDC1C6]"
                              : "border-b text-[#202124]"
                          }`}
                        >
                          <td className="p-2 ps-0">
                            <div className="flex gap-2 items-center">
                              <Avatar
                                className=""
                                style={{ width: "42px", height: "42px" }}
                              >
                                <AvatarImage
                                  src={playerImages[b.batsman.name]}
                                  alt={b.batsman.name}
                                />
                                <img
                                  src={playerImages[b.batsman.name]}
                                  alt={b.batsman.name}
                                />
                              </Avatar>
                              <div>
                                <span>{b.batsman.name}</span>
                                <div
                                  className={`${
                                    theme === "dark"
                                      ? "text-[#999DA9]"
                                      : "text-[#5E5E5E]"
                                  }`}
                                >
                                  {b["dismissal-text"]}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="m-2">{b.r}</td>
                          <td className="m-2">{b.b}</td>
                          <td className="m-2">{b["4s"]}</td>
                          <td className="m-2">{b["6s"]}</td>
                          <td className="m-2">{b.sr.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>

                    <tr
                      className={`${
                        theme === "dark"
                          ? "text-[#BDC1C6] border-b border-[#3c4043]"
                          : "text-[#BDC1C6] border-b border-[#0000000D]"
                      }`}
                    >
                      <td
                        className={`${
                          theme === "dark"
                            ? "p-2 font-medium "
                            : "p-2 font-medium text-[#202124]"
                        }`}
                      >
                        Extras
                      </td>
                      <td
                        colSpan={5}
                        className={`${
                          theme === "dark" ? "" : "text-[#1F1F1F]"
                        }`}
                      >
                        {data.scorecard[0]?.extras?.r}{" "}
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-[#999DA9] text-xs"
                              : "text-[#1F1F1F] text-xs"
                          }`}
                        >
                          (B:{data.scorecard[inningIdx]?.extras?.b})
                        </span>
                      </td>
                    </tr>

                    <tr
                      className={`${
                        theme === "dark"
                          ? "text-[#BDC1C6] border-b border-[#3c4043]"
                          : "text-[#BDC1C6] border-b border-[#0000000D]"
                      }`}
                    >
                      <td
                        className={`${
                          theme === "dark"
                            ? "p-2 font-medium  "
                            : "p-2 font-medium text-[#202124] "
                        }`}
                      >
                        Total runs
                      </td>
                      <td
                        colSpan={5}
                        className={`${
                          theme === "dark" ? "" : "text-[#1F1F1F] "
                        }`}
                      >
                        {formatScore(data.score?.[0])}
                      </td>
                    </tr>
                  </table>
                </div>
              ) : (
                <div className="text-center text-sm py-4 text-gray-500">
                  Scorecard Not Available
                </div>
              )}

              Bowling Table
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead
                    className={`${
                      theme === "dark"
                        ? "text-left text-xs text-[#999DA9] border-b border-gray-600"
                        : "text-left text-xs text-[#5E5E5E] border-b  sm:mb-0 mb-2 border-[#ddd]"
                    }`}
                  >
                    <tr>
                      <td className=" sm:w-3/4 w-60 pb-2">Bowling</td>
                      <td className="w-6 pb-2">O</td>
                      <td className="w-6 pb-2">M</td>
                      <td className="w-6 pb-2">R</td>
                      <td className="w-6 pb-2">W</td>
                      <td className="w-6 pb-2">Econ</td>
                    </tr>
                  </thead>
                  <tbody>
                    {bowlingData.map((b, bi) => {
                      const teamIndex = i;
                      return (
                        <tr
                          key={bi}
                          className={`${
                            theme === "dark"
                              ? "border-b border-gray-700 text-[#BDC1C6]"
                              : "border-b border-[#0000000D] text-[#202124]  "
                          }`}
                        >
                          <td className="p-2 ps-0">
                            <div className="flex gap-2 items-center sm:text-sm text-[12px]">
                              <Avatar
                                className=""
                                style={{ width: "42px", height: "42px" }}
                              >
                                <AvatarImage
                                  src={playerImages[b.bowler.name]}
                                  alt={b.bowler.name}
                                />
                              </Avatar>
                              <div>
                                <span> {b.bowler.name}</span>
                              </div>
                            </div>
                          </td>
                          <td className="m-2 w-6">{`${b.o}.0`}</td>
                          <td className="m-2">{b.m}</td>
                          <td className="m-2">{b.r}</td>
                          <td className="m-2">{b.w}</td>
                          <td className="m-2">{b.eco.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          );
        })} */}

        {[0, 1].map((i) => {
          const inning = data?.scorecard?.[i];
          const battingData = inning?.batting || [];
          const bowlingData = inning?.bowling || [];
          const teamName = data?.teams?.[i];
          const hasBatted = !!inning;

          return (
            <TabsContent key={i} value={i.toString()} className="px-4">
              {/* Team Info */}
              {/* <div className="flex items-center justify-between w-full px-2 sm:px-4">
                <div className="flex items-center gap-2">
                  {teamLogos?.[i] && (
                    <img
                      src={teamLogos[i]}
                      className="w-6 h-6"
                      alt={teamName}
                    />
                  )}
                  <span className="text-white font-medium">{teamName}</span>
                </div>
              </div> */}

              {hasBatted ? (
                <>
                  {/* Batting Table */}

                  <div className="overflow-x-auto  whitespace-nowrap mb-4">
                    <table className="min-w-full sm:text-sm text-[12px]">
                      <thead
                        className={`${
                          theme === "dark"
                            ? "text-left text-xs text-[#999DA9] border-b border-gray-600"
                            : "text-left text-xs text-[#5E5E5E] border-b border-[#ddd]"
                        }`}
                      >
                        <tr>
                          <td className="pt-2  pb-2 sm:w-3/4 w-60">Batting</td>
                          <td className="pt-2 w-6 pb-2 ">R</td>
                          <td className="pt-2 w-6 pb-2">B</td>
                          <td className="pt-2 w-6 pb-2">4s</td>
                          <td className="pt-2 w-6 pb-2">6s</td>
                          <td className="pt-2 w-6 pb-2">S/R</td>
                        </tr>
                      </thead>
                      <tbody>
                        {battingData.map((b, bi) => (
                          <tr
                            key={bi}
                            className={`${
                              theme === "dark"
                                ? "border-b text-[#BDC1C6]"
                                : "border-b text-[#202124]"
                            }`}
                          >
                            <td className="p-2 ps-0">
                              <div className="flex gap-2 items-center">
                                <Avatar
                                  className=""
                                  style={{ width: "42px", height: "42px" }}
                                >
                                  <AvatarImage
                                    src={playerImages[b.batsman.name]}
                                    alt={b.batsman.name}
                                  />
                                </Avatar>
                                <div>
                                  <span>{b.batsman.name}</span>
                                  <div
                                    className={`${
                                      theme === "dark"
                                        ? "text-[#999DA9]"
                                        : "text-[#5E5E5E]"
                                    }`}
                                  >
                                    {b["dismissal-text"]}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="m-2">{b.r}</td>
                            <td className="m-2">{b.b}</td>
                            <td className="m-2">{b["4s"]}</td>
                            <td className="m-2">{b["6s"]}</td>
                            <td className="m-2">{b.sr.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>

                      {data?.score?.length > inningIdx &&
                        data?.scorecard?.[inningIdx]?.extras && (
                          <>
                            <tr
                              className={`${
                                theme === "dark"
                                  ? "text-[#BDC1C6] border-b border-[#3c4043]"
                                  : "text-[#BDC1C6] border-b border-[#0000000D]"
                              }`}
                            >
                              <td
                                className={`${
                                  theme === "dark"
                                    ? "p-2 font-medium"
                                    : "p-2 font-medium text-[#202124]"
                                }`}
                              >
                                Extras
                              </td>
                              <td
                                colSpan={5}
                                className={`${
                                  theme === "dark" ? "" : "text-[#1F1F1F]"
                                }`}
                              >
                                {data.scorecard[inningIdx]?.extras?.r}{" "}
                                <span
                                  className={`${
                                    theme === "dark"
                                      ? "text-[#999DA9] text-xs"
                                      : "text-[#1F1F1F] text-xs"
                                  }`}
                                >
                                  (B:{data.scorecard[inningIdx]?.extras?.b})
                                </span>
                              </td>
                            </tr>

                            <tr
                              className={`${
                                theme === "dark"
                                  ? "text-[#BDC1C6] border-b border-[#3c4043]"
                                  : "text-[#BDC1C6] border-b border-[#0000000D]"
                              }`}
                            >
                              <td
                                className={`${
                                  theme === "dark"
                                    ? "p-2 font-medium"
                                    : "p-2 font-medium text-[#202124]"
                                }`}
                              >
                                Total runs
                              </td>
                              <td
                                colSpan={5}
                                className={`${
                                  theme === "dark" ? "" : "text-[#1F1F1F]"
                                }`}
                              >
                                {formatScore(data.score?.[inningIdx])}
                              </td>
                            </tr>
                          </>
                        )}
                    </table>
                  </div>
                  {/* {i === 0 ||
                  (i === 1 && (!data?.matchStarted || data?.matchWinner)) ? (
                    <div className="overflow-x-auto whitespace-nowrap mb-4">
                      <table className="min-w-full sm:text-sm text-[12px]">
                        <thead
                          className={`${
                            theme === "dark"
                              ? "text-left text-xs text-[#999DA9] border-b border-gray-600"
                              : "text-left text-xs text-[#5E5E5E] border-b border-[#ddd]"
                          }`}
                        >
                          <tr>
                            <td className="pt-2  pb-2 sm:w-3/4 w-60">
                              Batting
                            </td>
                            <td className="pt-2 w-6 pb-2 ">R</td>
                            <td className="pt-2 w-6 pb-2">B</td>
                            <td className="pt-2 w-6 pb-2">4s</td>
                            <td className="pt-2 w-6 pb-2">6s</td>
                            <td className="pt-2 w-6 pb-2">S/R</td>
                          </tr>
                        </thead>
                        <tbody>
                          {battingData.map((b, bi) => (
                            <tr
                              key={bi}
                              className={`${
                                theme === "dark"
                                  ? "border-b text-[#BDC1C6]"
                                  : "border-b text-[#202124]"
                              }`}
                            >
                              <td className="p-2 ps-0">
                                <div className="flex gap-2 items-center">
                                  <Avatar
                                    className=""
                                    style={{ width: "42px", height: "42px" }}
                                  >
                                    <AvatarImage
                                      src={playerImages[b.batsman.name]}
                                      alt={b.batsman.name}
                                    />
                                    <img
                                      src={playerImages[b.batsman.name]}
                                      alt={b.batsman.name}
                                    />
                                  </Avatar>
                                  <div>
                                    <span>{b.batsman.name}</span>
                                    <div
                                      className={`${
                                        theme === "dark"
                                          ? "text-[#999DA9]"
                                          : "text-[#5E5E5E]"
                                      }`}
                                    >
                                      {b["dismissal-text"]}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="m-2">{b.r}</td>
                              <td className="m-2">{b.b}</td>
                              <td className="m-2">{b["4s"]}</td>
                              <td className="m-2">{b["6s"]}</td>
                              <td className="m-2">{b.sr.toFixed(1)}</td>
                            </tr>
                          ))}
                        </tbody>

                        <tr
                          className={`${
                            theme === "dark"
                              ? "text-[#BDC1C6] border-b border-[#3c4043]"
                              : "text-[#BDC1C6] border-b border-[#0000000D]"
                          }`}
                        >
                          <td
                            className={`${
                              theme === "dark"
                                ? "p-2 font-medium "
                                : "p-2 font-medium text-[#202124]"
                            }`}
                          >
                            Extras
                          </td>
                          <td
                            colSpan={5}
                            className={`${
                              theme === "dark" ? "" : "text-[#1F1F1F]"
                            }`}
                          >
                            {data.scorecard[0]?.extras?.r}{" "}
                            <span
                              className={`${
                                theme === "dark"
                                  ? "text-[#999DA9] text-xs"
                                  : "text-[#1F1F1F] text-xs"
                              }`}
                            >
                              (B:{data.scorecard[inningIdx]?.extras?.b})
                            </span>
                          </td>
                        </tr>

                        <tr
                          className={`${
                            theme === "dark"
                              ? "text-[#BDC1C6] border-b border-[#3c4043]"
                              : "text-[#BDC1C6] border-b border-[#0000000D]"
                          }`}
                        >
                          <td
                            className={`${
                              theme === "dark"
                                ? "p-2 font-medium  "
                                : "p-2 font-medium text-[#202124] "
                            }`}
                          >
                            Total runs
                          </td>
                          <td
                            colSpan={5}
                            className={`${
                              theme === "dark" ? "" : "text-[#1F1F1F] "
                            }`}
                          >
                            {formatScore(data.score?.[0])}
                          </td>
                        </tr>
                      </table>
                    </div>
                  ) } */}

                  {/* {(i === 0 ||
                    (i === 1 &&
                      data?.score.length > 1 &&
                      (!data?.matchStarted || data?.matchWinner))) && (
                    <div className="overflow-x-auto whitespace-nowrap mb-4">
                      <table className="min-w-full sm:text-sm text-[12px]">
                        <thead
                          className={`${
                            theme === "dark"
                              ? "text-left text-xs text-[#999DA9] border-b border-gray-600"
                              : "text-left text-xs text-[#5E5E5E] border-b border-[#ddd]"
                          }`}
                        >
                          <tr>
                            <td className="pt-2  pb-2 sm:w-3/4 w-60">
                              Batting
                            </td>
                            <td className="pt-2 w-6 pb-2 ">R</td>
                            <td className="pt-2 w-6 pb-2">B</td>
                            <td className="pt-2 w-6 pb-2">4s</td>
                            <td className="pt-2 w-6 pb-2">6s</td>
                            <td className="pt-2 w-6 pb-2">S/R</td>
                          </tr>
                        </thead>
                        <tbody>
                          {battingData.map((b, bi) => (
                            <tr
                              key={bi}
                              className={`${
                                theme === "dark"
                                  ? "border-b text-[#BDC1C6]"
                                  : "border-b text-[#202124]"
                              }`}
                            >
                              <td className="p-2 ps-0">
                                <div className="flex gap-2 items-center">
                                  <Avatar
                                    className=""
                                    style={{ width: "42px", height: "42px" }}
                                  >
                                    <AvatarImage
                                      src={playerImages[b.batsman.name]}
                                      alt={b.batsman.name}
                                    />
                                    <img
                                      src={playerImages[b.batsman.name]}
                                      alt={b.batsman.name}
                                    />
                                  </Avatar>
                                  <div>
                                    <span>{b.batsman.name}</span>
                                    <div
                                      className={`${
                                        theme === "dark"
                                          ? "text-[#999DA9]"
                                          : "text-[#5E5E5E]"
                                      }`}
                                    >
                                      {b["dismissal-text"]}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="m-2">{b.r}</td>
                              <td className="m-2">{b.b}</td>
                              <td className="m-2">{b["4s"]}</td>
                              <td className="m-2">{b["6s"]}</td>
                              <td className="m-2">{b.sr.toFixed(1)}</td>
                            </tr>
                          ))}
                        </tbody>
                        {data?.score?.length > inningIdx &&
                          data?.scorecard?.[inningIdx]?.extras && (
                            <>
                              <tr
                                className={`${
                                  theme === "dark"
                                    ? "text-[#BDC1C6] border-b border-[#3c4043]"
                                    : "text-[#BDC1C6] border-b border-[#0000000D]"
                                }`}
                              >
                                <td
                                  className={`${
                                    theme === "dark"
                                      ? "p-2 font-medium"
                                      : "p-2 font-medium text-[#202124]"
                                  }`}
                                >
                                  Extras
                                </td>
                                <td
                                  colSpan={5}
                                  className={`${
                                    theme === "dark" ? "" : "text-[#1F1F1F]"
                                  }`}
                                >
                                  {data.scorecard[inningIdx]?.extras?.r}{" "}
                                  <span
                                    className={`${
                                      theme === "dark"
                                        ? "text-[#999DA9] text-xs"
                                        : "text-[#1F1F1F] text-xs"
                                    }`}
                                  >
                                    (B:{data.scorecard[inningIdx]?.extras?.b})
                                  </span>
                                </td>
                              </tr>

                              <tr
                                className={`${
                                  theme === "dark"
                                    ? "text-[#BDC1C6] border-b border-[#3c4043]"
                                    : "text-[#BDC1C6] border-b border-[#0000000D]"
                                }`}
                              >
                                <td
                                  className={`${
                                    theme === "dark"
                                      ? "p-2 font-medium"
                                      : "p-2 font-medium text-[#202124]"
                                  }`}
                                >
                                  Total runs
                                </td>
                                <td
                                  colSpan={5}
                                  className={`${
                                    theme === "dark" ? "" : "text-[#1F1F1F]"
                                  }`}
                                >
                                  {formatScore(data.score?.[inningIdx])}
                                </td>
                              </tr>
                            </>
                          )}
                      </table>
                    </div>
                  )} */}

                  {/* Bowling Table */}
                  {/* ... insert existing bowling table block here ... */}

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead
                        className={`${
                          theme === "dark"
                            ? "text-left text-xs text-[#999DA9] border-b border-gray-600"
                            : "text-left text-xs text-[#5E5E5E] border-b  sm:mb-0 mb-2 border-[#ddd]"
                        }`}
                      >
                        <tr>
                          <td className=" sm:w-3/4 w-60 pb-2">Bowling</td>
                          <td className="w-6 pb-2">O</td>
                          <td className="w-6 pb-2">M</td>
                          <td className="w-6 pb-2">R</td>
                          <td className="w-6 pb-2">W</td>
                          <td className="w-6 pb-2">Econ</td>
                        </tr>
                      </thead>
                      <tbody>
                        {bowlingData.map((b, bi) => {
                          const teamIndex = i;
                          return (
                            <tr
                              key={bi}
                              className={`${
                                theme === "dark"
                                  ? "border-b border-gray-700 text-[#BDC1C6]"
                                  : "border-b border-[#0000000D] text-[#202124]  "
                              }`}
                            >
                              <td className="p-2 ps-0">
                                <div className="flex gap-2 items-center sm:text-sm text-[12px]">
                                  <Avatar
                                    className=""
                                    style={{ width: "42px", height: "42px" }}
                                  >
                                    <AvatarImage
                                      src={playerImages[b.bowler.name]}
                                      alt={b.bowler.name}
                                    />
                                  </Avatar>
                                  <div>
                                    <span> {b.bowler.name}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="m-2 w-6">{`${b.o}.0`}</td>
                              <td className="m-2">{b.m}</td>
                              <td className="m-2">{b.r}</td>
                              <td className="m-2">{b.w}</td>
                              <td className="m-2">{b.eco.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center text-sm py-6 text-gray-500">
                  Scorecard not available
                </div>
              )}
            </TabsContent>
          );
        })}
        <div
          className={`${
            theme === "dark"
              ? " w-full mb-4 text-sm  bg-[#171717]"
              : " w-full mb-4 text-sm bg-[#f8f9fa] pt-2 "
          }`}
        >
          <div className=" space-y-1 py-3 px-6 border-b border-[#0000000D]">
            <p
              className={`${
                theme === "dark" ? "text-[#999DA9]" : "text-[#5E5E5E]"
              }`}
            >
              <span
                className={`${
                  theme === "dark"
                    ? "text-[#70C890] font-medium"
                    : "text-[#0D652D] font-medium"
                }`}
              >
                Toss:
              </span>{" "}
              {getShortTeamName(data?.tossWinner)} won the toss and decided to{" "}
              {data?.tossChoice}
            </p>

            <p>
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
                {data?.venue}
              </span>
            </p>
          </div>
          <div className=" w-full  py-3 px-6 ">
            <p
              className={`${
                theme === "dark"
                  ? " text-[#999DA9]"
                  : " text-[#5E5E5E] text-[12px]"
              }`}
            >
              All times are in India Standard Time
            </p>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ScoreCardTab;
