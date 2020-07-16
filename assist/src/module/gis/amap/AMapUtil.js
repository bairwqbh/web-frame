import WKTUtil from "../WKTUtil";

/**
 * 高德地图帮助类
 */
export default class {

    /**
     * 坐标对象转坐标数组
     */
    static lngLat2Array(lngLat) {
        return [lngLat.getLng(), lngLat.getLat()];
    }

    /**
     * 路径对象数组转坐标数组
     */
    static path2Array(path) {
        let array = [];
        if (path && path.length) {
            for (let item of path) {
                if (item instanceof Array) {
                    array.push(AMapUtil.path2Array(item));
                } else {
                    array.push(AMapUtil.lngLat2Array(item));
                }
            }
        }
        return array;
    }

    /**
     * 要素转WKT字符串
     */
    static feature2Wkt(feature) {
        let className = feature.CLASS_NAME;
        switch (className) {
            case "AMap.Marker":
                return WKTUtil.coordinate2PointWkt(AMapUtil.lngLat2Array(feature.getPosition()));
            case "AMap.Polyline":
                return WKTUtil.coordinate2PolylineWkt(AMapUtil.path2Array(feature.getPath()));
            case "AMap.Polygon":
                let path = feature.getPath();
                path.push(path[0]);
                return WKTUtil.coordinate2PolygonWkt(AMapUtil.path2Array(path));
            case "AMap.Circle":
                return WKTUtil.coordinate2PointWkt(AMapUtil.lngLat2Array(feature.getCenter()));
        }
    }

};
