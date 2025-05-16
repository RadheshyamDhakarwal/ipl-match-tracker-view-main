"use client";

const commentaryData = [
  {
    time: "11:29 pm",
    text: `The victorious captain of Delhi Capitals, Axar Patel, says everyone in the team is brimming with confidence and is delighted to win four out of four. Highlights that he took a chance to deploy more spin as the RCB openers love to bat against pace. Reflects that when he came to bowl, the ball was gripping and holding a bit. Appreciates the wrist spinners for bowling exceptionally well. Says Kuldeep Yadav has been doing the job over the years, and also lauds Vipraj Nigam for being confident enough to bowl the 18th over. Also admits that bringing himself to bowl in the 19th over was a tactical mistake where he conceded too many runs. On KL Rahul, he says it's a luxury to have him in the side. Mentions it is not easy to bat at different positions and says he played a mature innings, partnering well with Stubbs and is continuing with his form from the Champions Trophy.`,
  },
  {
    time: "11:25 pm",
    text: `That brings an end to this contest as Delhi Capitals continue their dominant run, handing Royal Challengers Bengaluru their second home defeat of the season while extending their own unbeaten streak. The IPL caravan now moves to the iconic MA Chidambaram Stadium, where Chennai Super Kings will take on Kolkata Knight Riders in Match 25 on April 11, Friday. The action kicks off at 7.30 pm IST (2 pm GMT), but be sure to join us early for all the pre-match buildup. Until then, take care and see you soon for another thrilling encounter.`,
  },
  {
    time: "11:23 pm",
    text: `KL Rahul is the PLAYER OF THE MATCH for his unbeaten and match-winning knock of 93 runs off 57 balls. He says it was a slightly tricky wicket, but having seen it play from behind the stumps for 20 overs, it gave him a good idea of how it would play out. Adds that it wasn't two-paced as such, but was just sticking a bit. Mentions his plans and says he knew when and which pockets to target, and once he got in, just kept going and enjoyed playing at his home ground. Talks about his preparation and says how he looks to adapt to the conditions and plan accordingly, not just in games, but also in practice sessions too.`,
  },
  {
    time: "11:11 pm",
    text: `It's time for the Presentation Ceremony ...`,
  },
];

export default function CommentaryTab() {
  return (
    <div className=" text-gray-600 min-h-screen p-6 space-y-6">
      {commentaryData.map((entry, idx) => (
        <div key={idx} className="border-l-2 border-gray-700 pl-4">
          <div className="text-sm font-semibold text-gray-400">{entry.time}</div>
          <div className="mt-1 text-base text-gray-600">{entry.text}</div>
        </div>
      ))}
    </div>
  );
}
