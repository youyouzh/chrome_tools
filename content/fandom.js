/**
 * 泰拉瑞亚wiki网站
 * 屏蔽广告
 */

function hideAd() {
    hideElement('.top-ads-container');
    hideElement('.bottom-ads-container');
    hideElement('#incontent_boxad_1');
    hideElement('#mixed-content-footer');
    hideElement('.page__right-rail');
    hideElement('.wds-global-footer');
    hideElement('#top_boxad');
}

setInterval(hideAd, 500);
