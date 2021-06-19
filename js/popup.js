/**
 * popup.js
 */

let downloadUrl;
document.getElementById('download-button').addEventListener("click", async () => {
    console.log(downloadUrl);
    // 下载文件
    chrome.downloads.download({
        url: downloadUrl,
        filename: downloadUrl.split('/').pop()
    });
});

// 监听内容脚本发送的消息
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if (request.downloadUrl) {
            console.log(request.downloadUrl);
            downloadUrl = request.downloadUrl;
        }
    }
);

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
