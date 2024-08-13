/**
 * hscangku.com, hsck.cc 视频播放地址提取和复制
 */

function extractVideoUrl() {
    const videoScriptElement = document.querySelector('div.stui-player__video > script:nth-child(1)');
    if (!videoScriptElement) {
        return;
    }
    const playerInfo = JSON.parse(videoScriptElement.innerText.substr(16));
    const m3u8Url = playerInfo['url'];
    console.log('url: ' + m3u8Url);

    const titleElement = document.querySelector('div.stui-warp-content div.stui-pannel__head h3');
    const urlElement = titleElement.cloneNode();
    urlElement.innerText = m3u8Url;
    titleElement.parentElement.appendChild(urlElement);
}

// 隐藏 hscangku.com, hsck.cc 的广告
function hideAd() {
    // const titleElement = document.querySelector('head > title');
    const titleElement = document.querySelector('div.hidden-xs');
    // 通过title判断是否是指定网站，这个网站经常换域名
    if (!!titleElement && (titleElement.innerText.search('黄色仓库') >= 0 || titleElement.innerText.search('taohuazu') >= 0)) {
        const homeAdElement = document.querySelector('body > div');
        if (homeAdElement.childElementCount >= 20) {
            homeAdElement.style.display = 'none';
        }

        hideElement('div.stui-warp-content > div:nth-child(2) > a');
    }
}

hideAd();
setTimeout(() => {
    extractVideoUrl();
}, 500);