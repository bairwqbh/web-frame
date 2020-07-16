
/** 长半轴 */
const A = 6378137;

/** 偏心率 */
const EE = 0.00669342162296594323;

/** 投影长度 */
const PRO_LEN = 20037508.342789;

/**
 * GIS应用帮助类
 */
export default class {

    /**
     * WGS84地理坐标转WEB墨卡托
     *
     * @param x
     *            经度
     * @param y
     *            纬度
     * @return WEB墨卡托坐标
     */
    static wgs84ToMercator(x, y) {
        let tx = x * PRO_LEN / 180;
        let ty = Math.log(Math.tan((90 + y) * Math.PI / 360)) / (Math.PI / 180);
        ty = ty * PRO_LEN / 180;
        return [ tx, ty ];
    }

    /**
     * WEB墨卡托转WGS84地理坐标
     *
     * @param x
     *            经度
     * @param y
     *            纬度
     * @return 地理坐标
     */
    static mercatorToWgs84(x, y) {
        let tx = x / PRO_LEN * 180;
        let ty = y / PRO_LEN * 180;
        ty = 180 / Math.PI * (2 * Math.atan(Math.exp(ty * Math.PI / 180)) - Math.PI / 2);
        return [ tx, ty ];
    }

    /**
     * WGS84转中国测绘02
     *
     * @param x
     *            经度
     * @param y
     *            纬度
     * @return 坐标
     */
    static wgs84ToGcj02(x, y) {
        let tx = this.transformX(x - 105.0, y - 35.0);
        let ty = this.transformY(x - 105.0, y - 35.0);
        let rady = y / 180.0 * Math.PI;
        let magic = Math.sin(rady);
        magic = 1 - EE * magic * magic;
        let sqrtMagic = Math.sqrt(magic);
        ty = (ty * 180.0) / ((A * (1 - EE)) / (magic * sqrtMagic) * Math.PI);
        tx = (tx * 180.0) / (A / sqrtMagic * Math.cos(rady) * Math.PI);
        let my = y + ty;
        let mx = x + tx;
        return [ mx, my ];
    }

    /**
     * 中国测绘02转GPS84
     *
     * @param x
     *            经度
     * @param y
     *            纬度
     * @return 坐标
     */
    static gcj02ToWgs84(x, y) {
        let [tx, ty] = this.transform(x, y);
        return [ tx -= x * 2 , ty -= y * 2 ];
    }

    /**
     * 中国测绘02转百度09
     *
     * @param x
     *            经度
     * @param y
     *            纬度
     * @return 坐标
     */
    static gcj02ToBd09(x, y) {
        let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI);
        let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI);
        let bx = z * Math.cos(theta) + 0.0065;
        let by = z * Math.sin(theta) + 0.006;
        return [ bx, by ];
    }

    /**
     * 百度09转中国测绘02
     *
     * @param x
     *            经度
     * @param y
     *            纬度
     * @return 坐标
     */
    static bd09ToGcj02(x, y) {
        let bx = x - 0.0065;
        let by = y - 0.006;
        let bz = Math.sqrt(bx * bx + by * by) - 0.00002 * Math.sin(by * Math.PI);
        let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI);
        let gx = bz * Math.cos(theta);
        let gy = bz * Math.sin(theta);
        return [ gx, gy ];
    }

    /**
     * 百度09转GPS84
     *
     * @param x
     *            经度
     * @param y
     *            纬度
     * @return 坐标
     */
    static bd09ToWgs84(x, y) {
        return this.gcj02ToWgs84(...this.bd09ToGcj02(x, y));
    }

    /**
     * 坐标转换
     *
     * @param x
     *            经度
     * @param y
     *            纬度
     * @return 坐标
     */
    static transform(x, y) {
        let tx = this.transformX(x - 105.0, y - 35.0);
        let ty = this.transformY(x - 105.0, y - 35.0);
        let ry = y / 180.0 * Math.PI;
        let magic = Math.sin(ry);
        magic = 1 - EE * magic * magic;
        let sqrtMagic = Math.sqrt(magic);
        ty = (ty * 180.0) / ((A * (1 - EE)) / (magic * sqrtMagic) * Math.PI);
        tx = (tx * 180.0) / (A / sqrtMagic * Math.cos(ry) * Math.PI);
        let my = y + ty;
        let mx = x + tx;
        return [ mx, my ];
    }

    /**
     * 转换经度
     *
     * @param x
     *            经度
     * @param y
     *            纬度
     * @return 经度
     */
    static transformX(x, y) {
        let result = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        result += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
        result += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
        result += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
        return result;
    }

    /**
     * 转换纬度
     *
     * @param x
     *            经度
     * @param y
     *            纬度
     * @return 纬度
     */
    static transformY(x, y) {
        let result = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        result += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
        result += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
        result += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
        return result;
    }

};
