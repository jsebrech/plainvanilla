// UMD version of dayjs, from https://unpkg.com/dayjs/
const dayjs = window.dayjs;
const dayjsRelativeTime = window.dayjs_plugin_relativeTime;
dayjs.extend(dayjsRelativeTime);

export default dayjs;
