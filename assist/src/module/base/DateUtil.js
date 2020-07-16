/**
 * 日期帮助类
 */
export default class {

    /**
     * 日期格式化函数
     *
     * @param {Date}
     *            date 日期
     * @param {String}
     *            format 日期格式
     * @returns {String} 日期字符串
     */
    static dateFormat(date, format = "yyyy-MM-dd hh:mm:ss") {
        if (date) {
            let map = new Map();
            map.set("M+", date.getMonth() + 1);
            map.set("d+", date.getDate());
            map.set("d+", date.getDate());
            map.set("h+", date.getHours());
            map.set("m+", date.getMinutes());
            map.set("s+", date.getSeconds());
            map.set("q+", Math.floor((date.getMonth() + 3) / 3));
            map.set("S", date.getMilliseconds());
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
            }
            for (let [key, value] of map) {
                if (new RegExp(`(${key})`).test(format)) {
                    format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (value) : ((`00${value}`).substr((`${value}`).length)));
                }
            }
        }
        return format;
    }

    /**
     * 获取日期数值
     *
     * @param {Any}
     *            value 日期值
     * @returns {Number} 日期数值
     */
    static dateParse(value) {
        return typeof value === "number" ? value : Date.parse(value.replace(/-/g, "/"));
    }

    /**
     * 将数据转为日期对象
     *
     * @param {Any}
     *            value 日期值
     * @returns {Date} 日期对象
     */
    static toDate(value) {
        return new Date(this.dateParse(value));
    }

    /**
     * 日期单位数值增加
     *
     * @param {Date}
     *            date 日期对象
     * @param {String}
     *            unit 单位标识(y:年,M:月,d:日,h:时,m:分,s:秒,S:毫秒)
     * @param {Integer}
     *            value 增加数值
     */
    static addDate(date, unit, value) {
        if (date && unit && value) {
            value = Number.isNaN(value) ? 0 : value * 1;
            switch (unit) {
                case "y":
                    date.setFullYear(date.getFullYear() + value);
                    break;
                case "M":
                    date.setMonth(date.getMonth() + value);
                    break;
                case "d":
                    date.setDate(date.getDate() + value);
                    break;
                case "h":
                    date.setHours(date.getHours() + value);
                    break;
                case "m":
                    date.setMinutes(date.getMinutes() + value);
                    break;
                case "s":
                    date.setSeconds(date.getSeconds() + value);
                    break;
                case "S":
                    date.setMilliseconds(date.getMilliseconds() + value);
                    break;
            }
        }
    }

    /**
     * 日期单位数值减少
     *
     * @param {Date}
     *            date 日期对象
     * @param {String}
     *            unit 单位标识(y:年,M:月,d:日,h:时,m:分,s:秒,S:毫秒)
     * @param {Integer}
     *            value 减少数值
     */
    static reduceDate(date, unit, value) {
        if (date && unit && value) {
            value = Number.isNaN(value) ? 0 : value * 1;
            switch (unit) {
                case "y":
                    date.setFullYear(date.getFullYear() - value);
                    break;
                case "M":
                    date.setMonth(date.getMonth() - value);
                    break;
                case "d":
                    date.setDate(date.getDate() - value);
                    break;
                case "h":
                    date.setHours(date.getHours() - value);
                    break;
                case "m":
                    date.setMinutes(date.getMinutes() - value);
                    break;
                case "s":
                    date.setSeconds(date.getSeconds() - value);
                    break;
                case "S":
                    date.setMilliseconds(date.getMilliseconds() - value);
                    break;
            }
        }
    }

    /**
     * 解析格式化时间字符串
     *
     * @param {String}
     *            dateStr 时间字符串
     * @param {String}
     *            format 日期格式
     * @returns {Date} 日期
     */
    static dateFormatParse(dateStr, formatStr) {
        if (!dateStr) {
            return null;
        }
        if (!formatStr) {
            return new Date(Date.parse(dateStr));
        }
        let place,
            last,
            FORMATS = "yMdhHmsfztg",
            date = new Date(1970, 0, 1),
            h,
            z,
            t,
            p = 0,
            format = formatStr.split("");
        for (let [index, item] of format.entries()) {
            if (item !== last) {
                if (place) {
                    place = place.join("");
                    str = subDateStr(dateStr, place, index, p);
                    p = str.p;
                    set(str.str, place);
                }
                place = null;
                if (FORMATS.includes(item)) {
                    place = [item];
                }
            } else {
                place && place.push(item);
            }
            last = item;
        }
        if (h) {
            t == "PM" && (h += 12);
            date.setHours(h);
        }
        if (z) {
            z = new Date().getTimezoneOffset() / 60 - z;
            date.setHours(date.getHours() + z);
        }
        return date;

        function subDateStr(dateStr, place, i, p) {
            if (!place || !place.length) {
                return "";
            }
            let start = 0,
                str;
            if (place == "MMMM") {
                start = p + i - place.length;
                str = dateStr.substring(start, p + i - 1);
                for (let j = 0; j < MONTHNAMES.length; j++) {
                    if (MONTHNAMES[j].indexOf(str) >= 0) {
                        str = MONTHNAMES[j];
                        break;
                    }
                }
                p += (str.length - place.length);
            } else {
                start = p + i - place.length;
                str = dateStr.substring(start, p + i);
                if (place.indexOf("y") == 0 || place.indexOf("z") == 0 || place.indexOf("g") == 0) {
                    if (str.indexOf("-") == 0) {
                        str = dateStr.substring(start, p + i + 1);
                        p++;
                    }
                }
            }
            return {
                str : str || "",
                p : p
            };
        }

        function set(str, place) {
            if (!place || !place.length || !str || !str.length) {
                return;
            }
            let v,
                c;
            if (/M{3,}/.test(place)) {
                for (let i = 0; i < MONTHNAMES.length; i++) {
                    if (MONTHNAMES[i].indexOf(str) == 0) {
                        v = i;
                        break;
                    }
                }
                v != null && date.setMonth(v);
            } else if (place == "yy" || place == "y") {
                let Y = fix(new Date().getFullYear().toString(), 4, "0", true);
                Y = Y.substr(0, Y.length - 2);
                Y += fix(str, 2, "0", true);
                v = parseInt(Y);
                date.setFullYear(v);
            } else {
                c = place.substr(0, 1);
                if (c == "t") {
                    t = place.length == 1 ? str + "M" : str;
                } else {
                    v = parseInt(str);
                    switch (c) {
                    case "h":
                        h = v;
                        break;
                    case "z":
                        z = v;
                        break;
                    case "y":
                        date.setFullYear(v);
                        break;
                    case "M":
                        date.setMonth(v - 1);
                        break;
                    case "d":
                        date.setDate(v);
                        break;
                    case "H":
                        date.setHours(v);
                        break;
                    case "m":
                        date.setMinutes(v);
                        break;
                    case "s":
                        date.setSeconds(v);
                        break;
                    case "f":
                        date.setMilliseconds(v);
                        break;
                    }
                }
            }
        }
    }

};
