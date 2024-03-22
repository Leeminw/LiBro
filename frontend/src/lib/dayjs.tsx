import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ko from "dayjs/locale/ko";

function dateView(date : string) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.locale(ko);
    dayjs.extend(relativeTime);

    return dayjs().to(dayjs(date).tz().format("YYYY.MM.DD HH:mm:ss"));
}

export default dateView;
