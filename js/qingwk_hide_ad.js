// 轻微课隐藏弹窗广告

const popup_ad_elements = document.getElementsByClassName('c-meiqia-wrapper');
function hide_popup_ads() {
    if (popup_ad_elements && popup_ad_elements.length > 0) {
        popup_ad_elements[0].style.display = 'none';
    }
}

setInterval(hide_popup_ads, 100);