(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{215:function(e,t,a){"use strict";a.r(t);a(13),a(207),a(218);var n=a(0),o=a.n(n),r=a(1);var l=r.a.div.withConfig({displayName:"HeadList__Wrapper",componentId:"sc-9niu7c-0"})(['display:block;padding:30px 5px;background:#fff;border-bottom:1px solid #e1e2e3;.title{position:relative;text-align:center;padding-bottom:5px;margin-bottom:30px;&:after{content:"";display:block;position:absolute;width:30px;border-bottom:1px solid #74d6eb;bottom:0;left:50%;margin-left:-15px;}}']),i=r.a.div.withConfig({displayName:"HeadList__List",componentId:"sc-9niu7c-1"})(["margin:0;padding:0;list-style:none;font-size:14px;span{color:#6b7174;cursor:pointer;&:hover{color:#1993ad;text-decoration:underline;}}.l1{padding-left:0;}.l2{padding-left:1em;}.l3{padding-left:2em;}.l4{padding-left:3em;}"]);var c=function(e){var t,a;function n(){return e.apply(this,arguments)||this}a=e,(t=n).prototype=Object.create(a.prototype),t.prototype.constructor=t,t.__proto__=a;var r=n.prototype;return r.onItemClick=function(e){!function(e){document.documentElement.scrollTop=e-50}(document.getElementById(e).offsetTop)},r.render=function(){var e=this,t=this.props.listData;return o.a.createElement(l,null,o.a.createElement("div",null,o.a.createElement("div",{className:"title"},"文章目录"),o.a.createElement(i,null,t.map((function(t){return o.a.createElement("div",{className:"l"+t.depth,key:t.value,role:"button",tabIndex:0,onClick:function(){return e.onItemClick(t.value)},onKeyDown:function(){return e.onItemClick(t.value)}},t.value)})))))},n}(o.a.Component),s=a(213),m=a(208),p=r.a.div.withConfig({displayName:"Pagination__Wrapper",componentId:"sc-1surqvn-0"})(["margin:40px auto 0;text-align:center;padding:30px 0;border-top:1px solid #ddd;"]),d=r.a.a.withConfig({displayName:"Pagination__Button",componentId:"sc-1surqvn-1"})(["display:inline-block;margin:0 10px;color:#fff;background-color:#1ca6c4;font-size:.875rem;padding:.2em .75em;border-radius:.3rem;box-shadow:0 5px 0 #158097;transition:all .3s cubic-bezier(.55,0,.1,1);&:hover{text-decoration:none;background-color:#1fb9da;color:#fff;outline:none;}&:active{text-decoration:none;background-color:#1ca6c4;color:#126d81;text-shadow:0 1px hsla(0,0%,100%,.4);box-shadow:0 2px 0 #158097;}"]),u=function(e){var t=e.prev,a=e.next;return o.a.createElement(p,null,t?o.a.createElement(d,{href:t.frontmatter.path},o.a.createElement("i",{className:"ion-arrow-left-c"})," ",t.frontmatter.title):null,a?o.a.createElement(d,{href:a.frontmatter.path},a.frontmatter.title," ",o.a.createElement("i",{className:"ion-arrow-right-c"})):null)},f=a(209);function g(e){var t={lt:"<",gt:">",nbsp:" ",amp:"&",quot:'"'};return e.replace(/&(lt|gt|nbsp|amp|quot);/gi,(function(e,a){return t[a]}))}a.d(t,"default",(function(){return v})),a.d(t,"pageQuery",(function(){return E}));var v=function(e){var t,a;function n(){return e.apply(this,arguments)||this}a=e,(t=n).prototype=Object.create(a.prototype),t.prototype.constructor=t,t.__proto__=a;var r=n.prototype;return r.componentDidMount=function(){for(var e=1;e<=5;e+=1)for(var t=document.getElementsByTagName("h"+e),a=0;a<t.length;a+=1)t[a].setAttribute("id",g(t[a].innerHTML)),t[a].dataset.offset=String(t[a].offsetTop);var n=document.getElementById("leftCover");n.style.width=n.offsetWidth+"px",n.style.position="fixed",n.style.top="80px",n.style.left=String(n.offsetLeft)},r.render=function(){var e=this.props,t=e.data,a=e.location,n=e.pageContext,r=t.markdownRemark,l=r.headings,i=r.html,p=r.frontmatter,d=p.title,g=p.date,v=p.category;console.log(t.markdownRemark.tableOfContents);var E="https://blog.kiit.wang"+a.pathname;return o.a.createElement("div",{className:"post-detail"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"row__left"},o.a.createElement("div",{id:"leftCover"},o.a.createElement(m.a,null),o.a.createElement(c,{listData:l}))),o.a.createElement("div",{className:"row__right"},o.a.createElement("div",{className:"post-detail__header"},d),o.a.createElement("div",{className:"post-detail__meta"},o.a.createElement("div",{className:"post-detail__meta-item"},o.a.createElement("i",{className:"ion-android-calendar"}),o.a.createElement("span",null,"发表于 "+g)),o.a.createElement("div",{className:"post-detail__meta-item"},o.a.createElement("i",{className:"ion-android-folder-open"}),o.a.createElement("span",null,"发表于 "+v))),o.a.createElement("div",{dangerouslySetInnerHTML:{__html:i}}),o.a.createElement("div",{className:"copyright"},o.a.createElement("li",null,o.a.createElement("span",{className:"title"},"本文作者: "),o.a.createElement("span",null,"Kitwang Chen")),o.a.createElement("li",null,o.a.createElement("span",{className:"title"},"本文链接: "),o.a.createElement("span",null,o.a.createElement("a",{href:E},E))),o.a.createElement("li",null,o.a.createElement("span",{className:"title"},"版权声明: "),o.a.createElement("span",null,"本博客所有文章除特别声明外，均采用",o.a.createElement("a",{href:"https://creativecommons.org/licenses/by-nc-sa/3.0/cn/"},"CC BY-NC-SA 3.0 CN"),"许可协议。转载请注明出处！"))),o.a.createElement(u,{prev:n.previous,next:n.next}))),o.a.createElement(f.a,null),o.a.createElement(s.a,{delay:2e3}))},n}(o.a.Component),E="2229286800"}}]);
//# sourceMappingURL=component---src-templates-post-tsx-566ccdc25fdc85ea11c7.js.map