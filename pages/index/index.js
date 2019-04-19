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
// 引入SDK核心类
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2



Page({
  data: {
    nowTemp: '14',
    nowWeather: 'Sunny',
    bgUrl: '/image/sunny-bg.png',
    forecast: [],
    todayTemp: '5-6',
    nowDate: '',
    city: '广州市',
    locationAuthType: UNPROMPTED
  },
  //启动load
  onLoad() {
    this.qqmapsdk = new QQMapWX({
      key: 'X76BZ-HPPKX-5ZP4Z-ZGO4C-QY6KF-APFYE' // 必填
    })
    wx.getSetting({
      success: res => {
        let auth = res.authSetting['scope.userLocation']
        let locationAuthType = auth ? AUTHORIZED:(auth === false)? UNAUTHORIZED:UNPROMPTED
        this.setData({
          locationAuthType: locationAuthType,
        })
        if (auth){
          this.getLocationAndWeather()
        }else {
          this.getNow()
        }
      },
      fail: ()=>{
        this.getNow()
      }
    })
  },
  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  },
  //点击跳转7天预告页面
  onTapWeatherDetail() {
    wx.navigateTo({
      url: '/pages/list/list?city=' + this.data.city,
    })
  },
  //点击获取当前地点
  onTapLocation() {
    this.getLocationAndWeather()
  },
  getLocationAndWeather() {
    wx.getLocation({
      success: res => {
        this.setData({
          locationAuthType: AUTHORIZED,
        })
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            let city = res.result.address_component.city
            this.setData({
              city: city,
            })
            this.getNow()
          },
        })
      },
      fail: () => {
        this.setData({
          locationAuthType: UNAUTHORIZED,
        })
      }
    })
  },
  //获取weather API信息
  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        let result = res.data.result
        this.setNow(result)
        this.setHourly(result)
        this.setDetail(result)
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  //设置现在天气情况
  setNow(result) {
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
  //设置未来24小时天气情况
  setHourly(result) {
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
  },
  //今天日期与天气（跳转栏）
  setDetail(result) {
    let date = new Date()
    let minTemp = result.today.minTemp
    let maxTemp = result.today.maxTemp
    this.setData({
      nowDate: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 今天`,
      todayTemp: `${minTemp}° - ${maxTemp}° `
    })
  }
})