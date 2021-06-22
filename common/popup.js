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
    chrome.storage.local.get(_u_constant.cookie_storage_key, (cookies) => {
        console.log(_u_constant.cookie_storage_key, cookies);
        cookies = cookies[_u_constant.cookie_storage_key][domain];

        if (!cookies) {
            // 不存在cookie，打开新页面
            chrome.tabs.create({
                active: true,
                url: 'https://' + domain + '/admin/amis/minicourse/GiftMiniCourse'
            }, (tab) => {
                // chrome.tabs.remove(tab.id);
            })
        } else {
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.setAttribute('value', 'Cookie: ' + cookies[0].name + '=' + cookies[0].value);
            inputElement.style.display = 'none';
            inputElement.select();
            document.getElementById('pop_main').append(inputElement);
            console.log(inputElement);
            document.execCommand('Copy');
        }
    });
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
