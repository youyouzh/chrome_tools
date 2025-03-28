/**
 * 一些工具类
 * 全局变量统一使用小写的下划线分割命名，并且以 _u_开头
 * 局部变量统一使用驼峰命名法，包括对象字段名
 */

// 常量定义
_u_constant = {
    storageKey: {
        downloadUrls: '_u_download_urls',
        cookie: '_u_cookie_cache',
        activeTabId: '_u_active_tab_id',
        zhihuReadMod: "_u_zhihu_read_mod",
        m3u8Videos: '_u_m3u8_videos'
    },
    cookie: {
        cacheDomains: ['admin.wumii.net', 'admin-web.wumii.net'],
        careNames: ['gssapi_session', 'mod_auth_openidc_session']
    },
    messageType: {
        m3u8UrlAttach: '_u_m3u8_url_attach',
        downloadTask: '_u_download_task'
    }
};

// 自有封装的api
_u_api = {
    getStorage: function (keys) {
        // Immediately return a promise and start asynchronous work
        return new Promise((resolve, reject) => {
            // Asynchronously fetch all data from storage.sync.
            try {
                chrome.storage.local.get(keys, (items) => {
                    // Pass any observed errors down the promise chain.
                    if (chrome.runtime.lastError) {
                        return reject(chrome.runtime.lastError);
                    }
                    // Pass the data retrieved from storage down the promise chain.
                    resolve(items[keys]);
                });
            } catch (e) {
                return reject(e);
            }
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
 * 添加后台下载任务
 * @param downloadUrl 下载地址
 * @param dirPath 保存文件路径，默认实在C盘下载目录下创建子目录
 * @param saveFilename 下载保存文件名，如果为空，则从url中取名字
 * @param force 是否强制下载，后台会保存下载历史，如果为false可能会重复下载
 */
function addDownloadTask(downloadUrl, dirPath, saveFilename = '', force = false) {
    console.log(`add background download task. url: ${downloadUrl}, path: ${dirPath}, filename: ${saveFilename}`)
    // 发送消息给扩展程序
    chrome.runtime.sendMessage({
        type: _u_constant.messageType.downloadTask,
        url: downloadUrl,
        path: dirPath,
        filename: saveFilename,
        force: force
    });
}

/**
 * 隐藏掉指定类名称的元素
 *
 * @param querySelector css查询选择器
 */
function hideElement(querySelector) {
    const classElements = document.querySelectorAll(querySelector);
    if (!!classElements && classElements.length > 0) {
        for (const element of classElements) {
            element.style.display = 'none';
            element.style.zIndex = '-10';
        }
    }
}

/**
 * css 查询第一个元素，并调用回调函数
 *
 * @param querySelector css选择器
 * @param callback 回调函数
 */
function querySelector(querySelector, callback) {
    const element = document.querySelector(querySelector);
    if (!!element && !!callback && typeof callback === 'function') {
        callback(element);
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
  // const copyFrom = document.getElementById('copy-content');
  // Create a textbox field where we can insert text to.
  const copyFrom = document.createElement("textarea");
  // Set the text content to be the text you wished to copy.
  copyFrom.textContent = content;
  // Append the textbox field into the body as a child.
  // "execCommand()" only works when there exists selected text, and the text is inside
  // document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);
  // Select all the text!
  copyFrom.select();
  // Execute command
  document.execCommand('copy');
  // (Optional) De-select the text using blur().
  copyFrom.blur();
  // Remove the textbox field from the document.body, so no other JavaScript nor
  // other elements can get access to this.
  document.body.removeChild(copyFrom);
  // window.navigator.clipboard.writeText(content);
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

/**
 * 从下载地址中提取文件名称，包括扩展名称
 * http://uusama.com/down.pdf 返回 down.pdf
 *
 * @param url url
 * @returns {string} 文件名
 */
function getFilename(url) {
    return url.split('/').pop();
}

/**
 * 获取扩展名称
 * http://uusama.com/down.pdf 返回 .pdf
 *
 * @param url url路径
 * @returns {string} 文件扩展名，包括点
 */
function getExtension(url) {
    return '.' + getFilename(url).split('.').pop();
}

/**
 * 通过chrome扩展下载文件，文件保存在【下载】文件夹下面
 *
 * @param downloadUrl 完整的下载地址
 * @param path 保存路径，如 j9q，文章则保存在【下载/j9q/】下面
 * @param title 文件标题名称，不带后缀名，后缀名自动从下载地址中提取
 * @param force 是否强制下载，如果文件已经下载过，则不会再重复下载，除非force = true
 */
function download(downloadUrl, path, title, force = false) {
    const filename = !!title ? title + getExtension(downloadUrl) : getFilename(downloadUrl);
    chrome.runtime.sendMessage({
        type: 'download',
        url: downloadUrl,
        path: path,
        filename: filename,
        force: force
    });
}