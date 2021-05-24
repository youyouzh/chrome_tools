// 轻微课隐藏弹窗广告


function hide_popup_ads() {
    const popup_ad_elements = document.getElementsByClassName('c-meiqia-wrapper');
    if (popup_ad_elements && popup_ad_elements.length > 0) {
        popup_ad_elements[0].style.display = 'none';
    }
}

setInterval(hide_popup_ads, 100);