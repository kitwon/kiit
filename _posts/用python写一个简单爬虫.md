---
path: /post/python-crawler
date: 2017-06-11T11:52:53.000Z
title: 用python写一个简单爬虫
category:
- python
---

之前一直有学习python，但是一直都是在学一些比较基础的东西，所在在这段空闲的时间打算系统学一下python。在这会使用python写一个爬百科的简单爬虫，首先分析下爬虫的需求。

## 主要需求

这个demo中爬虫有3个主要模块，**URL管理器**、**下载器**、**解析器**

* URL管理器主要处理爬取的URL的状态。
* 下载器会通过**URL管理器**传送过来有效URL进行下载。
* 解析器会将**下载器**下载的内容解析成字符串，再进行保存。如果解析出有效URL再传给**URL管理器**进行重复操作。

### 入口程序

`spider_main`文件为程序入口，处理整个爬虫的运行逻辑

<!-- more -->
```python
import url_manager, html_downloader, html_outputer, html_parser
import sys

class SpiderMain(object):
  def __init__(self):
    self.urls = url_manager.UrlManager()
    self.downloder = html_downloader.HtmlDownloader()
    self.parser = html_parser.HtmlParser()
    self.outputer = html_outputer.HtmlOutputer()

  def crawl(self, root_url):
    count = 1
    # 初始化原始的爬取地址
    self.urls.add_new_ursl(root_url)

    while self.urls.has_new_url():
      try:
        new_url = self.urls.get_new_url()
        print 'crawl %d : %s' % (count, new_url)
        html_cont = self.downloder.download(new_url)
        new_urls, new_data = self.parser.parse(new_url, html_cont)

        self.urls.add_new_urls(new_urls)
        self.outputer.collect_data(new_data)

        # 爬取的数据到1000条时跳出循环
        if count == 1000:
          break

        count = count + 1
      except:
        # 使用sys抛出其他函数错误
        info=sys.exc_info()
        print info[0],":",info[1]

        print 'crawl failed'

    # 将爬取的数据组装
    self.outputer.output_html()

if __name__ == '__main__':
  root_url = 'https://baike.baidu.com/item/Python'
  obj_spider = SpiderMain()
  obj_spider.crawl(root_url)
```

## url管理器

```python
# url_manager.py
class UrlManager(object):
  def __init__(self):
    self.new_urls = set()
    self.old_urls = set()

  # 添加一条新的url
  def add_new_url(self, url):
    if url is None:
      return

    if url not in self.new_urls and url not in self.old_urls:
      self.new_urls.add(url)

  # 添加多条url
  def add_new_urls(self, urls):
    if urls is None and len(urls) == 0:
      return

    for url in urls:
      self.add_new_url(url)

  # 是否有代爬取地址
  def has_new_url(self):
    return len(self.new_urls) != 0

  # 返回一条新的url
  def get_new_url(self):
    new_url = self.new_urls.pop()
    self.old_urls.add(new_url)
    return new_url
```

### 下载器

下载器使用自带的[urllib2](https://docs.python.org/2/library/urllib2.html)库处理请求

```python
# html_downloader.py
import urllib2

class HtmlDownloader(object):
  def download(self, url):
    if url is None:
      return

    # 这里设置一下超时，不然网络会使程序运行出现停止
    response = urllib2.urlopen(url, timeout = 5)

    # 请求失败时候跳出程序
    if response.getcode() != 200:
      return None

    return response.read()

```

### 解析器

解析器分为两部分，一个解析，一个输出，首先看看解析模块。

解析html我们使用了[beautifulsoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/index.zh.html)，解析后可以使用库提供的方法做DOM操作，获取有用的信息

```python
# html_parser.py
from bs4 import BeautifulSoup
import re
import urlparse

class HtmlParser(object):
  def _get_new_urls(self, page_url, soup):
    new_urls = set()

    # 获取a标签中所有匹配的url地址
    links = soup.find_all('a', href=re.compile(r'/item/'))
    for link in links:
      new_url = link['href']
      new_full_url = urlparse.urljoin(page_url, new_url)
      new_urls.add(new_full_url)

    return new_urls

  def _get_new_data(self, page_url, soup):
    res_data = {}

    # 获取页面相关内容
    res_data['url'] = page_url

    # <dd class="lemmaWgt-lemmaTitle-title"> <h1>Python</h1>
    title_node = soup.find('dd', class_='lemmaWgt-lemmaTitle-title').find('h1')
    res_data['title'] = title_node.get_text()

    # <div class="lemma-summary" label-module="lemmaSummary">
    summary_node = soup.find('div', class_='lemma-summary')
    res_data['summary'] = summary_node.get_text()

    return res_data

  def parse(self, page_url, html_cont):
    if page_url is None or html_cont is None:
      return

    soup = BeautifulSoup(html_cont, 'html.parser', from_encoding='utf-8')
    new_urls = self._get_new_urls(page_url, soup)
    new_data = self._get_new_data(page_url, soup)

    return new_urls, new_data

```

```python
# html_outputer.py
class HtmlOutputer(object):
  def __init__(self):
    self.datas = []

  # 获取到的页面内容对象push到数组中
  def collect_data(self, data):
    if data is None:
      return

    self.datas.append(data)

  # 将数组循环拼接，写入html文件中
  def output_html(self):
    fout = open('output.html', 'w')

    fout.write('<html>')
    fout.write('<body>')
    fout.write('<table>')

    for data in self.datas:
      fout.write('<tr>')
      fout.write('<td>%s</td>'%data['url'])
      fout.write('<td>%s</td>'%data['title'].encode('utf-8'))
      fout.write('<td>%s</td>'%data['summary'].encode('utf-8'))
      fout.write('</tr>')

    fout.write('</html>')
    fout.write('</body>')
    fout.write('</table>')
```

## 总结

短短几行代码就实现了一个简单的爬虫，足以体现python的简单易用。学习python主要是想了解一下机器学习，后面会看一些书籍和资料，应该会再记录，但是后面估计会先写完深度学习javascript系列先。
