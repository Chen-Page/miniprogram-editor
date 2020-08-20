let upload = (src) => {
  // 模拟上传图片到服务器
  return new Promise(resolve => {
    setTimeout(() => {
      // 服务器返回网络图片路径
      src = 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
      resolve(src)
    }, 500)
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  uploadRichText () {
    let t = this
    let customEditor = this.selectComponent('#customEditor')
    let reg1 = /^http:\/\/tmp/
    let reg2 = /^wxfile:\/\//
    customEditor.getContents({
      success (res) {
        console.log('获取富文本成功', res)
        let delta = res.delta
        let localFileList = []
        let localFileIndexList = []
        for (let i in delta.ops) {
          if (delta.ops[i].insert && delta.ops[i].insert.image) {
            let img = delta.ops[i].insert.image
            if (reg1.test(img) || reg2.test(img)) {
              localFileList.push(img)
              localFileIndexList.push(i)
            }
          } 
        }
        if (localFileList.length != 0) {
          let uploadList = []
          for (let i in localFileList) {
            uploadList.push(upload(localFileList[i]))
          }
          Promise.all(uploadList).then((res) => {
            console.log('上传图片完成', res)
            for (let i in delta.ops) {
              if (localFileIndexList.includes(i)) {
                delta.ops[i].insert.image = res.shift()
              }
            }
            customEditor.setContents({
              delta
            })
            customEditor.getContents({
              success (res) {
                console.log('重置富文本成功', res)
                t.submit(res)
              }
            })
          })
        } else {
          console.log('无需上传图片')
          t.submit(res)
        }
      }
    })
  },

  submit (e) {
    // 上传最终内容
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})