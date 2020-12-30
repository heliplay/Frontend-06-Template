# 学习笔记

## 三代排版技术

### 第一代排版技术-古典排版

关键技术

- position
- display
- float

### 带二代排版技术

关键技术

- flex[[CSS/Flex]]

### 第三代

关键技术

- grid

## Flex排版处理思路

1. 默认关键参数处理
    - flex-direction
    - flex-wrap
    - align-items
    - justify-content
    - justify-items
2. 统一处理逻辑，在不同的参数下一致的处理流程
3. 收集元素进行(hang)
    - flex-wrap
        - no-wrap,同一行
        - auto，分行
4. 计算主轴
    - 找出所有Flex元素
    - 把主轴方向剩余的尺寸按比例分配给这些元素
    - 若剩余空间为负数，所有的flex元素为0,等比压缩元素
5. 计算副交叉轴
    - 根据每一行中最大元素尺寸计算行高
    - 根据行高flex-align和item-align,确定元素具体位置

6. 绘制准备
    - 依赖一个图形环境
    - [npm/images](https://www.npmjs.com/package/images)
    - 绘制在一个viewport上进行
7. 绘制DOM树
    - **递归**调用子元素来回执DOM树
    - 忽略一些不需要绘制的节点
    - 实际浏览器中，文字绘制是难点，需要依赖字体库
    - 实际浏览器中，还会对一些图层做compositing
