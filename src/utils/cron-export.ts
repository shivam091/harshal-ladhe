import type { CronFields } from "@/interfaces/cron-builder";

export function toCrontabLine(fields: CronFields): string {
  return `${fields.minute} ${fields.hour} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`;
}

export function toGithubActionsYaml(fields: CronFields): string {
  return `on:\n  schedule:\n    - cron: "${toCrontabLine(fields)}"`;
}

export function toKubernetesCronJob(fields: CronFields): string {
  return `apiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: example-cronjob\nspec:\n  schedule: "${toCrontabLine(fields)}"\n  jobTemplate:\n    spec:\n      template:\n        spec:\n          containers:\n            - name: example\n              image: busybox\n              args: ["echo", "hello"]\n          restartPolicy: OnFailure`;
}
