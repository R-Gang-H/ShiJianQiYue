Page({
    data: {
      list:[{
        'author': '萌兔子QAQ1111',
        'info': '我发现萌兔子,真的好帅!',
        'praise': "../../images/a.mp3",
        'isData': true,
        "action": {
          method: 'pause'
        }
      },
      {
        'author': '萌兔子QAQ2222',
        'info': '我发现萌兔子,真的好帅!',
        'praise': "../../images/b.mp3",
        'isData': true,
        "action": {
          method: 'pause'
        }
      },
      {
        'author': '萌兔子QAQ3333',
        'info': '我发现萌兔子,真的好帅!',
        'praise': "../../images/a.mp3",
        'isData': true,
        "action": {
          method: 'pause'
        }
      },
      {
        'author': '萌兔子QAQ44444',
        'info': '我发现萌兔子,真的好帅!',
        'praise': "../../images/b.mp3",
        'isData': true,
        "action": {
          method: 'pause'
        }
      }],

      

    },
  audioPlay: function (e) {
    var index = e.currentTarget.dataset.curindex;
    var _index = e.currentTarget.dataset.id
    this.setData({
      _index: _index,
      index: index
    })
    // var that=this;
    if (this.data.list[index]) {
    var audioContext = wx.createAudioContext("myAudio" + _index)
      var hasChange = this.data.list[index].isData;
      // console.log(hasChange)
      if (hasChange !== undefined) {
        // var onum = this.data.list[index].praise;
        // console.log("11",onum)
        if (hasChange) {
          // this.data.list[index].praise = (onum - 1);
          this.data.list[index].isData = false;

          audioContext.play();
          // this.data.list[index].action.method = play;
        } else {
          // this.data.list[index].praise = (onum + 1);
          this.data.list[index].isData = true;

          audioContext.pause();
        }
        this.setData({
          list: this.data.list
        })
      }
    }
  }
})