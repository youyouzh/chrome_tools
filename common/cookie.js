"use strict";

window._u_constant = {};
window._u_constant.cookie_storage_key = '_u_cookie_cache';

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
    const cachedCookies = await chrome.storage.local.get(_u_constant.cookie_storage_key);
    console.log(_u_constant.cookie_storage_key, cachedCookies);

    const cookieCache = new CookieCache(cachedCookies);
    cookieCache.remove(info.cookie);
    if (info.removed) {
        return;
    }
    cookieCache.add(info.cookie);

    const saveData = {};
    saveData[_u_constant.cookie_storage_key] = JSON.stringify(cookieCache.getAll());
    chrome.storage.local.set(saveData, () => console.log('update cookie cache success: ', cookieCache));
}

chrome.cookies.onChanged.addListener((info) => cookieChange(info));
