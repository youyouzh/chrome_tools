/**
 * Created by rumi.zhao on 2017/10/20.
 * 参考： https://developer.chrome.com/docs/extensions/mv3/background_pages/
 */

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
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if (!message.type) {
            console.log("please set the type param, when you send message.");
            return;
        }

        if (message.type === 'download') {
            processDownloadUrl(message);
        }
    }
);

function bindContextMenu() {
    chrome.contextMenus.create({
        "id": "sampleContextMenu",
        "title": "Sample Context Menu",
        "contexts": ["selection"]
    });
}

let downloadedUrls = [];

// 处理下载任务
async function processDownloadUrl(message) {
    if (!message || !message.hasOwnProperty('url')) {
        console.log('There is not any need download url.');
        return;
    }
    if (downloadedUrls.indexOf(message.url) >= 0 && !message.force) {
        console.log('The file has been download: ' + message.url);
        return;
    }

    // 支持相对路径，windows的”下载“文件夹下
    let filename = message.url.split('/').pop();
    if (message.hasOwnProperty('title')) {
        filename = message.title + '-' + filename;
    }
    filename = 'jj20\\' + filename;
    console.log('begin download: ' + message.url + ', filename: ' + filename);

    // 通过地址下载文件
    chrome.downloads.download({url: message.url, filename: filename});
    downloadedUrls.push(message.url);

    if (downloadedUrls.length >= 100) {
        // 只记录最近的地址，避免太多，先进先出
        downloadedUrls.shift();
    }
}
