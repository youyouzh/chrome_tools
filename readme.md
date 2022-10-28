## Chrome 扩展开发文档

官方文档参考： <https://developer.chrome.com/docs/extensions/mv3/getstarted/>。

## Chrome浏览器扩展工具

### 知乎阅读模式
当在知乎问题页面滚动时，隐藏下面内容：

- 隐藏知乎问题侧边栏
- 隐藏回答者相关评论功能

### sass官网文档隐藏广告
[sass官网文档](https://www.sass.hk/docs/)隐藏侧边栏广告

## Content Script

Content Script官方文档： <https://developer.chrome.com/docs/extensions/mv3/content_scripts/>。

manifest.json关于content script配置项目：

- matches: 匹配网址
- js: 注入到网页中的js文件列表
- match_about_blank： 是否匹配打开的空白页面
- run_at： 运行时间，默认为`document_idle`，即页面加载完成
  - document_start： dom还未加载
  - document_end： dom加载完成，但是图片或者frames还未加载
  - document_idle： dom加载完成，相当于window.onload，读取document.readyState

## chrome插件地址

- windows xp中chrome插件默认安装目录位置: `C:\Documents and Settings\用户名\Local Settings\Application Data\Google\Chrome\User Data\Default\Extensions`
- windows7中chrome插件默认安装目录位置: `C:\Users\用户名\AppData\Local\Google\Chrome\User Data\Default\Extensions`
- MAC中chrome插件默认安装目录位置: `~/Library/Application Support/Google/Chrome/Default/Extensions`
- Ubuntu中chrome插件默认安装目录位置: ` ~/.config/google-chrome/Default/Extensions`
