webpackJsonp([0xb53df5922bff],{300:function(e,t){e.exports={data:{markdownRemark:{html:'<p>作为一个程序员，想必每个都有自己的编码风格。有风格虽好，但这问题令很多项目管理者头疼，不一样的代码风格及缩进，必会降低代码可读性，从而间接降低效率。但是这个问题都难不到我们伟大的程序员，很多如eslint，prettier等库的出现帮我们去解决问题。很多cli在生成初始项目时都会给我们加上eslint、csslint等，这不就能解决我们的问题了吗？too young too simple，每保存一次就弹出一个错误，还是一大堆英文，估计大部分人心里就默默一句what the fuck is that了，从而就导致我们嘴上虽很强硬的说着要规范我们的代码风格，身体却很诚实地默默把各种lint的配置关掉🤷🏼‍♂️。\n所以在这篇文章里，会给大家提供一些好用的方法，使各位重拾定规范时候的激情。</p>\n<h1>something useful</h1>\n<ol>\n<li>使用<code>eslint --fix</code>格式化文件\n<strong>eslint</strong>虽好，但是对规范还没适应的同学却是一个难题，每写一遍都弹个黑白屏出来，特别英文不好的，估计半天都不知道哪里出问题，这样子下来估计半天没写几行代码。这时候其实我们可以贴心地把配置项注释掉，只有提交前跑一下<code>eslint --fix</code>这个命令就好了，大部分代码都会根据规范格式化掉。</li>\n</ol>\n<!-- more -->\n<ol start="2">\n<li>\n<p>使用各种编辑器、IDE插件\n上方方法虽好，但是我们还是要从源头上解决问题，培养每个人的代码风格以及习惯，这时候插件就能帮住我们在写代码的时候及时发现，也不用看到一大片错误了。</p>\n</li>\n<li>\n<p>使用<strong>prettier</strong>格式化代码\nPrettier可以帮助我们做一些代码格式化的工作，如代码缩进，双引号变单引号等一些代码格式化工作，但是有些配置项与eslint是重复的，下面会介绍到如何解决。具体配置项可以查看<a href="https://prettier.io/docs/en/install.html">官网文档</a>。</p>\n</li>\n</ol>\n<p>虽然有很多方法提醒我们注意代码质量，但是有时候这并不能阻止我们把有linting error的代码提交到仓库上。有时候没有什么大问题，但是如果是使用YUI压缩或者其他代码检查工具导致发布失败，我们将会需要用大量地时间去找到n个人提交的代码中的1个不显眼的语法错误。</p>\n<h1>Pre-commit hook</h1>\n<p>所以，什么是<strong>pre-commit hook</strong>？其实Git给我门提供了很多钩子，比如pre-commit这个，就是提交前，还有提交后，其他钩子可自行查<a href="https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git-%E9%92%A9%E5%AD%90">Git - Git 钩子</a>。(SVN暂时无能为力，不过Google中有提供解决方案，但是看过一下实现起来颇麻烦的，大家有兴趣可以自行查找一下)</p>\n<h2>husky + lint-stage</h2>\n<p>假设你的项目中已经有了eslint和使用vue，然后我们需要安装两个package</p>\n<pre><code class="language-shell">npm install husky lint-stage --save-dev\n\n// or use yarn\nyarn add husky lint-stage -D\n</code></pre>\n<ol>\n<li>然后在<code>package.json</code>文件中添加如下配置</li>\n</ol>\n<pre><code class="language-javascript">// package.json\n{\n// ...\n  "script": {\n    "lint": "eslint --ext .js,.vue",\n    "precommit": "lint-staged"\n  },\n  "lint-staged": {\n    "*.{js|vue}": [\n      "npm run lint"\n    ]\n  }\n}\n</code></pre>\n<ol start="2">\n<li>然后随便找个文件删掉两个缩进空格，然后跑下提交命令<code>git commit -am \'test precommit\'</code>，此时应该可以看到下图的运行及报错。\n⚠️ 这里的错误大家可以看到是preiiter抛出的，是因为我的配置文件已经集成了prettier，如何集成下方有介绍。\n<img src="http://kiit-1253813979.file.myqcloud.com/pre-commit-hook/lint-error.jpg" alt="pre-commit-error"></li>\n</ol>\n<p>如果想使用eslint自动修复错误，可以修改成如下配置</p>\n<pre><code class="language-javascript">// package.json\n{\n// ...\n  "script": {\n    "lint": "eslint --fix --ext .js,.vue",\n    "precommit": "lint-staged"\n  },\n  "lint-staged": {\n    "*.{js|vue}": [\n      "npm run lint",\n      "git add"\n    ]\n  }\n}\n</code></pre>\n<p>这样修正好的文件就会重新跑一遍add命令，我们只需重按一下⬆️键重新跑一下命令提交即可，perfect。</p>\n<h2>集成prettier和Jest</h2>\n<ol>\n<li>prettier虽然和eslint有很多共同配置，但是prettier还可以对<code>vue template</code>和样式文件做验证和格式化，更多配置方式可以查看<a href="https://prettier.io/docs/en/index.html">文档</a>，下面只介绍快速集成eslint和prettier的方式。首先我们需要安装<code>eslint-plugin-prettier</code>和<code>eslint-config-prettier</code></li>\n</ol>\n<pre><code class="language-shell">npm install eslint-plugin-prettier eslint-config-prettier --save-dev\n</code></pre>\n<p>然后修改我们的<code>.eslintrc.js</code></p>\n<pre><code class="language-javascript">{\n  "extends": ["plugin:prettier/recommended"]\n}\n</code></pre>\n<p>然后重新执行上方配置的第二部就可以看到结果了。</p>\n<ol start="2">\n<li>\n<p>集成Jest做unit test。为什么这里也会抽出单独讲呢，理论上我们只需在配置中加段<code>npm run unit</code>就行了，但是运行时候会发现Jest会提升没有找到测试文件的情况。此时我们需要修改我们的npm script，给jest cli添加一个<code>--findRelatedTests</code>的参数。官网对这参数的解释是<strong>Useful for pre-commit hook integration to run the minimal amount of tests necessary.</strong> ，看起来是为pre-commit提供的特殊命令，but why🤷🏼‍♂️</p>\n<pre><code class="language-javascript">{\n...\n"script": {\n"unit": "jest --config test/jest.conf.js --findRelatedTests",\n"lint": "eslint --fix --ext .js,.vue",\n"precommit": "lint-staged"\n},\n"lint-staged": {\n"*.{js|vue}": [\n  "npm run lint",\n  "git add",\n  "npm run unit"\n]\n}\n}\n</code></pre>\n</li>\n</ol>\n<h1>Last</h1>\n<p>参照上面几步，便很容易的实现提交前验证，想整合打包等功能也十分简单，只需要在<code>lint-stage</code>中添加<code>npm run *</code>或者集成其他命令。我们也可以看到lint-stage可以通过<code>glob</code>的语法区分文件类型执行对应的script，大家可以自由发挥实现一下自动部署。</p>\n<h2>相关文档</h2>\n<ul>\n<li><a href="https://prettier.io/docs/en/eslint.html">prettier- Integrating with ESLint</a></li>\n<li><a href="https://github.com/typicode/husky/tree/master">Husky</a></li>\n<li><a href="https://www.npmjs.com/package/lint-staged">lint-stage</a></li>\n<li><a href="https://facebook.github.io/jest/docs/en/cli.html#findrelatedtests-spaceseparatedlistofsourcefiles">Jest Cli Options</a></li>\n</ul>',frontmatter:{date:"March 29, 2018",path:"/post/pre-commit-hook",title:"使用pre-commit实现提交前验证或自动部署代码"},headings:[{depth:1,value:"something useful"},{depth:1,value:"Pre-commit hook"},{depth:2,value:"husky + lint-stage"},{depth:2,value:"集成prettier和Jest"},{depth:1,value:"Last"},{depth:2,value:"相关文档"}]}},pathContext:{prev:!1,next:{title:"10个console的高级使用方法",date:"2018-03-19",category:["javascript"],tags:null,path:"/post/10tips-for-console"}}}}});
//# sourceMappingURL=path---post-pre-commit-hook-2bf75b43d321ef23fdac.js.map