import type { CronPresetMeta } from "@/interfaces/cron-builder";

/*
  Curated schedules — deliberately spanning every builder field mode (every, every-n, specific,
  range, range-step) plus one deliberately-restricted-dom-and-dow example, so loading a preset
  doubles as a tour of the builder's own widgets and the description panel's OR-quirk note.
*/
export const cronPresets: CronPresetMeta[] = [
  { slug: "every-minute", name: "Every minute", fields: { minute: "*", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { slug: "every-15-min", name: "Every 15 minutes", fields: { minute: "*/15", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { slug: "hourly", name: "Hourly", fields: { minute: "0", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { slug: "daily-midnight", name: "Daily at midnight", fields: { minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { slug: "weekdays-9am", name: "Weekdays at 9am", fields: { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" } },
  { slug: "business-hours", name: "Every 2 hours, 9am-5pm", fields: { minute: "0", hour: "9-17/2", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" } },
  { slug: "weekly-sunday", name: "Weekly on Sunday", fields: { minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "0" } },
  { slug: "monthly-1st-15th", name: "1st and 15th of the month", fields: { minute: "0", hour: "0", dayOfMonth: "1,15", month: "*", dayOfWeek: "*" } },
  { slug: "yearly-jan-1", name: "Yearly on Jan 1", fields: { minute: "0", hour: "0", dayOfMonth: "1", month: "1", dayOfWeek: "*" } },
  { slug: "dom-dow-quirk", name: "1st of month OR every Monday", fields: { minute: "0", hour: "0", dayOfMonth: "1", month: "*", dayOfWeek: "1" } }
];
