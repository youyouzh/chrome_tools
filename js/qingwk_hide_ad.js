// 轻微课隐藏弹窗广告

function hide_element(className) {
    const class_elements = document.getElementsByClassName(className);
    if (!!class_elements && class_elements.length > 0) {
        class_elements[0].style.display = 'none';
        class_elements[0].style.zIndex = '-10';
    }
}

function hide_not_care_elements() {
    hide_element('c-course-view-top-wrap');  // 课程头部介绍
    hide_element('c-meiqia-wrapper');  // 弹窗广告
    hide_element('qwk-kf-button');  // 客服图标
    hide_element('c-footer');       // 页面底部说明
    hide_element('c-page-entrance'); // 右侧固定栏
}

function auto_click_question() {
    const question_tab_element = document.getElementById('tab-works');
    console.log(question_tab_element);
    if (!!question_tab_element) {
        question_tab_element.click();
    }
}

window.onload = function() {
    hide_not_care_elements();
    auto_click_question();
}

// setInterval(hide_popup_ads, 100);