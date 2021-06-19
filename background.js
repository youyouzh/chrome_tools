/**
 * Created by rumi.zhao on 2017/10/20.
 */

const defaultOptions = {

}

chrome.runtime.onInstalled.addListener(() => {
    console.log('on install event.');
});

let needDownloadUrl = null;
let downloadedUrls = [];
setInterval(processDownloadUrl, 500);

// 监听内容脚本发送的消息
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if (request.downloadUrl) {
            needDownloadUrl = request.downloadUrl;
        }
    }
);

function processDownloadUrl() {
    if (!needDownloadUrl) {
        console.log('There is not any need download url.');
        return;
    }
    if (downloadedUrls.indexOf(needDownloadUrl) >= 0) {
        console.log('The file has been download: ' + needDownloadUrl);
        needDownloadUrl = null;
        return;
    }

    console.log('begin download: ' + needDownloadUrl);
    chrome.downloads.download({url: needDownloadUrl});
    downloadedUrls.push(needDownloadUrl);
    needDownloadUrl = null;
}
