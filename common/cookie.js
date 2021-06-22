
// An object used for caching data about the browser's cookies, which we update
// as notifications come in.
function CookieCache() {
    this._cookies = {};

    this.reset = function() {
        this._cookies = {};
    }

    this.add = function(cookie) {
        const domain = cookie.domain;
        if (!this._cookies[domain]) {
            this._cookies[domain] = [];
        }
        this._cookies[domain].push(cookie);
    };

    this.remove = function(cookie) {
        const domain = cookie.domain;
        if (this._cookies[domain]) {
            let i = 0;
            while (i < this._cookies[domain].length) {
                if (this.match(this._cookies[domain][i], cookie)) {
                    this._cookies[domain].splice(i, 1);
                } else {
                    i++;
                }
            }
            if (this._cookies[domain].length === 0) {
                delete this._cookies[domain];
            }
        }
    };

    this.match = function(c1, c2) {
        return c1.name === c2.name && c1.domain === c2.domain &&
            c1.hostOnly === c2.hostOnly && c1.path === c2.path &&
            c1.secure === c2.secure && c1.httpOnly === c2.httpOnly &&
            c1.session === c2.session && c1.storeId === c2.storeId;
    }

    this.getCookies = function(domain) {
        return this._cookies[domain];
    };
}

function cookieChange(info) {
    const cookieStorageKey = 'cookie-cache';
    let cookieCache = new CookieCache();
    chrome.storage.local.get([cookieStorageKey], (result) => cookieCache = result);

    cookieCache.remove(info.cookie);
    if (info.removed) {
        return;
    }
    cookieCache.add(info.cookie);
    console.log(cookieCache);
    if (info.cookie.domain.indexOf('wumii.net') >= 0) {
        let wumiiCookie = 'Cookie: ' + info.cookie.name + '=' + info.cookie.value;
        console.log('capture wumii online cookie: ' + wumiiCookie);
        chrome.notifications.create('notification-id', {
            type: "basic",
            title: "成功获取cookie",
            message: "Primary message to display",
            iconUrl: "image/icon_48.png"
        }, (id) => {
            console.log('send success:' + id);
        });
    }
}