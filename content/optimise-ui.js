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

const dispatcherMap = {
    'saas.hk/': hideSaasHkAd,
    'fandom.com/': hideFandomAd,
    '360doc.com/': optimiseUiFor360Doc,
    'tophub.today/': optimiseUiForTopHub
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

setTimeout(() => {
    optimiseUiDispatcher();
}, 500);