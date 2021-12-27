Component({
  properties: {
    dataSource: {
      type: Array,
      value: [],
    },
    defaultActiveKey: {
      type: Number,
      optionalTypes: [String],
      observer(newValue, _) {
        this.handleActiveTab(newValue);
      },
    },
    needHide: {
      type: Boolean,
      value: false,
    },
    timerKeepOn: {
      type: Number,
      value: 3000,
    },
    themeColor: {
      type: String,
      value: "#FF2A84"
    }
  },

  data: {
    sliderLeftValue: 0,
    sliderWidth: 100,
    activeKey: 0,
    isShow: true,
    isShowSlider: false
  },

  lifetimes: {
    created() {
      this.anchorList = [];
      this.anchorTopList = [];
      this.isJumping = false;
      this.isScrolling = false;
      this.timer = null;
    },

    attached() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const ctx = this.properties.context || currentPage;
      ctx.onPageScroll = this.handlePageScroll.bind(this);

      for (const { anchor } of this.properties.dataSource) {
        wx.createIntersectionObserver(ctx)
          .relativeToViewport()
          .observe(anchor, (res) => {
            if (res) {
              this.updateAnchorList(res, anchor);
              const activeIndex =
                this.anchorTopList.findIndex(
                  ({ intersectionRatio }) => intersectionRatio > 0
                ) || 0;

              if (this.isJumping) {
                return;
              }

              this.handleActiveTab(
                this.properties.dataSource[activeIndex]?.key
              );
            }
          });
      }
    },
  },

  methods: {
    onClickTabItem(e) {
      const dataSource = e?.target?.dataset?.item || {};
      const { key, anchor } = dataSource;
      this.handleActiveTab(key);
      this.handleScrollTo(anchor);
      this.handleHideElevator()
      this.triggerEvent("onClick", dataSource);
    },

    updateAnchorList(res, selector) {
      const index = this.anchorList.findIndex(
        ({ anchor }) => anchor === selector
      );
      if (index > -1) {
        this.anchorTopList[index] = this.anchorTopList[index] || {
          anchor: selector,
          intersectionRatio: 0,
        };
        this.anchorTopList[index] = {
          anchor: selector,
          intersectionRatio: res?.intersectionRatio || 0,
        };
      }
    },

    async handleActiveTab(activeKey) {
      if (activeKey === void 0) {
        return;
      }

      const tabActiveLeftValue = await this.getElementLeftValue(
        `#easy-wx-elevator-${activeKey}`
      );
      if (tabActiveLeftValue === null) {
        return;
      }

      this.setData({
        sliderLeftValue:
          this.px2rpx(tabActiveLeftValue) - this.data.sliderWidth / 2,
        activeKey,
      });
    },

    async handleScrollTo(anchor) {
      this.isJumping = true;
      if (!anchor) {
        return (this.isJumping = false);
      }

      wx.pageScrollTo({
        selector: anchor,
        duration: 300,
      });

      setTimeout(() => {
        this.isJumping = false;
      }, 400);
    },

    getElementLeftValue(selector) {
      return new Promise((resolve) => {
        wx.createSelectorQuery()
          .in(this)
          .select(selector)
          .boundingClientRect(function (rect) {
            if (rect?.width && rect?.left) {
              const { width = 0, left = 0 } = rect;
              resolve(left + width / 2);
            } else {
              resolve(null);
            }
          })
          .exec();
      });
    },

    px2rpx(pixel) {
      const { screenWidth } = wx.getSystemInfoSync();
      return (pixel / screenWidth) * 750;
    },

    handlePageScroll(_) {
      this.handleHideElevator()
    },

    handleHideElevator() {
      if (!this.properties.needHide) {
        return;
      }

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (!this.data.isShow) {
        this.setData({ isShow: true });
      }
      this.timer = setTimeout(() => {
        this.setData({ isShow: false });
      }, this.properties.timerKeepOn || 2000);
    },
  },

  observers: {
    "dataSource,defaultActiveKey"(dataSource, defaultActiveKey) {
      if (!dataSource.length) {
        return this.setData({ isShow: false })
      }
      this.anchorList = dataSource.map(({ anchor }) => ({
        anchor,
      }));

      setTimeout(() => {
        const { anchor } =
          dataSource.find(({ key }) => defaultActiveKey === key) || {};
        this.handleScrollTo(anchor);
      }, 0);

      setTimeout(() => {
        this.setData({ isShowSlider: true })
      }, 200);
    },
  },
});
