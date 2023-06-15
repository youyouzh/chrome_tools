/**
 * 该脚本主要用来提取m3u8视频，适用网站如下
 * - xvideos.com
 * - pornlulu.com
 * - pornhub.com
 * https://www.pornlulu.com/
 */

// 记录视频标题
async function recordTitle(titleElement) {
  const m3u8Videos = await _u_api.getStorage(_u_constant.storageKey.m3u8Videos);
  const activeTabId = await _u_api.getStorage(_u_constant.storageKey.activeTabId);
  if (!m3u8Videos || !m3u8Videos.hasOwnProperty(activeTabId) || !m3u8Videos[activeTabId].hasOwnProperty('length') || m3u8Videos[activeTabId].length === 0) {
    console.warn('The match m3u8Videos is not exist.', activeTabId, m3u8Videos);
    return;
  }
  m3u8Videos[activeTabId] = m3u8Videos[activeTabId].map(v => {
    if (v['m3u8Url'].indexOf('master.m3u8') >= 0) {
      return
    }
    v['title'] = titleElement.innerText;
    const download_python_statement = `download_with_m3u8_url('${v["title"]}', '${v["m3u8Url"]}')`
    titleElement.append('【' + download_python_statement + '】')
    return v;
  });
  console.log('------->videos:', m3u8Videos[activeTabId]);
}

const titleElementSelectors = {
  'xvideo.com': '#main > h2.page-title',
  'pornlulu.com': 'h1.title',
  'pornhub.com': 'h1.title',
  'jable.tv': 'div.header-left > h4'
}

function extractVideoTitle() {
  for (const website in titleElementSelectors) {
    const titleElement = document.querySelector(titleElementSelectors[website]);
    if (!titleElement) {
      console.log('Can not find title element: ', website);
      continue;
    }
    recordTitle(titleElement);
    return;
  }
}

setTimeout(extractVideoTitle, 2000);