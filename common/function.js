/**
 * 一些工具类
 * 全局变量统一使用小写的下划线分割命名，并且以 _u_开头
 * 局部变量统一使用驼峰命名法，包括对象字段名
 */

// 常量定义
_u_constant = {
    storageKey: {
        downloadUrls: '_u_download_urls',
        cookie: '_u_cookie_cache'
    }
};

// 自有封装的api
_u_api = {
    getStorage: function (keys) {
        // Immediately return a promise and start asynchronous work
        return new Promise((resolve, reject) => {
            // Asynchronously fetch all data from storage.sync.
            chrome.storage.local.get(keys, (items) => {
                // Pass any observed errors down the promise chain.
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                // Pass the data retrieved from storage down the promise chain.
                resolve(items);
            });
        });
    },
    /**
     * chrome.storage.sync.set 的配额为 8,192 byte
     * chrome.storage.local.set 的配额为 5,242,880  byte
     * permissions unlimitedStorage，可以设置不限大小的storage，此权限仅适用于 Web SQL 数据库和应用程序缓存
     *
     * @param key key
     * @param value value
     * @returns {Promise<unknown>}
     */
    setStorage: function (key, value) {
        // storage 设置更新的 promise 封装
        return new Promise((resolve, reject) => {
            const saveData = {};
            saveData[key] = value;
            chrome.storage.local.set(saveData, () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });
    },
    clearStorage: function () {
        return new Promise((resolve, reject) => chrome.storage.local.clear(() => resolve()));
    },
    removeCookie: function(cookie) {
        const url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
        return chrome.cookies.remove({"url": url, "name": cookie.name});
    }
};

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
    const classElements = document.getElementsByClassName(className);
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

/**
 * 创建一个新的tab
 *
 * @param url 可以是插件相对url， 比如 page/cookie.html
 */
function focusOrCreateTab(url) {
    chrome.windows.getAll({"populate":true}, function(windows) {
        let existing_tab = null;
        for (const window of windows) {
            for (const tab of window.tabs) {
                if (tab.url === url) {
                    existing_tab = tab;
                    break;
                }
            }
        }

        if (existing_tab) {
            chrome.tabs.update(existing_tab.id, {"selected":true});
        } else {
            chrome.tabs.create({"url":url, "selected":true});
        }
    });
}

/**
 * 创建一个 textarea，并设置内容，实现自动复制到剪贴板
 *
 * @param content 复制的内容
 */
function copyContent(content) {
    const copyFrom = document.createElement('textarea');
    copyFrom.style.position = 'absolute';
    copyFrom.style.left = '-1000px';
    copyFrom.style.top = '-1000px';
    copyFrom.textContent = content;
    document.append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
}

/**
 * 执行content脚本
 *
 * @returns {Promise<void>}
 */
async function executeContentScript() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: downloadImage,
    });

    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({active: true, windowId: currentWindow.id},
            function(activeTabs) {
                chrome.tabs.executeScript(
                    activeTabs[0].id, {file: 'content_script.js', allFrames: true});
            });
    });
}