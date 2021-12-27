Page({
  data: {
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
  handleClickElevator(e) {
    console.log(e.detail);
  }
})
