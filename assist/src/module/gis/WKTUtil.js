
/** WKT点 */
const WKT_POINT = "POINT";

/** WKT点簇 */
const WKT_MULTI_POINT = "MULTIPOINT";

/** WKT线 */
const WKT_LINESTRING = "LINESTRING";

/** WKT多线 */
const WKT_MULTI_LINESTRING = "MULTILINESTRING";

/** WKT面 */
const WKT_POLYGON = "POLYGON";

/** WKT多面 */
const WKT_MULTI_POLYGON = "MULTIPOLYGON";

/** WKT要素集合 */
const WKT_GEOMETRY_COLLECTION = "GEOMETRYCOLLECTION";

/**
 * WKT帮助类
 */
export default class {

    /**
     * WKT转空间要素
     *
     * @param wkt
     *            WKT数据
     * @return 空间要素
     */
    static wkt2Coordinate(wkt) {
        let regex1 = new RegExp(".+?\\((.+?)\\)", "ig");
        let regex2 = new RegExp(".+?\\(\\((.+?)\\)\\)", "ig");
        let regex3 = new RegExp(".+?\\(\\(\\((.+?)\\)\\)\\)", "ig");
        let wktArr = wkt.split(";");
        if (wktArr.length >= 2) {
            wkt = wktArr[1];
        }
        let type = wkt.substring(0, wkt.indexOf("("));
        switch (type) {
            case WKT_POINT:
                return regex1.exec(wkt)[1].trim().split(" ");
            case WKT_MULTI_POINT:
            case WKT_LINESTRING:
                return wkt2Poly(wkt, regex1);
            case WKT_MULTI_LINESTRING:
                return wkt2MultiPoly(wkt, regex2, "),(");
            case WKT_POLYGON:
                return wkt2Poly(wkt, regex2);
            case WKT_MULTI_POLYGON:
                return wkt2MultiPoly(wkt, regex3, ")),((");
            case WKT_GEOMETRY_COLLECTION:
                return null;
        }

        /**
         * WKT转一维坐标
         */
        function wkt2Poly(wkt, regex) {
            return regex.exec(wkt)[1].trim().split(",")
                .map(point => point.trim().split(" "));
        }

        /**
         * WKT转二维坐标
         */
        function wkt2MultiPoly(wkt, regex, separator) {
            return regex.exec(wkt)[1].trim().split(separator)
                .map((points) => points.trim().split(",")
                .map(point => point.trim().split(" ")));
        }

    }

    /**
     * 点要素转WKT数据
     *
     * @param coordinate
     *            点要素
     * @return WKT数据
     */
    static coordinate2PointWkt(coordinate) {
        return `${WKT_POINT}(${coordinate.join(" ")})`;
    }

    /**
     * 点簇要素转WKT数据
     *
     * @param coordinate
     *            点簇要素
     * @return WKT数据
     */
    static coordinate2MultiPointWkt(coordinate) {
        return `${WKT_MULTI_POINT}(${coordinate.map(point => point.join(" ")).join()})`;
    }

    /**
     * 线要素转WKT数据
     *
     * @param coordinate
     *            线要素
     * @return WKT数据
     */
    static coordinate2PolylineWkt(coordinate) {
        return coordinate[0][0] instanceof Array ?
                this.coordinate2MultiPolylineWkt(coordinate) :
                `${WKT_LINESTRING}(${coordinate.map(point => point.join(" ")).join()})`;
    }

    /**
     * 多线要素转WKT数据
     *
     * @param coordinate
     *            多线要素
     * @return WKT数据
     */
    static coordinate2MultiPolylineWkt(coordinate) {
        return `${WKT_MULTI_LINESTRING}((${coordinate.map(path => path.map(point => point.join(" ")).join()).join("),(")}))`;
    }

    /**
     * 面要素转WKT数据
     *
     * @param coordinate
     *            面要素
     * @return WKT数据
     */
    static coordinate2PolygonWkt(coordinate) {
        return coordinate[0][0] instanceof Array ?
                WKTUtil.coordinate2MultiPolygonWkt(coordinate) :
                `${WKT_POLYGON}((${coordinate.map(point => point.join(" ")).join()}))`;
    }

    /**
     * 多面要素转WKT数据
     *
     * @param coordinate
     *            多面要素
     * @return WKT数据
     */
    static coordinate2MultiPolygonWkt(coordinate) {
        return `${WKT_MULTI_POLYGON}(((${coordinate.map((ring) => ring.map(point => point.join(" ")).join()).join(")),((")})))`;
    }

};
