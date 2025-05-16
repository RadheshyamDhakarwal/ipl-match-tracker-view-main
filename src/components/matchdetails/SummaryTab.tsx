"use client";

import { MatchData } from "@/pages/MatchDetails";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type Props = {
  data: MatchData;
  teamLogos?: string[];
};

export default function MatchSummaryTab({ data, teamLogos }: Props) {
  return (
    <div className="space-y-8">
      {data.scorecard.map((inning, idx) => {
        const teamName = data.teams[idx];
        const logoUrl = teamLogos?.[idx];

        // find total for this inning
        const total = data.score[idx];
        const totalText = `${total.r}/${total.w} (${total.o})`;

        return (
          <div key={idx}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2 border-b border-gray-700">
              <div className="flex items-center gap-2 ">
                {logoUrl && (
                  <img src={logoUrl} alt={teamName} className="w-8 h-8" />
                )}
                <span>
                  <strong>{teamName}</strong>
                </span>
              </div>
              <span className="text-lg">{totalText}</span>
            </div>

            {/* Batting */}
            <div className="flex flex-col sm:flex-row  gap-4  ">
              {/* Batting (Left Column) */}
              <div className="flex-1 ">
                <div className="mb-4 space-y-1">
                  {inning.batting.map((b, i) => (
                    <div key={i} className="">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={
                              b?.playerImg &&
                              b.playerImg !==
                                "https://h.cricapi.com/img/icon512.png"
                                ? b.playerImg
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    b.batsman.name
                                  )}&background=dddddd`
                            }
                            alt={b.batsman.name}
                          />
                        </Avatar>
                        <div>
                          <span className=" text-[#ECECEC]">
                            {b.batsman.name}
                          </span>
                          <div className="text-[#999DA9]">
                            {b.r} ({b.b}){" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bowling (Right Column) */}
              <div className=" ">
                <div className="space-y-1">
                  {inning.bowling.map((b, i) => (
                    <div
                      key={i}
                      className="flex flex-row-reverse gap-3 items-center"
                    >
                      {/* Avatar on the right */}
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={
                            b?.playerImg &&
                            b.playerImg !==
                              "https://h.cricapi.com/img/icon512.png"
                              ? b.playerImg
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  b.bowler.name
                                )}&background=dddddd`
                          }
                          alt={b.bowler.name}
                        />
                      </Avatar>

                      {/* Name and stats aligned right */}
                      <div className="text-right">
                        <div className="text-[#ECECEC]">{b.bowler.name}</div>
                        <div className="text-[#999DA9]">
                          {b.o}/{b.r}({b.w})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
