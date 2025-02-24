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

  let downloadPythonStatement = ''
  const skip_url_tokens = ['master.m3u8', '_240p.m3u8', 'playlist.m3u8']
  m3u8Videos[activeTabId] = m3u8Videos[activeTabId].map(v => {
    for (const skip_url_token of skip_url_tokens) {
      if (v['m3u8Url'].indexOf(skip_url_token) >= 0) {
        return
      }
    }
    downloadPythonStatement += `download_with_m3u8_url('${v["title"]}', '${v["m3u8Url"]}')\n`
    v['title'] = titleElement.innerText;
    // 链接未加入标题才添加
    if (titleElement.innerText.indexOf(v['m3u8Url']) < 0) {
      titleElement.append(`【${v["m3u8Url"]}】`)
    }
    return v;
  });
  console.log('------->videos:', downloadPythonStatement);
  // copyContent(downloadPythonStatement);
  // setTimeout(() => window.navigator.clipboard.writeText(downloadPythonStatement), 3000);
  // DOMException: Document is not focused. clipboard
  // https://stackoverflow.com/questions/56306153/domexception-on-calling-navigator-clipboard-readtext
  // await window.navigator.clipboard.writeText(downloadPythonStatement);
}

const titleElementSelectors = {
  'xvideo.com': '#main > h2.page-title',
  'pornlulu.com': 'h1.title',
  'pornhub.com': 'h1.title',
  'jable.tv': 'div.header-left > h4',
  'missav': 'div.mt-4 > h1',
  'tktube.com': 'div.info > div.item',
  'njav.tv': 'div.mr-3 > h1',
  'supjav.com': 'div.archive-title > h1'
}

function extractVideoTitle() {
  for (const website in titleElementSelectors) {
    const titleElement = document.querySelector(titleElementSelectors[website]);
    if (!titleElement) {
      continue;
    }
    console.log('Found title element: ', website);
    recordTitle(titleElement);
    return;
  }
}

setTimeout(extractVideoTitle, 3000);
setTimeout(extractVideoTitle, 10000);
