/**
 * 360个人图书馆UI优化
 */

function optimiseUI() {
    // 只保留文章内容
    let articleNode = document.getElementById('printArticle');
    if (!articleNode) {
        return;
    }
    articleNode = articleNode.cloneNode(true);
    articleNode.style.margin = 'auto';
    articleNode.style.width = '50%';
    document.body.replaceChildren();
    document.body.appendChild(articleNode);
    document.body.classList.remove('articleMaxH');
}


window.onload = () => {
    optimiseUI();
}
