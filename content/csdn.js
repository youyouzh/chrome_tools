/**
 * 该脚本主要用来优化csdn网站的UI等
 * 自动点击登录弹窗，移除掉推广广告栏，解封复制代码功能
 */

function optimiseUI() {
    hideElement('div.recommend-box');  // 隐藏底部的推广栏
    hideElement('#csdn-toolbar');      // 隐藏顶部工具栏，几乎不会用到
}

function hideLoginPopUp() {
    hideElement('div.passport-login-container');
}

setInterval(hideLoginPopUp, 1000);
optimiseUI();