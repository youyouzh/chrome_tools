/**
 * UI优化类处理，主要针对某些特定的网站，隐藏一些和内容无关的广告和推荐等
 */

// 隐藏掉 saas.hk 网站的广告
function hideSaasHkAd() {
    hideElement('gg');
}

// 泰拉瑞亚wiki网站屏蔽广告
function hideFandomAd() {
    hideElement('.top-ads-container');
    hideElement('.bottom-ads-container');
    hideElement('#incontent_boxad_1');
    hideElement('#mixed-content-footer');
    hideElement('.page__right-rail');
    hideElement('.wds-global-footer');
    hideElement('#top_boxad');
}

// 360文档隐藏侧边栏等
function optimiseUiFor360Doc() {
    // 只保留文章内容
    let articleNode = document.getElementById('printArticle');
    if (!articleNode) {
        return;
    }
    articleNode = articleNode.cloneNode(true);
    articleNode.style.margin = 'auto';
    articleNode.style.width = '50%';
    document.body.replaceChildren();
    document.body.appendChild(articleNode);
    document.body.classList.remove('articleMaxH');
}

function optimiseUiForTopHub() {
    // 隐藏顶部导航栏
    hideElement('div#appbar');
    hideElement('div#tabbar');
    hideElement('div.cq');
    hideElement('div.alert');

    // 隐藏热卖广告
    hideElement('div.bc > div:nth-child(1)');
    hideElement('div.bc > div:nth-child(2)');
}

/**
 * 该脚本适用网站： http://www.j9p.com/
 * 主要用来帮助快速下载文件，以及修改下载文件名称，避免每次都要另存为然后复制标题
 */
function changeDownloadActionForJ9p() {
    // 修改下载按钮的行为
    const sourceDownloadElement = document.querySelector('p.localdown > a');
    if (!sourceDownloadElement) {
        console.log('Do not find download element.');
        return;
    }

    // 原来的下载按钮会有下滚动的事件，移除掉，只能通过复制元素的方式，可以拷贝 onclick() 绑定的事件，但是不能拷贝 addEventListener() 动态绑定的事件
    const cloneElement = sourceDownloadElement.cloneNode(true);
    cloneElement.href = '#';
    sourceDownloadElement.parentElement.replaceChild(cloneElement, sourceDownloadElement);

    // 标题元素和下载地址元素
    const titleElement = document.querySelector('div.g-softinfo-box > div.info > h1');
    const title = titleElement && titleElement.innerText;
    const downloadElement = document.querySelector('ul.topdown > li.address_like > a');
    const downloadUrl = downloadElement && downloadElement.href;

    if (!title || !downloadUrl) {
        console.log('The download url or title is empty.');
        cloneElement.innerHTML = '<b>不能下载</b>';
        return;
    }
    cloneElement.href = downloadUrl;
    cloneElement.title = downloadUrl;

    // 这样绑定的事件不能在控制台看到，真奇怪
    cloneElement.addEventListener('click', (evt) => {
        addDownloadTask(downloadUrl, 'j9p', title + getExtension(downloadUrl))

        evt.preventDefault();
        evt.stopImmediatePropagation();
    });
}

/**
 * 看文档的时候有个超级烦人的置顶广告，太鸡儿恶心了
 */
function hideNodeJsCnAd() {
    hideElement('div.pageadw');
    hideElement('div#pagead0');
}

function hideAdForGameSky() {
    hideElement('div.pcWuKongCode');
}

const dispatcherMap = {
    'saas.hk': hideSaasHkAd,
    'fandom.com': hideFandomAd,
    '360doc.com': optimiseUiFor360Doc,
    'tophub.today': optimiseUiForTopHub,
    'j9p.com': changeDownloadActionForJ9p,
    'nodejs.cn': hideNodeJsCnAd,
    'gamersky.com': hideAdForGameSky,
    'huww98.github.io': () => {
        document.querySelector('#desc').setAttribute('rows', '16');
        document.querySelector('#bp-str').setAttribute('rows', '8');
    }
}

function optimiseUiDispatcher() {
    const current_url = document.location.href;
    for (const website in dispatcherMap) {
        if (current_url.indexOf(website) >= 0) {
            console.log('optimise ui for website: ' + website);
            dispatcherMap[website]();
        }
    }
}

setInterval(() => {
    optimiseUiDispatcher();
}, 500);
