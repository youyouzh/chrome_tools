/**
 * bilibli网站功能辅助脚本
 * 1. 专栏文章图片原始链接提取和下载
 * 2. 去除复制文本后面的小尾巴（版权说明）
 */
'use strict'

function extractSourceImageUrl() {
    const imageElements = document.querySelectorAll('div#article-content img');
    console.log('extract image element size: ' + imageElements.length);
    for (const imageElement of imageElements) {
        // 发送消息给扩展程序
        imageElement.addEventListener('dblclick', () => {
            const title = imageElement.nextElementSibling && imageElement.nextElementSibling.innerText;
            let downloadUrl = imageElement.getAttribute('data-src');
            downloadUrl = downloadUrl.replaceAll(/@.+$/g, '');   // 把路径后面的参数去掉
            downloadUrl = 'https:' + downloadUrl;
            // imageElement.setAttribute('src', downloadUrl);

            // 发送消息给扩展程序
            addDownloadTask(downloadUrl, 'bilibili');
        });
    }
}

function optimiseCopy() {
    // 去除复制后的copyright小尾巴
    document.querySelectorAll('*').forEach(item => {
        item.oncopy = function (e) {
            e.stopPropagation();
        }
    });
}

optimiseCopy();
extractSourceImageUrl();