/**
 * 网站 http://www.jj20.com/bz/nxxz/shxz/329486_2.html
 * 快速下载图片，避免每次点击下载都跳转到新的页面
 * 下载文件通过 window.open(url) 实现
 *
 * <a href="https://uusama.com/logo.png" download="logo.png">下载图片</a>
 * 1. 将a标签的href属性指向图片的地址;同时增加download属性;即可实现点击下载
 * 2. download属性的属性值选填,代表下载图片的名称,如不填写,则使用href中的图片名称,即图片的原名称
 * 3. a标签的download属性目前主流浏览器只有火狐和谷歌支持
 */

function focusPicture() {
    console.log('focusPicture');
    hideElement('g-box-1200');
    hideElement('bzc2');

    const prevDivElement = getFirstClassElement('tu-shang');
    const nextDivElement = getFirstClassElement('tu-xia');
    if (!!prevDivElement) {
        prevDivElement.style.width = '10%';
        prevDivElement.style.heidht = '30%';
    }
    if (!!nextDivElement) {
        nextDivElement.style.width = '10%';
        nextDivElement.style.heidht = '30%';
    }

    const imageElement = document.getElementById('bigImg');
    const cloneImageElement = imageElement.cloneNode(true);

    // 隐藏原来的元素
    imageElement.parentElement.parentElement.prepend(cloneImageElement);
    imageElement.parentElement.parentElement.removeChild(imageElement.parentElement);

    let fullImageUrl = document.getElementById('kk').childNodes[0].href;
    fullImageUrl = fullImageUrl.replace('http://cj.jj20.com/2020/down.html?picurl=', 'http://pic.jj20.com');

    // 修改【查看原图】按钮
    const buttonElement = document.getElementById('kk').childNodes[0];
    buttonElement.href = 'javascript:void(0);';
    buttonElement.target = '';
    buttonElement.addEventListener('click', () => readyDownloadImage(fullImageUrl));

    // 添加事件监听
    cloneImageElement.addEventListener('contextmenu', () => readyDownloadImage(fullImageUrl));
    cloneImageElement.addEventListener('click', () => readyDownloadImage(fullImageUrl));
    cloneImageElement.addEventListener('dblclick', () => readyDownloadImage(fullImageUrl));
}

function readyDownloadImage(imageUrl) {
    console.log('ready download image: ' + imageUrl);
    document.getElementById('bigImg').src = imageUrl;

    // 发送消息给扩展程序
    chrome.runtime.sendMessage({
        downloadUrl: imageUrl
    });
}

focusPicture();