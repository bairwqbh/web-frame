
/** 谷歌地图服务请求密钥 */
const GOOGLE_PRIVATE_KEY = "AIzaSyDjzEW3P2rTdk30uDuo6h4-PxTwgoJGrT4";

/** 高程服务请求地址 */
const ELEVATION_SERVICE_URL = "https://ditu.google.cn/maps/api/elevation/json";

/**
 * 几何服务类
 */
export default class {

    /**
     * 根据坐标获取高程
     *
     * @param {Array|Array
     *            <Array>} coordinate 坐标
     * @param {Function}
     *            proxy 代理函数
     * @param {Function}
     *            callback 成功请求回调函数
     */
    static elevationService(coordinate, proxy, callback) {
        if (coordinate instanceof Array && coordinate.length && proxy && callback) {
            let locations = null;
            if (coordinate[0] instanceof Array) {
                locations = coordinate.map(item => item.reverse().join()).join("|");
            } else {
                locations = coordinate.reverse().join();
            }
            if (locations) {
                proxy({
                    method: "get",
                    url: ELEVATION_SERVICE_URL,
                    params: { GOOGLE_PRIVATE_KEY, locations }
                }).then(result => {
                    if (result && result.status === "OK" && result.results && result.results.length) {
                        let elevation = null;
                        if (result.results.length == 1) {
                            elevation = result.results[0].elevation;
                        } else {
                            elevation = result.results.map(item => item.elevation);
                        }
                        callback && callback(elevation);
                    }
                });
            }
        }
    }

};