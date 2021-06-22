/**
 * 一些工具类
 */

// 常量定义
_u_constant = {};
_u_constant.cookie_storage_key = '_u_cookie_cache';

/**
 * 通过绘制canvas实现图片下载，直接通过设置a标签href属性的方式对于服务器设置了content-type: image的方式不能下载
 * 需要服务器设置 content-type: application/octet-stream
 *
 * @param imageUrl 下载图片地址
 * @param imagName 保存图片时的文件名称，如果没有指定，则取下载地址中的文件名
 */
function downloadImage(imageUrl, imagName) {
    const image = new Image();
    /**
     * 除非服务器设置了允许跨域请求，否则会报错:
     * Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
     * 服务器设置 Allow-Headers: Access-Control-Allow-Origin
      */
    // image.setAttribute('crossOrigin', 'anonymous');  // 解决跨域 Canvas 污染问题
    image.src = imageUrl;
    image.onload = function () {
        // 将图片绘制到canvas，并得到url
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height)
        const canvasImageUrl = canvas.toDataURL('image/png')

        // 创建一个a标签，并设置url为canvas的url，并模拟点击下载
        const aElement = document.createElement('a');     // 创建一个a节点插入的document
        const clickEvent = new MouseEvent('click');           // 模拟鼠标click点击事件

        aElement.download = imagName || imageUrl.split('/').pop(); // 设置a节点的download属性值，下载时候的文件名
        aElement.href = canvasImageUrl;      // 将生成的URL设置为a.href属性
        aElement.dispatchEvent(clickEvent);  // 触发a的单击事件
    }
}

/**
 * 隐藏掉指定类名称的元素
 *
 * @param className className
 */
function hideElement(className) {
    const classElements = document.querySelector('.' + className);
    if (!!classElements && classElements.length > 0) {
        for (const element of classElements) {
            element.style.display = 'none';
            element.style.zIndex = '-10';
        }
    }
}

/**
 * 因为content-script有一个很大的“缺陷”，也就是无法访问页面中的JS，虽然它可以操作DOM
 * 可以通过在原Dom中注入一个 <script> 节点，并导入注入的脚本即可，这样就可以使用原页面中js代码，比如调用签名函数等
 * 注意还需要在 manifest.json 中配置 web_accessible_resources，包含需要注入的js文件
 *
 * @param jsPath 需要注入的js相对路径
 */
function injectCustomJs(jsPath) {
    jsPath = jsPath || 'js/inject.js';
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ohoiusodihtoalkjxoichgoiaw/js/inject.js
    scriptElement.src = chrome.extension.getURL(jsPath);

    // 放在页面不好看，执行完后移除掉
    // scriptElement.onload = () => this.parentNode.removeChild(this)
    document.head.appendChild(scriptElement);
}

/**
 * 创建通知
 * 图片通知
var opt = {
  type: "basic",
  title: "Primary Title",
  message: "Primary message to display",
  iconUrl: "url_to_small_icon",
  imageUrl: "url_to_preview_image"
}
 * 列表通知
 * var opt = {
  type: "list",
  title: "Primary Title",
  message: "Primary message to display",
  iconUrl: "url_to_small_icon",
  items: [{ title: "Item1", message: "This is item 1."},
          { title: "Item2", message: "This is item 2."},
          { title: "Item3", message: "This is item 3."}]
}
 * 创建进度通知
 * var opt = {
  type: "progress",
  title: "Primary Title",
  message: "Primary message to display",
  iconUrl: "url_to_small_icon",
  progress: 42
}
 */
function createBasicNotification() {
    chrome.notifications.create('notification-id', {
        type: "basic",
        title: "Primary Title",
        message: "Primary message to display",
        iconUrl: "image/icon_48.png"
    }, (id) => {
        console.log('send success:' + id);
    })
}
