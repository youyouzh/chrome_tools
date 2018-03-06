
window.onscroll = function() {
    // 隐藏页面首部的标题
    var pageHeader = document.getElementsByClassName('PageHeader')[0];
    var header = document.getElementsByTagName('header')[0];
    header && (header.style.display = 'none');

// 隐藏右边栏：相关问题和相关推荐
    var sideColumn = document.getElementsByClassName('Question-sideColumn')[0];
    sideColumn && (sideColumn.style.display = 'none');

    // 隐藏答题人休息，使用横线替换
    var contentItem_meta = document.getElementsByClassName('ContentItem-meta'),
        contentItem_action = document.getElementsByClassName('ContentItem-actions');
    var hr = '<HR style="FILTER: alpha(opacity=100,finishopacity=0,style=3)" color=#987cb9 SIZE=3>'

    for (var i = 0; i < contentItem_meta.length; i++) {
        var zans = contentItem_action[i].childNodes[0].childNodes[0];
        if (zans) {
            zans = zans.innerText;
        } else {
            continue;
        }
        // 替换成赞和显示横线
        contentItem_meta[i].innerHTML = hr + zans;
        contentItem_action[i].innerHTML= hr + zans;
    }
    
    

    var questionHeader = document.getElementsByClassName('QuestionHeader')[0];
    questionHeader.style.display = 'none';
}
