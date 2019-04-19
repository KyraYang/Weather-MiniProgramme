const weekDayMap = ['星期天','星期一', '星期二', '星期三', '星期四','星期五','星期六']
Page({
  data: {
    city: '广州市'
  },
  onLoad(option) {
    this.setData({
      city: option.city
    })
    this.getNow()
  },
  onPullDownRefresh() {
    this.getNow(wx.stopPullDownRefresh())
  },
  getNow(callBack) {
    let today = new Date()
    let timestamp = today.getTime()
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        time:timestamp,
        city: this.data.city
      },
      success: res => {
        let result = res.data.result
        console.log(result[0])
        console.log(this.data.city)
        this.getForecast(result, today)
      },
       complete: () => {
        callBack && callBack()
      }
    })
   
  },
  getForecast(result, today) {
    let sevenDays = []
    let todayDay = today.getDay()
    for (let i = 0; i < 7; i++) {
      sevenDays.push({
        day: weekDayMap[(todayDay + i) % 7],
        date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + + i}`,
        temp: `${result[i].minTemp}° - ${result[i].maxTemp}°`,
        icon: '/image/' + result[i].weather + '-icon.png',
      })
    }
    sevenDays[0].day = '今天'
    this.setData({
      sevenDays: sevenDays,
    })
  }
})