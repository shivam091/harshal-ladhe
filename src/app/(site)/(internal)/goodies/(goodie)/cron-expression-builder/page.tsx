import type { JSX } from "react";
import type { Metadata } from "next";
import CronBuilder from "@/components/CronBuilder";
import Details from "@/components/Details";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";
import type { GoodieMetadataImage } from "@/utils/goodie-metadata";

const TITLE = "Cron Expression Builder";
const DESCRIPTION =
  "Field-by-field cron builder — build a 5-field cron string with per-field widgets, read it back in plain English, and preview its next 5 runs with crontab, GitHub Actions, and Kubernetes export.";
const IMAGE: GoodieMetadataImage = {
  path: "/assets/img/goodies/cron-expression-builder/cover.png",
  width: 1536,
  height: 1024,
  alt: "A modern dark-themed cover image for a Cron Expression Builder, featuring a visual cron schedule editor, live preview of upcoming run times, plain-English readout, presets, and export options for Crontab, GitHub Actions, and Kubernetes."
};

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/cron-expression-builder",
  image: IMAGE
});

// Static server component wrapper, so the explanatory copy renders on the server and only CronBuilder itself ships as client code.
export default function CronExpressionBuilderPage(): JSX.Element {
  return (
    <>
      <p>
        Cron expressions are compact, but that compactness cuts both ways — the same five fields
        that make a schedule easy to paste into a crontab also make it easy to misread. This
        builder assembles the string one field at a time: give each field a dedicated widget
        (every value, every N, specific values, a range, or a range with a step) and the cron
        string updates live. For anything those shapes can&apos;t express, such as a compound{" "}
        <code>1-5,10,20-25/5</code>, switch the field to Custom and type its raw value. A field
        cron would reject is flagged on the spot.
      </p>
      <p>
        Every edit is paired with a plain-English readout, including the notorious
        day-of-month/day-of-week quirk — cron treats those two fields as an OR when both are
        restricted, not an AND — so the sentence always reflects what the schedule will actually
        do, not just what it looks like. A live preview of the next five run times sits alongside
        it, computed as you edit rather than only on submit.
      </p>
      <p>
        Once a schedule is right, export it straight into the format you need — a plain crontab
        line, a GitHub Actions <code>schedule</code> block, or a Kubernetes <code>CronJob</code>{" "}
        manifest.
      </p>

      <CronBuilder />

      <h2 id="how-to-use">How to use</h2>
      <ol>
        <li>
          Start from a preset in the side panel, such as <em>Weekdays at 9am</em> or{" "}
          <em>Every 15 minutes</em>.
        </li>
        <li>
          Work through the five field cards (minute, hour, day of month, month and day of week)
          and pick a mode for each:
          <ul>
            <li>
              <strong>Every value</strong>: <code>*</code>, so the field never restricts the
              schedule.
            </li>
            <li>
              <strong>Every N</strong>: a step such as <code>*/15</code>, which means every 15th
              value.
            </li>
            <li>
              <strong>Specific values</strong>: a comma-separated list such as <code>1,15</code>.
            </li>
            <li>
              <strong>Range</strong>: an inclusive span such as <code>9-17</code>.
            </li>
            <li>
              <strong>Range + step</strong>: every Nth value inside a span, such as{" "}
              <code>9-17/2</code>.
            </li>
            <li>
              <strong>Custom</strong>: type the raw field yourself, for anything compound such as{" "}
              <code>1-5,10,20-25/5</code>. If you already have a cron expression, copy each of its
              five parts into the matching card this way.
            </li>
          </ul>
        </li>
        <li>
          Read the sentence under the assembled expression to check the schedule means what you
          intended. Watch out when both day of month and day of week are restricted: cron runs on
          either match, not only when both line up.
        </li>
        <li>
          Check the <em>Next 5 runs</em> list. The times are in your browser&apos;s local time
          zone. If it finds no upcoming run, the schedule can never fire (day 31 in February, for
          instance).
        </li>
        <li>
          Choose <em>Crontab</em>, <em>GitHub Actions</em> or <em>Kubernetes</em> in the export
          panel and copy the snippet. The clipboard button beside the expression copies just the
          five fields.
        </li>
      </ol>

      <h2 id="cron-syntax">Cron syntax at a glance</h2>
      <p>
        A standard cron expression has five fields separated by spaces. Reading left to right, they
        say <em>which minute, which hour, which day of the month, which month and which day of the
        week</em> the job should fire on. A job runs at every moment where all five fields match.
      </p>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Allowed values</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Minute</td>
            <td>
              <code>0</code>–<code>59</code>
            </td>
            <td>
              <code>*/15</code> means minutes 0, 15, 30 and 45.
            </td>
          </tr>
          <tr>
            <td>Hour</td>
            <td>
              <code>0</code>–<code>23</code>
            </td>
            <td>24-hour clock, so <code>0</code> is midnight and <code>17</code> is 5pm.</td>
          </tr>
          <tr>
            <td>Day of month</td>
            <td>
              <code>1</code>–<code>31</code>
            </td>
            <td>A value such as <code>31</code> simply skips the months that are too short.</td>
          </tr>
          <tr>
            <td>Month</td>
            <td>
              <code>1</code>–<code>12</code>
            </td>
            <td>
              <code>1</code> is January. The builder takes numbers, not names such as{" "}
              <code>JAN</code>.
            </td>
          </tr>
          <tr>
            <td>Day of week</td>
            <td>
              <code>0</code>–<code>7</code>
            </td>
            <td>
              Both <code>0</code> and <code>7</code> mean Sunday, and <code>1</code> is Monday.
            </td>
          </tr>
        </tbody>
      </table>
      <p>Four characters do all the work inside a field:</p>
      <ul>
        <li>
          <code>*</code> means &ldquo;every possible value&rdquo;.
        </li>
        <li>
          <code>,</code> separates a list, so <code>1,15</code> means the 1st and the 15th.
        </li>
        <li>
          <code>-</code> is an inclusive range, so <code>9-17</code> means 9 through 17.
        </li>
        <li>
          <code>/</code> is a step, so <code>*/10</code> means every 10th value and{" "}
          <code>9-17/2</code> means every 2nd value from 9 to 17.
        </li>
      </ul>

      <h2 id="worked-examples">Worked examples</h2>
      <p>
        Each of these loads in a click from the preset panel, and the plain-English readout under
        the expression should match what is written here.
      </p>
      <ul>
        <li>
          <code>*/15 * * * *</code> runs every 15 minutes, all day, every day.
        </li>
        <li>
          <code>0 9 * * 1-5</code> runs at 09:00 from Monday to Friday. The minute is pinned to{" "}
          <code>0</code>, the hour to <code>9</code>, and the day-of-week range does the weekday
          filtering.
        </li>
        <li>
          <code>30 2 * * *</code> runs at 02:30 every night, a popular slot for backups because
          traffic is usually at its lowest.
        </li>
        <li>
          <code>0 0 1 1,4,7,10 *</code> runs at midnight on the 1st of January, April, July and
          October, which is a quarterly job.
        </li>
        <li>
          <code>*/5 9-17 * * 1-5</code> runs every five minutes from 09:00 to 17:55 on weekdays.
          The hour range covers hours 9 to 17 in full, so the last run is at 17:55, not 17:00.
        </li>
      </ul>

      <h2 id="day-of-month-or-day-of-week">The day-of-month and day-of-week quirk</h2>
      <p>
        Most people assume that every field narrows the schedule, so five fields must all agree.
        That holds for four of them. The two day fields behave differently: when{" "}
        <strong>both</strong> day of month and day of week are restricted, cron runs the job when{" "}
        <strong>either</strong> one matches.
      </p>
      <p>
        So <code>0 0 1 * 1</code> does not mean &ldquo;midnight on the 1st, when it is a
        Monday&rdquo;. It means &ldquo;midnight on the 1st of every month, <em>and</em> midnight on
        every Monday&rdquo;. The <em>1st of month OR every Monday</em> preset is there to show
        this, and the builder adds a note to the readout whenever it applies.
      </p>
      <p>
        A field counts as unrestricted when it starts with <code>*</code>, which includes steps
        such as <code>*/2</code>. In that case the two fields combine as an AND again, so{" "}
        <code>0 0 */2 * 1</code> means &ldquo;every second day of the month, but only on
        Mondays&rdquo;. If you really do want &ldquo;the first Monday of the month&rdquo;, plain
        cron cannot express it. The usual workaround is to schedule the job for every Monday and
        have the script itself exit unless the day of the month is 7 or less.
      </p>

      <h2 id="time-zones-and-platforms">Time zones and where the job runs</h2>
      <p>
        A cron expression carries no time zone. It is interpreted by whatever scheduler runs it,
        and the <em>Next 5 runs</em> list above is shown in your browser&apos;s local time zone
        purely so you can sanity-check it. Before shipping a schedule, check how its destination
        reads the clock:
      </p>
      <ul>
        <li>
          <strong>Crontab</strong> uses the time zone of the machine (or the{" "}
          <code>CRON_TZ</code> variable, on implementations that support it). Daylight saving
          changes can make a job at a skipped or repeated hour run late, twice or not at all,
          depending on the implementation, so servers are best kept on UTC.
        </li>
        <li>
          <strong>GitHub Actions</strong> always reads <code>schedule</code> triggers as UTC. The
          shortest interval is every five minutes, scheduled runs only fire for the workflow file
          on the default branch, and runs can start several minutes late when GitHub is busy. In
          public repositories, scheduled workflows are also switched off after 60 days without
          repository activity.
        </li>
        <li>
          <strong>Kubernetes</strong> evaluates a CronJob in the controller manager&apos;s time
          zone unless the manifest sets <code>spec.timeZone</code> to an IANA name such as{" "}
          <code>Europe/London</code>. The generated manifest is a minimal skeleton: swap in your
          own image and command, and consider setting a{" "}
          <code>concurrencyPolicy</code> so a slow run does not overlap the next one.
        </li>
      </ul>

      <h2 id="common-pitfalls">Common pitfalls</h2>
      <ul>
        <li>
          <strong>
            <code>*/N</code> is not &ldquo;every N since the last run&rdquo;.
          </strong>{" "}
          A step restarts at the top of its field, so <code>*/7</code> in the minute field fires at
          minutes 0, 7, 14 and so on up to 56, and then again at minute 0 of the next hour, only
          four minutes later. Pick a step that divides the field evenly (such as 5, 10, 15 or 30
          minutes) if you need an even rhythm.
        </li>
        <li>
          <strong>A forgotten minute field runs the job 60 times an hour.</strong> Writing{" "}
          <code>* 9 * * *</code> to mean &ldquo;at 9am&rdquo; fires every minute from 09:00 to
          09:59. Pin the minute with <code>0</code> unless that is what you want.
        </li>
        <li>
          <strong>Use 0 for Sunday.</strong> Seven also means Sunday in most implementations, but{" "}
          <code>0</code> is understood everywhere.
        </li>
        <li>
          <strong>Five fields, not six.</strong> Some schedulers, such as Quartz and Spring, add a
          leading seconds field. A six-field string pasted into crontab, GitHub Actions or
          Kubernetes will not mean what you expect.
        </li>
        <li>
          <strong>
            A literal <code>%</code> in a crontab command needs escaping.
          </strong>{" "}
          Cron treats an unescaped <code>%</code> as a newline, so write <code>\%</code> inside
          commands such as <code>date +%F</code>.
        </li>
      </ul>

      <h2 id="what-the-builder-supports">What the builder supports</h2>
      <p>
        The builder handles the portable, five-field syntax that crontab, GitHub Actions and
        Kubernetes all share: numbers, <code>*</code>, lists, ranges and steps, including compound
        combinations such as <code>1-5,10,20-25/5</code> in a Custom field. It deliberately leaves
        out scheduler-specific extras, and a field using them is flagged rather than guessed at:
      </p>
      <ul>
        <li>
          Month and weekday names (<code>JAN</code>, <code>MON</code>): use numbers instead.
        </li>
        <li>
          Shortcuts such as <code>@daily</code>, <code>@hourly</code> and <code>@reboot</code>.
        </li>
        <li>
          Quartz-only symbols: <code>?</code>, <code>L</code>, <code>W</code>, <code>#</code> and a
          seconds field.
        </li>
      </ul>
      <p>
        Everything runs in your browser. The expression you build is never sent anywhere, and
        nothing is saved between visits, so the builder always opens on the same weekday-morning
        schedule.
      </p>

      <h2 id="faq">Frequently asked questions</h2>
      <Details summary="How do I run a job every 10 minutes?">
        <p>
          Set the minute field to Every N with a step of 10 and leave the rest as Every value. That
          gives <code>*/10 * * * *</code>, which fires at minutes 0, 10, 20, 30, 40 and 50 of every
          hour.
        </p>
      </Details>
      <Details summary="How do I run a job on the last day of the month?">
        <p>
          Standard cron has no &ldquo;last day&rdquo; value. Schedule the job for days 28 to 31 (
          <code>0 0 28-31 * *</code>) and have the script check whether tomorrow is the 1st before
          doing any work.
        </p>
      </Details>
      <Details summary="Why does the Next 5 runs list say no upcoming run was found?">
        <p>
          The schedule can never fire. The classic case is a date that does not exist, such as day
          30 of February, or day 31 in a month restricted to ones that only have 30 days. The
          search looks eight years ahead, which always spans a leap day, so a schedule for 29
          February still resolves.
        </p>
      </Details>
      <Details summary="What does a plain-English description of a messy schedule look like?">
        <p>
          When a field does not match one of the simple shapes, the readout falls back to listing
          the exact minutes, hours or days the job fires on. It can be longer than a hand-written
          sentence, but it is always accurate.
        </p>
      </Details>
      <Details summary="Is my expression stored or sent anywhere?">
        <p>
          No. The builder runs entirely in your browser: parsing, descriptions, the next-run search
          and the exports are all calculated locally.
        </p>
      </Details>
    </>
  );
}
