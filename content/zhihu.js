/**
 * 该脚本用于优化知乎网站UI
 * 屏蔽掉无用的内容，比如侧边栏广告，还有嵌入的连接广告等
 * 自动提取跳转链接地址并自动替换，避免跳转中转
 * 突破知乎的复制限制，选中后立刻复制
 */
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
    // 回答内容居中，宽度调整
    querySelector('div.Question-main', (element) => element.style.width = '100%');
    querySelector('div.Question-mainColumn', (element) => {
        element.style.width = '80%';
        element.style.margin = '0 auto';
    });
    querySelector('div.Topstory-mainColumn', (element) => {
        element.style.width = '80%';
        element.style.margin = '0 auto';
    });

    hideElement('div[data-za-detail-view-path-module="RightSideBar"]');   // 隐藏侧边栏

    // 隐藏顶部区域
    hideElement('div.TopstoryPageHeader-main');   // 隐藏顶部导航栏
    hideElement('div.AppHeader-inner > a');   // 隐藏 知乎 图标
    hideElement('div.QuestionHeader-content > a');   // 隐藏 知乎 图标
    hideElement('div.AppHeader-inner > ul.AppHeader-Tabs');   // 隐藏导航菜单栏
    hideElement('div.SearchBar-askContainer');   // 隐藏导航菜单栏
    hideElement('div.QuestionHeader-side > div.QuestionButtonGroup');   // 隐藏顶部右侧按钮：【提问问题】和【关注问题】

    // 隐藏操作按钮
    hideElement('.Reward');               // 隐藏赞赏按钮
    hideElement('div.RichText-LinkCardContainer');  // 隐藏导流链接
    hideElement('div.ContentItem-action.ShareMenu');   // 隐藏分享按钮

    hideElement('h1.QuestionHeader-title');  // 隐藏标题
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
     // _u_api.getStorage(_u_constant.storageKey.zhihuReadMod).then((readMod) => {
     //     if (readMod) {
     //         hideAppHeadAndAction();
     //     }
     // });
}, 1000);
