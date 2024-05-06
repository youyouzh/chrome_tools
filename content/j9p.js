/**
 * 该脚本适用网站： http://www.j9p.com/
 * 主要用来帮助快速下载文件，以及修改下载文件名称，避免每次都要另存为然后复制标题
 */

function changeDownloadAction() {
    // 修改下载按钮的行为
    const sourceDownloadElement = document.querySelector('p.localdown > a');
    if (!sourceDownloadElement) {
        console.log('Do not find download element.');
        return;
    }

    // 原来的下载按钮会有下滚动的事件，移除掉，只能通过复制元素的方式，可以拷贝 onclick() 绑定的事件，但是不能拷贝 addEventListener() 动态绑定的事件
    const cloneElement = sourceDownloadElement.cloneNode(true);
    cloneElement.href = '#';
    sourceDownloadElement.parentElement.replaceChild(cloneElement, sourceDownloadElement);

    // 标题元素和下载地址元素
    const titleElement = document.querySelector('div.g-softinfo-box > div.info > h1');
    const title = titleElement && titleElement.innerText;
    const downloadElement = document.querySelector('ul.topdown > li.address_like > a');
    const downloadUrl = downloadElement && downloadElement.href;

    if (!title || !downloadUrl) {
        console.log('The download url or title is empty.');
        cloneElement.innerHTML = '<b>不能下载</b>';
        return;
    }
    cloneElement.href = downloadUrl;
    cloneElement.title = downloadUrl;

    // 这样绑定的事件不能在控制台看到，真奇怪
    cloneElement.addEventListener('click', (evt) => {
        addDownloadTask(downloadUrl, 'j9p', title + getExtension(downloadUrl))

        evt.preventDefault();
        evt.stopImmediatePropagation();
    });
}

changeDownloadAction();