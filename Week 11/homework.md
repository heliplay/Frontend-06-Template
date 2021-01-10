# 思考题

> 1. 问题：为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？（提交至 GitHub

> 答：::first-line在某块级元素第一行应用样式。第一行的长度取决于很多因素，包括元素宽度，文档宽度和文本的文字大小。设置元素 display:block会让第一行成为block，按照block进行渲染，文本的“first-line”将会改变，从而得到不到稳定的第一行；float会让内容紧凑，减少内容占用空间，同样会使得文本“first-line”变得不稳定。
