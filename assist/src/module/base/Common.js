import jquery from 'jquery';
import AjaxUtil from './AjaxUtil';

/** 路由参数 */
let __routeParam__ = null;

/**
 * 基础通用帮助类
 */
export default class {

    /**
     * 将表单数据序列化成JSON对象
     *
     * @param {String}
     *            form 表单jquery选择器
     * @returns {Object} 表单JSON对象
     */
    static serialize(form) {
        let data = {};
        if (form) {
            let fields = jquery(form).serializeArray();
            if (fields && fields.length) {
                fields.forEach(item => data[item.name] = item.value);
            }
        }
        return data;
    }

    /**
     * 将请求参数对象封装到url中
     *
     * @param {String}
     *            url 文件路径
     * @param {Object}
     *            param 参数对象
     * @return {String} 封装后的url
     */
    static parseParam(url, param) {
        let urlArr = [url];
        if (param) {
            let paramArr = Object.entries(param).map(([key, value]) => value != null ? `${key}=${value}` : '');
            if (paramArr.length > 0) {
                urlArr.push(url.includes("?") ? "&" : "?");
                urlArr.push(paramArr.join("&"));
            }
        }
        return urlArr.join("");
    }

    /**
     * 文件下载
     *
     * @param {String}
     *            url 文件路径
     */
    static download(url) {
        let form = jquery(`<form method="post" action="${url}"></form>`);
        jquery("body").append(form);
        form.submit();
        form.remove();
    }

    /**
     * 根据文件后缀判断文件是否为图片
     *
     * @param {String}
     *            type 文件后缀
     */
    static isImg(type) {
        if (type) {
            let suffix = type.toUpperCase();
            return suffix == "BMP"
                || suffix == "JPG"
                || suffix == "JPEG"
                || suffix == "PNG"
                || suffix == "GIF";
        }
        return false;
    }

