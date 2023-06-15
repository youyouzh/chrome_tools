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

const dispatcherMap = {
    'saas.hk/': hideSaasHkAd,
    'fandom.com/': hideFandomAd,
    '360doc.com/': optimiseUiFor360Doc
}

function optimiseUiDispatcher() {
    const current_url = document.location.href;
    Objects.keys(dispatcherMap).filter(v => current_url.indexOf(v) >= 0)
        .map(v => dispatcherMap[v]());
}

setInterval(() => {
    optimiseUiDispatcher();
}, 500);