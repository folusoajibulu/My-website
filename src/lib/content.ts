import governance from "@/assets/article-governance.jpg";
import history from "@/assets/article-history.jpg";
import security from "@/assets/article-security.jpg";
import diplomacy from "@/assets/article-diplomacy.jpg";

export type Article = {
  slug: string;
  topic: string;
  title: string;
  standfirst: string;
  date: string;
  readTime: string;
  image: string;
  body: string[];
  pullQuote?: string;
};

export const articles: Article[] = [
  {
    slug: "institutions-outlive-personalities",
    topic: "Governance",
    title: "Institutions Outlive Personalities",
    standfirst:
      "Nigeria's recurring crises of confidence are less a failure of individuals than a failure to let institutions mature beyond the men who lead them.",
    date: "12 July 2026",
    readTime: "9 min read",
    image: governance,
    pullQuote:
      "A nation is not governed by the brilliance of its leaders. It is governed by the patience of its institutions.",
    body: [
      "Every generation of Nigerians has been promised deliverance by a person. The promise is always seductive because it is simple: find the right man, and the country will right itself. Nothing in our recorded history supports this belief, and a great deal contradicts it.",
      "In the decades I spent in uniform, I watched command pass from one officer to another with striking regularity. What held the service together was never the character of a single commander. It was doctrine, procedure, training, and an accepted understanding of what the institution was for. When those things were strong, weak leadership was survivable. When they were weak, no amount of personal brilliance could compensate.",
      "The same logic applies to civil governance. An electoral commission that depends on the integrity of its chairman is not an institution; it is a temporary arrangement. A judiciary whose independence rests on the temperament of the executive of the day is not independent. We have too often confused the presence of an office with the existence of an institution.",
      "History is instructive here. The reforms that endured in the First Republic endured because they were embedded in process rather than personality. Those that vanished, vanished with the men who authored them. This is not a Nigerian peculiarity; it is a universal pattern that Nigeria has simply had less time to escape.",
      "The practical implication is unglamorous. Building institutions means accepting slow, cumulative, largely invisible work: rules that are written down, followed when inconvenient, and enforced against friends. It offers no ribbon-cutting and very little applause. It is, nonetheless, the only durable form of national progress I have observed.",
    ],
  },
  {
    slug: "reading-the-past-honestly",
    topic: "History",
    title: "Reading the Past Honestly",
    standfirst:
      "A national history written only to flatter is of no use to the nation that reads it.",
    date: "28 June 2026",
    readTime: "7 min read",
    image: history,
    body: [
      "There is a temptation, in every young nation, to treat history as a form of public relations. The archive is mined for what is creditable and quietly closed over what is not. The result is a comfortable narrative and a poorly prepared citizenry.",
      "Honest history is more demanding. It requires that we hold two facts at once: that a decision was understandable in its moment, and that it was nonetheless wrong in its consequence. Students of Nigerian history should be able to state the arguments of those they disagree with in terms those people would recognise.",
      "The archives themselves are in fragile condition. Records held in state repositories are deteriorating faster than they are being digitised, and much of what is available exists only in the private papers of families who may not know what they hold. This is a quiet emergency.",
      "What we preserve determines what the next generation is able to argue about. That is reason enough to take the work seriously.",
    ],
  },
  {
    slug: "maritime-security-gulf-of-guinea",
    topic: "National Security",
    title: "The Gulf of Guinea and the Limits of Presence",
    standfirst:
      "Naval presence deters, but it does not govern. Maritime security in the Gulf requires a legal and economic architecture on land.",
    date: "9 June 2026",
    readTime: "8 min read",
    image: security,
    body: [
      "Piracy in the Gulf of Guinea is regularly discussed as a naval problem. It is more accurately a governance problem that expresses itself at sea.",
      "Ships and patrols matter. A credible presence raises the cost of an attack and shortens the window in which one can be completed. But the men in those skiffs come from coastal communities with collapsed livelihoods, and they sell what they seize into markets that operate onshore, in daylight, with paperwork.",
      "A serious strategy therefore runs on three tracks at once: capable and sustained naval patrol, prosecutable domestic law with courts willing to use it, and economic alternatives in the littoral communities themselves. Remove any one track and the other two erode within a few years.",
      "Regional coordination has improved markedly, and that deserves acknowledgement. What remains underdeveloped is the unglamorous legal machinery that turns an interception into a conviction.",
    ],
  },
  {
    slug: "nigeria-and-the-multipolar-turn",
    topic: "International Relations",
    title: "Nigeria and the Multipolar Turn",
    standfirst:
      "Non-alignment was once a posture. In a genuinely multipolar world it must become a strategy.",
    date: "21 May 2026",
    readTime: "10 min read",
    image: diplomacy,
    body: [
      "For much of the post-independence period, Nigerian foreign policy could rely on a relatively stable international order in which the major questions were settled elsewhere. That period has ended.",
      "The emerging arrangement offers African states more counterparties and, with them, more leverage. It also offers more opportunities to be played against one another. Leverage is only useful to a state that knows precisely what it wants.",
      "This is where clarity of national interest becomes indispensable. Partnerships should be assessed against a short and honest list: does this arrangement build domestic capability, does it leave us with an asset we control, and can we exit it without crisis?",
      "Diplomacy conducted on those terms is less dramatic than summit photography, but it is considerably more durable.",
    ],
  },
];

export const featured: Article = articles[0]!;
export const latest = articles.slice(1, 4);

export const topics = [
  {
    number: "01",
    name: "History",
    description:
      "Understanding Nigeria's past and its continuing influence on the present.",
  },
  {
    number: "02",
    name: "Politics & Governance",
    description: "Examining institutions, leadership and the conduct of public affairs.",
  },
  {
    number: "03",
    name: "International Relations",
    description:
      "Perspectives on diplomacy, global affairs and Nigeria's place in the world.",
  },
  {
    number: "04",
    name: "National Security",
    description:
      "Insights shaped by decades of military service and strategic appointments.",
  },
];

export const timeline = [
  {
    years: "1984 — 1988",
    title: "Nigerian Defence Academy",
    detail: "36 Regular Combatant Course. B.A. (Hons.) History.",
  },
  {
    years: "1988 — 1996",
    title: "Nigerian Navy — Commissioned Officer",
    detail: "Sea service aboard NNS Aradu, NNS Erinomi and NNS Ambe.",
  },
  {
    years: "1996 — 2008",
    title: "Strategic & Command Appointments",
    detail:
      "Western Naval Command · Naval Headquarters · Directorate of Combat Policy & Tactics · Naval Logistics Command.",
  },
  {
    years: "2008 — Retirement",
    title: "Public Affairs & Training",
    detail:
      "Command Information Officer · Instructor, Nigerian Naval Training College · Public Relations Officer, NAFRC.",
  },
];

export const institutions = [
  "Nigerian Defence Academy",
  "Nigerian Navy",
  "Command and Staff College, Jaji",
  "Armed Forces Resettlement Centre",
];
