import type { CronPresetMeta } from "@/components/CronBuilder/CronBuilder.types";

/*
  Curated schedules people actually reach for — polling and health checks, off-peak backups, daily
  and weekly reports, billing runs — ordered from most to least frequent so the list reads like a
  scale. Between them they still cover every builder field mode (every, every-n, specific, range,
  range-step), and the last one deliberately restricts both day fields to show the OR quirk.
*/
export const cronPresets: CronPresetMeta[] = [
  { slug: "every-minute", name: "Every minute", fields: { minute: "*", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { slug: "every-5-min", name: "Every 5 minutes", fields: { minute: "*/5", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { slug: "every-15-min", name: "Every 15 minutes", fields: { minute: "*/15", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { slug: "every-30-min", name: "Every 30 minutes", fields: { minute: "*/30", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { slug: "hourly", name: "Hourly", fields: { minute: "0", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { slug: "every-6-hours", name: "Every 6 hours", fields: { minute: "0", hour: "*/6", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { slug: "working-hours-5-min", name: "Every 5 minutes, 9am–5pm on weekdays", fields: { minute: "*/5", hour: "9-17", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" } },
  { slug: "business-hours", name: "Every 2 hours, 9am–5pm on weekdays", fields: { minute: "0", hour: "9-17/2", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" } },
  { slug: "daily-midnight", name: "Daily at midnight", fields: { minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { slug: "nightly-2-30am", name: "Nightly at 2:30am (off-peak)", fields: { minute: "30", hour: "2", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { slug: "twice-daily", name: "Twice a day, 9am and 6pm", fields: { minute: "0", hour: "9,18", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { slug: "weekdays-9am", name: "Weekdays at 9am", fields: { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" } },
  { slug: "weekdays-6pm", name: "Weekdays at 6pm", fields: { minute: "0", hour: "18", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" } },
  { slug: "weekends-10am", name: "Weekends at 10am", fields: { minute: "0", hour: "10", dayOfMonth: "*", month: "*", dayOfWeek: "0,6" } },
  { slug: "weekly-monday-9am", name: "Weekly on Monday at 9am", fields: { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1" } },
  { slug: "weekly-sunday", name: "Weekly on Sunday at midnight", fields: { minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "0" } },
  { slug: "monthly-1st-9am", name: "Monthly on the 1st at 9am", fields: { minute: "0", hour: "9", dayOfMonth: "1", month: "*", dayOfWeek: "*" } },
  { slug: "monthly-1st-15th", name: "1st and 15th of the month", fields: { minute: "0", hour: "0", dayOfMonth: "1,15", month: "*", dayOfWeek: "*" } },
  { slug: "quarterly", name: "Quarterly, on the 1st at midnight", fields: { minute: "0", hour: "0", dayOfMonth: "1", month: "1,4,7,10", dayOfWeek: "*" } },
  { slug: "yearly-jan-1", name: "Yearly on 1 January", fields: { minute: "0", hour: "0", dayOfMonth: "1", month: "1", dayOfWeek: "*" } },
  { slug: "dom-dow-quirk", name: "1st of month OR every Monday", fields: { minute: "0", hour: "0", dayOfMonth: "1", month: "*", dayOfWeek: "1" } }
];
