
function hideZhihuBanner() {
    // 隐藏页面首部的标题
    const pageHeader = document.getElementsByClassName('PageHeader')[0];
    hideElement('header');          // 隐藏顶部菜单栏
    hideElement('.Question-sideColumn'); // 隐藏右边栏：相关问题和相关推荐
    hideElement('.QuestionHeader');      // 隐藏原问题

    // 隐藏答题人信息，但是显示多少赞，使用横线替换
    const contentItem_meta = document.getElementsByClassName('ContentItem-meta'),
        contentItem_action = document.getElementsByClassName('ContentItem-actions');
    const hr = '<HR style="FILTER: alpha(opacity=100,finishopacity=0,style=3)" color=#987cb9 SIZE=3>'

    for (let i = 0; i < contentItem_meta.length; i++) {
        let zans = contentItem_action[i].childNodes[0].childNodes[0];
        if (zans) {
            zans = zans.innerText;
        } else {
            continue;
        }
        // 替换成赞和显示横线
        contentItem_meta[i].innerHTML = hr + zans;
        contentItem_action[i].innerHTML= hr + zans;
    }
}

/**
 * 知乎的链接挑战都会加一个中专，每次都要点一下，挺烦的，去掉
 */
function restoreOriginUrl() {
    const aElements = document.getElementsByTagName('a');
    console.log(aElements);
    for (const aElement of aElements) {
        if (aElement.href.indexOf('https://link.zhihu.com/?target=') >= 0) {
            let sourceUrl = aElement.href.replace('https://link.zhihu.com/?target=', '');
            sourceUrl = decodeURIComponent(sourceUrl);
            aElement.href = sourceUrl;
        }
    }
}

window.onload = function() {
    restoreOriginUrl();
    hideZhihuBanner();
}
