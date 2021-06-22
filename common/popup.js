/**
 * popup.js
 */

document.getElementById('download-button').addEventListener("click", async () => {
    // 下载文件
    // for (const downloadUrl of downloadUrls) {
    //     chrome.downloads.download({
    //         url: downloadUrl,
    //         filename: downloadUrl.split('/').pop()
    //     });
    // }
});

document.getElementById('copy-wumii-dev-cookie').addEventListener('click', () => copyCookie('admin.wumii.net'));
document.getElementById('copy-wumii-online-cookie').addEventListener('click', () => copyCookie('admin-web.wumii.net'));

async function copyCookie(domain) {
    let cachedCookies = await chrome.storage.local.get(_u_constant.cookie_storage_key);
    console.log(_u_constant.cookie_storage_key, cachedCookies);

    cachedCookies = JSON.parse(cachedCookies);
    if (!cachedCookies) {
        // 不存在cookie，打开新页面
        chrome.tabs.create({
            active: true,
            url: 'https://' + domain + '/admin/amis/minicourse/GiftMiniCourse'
        }, (tab) => {
            chrome.tabs.remove(tab.id);
        })
    } else {
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = 'Cookie: ' + cachedCookies[0].name + '=' + cachedCookies[0].value;
        inputElement.style.display = 'none';
        document.appendChild(inputElement);
        inputElement.select();
        document.execCommand('Copy');
    }
}


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
