/**
 * 该脚本主要用来提取视频标题
 */

function extractVideoTitle() {
  const titleElement = document.querySelector('#main > h2.page-title');
  if (!titleElement) {
    console.log('Can not find title element.');
    return "";
  }

  chrome.runtime.sendMessage({
    type: _u_constant.messageType.xvideosTitle,
    title: titleElement.innerText
  });
}

setTimeout(extractVideoTitle, 1000);