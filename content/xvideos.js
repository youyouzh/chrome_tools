/**
 * 该脚本主要用来提取视频标题，试用网站如下
 * - xvideos.com
 * https://www.pornlulu.com/
 */

async function recordTitle(titleElement) {
  const m3u8Videos = await _u_api.getStorage(_u_constant.storageKey.m3u8Videos);
  const activeTabId = await _u_api.getStorage(_u_constant.storageKey.activeTabId);
  if (!m3u8Videos || !m3u8Videos.hasOwnProperty(activeTabId) || !m3u8Videos[activeTabId].hasOwnProperty('length') || m3u8Videos[activeTabId].length === 0) {
    console.warn('The match m3u8Videos is not exist.', activeTabId, m3u8Videos);
    return;
  }
  m3u8Videos[activeTabId] = m3u8Videos[activeTabId].map(v => {
    v['title'] = titleElement.innerText;
    titleElement.append('【' + v['m3u8Url'] + '】')
    return v;
  });
  console.log('------->videos:', m3u8Videos[activeTabId]);
}

// for xvideos.com
function extractVideoTitleFromXVideos() {
  const titleElement = document.querySelector('#main > h2.page-title');
  if (!titleElement) {
    console.log('Can not find title element.');
    return "";
  }
  recordTitle(titleElement);
}

// for https://www.pornlulu.com/
function extractVideoTitleFromPornLuLu() {
  const titleElement = document.querySelector('h1.title');
  if (!titleElement) {
    console.log('Can not find title element.');
    return "";
  }
  recordTitle(titleElement);
}

function extractVideoTitle() {
  extractVideoTitleFromXVideos();
  extractVideoTitleFromPornLuLu();
}

setTimeout(extractVideoTitle, 2000);