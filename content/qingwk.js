/**
 * 该脚本主要用来修改轻微课网站的体验
 * 隐藏掉广告，弹窗等
 * 自动聚焦到题目列表
 */
// 轻微课隐藏弹窗广告
function hideNotCareElements() {
    hideElement('.c-course-view-top-wrap');  // 课程头部介绍
    hideElement('.c-meiqia');  // 弹窗广告
    hideElement('.qwk-kf-button');  // 客服图标
    hideElement('iframe');  // 客服iframe
    hideElement('.c-footer');       // 页面底部说明
    hideElement('.c-page-2021-entrance'); // 右侧固定栏
    hideElement('.c-footer-ad');     // 底部广告栏
    hideElement('.c-footer-banner');     // 底部广告栏
}

function autoClickQuestion() {
    const questionTabElement = document.getElementById('tab-works');
    if (!!questionTabElement) {
        questionTabElement.click();
    }
}

hideNotCareElements();
autoClickQuestion();

setTimeout(() => {
    autoClickQuestion();
    hideNotCareElements();
}, 1000)

setInterval(() => hideNotCareElements(), 1000);
