import { formatDuration, intervalToDuration } from "date-fns";

export const humanizeDuration = (ms: number) =>
  formatDuration(
    intervalToDuration({
      start: 0,
      end: ms,
    }),
    {
      format: ["days", "hours", "minutes", "seconds"],
    },
  );
