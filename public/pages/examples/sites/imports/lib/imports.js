// UMD version of dayjs, from https://unpkg.com/dayjs/
const dayjs = window.dayjs;
const dayjsRelativeTime = window.dayjs_plugin_relativeTime;
dayjs.extend(dayjsRelativeTime);

// ESM version of web-vitals, from https://unpkg.com/web-vitals/dist/web-vitals.js
import * as webVitals from './web-vitals.js';

export { dayjs, webVitals };
