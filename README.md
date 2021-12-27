# easy-wx-elevator

微信小程序自定义电梯 elevator 组件，支持多个组件之间跳转

> 由于项目使用了可选链语法，因此运行本项目需要在微信开发者工具开启：[本地设置-增强编译](https://developers.weixin.qq.com/miniprogram/dev/devtools/codecompile.html)

## 项目背景

微信小程序项目，某个页面下有多个区域，导致页面特别长。如果想回看页面某一个区域，需要手动滚动页面，而且页面分区结构对用户感官也不明显。
因此需要设计一个数据驱动的电梯组件，可以通过点击直接跳转到页面各个区域，且组件代码无侵入，易使用

## 使用组件

### 1.在页面配置文件.json 中引入

```json
{
  "usingComponents": {
    "easy-wx-elevator": "../../../components/easy-wx-elevator"
  }
}
```

### 2.在页面视图文件.wxml 中使用组件

```html
<easy-wx-elevator
  dataSource="{{elevatorDataSource}}"
  defaultActiveKey="{{1}}"
  needHide="{{true}}"
  timerKeepOn="{{3000}}"
  bind:onClick="handleClickElevator"
/>
```

### 3.在页面逻辑文件.js 中传入数据源

```javaScript
Page({
  data: {
    // 电梯组件数据源
    elevatorDataSource: [
      {
        key: 1,
        label: "指数",
        anchor: "#section-index",
      },
      {
        key: 2,
        label: "积分",
        anchor: "#section-range",
      },
      {
        key: 3,
        label: "交锋",
        anchor: "#section-against",
      },
      {
        key: 4,
        label: "战绩",
        anchor: "#section-recent",
      },
      {
        key: 5,
        label: "赛程",
        anchor: "#section-schedule",
      },
    ],
  },

  // 点击电梯组件
  handleClickElevator(e) {
    console.log(e.detail);
  }
})
```

## 效果展示

![image](./screenshots/demo.gif)

## 参数说明

> dataSource 参数是一个数组，key 用于区分不同楼层，label 用于渲染电梯楼层文案，anchor 为页面个区域元素的选择器，建议使用 id 选择器

| 参数             | 说明                         | 类型           | 默认值  | 是否必填 |
| ---------------- | ---------------------------- | -------------- | ------- | -------- |
| dataSource       | 组件渲染数据源               | Array          | []      | 否       |
| defaultActiveKey | 默认选中电梯楼层             | Number\|String | 0       | no       |
| needHide         | 页面不滚动时是否隐藏         | boolean        | false   | 否       |
| timerKeepOn      | 从页面不滚动到隐藏的时间(ms) | Number         | 3000    | 否       |
| themeColor       | 电梯组件主题色               | String         | #FF2A84 | 否       |
| onClick          | 电梯组件点击事件             | Function       |         | 否       |
