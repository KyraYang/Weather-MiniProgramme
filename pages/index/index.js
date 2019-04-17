const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}
Page({
  data: {
    nowTemp: '14',
    nowWeather: 'Sunny',
    bgUrl: '/image/sunny-bg.png',
    forecast:[],
  },
  onLoad(){
    this.getNow()
  },
  onPullDownRefresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    })
  },
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now?city=北京市',
      data: {
       city:'北京市'
      },
      header: {
        'content-type': 'application/json'
      },
      success: res =>{
        let result = res.data.result
        this.setNow(result)
        this.setHourly(result)
        
      },
      complete: ()=>{
        callback && callback()
      }
    })
  },
  setNow(result){
    let temp = result.now.temp
    let weather = result.now.weather
    let forecastArray = result.forecast
    console.log(result),
      this.setData({
        nowTemp: temp + '°',
        nowWeather: weatherMap[weather],
        bgUrl: '/image/' + weather + '-bg.png',
      })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  setHourly(result){
    //set forecast
    let forecast = []
    let nowHour = new Date().getHours()
    for (let i = 0; i < 8; i++) {
      forecast.push({
        time: (i * 3 + nowHour) % 24 + '时',
        iconPath: '/image/' + result.forecast[i].weather + '-icon.png',
        temp: result.forecast[i].temp,
      })
    }
    forecast[0].time = '现在',
      this.setData({
        forecast: forecast,
      })
  }
})