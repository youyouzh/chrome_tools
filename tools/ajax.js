/**
 * 简单的HTTP POST请求Promise封装
 * @param url
 * @param requestData
 * @returns {Promise<any>}
 */
function httpPost(url, requestData)
{
    requestData = JSON.stringify(requestData);
    const promiseObject = new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return false;
            }
            if (xhr.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(xhr.statusText))
            }
        };
        // xhr.resposeType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        xhr.send(requestData);
    });
    return promiseObject;
}

const productList = [{
    "package": "id835599320",
    "product_name": "TikTok",
    "os": "iOS"
}, {
    "package": "com.zhiliaoapp.musically",
    "product_name": "TikTok",
    "os": "ANDROID"
}, {
    "package": "id1249798762",
    "product_name": "vigo video",
    "os": "iOS"
}, {
    "package": "com.ss.android.ugc.boom",
    "product_name": "vigo video",
    "os": "ANDROID"
}];

async function getData()
{
    console.log('begin fetch data');

    // 查询时间范围
    const fromDate = '2018-11-01';
    const toDate = '2018-11-07';

    for(const product of productList) {
        const queryParamsOverview = {
            "query": {
                "app_id": product.package,
                "start_date": fromDate,
                "end_date": toDate,
                "alt_timezone": false,
                "alt_currency": false,
                "tz_switch_date": "",
                "filters": {},
                "topics": ["installs"],
                "groupings": ["country", "date"],
                "exclusions": {
                    "media_source": ["organic"]
                },
                "ms_timeout": 54000,
                "remove_invalid_topics": true
            }
        };

        const queryParamsRetention = {
            "query": {
                "start-time": fromDate,
                "end-time": toDate,
                "groupings": ["country", "install_period"],
                "filters": {},
                "granularity": "daily",
                "min-installs": 10
            }
        };

        const urlList = {
            overview: 'https://hq1.appsflyer.com/connectivity/vishnu/getAgg/' + product.package,
            retention: 'https://hq1.appsflyer.com/connectivity/retention/data/' + product.package
        };

        let responseRetentionData = await httpPost(urlList.overview, queryParamsRetention);
        responseRetentionData = JSON.parse(responseRetentionData);
        const retentionData = responseRetentionData.map(value => {
            return {
                date: value.dimensions.install_period,
                country: value.dimensions.country,
                install_day0: data[0],
                install_day1: data[1],
                package: product.package,
                os: product.os,
                product_name: product.product_name
            }
        });
        console.log(responseRetentionData);
        break;
    }

    console.log('end fetch data');
}
