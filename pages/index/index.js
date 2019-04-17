Page({
  onLoad(){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now?city=广州市',
      data: {
       city:'广州市'
      },
      header: {
        'content-type': 'application/json'
      },
      success: res =>{
        let result = res.data.result
        let temp = result.now.temp
        let weather = result.now.weather
        return temp, weather
      },
    })
  },
  data: {
    nowTemp: '14',
    nowWeather: 'Sunny',
  },
})