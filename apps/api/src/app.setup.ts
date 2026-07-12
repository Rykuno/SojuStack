import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

export function registerDayJsPlugins() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(isBetween);
  dayjs.extend(advancedFormat);
  dayjs.extend(duration);
  dayjs.extend(relativeTime);
}
