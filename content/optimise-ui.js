/**
 * UI优化类处理，主要针对某些特定的网站，隐藏一些和内容无关的广告和推荐等
 */

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

// 复制小说内容并自动翻页
function copyArticleContent(){
    let articleNode = document.querySelector('body.theme_2');
    if (!articleNode) {
        console.log('articleNode not found');
        return;
    }
    console.log('articleNode found');
    // 监听articleNode 的点击事件，复制内容到剪切板
    articleNode.addEventListener('click', () => {
        let content = document.querySelector('div.title_box > h2').innerText + '\n\n' + document.querySelector('div.article').innerText + '\n\n'
        content = content.replace('UAA地址发布页：uaadizhi.com 加入官方电报群，了解最新动态！', '')
        copyContent(content)
        console.log('copy content success: ' + document.querySelector('div.title_box > h2').innerText)
        document.querySelector('a.next_chapter').click()
    })
}

// 隐藏 hscangku.com, hsck.cc 的广告
function hideHsckAd() {
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

// 隐藏轻微课的广告，并自动切换tab页到问题页面
function hideAdForQwk() {
    hideElement('.c-course-view-top-wrap');  // 课程头部介绍
    hideElement('.c-meiqia');  // 弹窗广告
    hideElement('.qwk-kf-button');  // 客服图标
    hideElement('iframe');  // 客服iframe
    hideElement('.c-footer');       // 页面底部说明
    hideElement('.c-page-2021-entrance'); // 右侧固定栏
    hideElement('.c-footer-ad');     // 底部广告栏
    hideElement('.c-footer-banner');     // 底部广告栏

    const questionTabElement = document.getElementById('tab-works');
    if (!!questionTabElement) {
        questionTabElement.click();
    }
}

const dispatcherMap = {
    'saas.hk': () => {
        // 隐藏掉 saas.hk 网站的广告
        hideElement('gg');
    },
    'fandom.com': () => {
        // 泰拉瑞亚wiki网站屏蔽广告
        hideElement('.top-ads-container');
        hideElement('.bottom-ads-container');
        hideElement('#incontent_boxad_1');
        hideElement('#mixed-content-footer');
        hideElement('.page__right-rail');
        hideElement('.wds-global-footer');
        hideElement('#top_boxad');
    },
    '360doc.com': optimiseUiFor360Doc,
    'tophub.today': () => {
        // 隐藏顶部导航栏
        hideElement('div#appbar');
        hideElement('div#tabbar');
        hideElement('div.cq');
        hideElement('div.alert');

        // 隐藏热卖广告
        hideElement('div.bc > div:nth-child(1)');
        hideElement('div.bc > div:nth-child(2)');
    },
    'j9p.com': changeDownloadActionForJ9p,
    'nodejs.cn': () => {
        hideElement('div.pageadw');
        hideElement('div#pagead0');
    },
    'gamersky.com': () => {
        hideElement('div.pcWuKongCode');
    },
    'huww98.github.io': () => {
        document.querySelector('#desc').setAttribute('rows', '16');
        document.querySelector('#bp-str').setAttribute('rows', '8');
    },
    'uaa.com': copyArticleContent,
    '': hideHsckAd,
    'qingwk.com': hideAdForQwk,
    'xueqiu.com': () => {
        hideElement('nav.stickyFixed');
    },
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
