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

// 知乎阅读模式
const zhihuReadModElement = document.getElementById('zhihu-read-mod');
_u_api.getStorage(_u_constant.storageKey.zhihuReadMod).then(value => zhihuReadModElement.checked = !!value);
zhihuReadModElement.addEventListener('change', (event) => _u_api.setStorage(_u_constant.storageKey.zhihuReadMod, event.target.checked));

async function copyCookie(domain) {
    const storageCookie = await _u_api.getStorage(_u_constant.storageKey.cookie);
    console.log(_u_constant.storageKey.cookie, storageCookie);
    let cookies = storageCookie && storageCookie[_u_constant.storageKey.cookie] && storageCookie[_u_constant.storageKey.cookie][domain] || [];
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
        const contentElement = document.getElementById('copy-content');
        const copyContent = cookies[0].name + '=' + cookies[0].value;
        contentElement.value = copyContent;
        contentElement.textContent = copyContent;
        contentElement.select();
        document.execCommand('Copy');

        // 发送消息通知
        // chrome.notifications.create('cookie-copy', {
        //     type: 'basic',
        //     title: '复制Cookie成功',
        //     message: '成功复制Cookie，域名： ' + domain,
        //     iconUrl: '/image/icon_128.png',
        // });
    }
}
