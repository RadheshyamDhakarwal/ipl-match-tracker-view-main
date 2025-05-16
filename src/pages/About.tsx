import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t, i18n } = useTranslation();
 useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);
  return (
    <div className=" text-gray-600 sm:px-4 sm:py-12  pt-3">
      <div className=" sm:text-center mx-auto sm:w-4/6 px-7 ">
        <h1 className="text-xl font-bold sm:mb-6 text-left">
          Dear Indian Cricket Fans,
        </h1>
        <div className="flex justify-end mb-4"></div>
        <div className="text-left space-y-6 text-base leading-7">
          <p>
           Like you, I have felt the heartbeat of a
            billion people thump in sync when India takes the field. It doesn’t
            matter which country’s passport you hold, how long it’s been since
            you last visited India or even if you were ever born there. The
            moment India plays, you are not American, Canadian, British or
            Australian. You are not Hindu, Muslim, Sikh or Christian. On that
            day, you are simply a fan of the Indian cricket team and your only
            dream in that moment is for India to win. Isn’t that a beautiful
            feeling?
          </p>

          <p>
            It’s one of the purest, most powerful emotions that connects all of
            us across oceans and borders. But until now, we’ve only been able to
            share this emotion with our close friends and family, a handful of
            WhatsApp groups, a few office lunch tables and maybe a video call
            with our dad back home. But what if you could share it with millions
            who feel exactly the same as you in that very moment? What if you
            could feel that match-day bond with people you’ve never met, but who
            are just like you?
          </p>

          <p>
            <strong>That’s why I’m building Cricindia.</strong>
          </p>

          <p>
            Cricindia is a digital stadium. A living, breathing, cheering,
            arguing, hugging, heartbroken community. It’s a space where you
            check live scores that are lightning fast and clean. But more
            importantly, it’s where you listen to live commentary not from
            studios, but from fans like you. People who might not be famous, but
            whose cricket intelligence can rival anyone on the field.
          </p>

          <p>
            There are geniuses among us, fans who can read the game so well, it
            gives goosebumps. Imagine if someday our insights, our
            community-sourced data, could help the actual team. What if our AI,
            powered by thousands of fans across the world, could find the exact
            weakness of an opposition batsman and suggest where Bumrah or
            Kuldeep should bowl to them in the upcoming matches? Imagine if
            those insights reached our coach or captain. That’s not a fantasy,
            that’s the potential of what we can build together.
          </p>

          <p>
            Now picture this, a post-match podcast where a school kid from
            Chennai is discussing Rohit Sharma’s pull shot with Sundar Pichai.
            Or Satya Nadella sharing his match-day superstition alongside a
            college student from Hyderabad. Because no matter how big the office
            or how small the screen, in that moment, they are both just fans.
            Childlike, emotional, passionate — united by one feeling that no
            age, title or status can ever separate.
          </p>

          <p>
            <strong>Cricindia is where all of that can happen.</strong>
          </p>

          <p>
            A space where legends and commoners speak the same language. Where
            opinions matter. Where laughter, heartbreak, predictions, voice
            notes, memes and cricket advice all flow together to create
            something truly magical. Something truly ours.
          </p>

          <p>
            So if this dream touches something inside you, if you feel you want
            to be a part of this in any way — as a fan, as a creator, as a
            techie or simply as someone who wants to feel that collective roar
            again — please write to me at{" "}
            <strong>rohanmathur@cricindia.com</strong>.
          </p>

          <p>
            Because Cricindia is coming and when it does, it won’t be just a
            platform. It will be an emotion. A festival. A religion. A home for
            all of us who believe that cricket is not just a game — it is who we
            are.
          </p>

          <p>From an Indian Cricket Fan,</p>

          <p className="font-bold">
            Rohan Mathur
            <br />
            Founder - Cricindia
          </p>
        </div>

        <p className="text-gray-400 mt-10 text-sm">www.cricindia.com</p>
      </div>
    </div>
  );
};

export default About;
