/**
 * 前端实现内容保存到本地
 * @param content
 * @param filename
 */
function downloadFile(content, filename = 'export.txt')
{
    const data = new Blob([content], {type: "text/plain;charset=UTF-8"});
    const downloadUrl = window.URL.createObjectURL(data);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = filename;
    anchor.click();
    window.URL.revokeObjectURL(data);
}

setTimeout(function () {
    getData().then(value => {
        console.log('--------end: ' + value);
    }).catch(reason => {
        console.log(reason);
    });
}, 1e3);

$('img').mousedown(function(event) {
    if (event.which === 3) {
        const imgUrl = $(this).attr('src');
        let fanhao = $(this).parent().get(0).innerText || $(this).parent().next().text();
        if (fanhao.length > 8) {
            fanhao = '';
        }
        const inputElement = document.createElement('input');
        inputElement.display = false;
        inputElement.value = imgUrl + '   ' + fanhao;
        document.body.appendChild(inputElement);
        inputElement.select();
        document.execCommand('copy');
    }
});