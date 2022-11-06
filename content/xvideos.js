/**
 * 该脚本主要用来提取视频标题，试用网站如下
 * - xvideos.com
 * https://www.pornlulu.com/
 */

function sendMessageToBackground(title) {
  chrome.runtime.sendMessage({
    type: _u_constant.messageType.xvideosTitle,
    title: title,
    url: window.location.href
  });
}

// for xvideos.com
function extractVideoTitleFromXVideos() {
  const titleElement = document.querySelector('#main > h2.page-title');
  if (!titleElement) {
    console.log('Can not find title element.');
    return "";
  }
  sendMessageToBackground(titleElement.innerText);
}

// for https://www.pornlulu.com/
function extractVideoTitleFromPornLuLu() {
  const titleElement = document.querySelector('h1.title');
  if (!titleElement) {
    console.log('Can not find title element.');
    return "";
  }
  sendMessageToBackground(titleElement.innerText);
}

function extractVideoTitle() {
  extractVideoTitleFromXVideos();
  extractVideoTitleFromPornLuLu();
}

setTimeout(extractVideoTitle, 1000);