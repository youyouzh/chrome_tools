
function hideAppHeadAndAction() {
    // 隐藏头部
    hideElement('.AppHeader');

    // 隐藏答题人信息，使用横线替换
    const contentItem_meta = document.getElementsByClassName('ContentItem-meta');
    const hr = '<HR style="FILTER: alpha(opacity=100,finishopacity=0,style=3)" color=#987cb9 SIZE=3>'

    for (let i = 0; i < contentItem_meta.length; i++) {
        // 替换成赞和显示横线
        contentItem_meta[i].innerHTML = hr;
    }
}

/**
 * 优化UI，修改内容宽度，隐藏广告和不必要的组件
 */
function optimiseUi() {
    // 修改内容宽度，免得只有中间一小条
    querySelector('div.Question-main', (element) => {
        element.style.width = '95%';
        element.style.justifyContent = 'center';
    });
    querySelector('div.Question-mainColumn', (element) => element.style.width = '95%');
    hideElement('div.Sticky.is-fixed');   // 隐藏侧边栏
    hideElement('.Reward');               // 隐藏赞赏按钮
    hideElement('div.Question-sideColumn');  // 隐藏右边栏：相关问题和相关推荐
    hideElement('div.ShareMenu');  // 隐藏分享按钮
    hideElement('div.ContentItem-action.Popover');  // 隐藏更多按钮
    hideElement('div.RichText-LinkCardContainer');  // 隐藏导流链接
}

/**
 * 知乎的链接跳转都会加一个中转，每次都要点一下，挺烦的，去掉
 */
function restoreOriginUrl() {
    const aElements = document.getElementsByTagName('a');
    for (const aElement of aElements) {
        if (aElement.href.indexOf('https://link.zhihu.com/?target=') >= 0) {
            let sourceUrl = aElement.href.replace('https://link.zhihu.com/?target=', '');
            sourceUrl = decodeURIComponent(sourceUrl);
            aElement.href = sourceUrl;
        }
    }
}

/**
 * 选中即复制，突破知乎的复制禁用
 */
document.onclick = () => {
    const content = document.getSelection(0).toString();
    if (content && content.length && content.length >= 2) {
        console.log(document.getSelection());
        copyContent(content);
    }
}

setInterval(() => {
    optimiseUi();
    restoreOriginUrl();
     _u_api.getStorage(_u_constant.storageKey.zhihuReadMod).then((readMod) => {
         if (readMod) {
             hideAppHeadAndAction();
         }
     });
}, 1000);
