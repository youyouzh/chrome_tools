/**
 * popup.js
 */

function copyContent(content) {
    const contentElement = document.getElementById('copy-content');
    contentElement.value = content;
    contentElement.textContent = content;
    contentElement.select();
    document.execCommand('Copy');
}

document.getElementById('download-button').addEventListener("click", async () => {
    // 下载文件
    // for (const downloadUrl of downloadUrls) {
    //     chrome.downloads.download({
    //         url: downloadUrl,
    //         filename: downloadUrl.split('/').pop()
    //     });
    // }
});

document.getElementById('copy-cookie').addEventListener('click', () => copyCookie('admin-web.wumii.net'));
document.getElementById('copy-m3u8-message').addEventListener('click', async () => {
    let cacheTitle = await _u_api.getStorage(_u_constant.storageKey.xvideosTitle);
    cacheTitle += '';
    cacheTitle = cacheTitle.replace(/[\\/?*<>|":]+/, '-');
    const cacheUrl = await _u_api.getStorage(_u_constant.storageKey.m3u8Url);
    const content = `download_with_m3u8_url('${cacheTitle}', '${cacheUrl}')`;
    console.log('copy content: ' + content);
    copyContent(content);
});

// 知乎阅读模式
const zhihuReadModElement = document.getElementById('zhihu-read-mod');
_u_api.getStorage(_u_constant.storageKey.zhihuReadMod).then(value => zhihuReadModElement.checked = value);
zhihuReadModElement.addEventListener('change', (event) => _u_api.setStorage(_u_constant.storageKey.zhihuReadMod, event.target.checked));

async function copyCookie(domain) {
    const storageCookie = await _u_api.getStorage(_u_constant.storageKey.cookie);
    console.log(_u_constant.storageKey.cookie, storageCookie);
    let cookies = storageCookie && storageCookie[domain] || [];
    cookies = cookies.filter(cookie => _u_constant.cookie.careNames.indexOf(cookie.name) >= 0);
    if (!cookies.length) {
        // 不存在cookie，打开新页面
        chrome.tabs.create({
            active: true,
            url: 'https://' + domain + '/admin/amis/minicourse/GiftMiniCourse'
        }, (tab) => {
            // chrome.tabs.remove(tab.id);
        })
    } else {
        const content = cookies[0].name + '=' + cookies[0].value;
        copyContent(content);
        // 发送消息通知
        // chrome.notifications.create('cookie-copy', {
        //     type: 'basic',
        //     title: '复制Cookie成功',
        //     message: '成功复制Cookie，域名： ' + domain,
        //     iconUrl: '/image/icon_128.png',
        // });
    }
}
