Page({
  data: {},
  onLoad() {
    let sevenDays = []
      for (let i = 0; i < 8; i++) {
        sevenDays.push({
          day: '星期一',
          date: '2019-04-17',
          temp: '1-2',
          icon: '/image/sunny-icon.png',
        })
      }
    this.setData({
      sevenDays: sevenDays,
    })
  }
})