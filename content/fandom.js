/**
 * 泰拉瑞亚wiki网站
 * 屏蔽广告
 */

function hideAd() {
    hideElement('.top-ads-container');
    hideElement('#incontent_boxad_1')
}

setTimeout(hideAd, 500)
