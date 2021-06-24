"use strict";

// An object used for caching data about the browser's cookies, which we update
// as notifications come in.
function CookieCache(cookies) {
    this._cookies = cookies || {};

    this.reset = function() {
        this._cookies = {};
    }

    this.getAll = function() {
        return this._cookies;
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

async function cookieChange(info) {
    const storageCookie = await _u_api.getStorage(_u_constant.storageKey.cookie);

    const cookieCache = new CookieCache(storageCookie[_u_constant.storageKey.cookie]);
    cookieCache.remove(info.cookie);
    if (info.removed) {
        return;
    }
    if (_u_constant.cookie.cacheDomains.indexOf(info.cookie.domain) === -1) {
        // 无关的cookie不缓存，避免占用过多的 storage 存储
        return;
    }
    cookieCache.add(info.cookie);

    _u_api.setStorage(_u_constant.storageKey.cookie, cookieCache.getAll())
        .catch((reason => {
            console.log('storage set error: ' + reason.message);
            _u_api.setStorage(_u_constant.storageKey.cookie, null);  // 清空cookie
        }));
}

chrome.cookies.onChanged.addListener((info) => cookieChange(info));
