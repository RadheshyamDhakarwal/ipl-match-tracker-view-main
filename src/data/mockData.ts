
export const matches = [
  {
    id: 1,
    team1: "Mumbai Indians",
    team2: "Chennai Super Kings",
    team1Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/MI/Logos/Roundbig/MIroundbig.png",
    team2Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/CSK/logos/Roundbig/CSKroundbig.png",
    date: "2024-04-16",
    time: "19:30",
    venue: "Wankhede Stadium",
    team1Score: "186/4",
    team2Score: "182/6",
    result: "Mumbai Indians won by 4 runs",
    status: "completed"
  },
  {
    id: 2,
    team1: "Royal Challengers Bangalore",
    team2: "Rajasthan Royals",
    team1Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/RCB/Logos/Roundbig/RCBroundbig.png",
    team2Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/RR/Logos/Roundbig/RRroundbig.png",
    date: "2024-04-17",
    time: "15:30",
    venue: "M. Chinnaswamy Stadium",
    status: "upcoming"
  },
  {
    id: 3,
    team1: "Delhi Capitals",
    team2: "Punjab Kings",
    team1Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/DC/Logos/Roundbig/DCroundbig.png",
    team2Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/PBKS/Logos/Roundbig/PBKSroundbig.png",
    date: "2024-04-18",
    time: "19:30",
    venue: "Arun Jaitley Stadium",
    status: "upcoming"
  }
];

export const teamRankings = [
  { rank: 1, team: "Chennai Super Kings", played: 5, won: 4, lost: 1, points: 8, nrr: "+0.825" },
  { rank: 2, team: "Mumbai Indians", played: 5, won: 4, lost: 1, points: 8, nrr: "+0.750" },
  { rank: 3, team: "Royal Challengers Bangalore", played: 5, won: 3, lost: 2, points: 6, nrr: "+0.350" },
  { rank: 4, team: "Rajasthan Royals", played: 5, won: 3, lost: 2, points: 6, nrr: "+0.200" },
  { rank: 5, team: "Delhi Capitals", played: 5, won: 2, lost: 3, points: 4, nrr: "-0.200" },
  { rank: 6, team: "Punjab Kings", played: 5, won: 2, lost: 3, points: 4, nrr: "-0.300" },
  { rank: 7, team: "Kolkata Knight Riders", played: 5, won: 2, lost: 3, points: 4, nrr: "-0.400" },
  { rank: 8, team: "Sunrisers Hyderabad", played: 5, won: 1, lost: 4, points: 2, nrr: "-0.800" }
];

export const matchDetails = {
  id: 1,
  overview: {
    match: "Mumbai Indians vs Chennai Super Kings",
    date: "2024-04-16",
    time: "19:30",
    venue: "Wankhede Stadium",
    tossWinner: "Mumbai Indians",
    tossDecision: "bat first",
    result: "Mumbai Indians won by 4 runs",
    team1Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/MI/Logos/Roundbig/MIroundbig.png",
    team2Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/CSK/logos/Roundbig/CSKroundbig.png"
  },
  scorecard: {
    team1: {
      name: "Mumbai Indians",
      logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/MI/Logos/Roundbig/MIroundbig.png",
      score: "186/4",
      overs: "20.0",
      battingStats: [
        { 
          player: "Rohit Sharma",
          playerImage: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/6.png",
          runs: 75,
          balls: 45,
          fours: 8,
          sixes: 4,
          strikeRate: 166.67
        },
        { 
          player: "Ishan Kishan",
          playerImage: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/5.png",
          runs: 48,
          balls: 32,
          fours: 6,
          sixes: 2,
          strikeRate: 150.00
        }
      ],
      bowlingStats: [
        { 
          player: "Jasprit Bumrah",
          playerImage: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/1.png",
          overs: "4.0",
          runs: 24,
          wickets: 3,
          economy: 6.00
        },
        { 
          player: "Trent Boult",
          playerImage: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/969.png",
          overs: "4.0",
          runs: 32,
          wickets: 2,
          economy: 8.00
        }
      ]
    },
    team2: {
      name: "Chennai Super Kings",
      logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/CSK/logos/Roundbig/CSKroundbig.png",
      score: "182/6",
      overs: "20.0",
      battingStats: [
        { 
          player: "MS Dhoni",
          playerImage: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/7.png",
          runs: 65,
          balls: 42,
          fours: 6,
          sixes: 3,
          strikeRate: 154.76
        },
        { 
          player: "Ruturaj Gaikwad",
          playerImage: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/102.png",
          runs: 42,
          balls: 30,
          fours: 5,
          sixes: 1,
          strikeRate: 140.00
        }
      ],
      bowlingStats: [
        { 
          player: "Deepak Chahar",
          playerImage: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/91.png",
          overs: "4.0",
          runs: 38,
          wickets: 2,
          economy: 9.50
        },
        { 
          player: "Ravindra Jadeja",
          playerImage: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/46.png",
          overs: "4.0",
          runs: 28,
          wickets: 1,
          economy: 7.00
        }
      ]
    }
  }
};
