let jsts = require("jsts");

let __wktReader__ = null;
let __wktWriter__ = null;

/**
 * 几何空间分析帮助类
 */
export default class {

    /**
     * WKT读取操作器
     */
    static wktReader() {
        if (__wktReader__ == null) {
            __wktReader__ = new jsts.io.WKTReader();
        }
        return __wktReader__;
    }

    /**
     * WKT写入操作器
     */
    static wktWriter() {
        if (__wktWriter__ == null) {
            __wktWriter__ = new jsts.io.WKTWriter();
        }
        return __wktWriter__;
    }

    /**
     * 要素合并
     */
    static union(geom0, geom1) {
        return this.wktWriter().write(this.wktReader().read(geom0).union(this.wktReader().read(geom1)));
    }
    /**
     * 要素相交
     */
    static intersection(geom0, geom1) {
        return this.wktWriter().write(this.wktReader().read(geom0).intersection(this.wktReader().read(geom1)));
    }
    /**
     * 要素缓冲
     */
    static buffer(geom, distance) {
        return this.wktWriter().write(this.wktReader().read(geom0).buffer(distance));
    }
    /**
     * 要素对称差异
     */
    static symDifference(geom0, geom1) {
        return this.wktWriter().write(this.wktReader().read(geom0).symDifference(this.wktReader().read(geom1)));
    }

    /**
     * 要素差异
     */
    static difference(geom0, geom1) {
        return this.wktWriter().write(this.wktReader().read(geom0).difference(this.wktReader().read(geom1)));
    }

    /**
     * 是否覆盖
     */
    static covers(geom0, geom1) {
        return this.wktReader().read(geom0).covers(this.wktReader().read(geom1));
    }

    /**
     * 是否相交
     */
    static intersects(geom0, geom1) {
        return this.wktReader().read(geom0).intersects(this.wktReader().read(geom1));
    }

    /**
     * 是否包含
     */
    static contains(geom0, geom1) {
        return this.wktReader().read(geom0).contains(this.wktReader().read(geom1));
    }

    /**
     * 距离
     */
    static distance(geom0, geom1) {
        return this.wktReader().read(geom0).distance(this.wktReader().read(geom1));
    }

};
