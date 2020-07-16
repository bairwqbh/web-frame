
/**
 * WebSocket处理器
 */
export default class {

    /**
     * WebSocket构建函数
     * 
     * @param {String}
     *            url 接口地址
     * @param {Object}
     *            option 配置项
     * 
     * @return WebSocket处理器
     */
    constructor(url, option = {}) {
        if ("WebSocket" in window) {
            if (url) {
                this.webSocket = new WebSocket(url);
                option.onmessage && (this.webSocket.onmessage = onmessage);
                option.onopen && (this.webSocket.onopen = onopen);
                option.onclose && (this.webSocket.onclose = onclose);
                this.webSocket.onerror = option.onerror ? option.onerror : (event => console.log(event));
                let _this = this;
                window.onbeforeunload = option.onbeforeunload ? option.onbeforeunload : (event => _this.webSocket.close());
            } else {
                console.log("未设置URL地址");
            }
        } else {
            console.log("当前浏览器 不支持 WebSocket");
        }
    }

    /**
     * 发送消息到服务端
     * 
     * @param {String}
     *            message 消息
     */
    send(message) {
        this.webSocket && message && this.webSocket.send(message);
    }

    /**
     * 关闭当前连接
     */
    close() {
        this.webSocket && this.webSocket.close();
    }

    /**
     * 设置接收消息的回调函数
     * 
     * @param {Function}
     *            onmessage 回调函数
     */
    setOnMessage(onmessage) {
        this.webSocket && onmessage && (this.webSocket.onmessage = onmessage);
    }

    /**
     * 设置与服务端连接成功的回调函数
     * 
     * @param {Function}
     *            onopen 回调函数
     */
    setOnOpen(onopen) {
        this.webSocket && onopen && (this.webSocket.onopen = onopen);
    }

    /**
     * 设置与服务端连接关闭的回调函数
     * 
     * @param {Function}
     *            onclose 回调函数
     */
    setOnClose(onclose) {
        this.webSocket && onclose && (this.webSocket.onclose = onclose);
    }

    /**
     * 设置连接发生错误的回调函数
     * 
     * @param {Function}
     *            onerror 回调函数
     */
    setOnError(onerror) {
        this.webSocket && onerror && (this.webSocket.onerror = onerror);
    }

    /**
     * 设置当前浏览器窗口已关闭的回调函数
     * 
     * @param {Function}
     *            onbeforeunload 回调函数
     */
    setOnBeforeUnload(onbeforeunloadFun) {
        onbeforeunloadFun && (window.onbeforeunload = onbeforeunloadFun);
    }

};
