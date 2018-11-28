
cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node,
        returnRun: {
            default: null,
            type: cc.Node,
            displayName: '返回',
        },
    },

    start () {
        wx.showShareMenu({
            withShareTicket: true,
        });
        //监听右上角的分享调用 
        wx.onShareAppMessage(function(res){
            return {
                title: "不怕，就来PK！",
                imageUrl: 'https://img2018.cnblogs.com/news/24442/201811/24442-20181116205423366-85420768.jpg',
                success(res){
                    console.log("转发成功!!!")
                    // common.diamond += 20;
                },
                fail(res){
                    console.log("转发失败!!!")
                } 
            }
        })
    },
    onLoad () {
        // 返回
        this.returnRun.on('touchend', (e) => {
            cc.director.loadScene("GameScene0");
        });
        // wx.postMessage({ message: window.time },{ windowTime: 20});
    },
});
