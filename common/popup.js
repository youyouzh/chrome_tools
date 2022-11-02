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
    // 当前激活tab
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
        const currentTab = tabs[0];
        if (!currentTab) {
            console.log('cannot get current tab.');
            return false;
        }
        const tabId = currentTab.id;
        let cacheTitles = await _u_api.getStorage(_u_constant.storageKey.xvideosTitles) || {};
        const cacheUrls = await _u_api.getStorage(_u_constant.storageKey.videoUrls) || {};
        if (cacheTitles.hasOwnProperty(tabId) && cacheUrls.hasOwnProperty(tabId) && cacheUrls[tabId].length > 0) {
            let cacheTitle = cacheTitles[tabId]['title'];
            cacheTitle = cacheTitle.replace(/[\\/?*<>|":]+/, '-');

            // 选一个最高清晰度
            const currentCacheUrls = cacheUrls[tabId].map(v => v['m3u8Url']).sort((x, y) => {
                const xx = x.indexOf('1080p') >= 0 ? 100 : (x.indexOf('720p') >= 0 ? 10 : 0);
                const yy = y.indexOf('1080p') >= 0 ? 100 : (y.indexOf('720p') >= 0 ? 10 : 0);
                return yy - xx;
            });
            let matchUrl = currentCacheUrls[0];

            const content = `download_with_m3u8_url('${cacheTitle}', '${matchUrl}')`;
            console.log('copy content: ' + content);
            copyContent(content);
        } else {
            console.error('There are not any cache title and video url. tabId: {}', tabId);
        }
    });
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
