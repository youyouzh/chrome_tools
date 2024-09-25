/**
 * 该脚本主要用来优化csdn网站的UI等
 * 自动点击登录弹窗，移除掉推广广告栏，解封复制代码功能
 */

function hideLoginPopUp() {
    hideElement('div.passport-login-container');
    hideElement('div.passport-login-tip-container');      // 隐藏登录提示
    hideElement('div.recommend-box');  // 隐藏底部的推广栏
    hideElement('#csdn-toolbar');      // 隐藏顶部工具栏，几乎不会用到
}

// 突破登录才能复制代码
function crackLoginCopy() {
    // 控制台输出: javascript:document.body.contentEditable='true';document.designMode='on'; void 0
    // document.body.contentEditable='true';
    // document.designMode='on';

    // 优化登陆后复制代码
    document.querySelectorAll('code')
        .forEach((element) => element.style.userSelect = 'unset');
    document.querySelectorAll('#content_views pre')
        .forEach((element) => element.style.userSelect = 'unset');

    // 移除“登陆后复制”按钮
    document.querySelectorAll('.hljs-button').forEach(element => element.remove());

    // 移除 readmore 按钮，并显示全文
    document.querySelectorAll('.hide-article-box')
        .forEach((element) => element.remove());
    document.querySelectorAll('.article_content')
        .forEach((element) => element.style.height = 'initial');

    // 去除复制后的copyright小尾巴
    document.querySelectorAll('*').forEach(item=> {
        item.oncopy = function (e) {
            e.stopPropagation();
        }
    });
}

setInterval(hideLoginPopUp, 1000);
crackLoginCopy();
