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
        const m3u8Videos = await _u_api.getStorage(_u_constant.storageKey.m3u8Videos) || {};
        if (m3u8Videos.hasOwnProperty(tabId) && m3u8Videos[tabId].length > 0) {
            // 选一个最高清晰度
            const bestVideo = m3u8Videos[tabId].sort((x, y) => {
                const xx = x['m3u8Url'].indexOf('1080p') >= 0 ? 100 : (x['m3u8Url'].indexOf('720p') >= 0 ? 10 : 0);
                const yy = y['m3u8Url'].indexOf('1080p') >= 0 ? 100 : (y['m3u8Url'].indexOf('720p') >= 0 ? 10 : 0);
                return yy - xx;
            })[0];
            let useTitle = ('' + bestVideo['title']).replace(/[\\/?*<>|":]+/, '-');

            const content = `download_with_m3u8_url('${useTitle}', '${bestVideo['m3u8Url']}')`;
            console.log('copy content: ' + content);
            copyContent(content);
        } else {
            console.log('There are not any cache title and video url. tabId: {}', tabId);
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
