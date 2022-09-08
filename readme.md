## 基本介绍

本项目是基于chrome v3的扩展，主要定制化去掉一些网页上烦人的弹窗，广告，以及对UI做一些辅助新功能，比如隐藏不必要的推广栏目等。

chrome开发文档参考： <https://developer.chrome.com/docs/extensions/mv3/getstarted/>。

## 使用方法

将该项目`git clone`下来， chrome扩展设置页打开开发者模式，然后将整个文件夹拖入即可使用该扩展。

如果需要对某些网站进行定制化，只需要修改`manifest.json`文件，在`content_script`部分添加网站匹配路径已经需要定制化的js脚本文件即可。

## 原理说明

去广告类或者UI优化类功能，主要通过配置`content_script`脚本，对原始页面的`document`进行修改实现。

点击即下载功能，主要通过点击时获取图片下载地址等信息，然后调用`chrome.runtime.sendMessage`发送chrome消息，在`background.js`中接受消息，然后调用chrome的下载api实现下载。

这样可以避免每次下载都要右键另存选择保存路径，实现点击后立即下载，还可以配置默认的下载路径等。

一些基础功能已经封装放到`common/function.js`中，可以直接调用，其作用域是所有的网站都有效。

## Content Script配置

Content Script官方文档： <https://developer.chrome.com/docs/extensions/mv3/content_scripts/>。

manifest.json关于content script配置项目：

- matches: 匹配网址
- js: 注入到网页中的js文件列表
- match_about_blank： 是否匹配打开的空白页面
- run_at： 运行时间，默认为`document_idle`，即页面加载完成
  - document_start： dom还未加载
  - document_end： dom加载完成，但是图片或者frames还未加载
  - document_idle： dom加载完成，相当于window.onload，读取document.readyState

## 当前已有的功能

- 知乎页面辅助
  - 知乎页面UI优化
  - 隐藏侧边栏推广内容等
  - 突破复制限制，选中则立即复制
- [sass官网文档](https://www.sass.hk/docs/)隐藏侧边栏广告
- 360文档禁用弹窗，隐藏侧边栏推广等内容
- bilibili网站专栏图片点击即下载功能
- [j9q](http://www.j9p.com/)网站点击即下载文档
- [jj20](http://www.jj20.com/bz/nxxz/shxz/329486_2.html)网站点击即下载图片功能
- hsck类网站的定制化去广告功能
