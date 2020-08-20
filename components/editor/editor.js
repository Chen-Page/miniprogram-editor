// components/editor/editor.js
const request = require('../../request')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '开始输入...'
    },
    readOnly: {
      type: Boolean,
      value: false
    },
    editorHeight: {
      type: String,
      value: '300'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    formats: {},
    keyboardHeight: 0,
    isIOS: false,
    defaultColorList: [
      "#000000",
      "#ffffff",
      "#888888",
      "#09bb07",
      "#e64340",
      "#576b95",
      "#c732b1",
      "#f7ff00",
      "#0000ff",
      "#ff4d00",
      "#00ffb7",
      "#ff6bf0"
    ],
    colorModal: false,
    customColor: '',
    previewColor: "#333333",
    colorModalType: ''
  },
  lifetimes: {
    attached () {
      const platform = wx.getSystemInfoSync().platform
      const isIOS = platform === 'ios'
      this.setData({ isIOS})
      const that = this
      this.updatePosition(0)
      let keyboardHeight = 0
      wx.onKeyboardHeightChange(res => {
        console.log(res)
        if (res.height === keyboardHeight) return
        const duration = res.height > 0 ? res.duration * 1000 : 0
        keyboardHeight = res.height
        setTimeout(() => {
          wx.pageScrollTo({
            scrollTop: 0,
            success() {
              that.updatePosition(keyboardHeight)
              that.editorCtx.scrollIntoView()
            }
          })
        }, duration)
      })
    },
    detached () {}
  },
  /**
   * 组件的方法列表
   */
  methods: {
    updatePosition(keyboardHeight) {
      // const toolbarHeight = 50
      // const { windowHeight, platform } = wx.getSystemInfoSync()
      // let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
      this.setData({
        // editorHeight,
        keyboardHeight
      })
    },
    calNavigationBarAndStatusBar() {
      const systemInfo = wx.getSystemInfoSync()
      const { statusBarHeight, platform } = systemInfo
      const isIOS = platform === 'ios'
      const navigationBarHeight = isIOS ? 44 : 48
      return statusBarHeight + navigationBarHeight
    },
    onEditorReady() {
      const that = this
      this.createSelectorQuery().select('#editor').context(function (res) {
        that.editorCtx = res.context
      }).exec()
    },
    blur() {
      this.editorCtx.blur()
    },
    format(e) {
      let { name, value } = e.target.dataset
      if (!name) return
      // console.log('format', name, value)
      this.editorCtx.format(name, value)
  
    },
    onStatusChange(e) {
      const formats = e.detail
      this.setData({ formats })
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          console.log('insert divider success')
        }
      })
    },
    redo () {
      this.editorCtx.redo({
        fail (err) {
          console.log('redo Error', err)
          wx.showToast({
            title: '失败',
            icon: 'none'
          })
        }
      })
    },
    undo () {
      this.editorCtx.undo({
        fail (err) {
          console.log('undo Error', err)
          wx.showToast({
            title: '撤销失败',
            icon: 'none'
          })
        }
      })
    },
    clear() {
      this.editorCtx.clear({
        success: function (res) {
          console.log("clear success")
        }
      })
    },
    setContents (e) {
      this.editorCtx.setContents(e)
    },
    removeFormat() {
      this.editorCtx.removeFormat()
    },
    insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.editorCtx.insertText({
        text: formatDate
      })
    },
    insertImage() {
      const that = this
      wx.showActionSheet({
        itemList: ['本地图片', '网络图片'],
        success (res) {
          if (res.tapIndex == 0) {
            wx.chooseImage({
              count: 1,
              success: function (res) {
                that.editorCtx.insertImage({
                  src: res.tempFilePaths[0],
                  alt: 'localImage',
                  data: {
                    type: 'localImage'
                  },
                  width: '80%',
                  success: function () {
                    console.log('insert image success')
                  }
                })
              }
            })
          } else {
            request.chooseImage().then((src) => {
              that.editorCtx.insertImage({
                src: src,
                alt: 'onlineImage',
                data: {
                  type: 'onlineImage'
                },
                width: '80%',
                success: function () {
                  console.log('insert image success')
                }
              })
            })
          }
        }
      })
    },
    getContents (e = {}) {
      this.editorCtx.getContents({
        success (res) {
          if (e.success) {
            e.success(res)
          }
        },
        fail (err) {
          if (e.fail) {
            e.fail(err)
          }
        },
        complete (res) {
          if (e.complete) {
            e.complete(res)
          }
        }
      })
    },
    getSelectionText (e = {}) {
      this.editorCtx.getSelectionText({
        success (res) {
          if (e.success) {
            e.success(res)
          }
        },
        fail (err) {
          if (e.fail) {
            e.fail(err)
          }
        },
        complete (res) {
          if (e.complete) {
            e.complete(res)
          }
        }
      })
    },
    chooseBackgroundColor () {
      // 变更背景颜色
      this.setData({
        colorModal: true,
        colorModalType: 'background'
      })
    },
    chooseTextColor () {
      // 变更文字颜色
      this.setData({
        colorModal: true,
        colorModalType: 'text'
      })
    },
    changeColor (e) {
      let color = e.currentTarget.dataset.color
      this.setData({
        previewColor: color
      })
    },
    input (e) {
      let value = e.detail.value
      let name = e.currentTarget.dataset.name
      this.setData({
        [name]: value
      })
    },
    customColor (e) {
      let color = this.data.customColor
      let reg = /^#([a-fA-F\d]{6}|[a-fA-F\d]{3})$/
      if (!reg.test(color)) {
        wx.showToast({
          title: '颜色格式错误',
          icon: 'none'
        })
        return
      } else {
        this.setData({
          previewColor: color
        })
      }
    },
    colorCancel () {
      this.resetColorModal()
    },
    colorConfirm () {
      let color = this.data.previewColor
      if (this.data.colorModalType == 'text') {
        this.editorCtx.format('color', color)
      } else if (this.data.colorModalType == 'background'){
        this.editorCtx.format('backgroundColor', color)
      }
      this.resetColorModal()
    },
    resetColorModal () {
      this.setData({
        customColor: '',
        previewColor: "#333333",
        colorModal: false,
        colorModalType: ''
      })
    }
  }
})
