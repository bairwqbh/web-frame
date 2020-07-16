import axios from 'axios';
import qs from 'qs';
import Common from './Common';

/**
 * AJAX请求帮助类
 */
export default class {

    /**
     * AJAX请求
     *
     * @param {Object}
     *            data 参数
     */
    static request(data) {
        if (data) {
            let options = {
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
                    "token": Common.getCookie("token")
                },
                withCredentials: true,
                method: "post",
                error: this.errorCallBack
            };
            options = Object.assign(options, Common.clone(data));
            if (options.data) {
                options.data = qs.stringify(options.data);
            }
            axios(options)
                .then(response => data.success && data.success(response.data))
                .catch(error => data.error && data.error(error));
        }
    }

    /**
     * JSON参数请求
     *
     * @param {Object}
     *            data 参数
     */
    static jsonRequest(data) {
        if (data) {
            if (data.data) {
                data.data = qs.stringify({ json : JSON.stringify(data.data) });
            }
            this.request(data);
        }
    }

    /**
     * jsonp跨域请求
     *
     * @param {Object}
     *            data 参数
     */
    static jsonp(data) {
        if (data) {
            let options = {
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
                    "token": Common.getCookie("token")
                },
                withCredentials: true,
                method: "get",
                dataType: "jsonp",
                jsonp: "callback",
                error: this.errorCallBack
            };
            options = Object.assign(options, Common.clone(data));
            if (options.data) {
                options.data = qs.stringify(options.data);
            }
            axios(options)
                .then(response => data.success && data.success(response.data))
                .catch(error => data.error && data.error(error));
        }
    }

    /**
     * 代理请求
     *
     * @proxyUrl {String} proxyUrl 代理地址
     * @param {Object}
     *            data 参数
     */
    static proxy(proxyUrl, data) {
        if (proxyUrl && data && data.url) {
            data.url = `${proxyUrl}/${data.url}`;
            this.request(data);
        }
    }

    /**
     * AJAX请求失败缺省回调函数
     *
     * @param {Object}
     *            error 错误对象
     */
    static errorCallBack(error) {
        alert("服务器异常！");
    }

};
