// Calendar year this portfolio first went live — used to compute the anniversary occasion's "Nth year" text below.
const PORTFOLIO_LAUNCH_YEAR = 2026;

// One inclusive day range an occasion is considered "active" for. "MM-DD" bounds recur every
// year (and may wrap across the New Year, e.g. "12-24" – "01-01"); "YYYY-MM-DD" bounds are a
// single dated occurrence — required for movable/lunar festivals whose date shifts year to year.
export interface FestiveDateRange {
  start: string;
  end: string;
}

// A single festival, holiday, or milestone the FestiveBanner can wish visitors on.
export interface FestiveOccasion {
  id: string;
  emoji: string;
  // Static copy, or a function of "now" for occasions whose wording depends on the current year (e.g. an anniversary count).
  message: string | ((now: Date) => string);
  href?: string;
  linkLabel?: string;
  dateRanges: FestiveDateRange[];
}

// Formats a positive integer with its ordinal suffix (1st, 2nd, 3rd, 4th, 11th, ...).
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

/*
  Occasions FestiveBanner checks against today's date, in priority order (the first whose
  dateRanges match "now" wins, so put anything that should take precedence over an overlap
  earlier in this list).

  Holi and the Hindu/lunisolar festivals further down this list follow the lunar calendar, so
  their dateRanges are single dated occurrences that need updating every year — double-check
  the exact dates against a panchang/calendar before each occasion and add next year's entry ahead of time.
*/
export const FESTIVE_OCCASIONS: FestiveOccasion[] = [
  // Portfolio's own launch day — message counts up the years automatically, no yearly edits needed.
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

  /*
    New Year's Day. Message names the incoming year explicitly, so — unlike the plain recurring
    "MM-DD" occasions above — it still needs a yearly bump (alongside new-years-eve below) even
    though the 01-01 date itself never changes; update both before each New Year.
  */
  {
    id: "new-year",
    emoji: "🎆",
    message: "Happy New Year 2027! Wishing you a great year ahead.",
    dateRanges: [{ start: "01-01", end: "01-01" }]
  },

  // Lohri (Punjab) — bonfire harvest festival, fixed solar date.
  {
    id: "lohri",
    emoji: "🔥",
    message: "Happy Lohri!",
    dateRanges: [{ start: "01-13", end: "01-13" }]
  },

  // Makar Sankranti / Pongal — solar harvest festival, fixed date (unlike the lunar festivals below).
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

  // Nowruz — Persian/Central Asian new year, pinned to the spring equinox.
  {
    id: "nowruz",
    emoji: "🌷",
    message: "Happy Nowruz! Wishing you a joyful new year.",
    dateRanges: [{ start: "03-20", end: "03-21" }]
  },

  /*
    Holi — lunar-calendar festival, date shifts every year. Verify and update this range
    ahead of each occasion; leaving a stale year-old date means the banner silently never fires.
  */
  {
    id: "holi",
    emoji: "🎨",
    message: "Happy Holi! Wishing you a colourful day.",
    dateRanges: [{ start: "2027-03-03", end: "2027-03-03" }]
  },

  // April Fools' Day.
  {
    id: "april-fools-day",
    emoji: "🤡",
    message: "Happy April Fools' Day!",
    dateRanges: [{ start: "04-01", end: "04-01" }]
  },

  // Baisakhi (Vaisakhi) — Punjabi harvest festival and Sikh new year, fixed solar date. Takes
  // precedence over Songkran below on their shared 04-14 (listed first).
  {
    id: "baisakhi",
    emoji: "🌾",
    message: "Happy Baisakhi!",
    dateRanges: [{ start: "04-14", end: "04-14" }]
  },

  // Songkran — Thai New Year water festival, fixed solar date.
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

  /*
    Parsi New Year (Navroz), Shahenshahi calendar as observed by most Indian Zoroastrians. Unlike
    the lunar festivals below this doesn't need yearly updates — the Shahenshahi calendar drifts
    against the Gregorian one only slowly (roughly a day every few years) — but re-verify this
    date every few years against a Parsi calendar.
  */
  {
    id: "parsi-new-year",
    emoji: "🌸",
    message: "Happy Parsi New Year (Navroz)!",
    dateRanges: [{ start: "08-16", end: "08-16" }]
  },

  /*
    The remaining Hindu/lunisolar festivals below all shift date every year — each dateRange is
    a single dated occurrence that needs updating annually. Verify against a panchang/calendar
    before each occasion; a stale year-old date means the banner silently never fires.
  */

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

  // Gandhi Jayanti.
  {
    id: "gandhi-jayanti",
    emoji: "🕊️",
    message: "Gandhi Jayanti — remembering the Mahatma today.",
    dateRanges: [{ start: "10-02", end: "10-02" }]
  },

  // Navratri begins.
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

  // Día de los Muertos (Day of the Dead) — Mexico.
  {
    id: "day-of-the-dead",
    emoji: "💀",
    message: "¡Feliz Día de los Muertos! Honouring loved ones today.",
    dateRanges: [{ start: "11-01", end: "11-02" }]
  },

  // Guy Fawkes Night / Bonfire Night (UK).
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

  // New Year's Eve. Message names the outgoing year explicitly, so it needs the same yearly bump as new-year above.
  {
    id: "new-years-eve",
    emoji: "🥳",
    message: "Happy New Year's Eve! Wishing you a great send-off to 2026.",
    dateRanges: [{ start: "12-31", end: "12-31" }]
  },

  /*
    Kwanzaa (US/African diaspora) — wraps across the New Year, so its range naturally yields
    priority to new-year (01-01) and new-years-eve (12-31) above, both listed earlier in this
    array; Kwanzaa still shows on its unshared days (Dec 26-30).
  */
  {
    id: "kwanzaa",
    emoji: "🕯️",
    message: "Happy Kwanzaa!",
    dateRanges: [{ start: "12-26", end: "01-01" }]
  }
];
