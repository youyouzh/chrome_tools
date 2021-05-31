/**
 * 设置代理函数
 */
function setProxy() {
    const baiduPacUrl = 'http://pac.internal.baidu.com/bdnew.pac';
    const pacScriptURL = 'https://mediago.baidu.com/proxy/snapchat.pac';
    const FixedServersConfig = {
        mode: "fixed_servers",
        rules: {
            proxyForHttp: {
                scheme: "http",
                port: 8280,
                host: "hkg02-appmarket-http03.hkg02.baidu.com"
            },
            proxyForHttps: {
                scheme: "https",
                port: 8280,
                host: "hkg02-appmarket-http03.hkg02.baidu.com"
            },
            bypassList: ["foobar.com"]
        }
    };

    const PacConfig = {
        mode: "pac_script",
        pacScript: {
            url: pacScriptURL,
            mandatory: true
        }
    };

    // chrome.proxy.settings.set({value: FixedServersConfig, scope: 'regular'}, function(){});
    chrome.proxy.settings.set({data: PacConfig, scope: 'regular'}, function(){});
}

// setProxy();

// 允许内嵌iframe
chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        for (let i = 0; i < details.responseHeaders.length; ++i) {
            if (details.responseHeaders[i].name.toLowerCase() === 'x-frame-options'
                || details.responseHeaders[i].name.toLowerCase() === 'frame-options') {
                console.log(details.responseHeaders[i].name);
                details.responseHeaders.splice(i, 1);
                break;
            }
        }
        return {responseHeaders: details.responseHeaders}
    }, {
        urls: ["<all_urls>"]
    }, ["blocking", "responseHeaders"]
);

chrome.webRequest.onErrorOccurred.addListener(function(detail) {
    console.log(detail);
    return detail;
}, {
    urls: ["<all_urls>"]
});

// chrome.webRequest.onBeforeRequest.addListener(
//     function (details) {
//         console.log(details.url);
//         return {
//             redirectUrl: details.url.replace('ads-interfaces.sc-cdn.net', 'mediago.baidu.com/proxy/js')
//         }
//     },
//     {
//         urls: ["https://ads-interfaces.sc-cdn.net/*"]
//     },
//     ["blocking"]
// );

/**
 * 自定义代理规则
 * @param url
 * @param host
 * @returns {string}
 * @constructor
 */
function FindProxyForURL(url, host) {
    const direct = 'DIRECT';
    const proxy = 'PROXY hkg02-inf-platform.hkg02.baidu.com:8799';
    if (shExpMatch(url, 'https://ads-interfaces.sc-cdn.net/*')) {
        return proxy;
    }
    return direct;
}