    /**
     * 获取UUID
     *
     * @returns {String} UUID
     */
    static uuid() {
        let s = [];
        let hexDigits = "0123456789abcdef";
        for ( let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("").replace(/-/g, "").toUpperCase();
    }

    /**
     * 获取跳转参数
     *
     * @param {String}
     *            param 参数名
     * @returns {String} 参数值
     */
    static getRequestParam(param) {
        let href = window.document.location.href;
        let index = href.indexOf("?");
        let paramStr = href.substr(index + 1);
        let paramArr = paramStr.split("&");
        for (let i = 0; i < paramArr.length; i++) {
            let itemArr = paramArr[i].split("=");
            if (itemArr[0].toUpperCase() == param.toUpperCase()) {
                return itemArr[1];
            }
        }
        return null;
    }

    /**
     * 获取路由参数
     *
     * @returns {Object} 路由参数
     */
    static getRouteParam() {
        return __routeParam__;
    }

    /**
     * 设置路由参数
     *
     * @param {Object}
     *            param 参数
     */
    static setRouteParam(routeParam) {
        __routeParam__ = routeParam;
    }

    /**
     * HTML页面路由
     *
     * @param {Object}
     *            data 传递参数
     */
    static route(data) {
        if (data) {
            let options = {
                success(result) {
                    this.setRouteParam(data.param ? data.param : null);
                    if (data.callback) {
                        data.callback(result);
                    } else if (data.container) {
                        jquery(data.container).html(result);
                    }
                }
            };
            AjaxUtil.request(Object.assign(options, this.clone(data)));
        }
    }

    /**
     * 对象克隆
     *
     * @param {Any}
     *            obj 目标对象
     * @returns {Any} 克隆对象
     */
    static clone(obj) {
        if (!obj) {
            throw new Error("目标对象不能为空！");
        }
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * 引入HTML、JS、CSS文件
     *
     * @param {String|Array}
     *            path 文件路径
     * @param {Function}
     *            callback HTML文件加载成功后的回调函数
     */
    static importFile(path, callback) {
        if (path) {
            let content = "";
            if (path instanceof Array) {
                let tags = path.map(getTag);
                content = tags.join("");
            } else if (typeof path === "string") {
                content = getTag(path);
            }
            document.writeln(content);
            function getTag(url) {
                let tag = "";
                url = url.trim();
                let suffix = url.substr(url.lastIndexOf(".") + 1);
                switch (suffix) {
                    case "html":
                        let count = 0;
                        this.route({
                            url,
                            callback(html) {
                                document.writeln(html);
                                count++;
                                if (typeof path === "string" || count == path.length) {
                                    callback && callback();
                                }
                            }
                        });
                        break;
                    case "js":
                        tag = `<script type="text/javascript" src="${url}"></script>`;
                        break;
                    case "css":
                        tag = `<link rel="stylesheet" type="text/css" href="${url}"/>`;
                        break;
                }
                return tag;
            }
        }
    }

    /**
     * 将数据自动装入表单元素中
     *
     * @param {DOM}
     *            form 表单
     * @param {Object}
     *            data 数据
     */
    static formData(form, data) {
        if (form && data) {
            Object.entries(data).forEach(([key, value]) => {
                let dom = jquery(form).find(`[name=${key}]`);
                if (!value instanceof Function && dom.length) {
                    dom.val(value);
                }
            });
        }
    }

    /**
     * 保留小数位
     *
     * @param {Number}
     *            decimal 数值
     * @param {Integer}
     *            bit 位数
     * @returns {Number} 变更后的数值
     */
    static ellipsisDecimal(decimal, bit) {
        decimal += "";
        let index = decimal.indexOf(".");
        if (index != -1 && decimal.substr(index + 1).length > bit) {
            let end = index + 1 + bit;
            decimal = decimal.substring(0, end);
        }
        return Number.parseFloat(decimal);
    }

    /**
     * 页面全屏显示
     *
     * @param {Document}
     *            dom dom对象
     * @returns {Boolean} 是否全屏
     */
    static fullScreen(dom) {
        if (!document.fullscreenElement &&
                  !document.msFullscreenElement &&
                !document.mozFullScreenElement &&
                  !document.webkitFullscreenElement) {
            dom = dom || document.documentElement;
            if (dom.requestFullscreen) {
                dom.requestFullscreen();
            } else if (dom.msRequestFullscreen) {
                dom.msRequestFullscreen();
            } else if (dom.mozRequestFullScreen) {
                dom.mozRequestFullScreen();
            } else if (dom.webkitRequestFullscreen) {
                dom.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            return true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            return false;
        }
    }

    /**
     * 根据Cookie名称获取Cookie值
     *
     * @param {String}
     *            name Cookie名称
     * @returns {String} Cookie值
     */
    static getCookie(name) {
        let value = null;
        let search = `${name}=`;
        if (document.cookie.length > 0) {
            let index = document.cookie.lastIndexOf(search);
            if (index > -1) {
                index += search.length;
                let end = document.cookie.indexOf(";", index);
                if (end == -1) {
                    end = document.cookie.length;
                }
                value = unescape(document.cookie.substring(index, end))
            }
        }
        return value;
    }

    /**
     * 设置Cookie
     *
     * @param {String}
     *            name Cookie名称
     * @param {String}
     *            value Cookie值
     * @param {Number}
     *            expiredays 过期时长
     */
    static setCookie(name, value, expiredays = 1000 * 60 * 30) {
        let exdate = new Date();
        exdate.setTime(exdate.getTime() + expiredays);
        document.cookie = `${name}=${escape(value)};expires=${exdate.toGMTString()}`;
    }

    /**
     * 根据Cookie名称删除Cookie
     *
     * @param {String}
     *            name Cookie名称
     */
    static delCookie(name) {
        let expires = new Date(0).toUTCString();
        document.cookie = `${name}=0;path=/;expires=${expires}`;
        document.cookie = `${name}=0;path=/;expires=${expires};domain=${document.domain}`;
    }

    /**
     * 递归查询树状列表数据
     *
     * @param id
     *            查询编号
     * @param list
     *            查询列表
     * @param idField
     *            编号字段名
     * @param listField
     *            列表字段名
     * @return 查询结果
     */
    static recursiveQuery(id, list, idField = 'id', listField = 'children') {
        if (!id || !list || !list.length) {
            return null;
        }
        for (let item of list) {
            if (!item) {
                continue;
            }
            if (item[idField] == id) {
                return item;
            }
            let result = this.recursiveQuery(id, item[listField], idField, listField);
            if (result) {
                return result;
            }
        }
        return null;
    }

    /**
     * 下划线转驼峰
     *
     * @param str
     *            字符串
     */
    static lineToCamel(str) {
        return str.replace(/\_(\w)/g, (all, letter) => letter.toUpperCase());
    }

    /**
     * 驼峰转下划线
     *
     * @param str
     *            字符串
     */
    static camelToLine(str) {
        return str.replace(/([A-Z])/g,"_$1").toLowerCase();
    }

};
