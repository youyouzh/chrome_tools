/**
 * 一些工具类
 */

/**
 * 通过绘制canvas实现图片下载，直接通过设置a标签href属性的方式对于服务器设置了content-type: image的方式不能下载
 * 需要服务器设置 content-type: application/octet-stream
 *
 * @param imageUrl 下载图片地址
 * @param imagName 保存图片时的文件名称，如果没有指定，则取下载地址中的文件名
 */
function downloadImage(imageUrl, imagName) {
    const image = new Image();
    /**
     * 除非服务器设置了允许跨域请求，否则会报错:
     * Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
     * 服务器设置 Allow-Headers: Access-Control-Allow-Origin
      */
    // image.setAttribute('crossOrigin', 'anonymous');  // 解决跨域 Canvas 污染问题
    image.src = imageUrl;
    image.onload = function () {
        // 将图片绘制到canvas，并得到url
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height)
        const canvasImageUrl = canvas.toDataURL('image/png')

        // 创建一个a标签，并设置url为canvas的url，并模拟点击下载
        const aElement = document.createElement('a');     // 创建一个a节点插入的document
        const clickEvent = new MouseEvent('click');           // 模拟鼠标click点击事件

        aElement.download = imagName || imageUrl.split('/').pop(); // 设置a节点的download属性值，下载时候的文件名
        aElement.href = canvasImageUrl;      // 将生成的URL设置为a.href属性
        aElement.dispatchEvent(clickEvent);  // 触发a的单击事件
    }
}

/**
 * 隐藏掉指定类名称的元素
 *
 * @param className className
 */
function hideElement(className) {
    const classElements = document.getElementsByClassName(className);
    if (!!classElements && classElements.length > 0) {
        classElements[0].style.display = 'none';
        classElements[0].style.zIndex = '-10';
    }
}