/**
 * Created by rumi.zhao on 2017/10/20.
 * 参考： https://developer.chrome.com/docs/extensions/mv3/background_pages/
 * 自从manifest-v3版本以后，background.common 的作用是一个后台的 service worker，它只在需要的时候启动，比如其中监听的事件被触发时
 * 其核心设计逻辑是在后台运行，与网页分开，专注与处理网页外的工作，比如推送通知、丰富的离线支持、后台同步和“添加到主屏幕”，需要注意下面两个问题
 *
 * 首先，service worker 在不使用时终止，需要时重新启动（比如收到事件通知）。
 * 相比于v2版本的background.common，不应再使用局部变量来保持值，service worker 的生命周期很短暂，使用 chrome.storage.local 代替
 * 在service worker 中使用 setTimeout或setInterval方法执行延迟或定期操作可能会失败，因为调度程序会在 Service Worker 终止时取消计时器，使用 chrome.alarms 代替
 *
 * 其次，服务工作者无权访问页面 DOM。
 * Service Worker 无法访问DOMParser API 或创建 iframe 来解析和遍历文档，可以通过 chrome.tabs.create() 创建新选项卡或使用库
 * 创建画布使用离线画布： const canvas = new OffscreenCanvas(width, height);
 */

importScripts('common/function.js');
importScripts('common/cookie.js');

// 插件安装成功后的回调
chrome.runtime.onInstalled.addListener(() => {
    console.log('on install event.');

    // 可以在这儿绑定右键菜单
    // bindContextMenu();
});

/**
 * 监听创建标签
 * chrome.bookmarks.onCreated.addListener(() => {});
 */

/**
 * 监听内容脚本发送的消息
 * 以type区分类型
 * type: download - 下载任务
 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (!message.type) {
        console.log("please set the type param, when you send message.");
        return;
    }

    if (message.type === 'download') {
        processDownloadUrl(message);
    }
});

function bindContextMenu() {
    chrome.contextMenus.create({
        "id": "sampleContextMenu",
        "title": "Sample Context Menu",
        "contexts": ["selection"]
    });
}

// 处理下载任务
async function processDownloadUrl(message) {
    if (!message || !message.hasOwnProperty('url')) {
        console.log('There is not any need download url.');
        return;
    }

    let cacheDownloadUrls = await _u_api.getStorage(_u_constant.storageKey.downloadUrls);
    cacheDownloadUrls = cacheDownloadUrls && cacheDownloadUrls[_u_constant.storageKey.downloadUrls] || [];
    if (cacheDownloadUrls.indexOf(message.url) >= 0 && !message.force) {
        console.log('The file has been download: ' + message.url);
        return;
    }

    // 支持相对路径，windows的”下载“文件夹下
    let filename = getFilename(message.url);
    if (message.hasOwnProperty('filename')) {
        filename = message.filename;
    }

    if (message.hasOwnProperty('path')) {
        if (typeof message.path === 'string') {
            filename = message.path + '\\' + filename;
        } else if (Array.isArray(message.path)) {
            filename = message.path.join('\\') + '\\' + filename;
        } else {
            console.log('unknown path: ', message.path);
        }
    }
    console.log('begin download: ' + message.url + ', filename: ' + filename);

    // 通过地址下载文件
    chrome.downloads.download({url: message.url, filename: filename});
    cacheDownloadUrls.push(message.url);

    if (cacheDownloadUrls.length >= 100) {
        // 只记录最近的地址，避免太多，先进先出
        cacheDownloadUrls.shift();
    }

    await _u_api.setStorage(_u_constant.storageKey.downloadUrls, cacheDownloadUrls);
}