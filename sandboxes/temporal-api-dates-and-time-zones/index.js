import "./shared/playground.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);
const DAY_MS = 86400000;

// One set of options for every column, so the Temporal and Date strings can be compared directly.
const FORMAT = {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short"
};

const cityName = (zone) => zone.split("/").pop().replace(/_/g, " ");

// Temporal: a ZonedDateTime is always formatted in its own zone, so no timeZone option is passed.
const formatZoned = (zdt) => zdt.toLocaleString("en-GB", FORMAT);

// Date: the object is only a millisecond count, so the zone has to be supplied when formatting.
const formatDate = (date, zone) => date.toLocaleString("en-GB", { ...FORMAT, timeZone: zone });

const controls = () => [
  $("date"),
  $("time"),
  $("organiser"),
  $("dst-btn"),
  ...$("attendees").querySelectorAll("input")
];

function selectedZones(organiser) {
  const ticked = [...$("attendees").querySelectorAll("input:checked")].map((input) => input.value);
  // The organiser's own row comes first and isn't repeated if their zone is also ticked.
  return [organiser, ...ticked.filter((zone) => zone !== organiser)];
}

function renderRows(meeting, naive, zones) {
  let differences = 0;

  const rows = zones.map((zone) => {
    const temporalText = formatZoned(meeting.withTimeZone(zone));
    const dateText = formatDate(naive, zone);
    const differs = temporalText !== dateText;
    if (differs) differences += 1;

    const tr = document.createElement("tr");
    tr.classList.toggle("differs", differs);

    const name = document.createElement("th");
    name.scope = "row";
    name.textContent = zone === meeting.timeZoneId ? `${cityName(zone)} (organiser)` : cityName(zone);

    const temporalCell = document.createElement("td");
    temporalCell.textContent = temporalText;

    const dateCell = document.createElement("td");
    dateCell.textContent = dateText;

    tr.append(name, temporalCell, dateCell);
    return tr;
  });

  $("rows").replaceChildren(...rows);
  return differences;
}

function render() {
  const dateValue = $("date").value;
  const timeValue = $("time").value;
  const organiser = $("organiser").value;

  if (!dateValue || !timeValue) {
    $("rows").replaceChildren();
    $("readout").textContent = "Pick a date and a time.";
    return;
  }

  // The inputs give a wall-clock date and time with no zone: exactly what a PlainDateTime is.
  const wallClock = Temporal.PlainDateTime.from(`${dateValue}T${timeValue}`);
  const meeting = wallClock.toZonedDateTime(organiser);

  // The usual Date approach: this string has no offset, so Date reads it in the browser's own zone.
  const naive = new Date(`${dateValue}T${timeValue}`);

  const differences = renderRows(meeting, naive, selectedZones(organiser));
  const lines = [];

  if (!meeting.toPlainDateTime().equals(wallClock)) {
    lines.push(
      `${timeValue} doesn't exist on that date in ${cityName(organiser)}: the clocks go forward,`,
      `so Temporal moved the meeting to ${meeting.toPlainTime().toString().slice(0, 5)}.`,
      ""
    );
  }

  lines.push(
    differences === 0
      ? "Both columns agree: the organiser's zone has the same offset as yours on that date."
      : `${differences} row(s) differ: new Date() read ${timeValue} in your zone, not ${cityName(organiser)}'s.`,
    ""
  );

  // Calendar units keep the wall-clock time; exact units add real time. They only differ across a DST change.
  const nextDay = meeting.add({ days: 1 });
  const plus24h = meeting.add({ hours: 24 });
  const datePlus24h = new Date(meeting.epochMilliseconds + DAY_MS);
  const dayLength = meeting.until(nextDay).total({ unit: "hours" });

  lines.push(
    `The next day, in ${cityName(organiser)}:`,
    `start                    ${formatZoned(meeting)}`,
    `.add({ days: 1 })        ${formatZoned(nextDay)}`,
    `.add({ hours: 24 })      ${formatZoned(plus24h)}`,
    `Date + 86,400,000 ms     ${formatDate(datePlus24h, organiser)}`,
    "",
    nextDay.equals(plus24h)
      ? "No DST change in the next 24 hours, so a day and 24 hours land on the same time."
      : `A DST change makes this day ${dayLength} hours long. Only ZonedDateTime can add a calendar day;\na Date can only add milliseconds.`
  );

  $("readout").textContent = lines.join("\n");
}

$("dst-btn").addEventListener("click", () => {
  // The day before UK clocks go forward (01:00 on 29 March 2026).
  $("date").value = "2026-03-28";
  $("time").value = "09:00";
  $("organiser").value = "Europe/London";
  render();
});

for (const control of [$("date"), $("time"), $("organiser"), $("attendees")]) {
  control.addEventListener("input", render);
  control.addEventListener("change", render);
}

const browserZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
$("local-zone").textContent = `Your time zone is ${browserZone}. Pick a different organiser zone to see new Date() go wrong.`;

// Without Temporal the demo can't run, so the controls are disabled and the reason is shown instead.
if (typeof Temporal === "undefined") {
  $("support-tip").hidden = false;
  for (const control of controls()) control.disabled = true;
  $("readout").textContent = "Temporal isn't available in this browser.";
} else {
  render();
}
