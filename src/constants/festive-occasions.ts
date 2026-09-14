// Portfolio launch year.
const PORTFOLIO_LAUNCH_YEAR = 2026;

// A date range for an occasion.
export interface FestiveDateRange {
  start: string;
  end: string;
}

// A festive occasion.
export interface FestiveOccasion {
  id: string;
  emoji: string;
  // The wish message.
  message: string | ((now: Date) => string);
  href?: string;
  linkLabel?: string;
  dateRanges: FestiveDateRange[];
}

// Formats a number with its ordinal suffix.
function ordinal(n: number): string {
  const remainder100 = n % 100;
  
  if (remainder100 >= 11 && remainder100 <= 13) {
    return `${n}th`;
  }

  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

// List of festive occasions.
export const FESTIVE_OCCASIONS: FestiveOccasion[] = [
  // Portfolio anniversary.
  {
    id: "portfolio-anniversary",
    emoji: "🎉",
    message: (now) => {
      const years = now.getFullYear() - PORTFOLIO_LAUNCH_YEAR;
      return years > 0
        ? `Happy ${ordinal(years)} anniversary to this portfolio!`
        : "This portfolio just went live today! 🚀";
    },
    dateRanges: [{ start: "06-18", end: "06-18" }]
  },

  // New Year's Day.
  {
    id: "new-year",
    emoji: "🎆",
    message: "Happy New Year 2027! Wishing you a great year ahead.",
    dateRanges: [{ start: "01-01", end: "01-01" }]
  },

  // Lohri.
  {
    id: "lohri",
    emoji: "🔥",
    message: "Happy Lohri!",
    dateRanges: [{ start: "01-13", end: "01-13" }]
  },

  // Makar Sankranti / Pongal.
  {
    id: "makar-sankranti",
    emoji: "🪁",
    message: "Happy Makar Sankranti & Pongal! Wishing you a joyful harvest season.",
    dateRanges: [{ start: "01-14", end: "01-14" }]
  },

  // Republic Day (India).
  {
    id: "republic-day",
    emoji: "🇮🇳",
    message: "Happy Republic Day!",
    dateRanges: [{ start: "01-26", end: "01-26" }]
  },

  // Australia Day.
  {
    id: "australia-day",
    emoji: "🇦🇺",
    message: "Happy Australia Day!",
    dateRanges: [{ start: "01-26", end: "01-26" }]
  },

  // Chinese New Year (Lunar New Year).
  {
    id: "chinese-new-year",
    emoji: "🧧",
    message: "Happy Chinese New Year! Wishing you good fortune in the Year of the Goat.",
    dateRanges: [{ start: "2027-02-06", end: "2027-02-07" }]
  },

  // Carnival (Brazil).
  {
    id: "carnival",
    emoji: "🎭",
    message: "Happy Carnival! Feliz Carnaval!",
    dateRanges: [{ start: "2027-02-05", end: "2027-02-09" }]
  },

  // Valentine's Day.
  {
    id: "valentines-day",
    emoji: "💖",
    message: "Happy Valentine's Day!",
    dateRanges: [{ start: "02-14", end: "02-14" }]
  },

  // St. Patrick's Day.
  {
    id: "st-patricks-day",
    emoji: "☘️",
    message: "Happy St. Patrick's Day!",
    dateRanges: [{ start: "03-17", end: "03-17" }]
  },

  // Nowruz.
  {
    id: "nowruz",
    emoji: "🌷",
    message: "Happy Nowruz! Wishing you a joyful new year.",
    dateRanges: [{ start: "03-20", end: "03-21" }]
  },

  // Holi.
  {
    id: "holi",
    emoji: "🎨",
    message: "Happy Holi! Wishing you a colourful day.",
    dateRanges: [{ start: "2027-03-03", end: "2027-03-03" }]
  },

  // Eid al-Fitr.
  {
    id: "eid-al-fitr",
    emoji: "🌙",
    message: "Eid Mubarak! Wishing you a blessed Eid al-Fitr.",
    dateRanges: [{ start: "2027-03-09", end: "2027-03-10" }]
  },

  // April Fools' Day.
  {
    id: "april-fools-day",
    emoji: "🤡",
    message: "Happy April Fools' Day!",
    dateRanges: [{ start: "04-01", end: "04-01" }]
  },

  // Baisakhi (Vaisakhi).
  {
    id: "baisakhi",
    emoji: "🌾",
    message: "Happy Baisakhi!",
    dateRanges: [{ start: "04-14", end: "04-14" }]
  },

  // Songkran.
  {
    id: "songkran",
    emoji: "💦",
    message: "Happy Songkran! Wishing you a joyful Thai New Year.",
    dateRanges: [{ start: "04-13", end: "04-15" }]
  },

  // May Day / International Workers' Day.
  {
    id: "may-day",
    emoji: "🛠️",
    message: "Happy May Day!",
    dateRanges: [{ start: "05-01", end: "05-01" }]
  },

  // Cinco de Mayo.
  {
    id: "cinco-de-mayo",
    emoji: "🌮",
    message: "¡Feliz Cinco de Mayo!",
    dateRanges: [{ start: "05-05", end: "05-05" }]
  },

  // Eid al-Adha.
  {
    id: "eid-al-adha",
    emoji: "🕌",
    message: "Eid Mubarak! Wishing you a blessed Eid al-Adha.",
    dateRanges: [{ start: "2027-05-16", end: "2027-05-17" }]
  },

  // Vesak (Buddha Purnima).
  {
    id: "vesak",
    emoji: "🪷",
    message: "Happy Vesak! Wishing you peace on Buddha Purnima.",
    dateRanges: [{ start: "2027-05-20", end: "2027-05-20" }]
  },

  // Juneteenth.
  {
    id: "juneteenth",
    emoji: "✊🏾",
    message: "Happy Juneteenth! Celebrating freedom and heritage.",
    dateRanges: [{ start: "06-19", end: "06-19" }]
  },

  // Canada Day.
  {
    id: "canada-day",
    emoji: "🇨🇦",
    message: "Happy Canada Day!",
    dateRanges: [{ start: "07-01", end: "07-01" }]
  },

  // Bastille Day (France).
  {
    id: "bastille-day",
    emoji: "🇫🇷",
    message: "Happy Bastille Day!",
    dateRanges: [{ start: "07-14", end: "07-14" }]
  },

  // Independence Day (India).
  {
    id: "independence-day",
    emoji: "🇮🇳",
    message: "Happy Independence Day!",
    dateRanges: [{ start: "08-15", end: "08-15" }]
  },

  // Parsi New Year (Navroz).
  {
    id: "parsi-new-year",
    emoji: "🌸",
    message: "Happy Parsi New Year (Navroz)!",
    dateRanges: [{ start: "08-16", end: "08-16" }]
  },

  // Eid Milad un-Nabi.
  {
    id: "eid-milad",
    emoji: "☪️",
    message: "Happy Eid Milad un-Nabi!",
    dateRanges: [{ start: "2027-08-14", end: "2027-08-14" }]
  },

  // Raksha Bandhan.
  {
    id: "raksha-bandhan",
    emoji: "🧵",
    message: "Happy Raksha Bandhan!",
    dateRanges: [{ start: "2027-08-17", end: "2027-08-17" }]
  },

  // Janmashtami.
  {
    id: "janmashtami",
    emoji: "🦚",
    message: "Happy Janmashtami!",
    dateRanges: [{ start: "2027-08-25", end: "2027-08-25" }]
  },

  // Ganesh Chaturthi.
  {
    id: "ganesh-chaturthi",
    emoji: "🐘",
    message: "Happy Ganesh Chaturthi!",
    dateRanges: [{ start: "2026-09-14", end: "2026-09-14" }]
  },

  // Onam.
  {
    id: "onam",
    emoji: "🌼",
    message: "Happy Onam!",
    dateRanges: [{ start: "2026-09-17", end: "2026-09-17" }]
  },

  // Oktoberfest (Germany).
  {
    id: "oktoberfest",
    emoji: "🍺",
    message: "Prost! Happy Oktoberfest!",
    dateRanges: [{ start: "2026-09-19", end: "2026-10-04" }]
  },

  // Chuseok (Korea).
  {
    id: "chuseok",
    emoji: "🌕",
    message: "Happy Chuseok!",
    dateRanges: [{ start: "2026-09-24", end: "2026-09-26" }]
  },

  // Mid-Autumn Festival.
  {
    id: "mid-autumn-festival",
    emoji: "🥮",
    message: "Happy Mid-Autumn Festival! Wishing you togetherness under the full moon.",
    dateRanges: [{ start: "2026-09-25", end: "2026-09-25" }]
  },

  // Gandhi Jayanti.
  {
    id: "gandhi-jayanti",
    emoji: "🕊️",
    message: "Gandhi Jayanti — remembering the Mahatma today.",
    dateRanges: [{ start: "10-02", end: "10-02" }]
  },

  // Navratri.
  {
    id: "navratri",
    emoji: "🪘",
    message: "Happy Navratri!",
    dateRanges: [{ start: "2026-10-11", end: "2026-10-11" }]
  },

  // Durga Puja.
  {
    id: "durga-puja",
    emoji: "🙏",
    message: "Happy Durga Puja!",
    dateRanges: [{ start: "2026-10-16", end: "2026-10-21" }]
  },

  // Dussehra (Vijayadashami).
  {
    id: "dussehra",
    emoji: "🏹",
    message: "Happy Dussehra!",
    dateRanges: [{ start: "2026-10-20", end: "2026-10-20" }]
  },

  // Karwa Chauth.
  {
    id: "karwa-chauth",
    emoji: "🌕",
    message: "Happy Karwa Chauth!",
    dateRanges: [{ start: "2026-10-21", end: "2026-10-21" }]
  },

  // Diwali (Deepavali).
  {
    id: "diwali",
    emoji: "🪔",
    message: "Happy Diwali! Wishing you light and prosperity.",
    dateRanges: [{ start: "2026-11-08", end: "2026-11-08" }]
  },

  // Thanksgiving (US).
  {
    id: "thanksgiving",
    emoji: "🦃",
    message: "Happy Thanksgiving!",
    dateRanges: [{ start: "2026-11-26", end: "2026-11-26" }]
  },

  // Bhai Dooj.
  {
    id: "bhai-dooj",
    emoji: "🎀",
    message: "Happy Bhai Dooj!",
    dateRanges: [{ start: "2026-11-11", end: "2026-11-11" }]
  },

  // Chhath Puja.
  {
    id: "chhath-puja",
    emoji: "🌅",
    message: "Happy Chhath Puja!",
    dateRanges: [{ start: "2026-11-15", end: "2026-11-15" }]
  },

  // Guru Nanak Jayanti.
  {
    id: "guru-nanak-jayanti",
    emoji: "☬",
    message: "Happy Guru Nanak Jayanti!",
    dateRanges: [{ start: "2026-11-24", end: "2026-11-24" }]
  },

  // Halloween.
  {
    id: "halloween",
    emoji: "🎃",
    message: "Happy Halloween!",
    dateRanges: [{ start: "10-31", end: "10-31" }]
  },

  // Día de los Muertos (Day of the Dead).
  {
    id: "day-of-the-dead",
    emoji: "💀",
    message: "¡Feliz Día de los Muertos! Honouring loved ones today.",
    dateRanges: [{ start: "11-01", end: "11-02" }]
  },

  // Guy Fawkes Night / Bonfire Night.
  {
    id: "guy-fawkes-night",
    emoji: "🎇",
    message: "Happy Bonfire Night!",
    dateRanges: [{ start: "11-05", end: "11-05" }]
  },

  // Christmas Eve and Day.
  {
    id: "christmas",
    emoji: "🎄",
    message: "Merry Christmas!",
    dateRanges: [{ start: "12-24", end: "12-25" }]
  },

  // New Year's Eve.
  {
    id: "new-years-eve",
    emoji: "🥳",
    message: "Happy New Year's Eve! Wishing you a great send-off to 2026.",
    dateRanges: [{ start: "12-31", end: "12-31" }]
  },

  // Boxing Day.
  {
    id: "boxing-day",
    emoji: "🎁",
    message: "Happy Boxing Day!",
    dateRanges: [{ start: "12-26", end: "12-26" }]
  },

  // Hanukkah.
  {
    id: "hanukkah",
    emoji: "🕎",
    message: "Happy Hanukkah! Wishing you light for all eight nights.",
    dateRanges: [{ start: "2026-12-05", end: "2026-12-12" }]
  },

  // Kwanzaa.
  {
    id: "kwanzaa",
    emoji: "🕯️",
    message: "Happy Kwanzaa!",
    dateRanges: [{ start: "12-26", end: "01-01" }]
  }
];
