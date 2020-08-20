const imgUrl = 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png' // 模拟的从服务器返回的图片

let upload = (src) => {
  // 模拟上传图片到服务器
  return new Promise(resolve => {
    setTimeout(() => {
      // 上传完成后服务器返回网络图片路径
      src = imgUrl
      resolve(src)
    }, 500)
  })
}

let chooseImage = () => {
  // 模拟一些延时操作，在小程序中展示并选择网络图片
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(imgUrl)
    }, 500)
  })
}

module.exports = {
  upload,
  chooseImage
}