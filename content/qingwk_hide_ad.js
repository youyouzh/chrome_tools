// 轻微课隐藏弹窗广告
function hideNotCareElements() {
    hideElement('c-course-view-top-wrap');  // 课程头部介绍
    hideElement('c-meiqia-wrapper');  // 弹窗广告
    hideElement('qwk-kf-button');  // 客服图标
    hideElement('c-footer');       // 页面底部说明
    hideElement('c-page-entrance'); // 右侧固定栏
}

function autoClickQuestion() {
    const questionTabElement = document.getElementById('tab-works');
    if (!!questionTabElement) {
        questionTabElement.click();
    }
}

window.onload = function() {
    hideNotCareElements();
    autoClickQuestion();
}

// setInterval(hide_popup_ads, 100);