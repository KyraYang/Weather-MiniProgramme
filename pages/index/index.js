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
    bgUrl: '/image/sunny-bg.png'
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
        let temp = result.now.temp
        let weather = result.now.weather
        console.log(result),
        this.setData({
          nowTemp: temp +'°',
          nowWeather: weatherMap[weather],
          bgUrl:'/image/' + weather + '-bg.png',
        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        })
      },
      complete: ()=>{
        callback && callback()
      }
    })
  },
  
})