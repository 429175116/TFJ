
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
                imageUrl: 'http://ac.beaconway.cn/uploads/images/startBg.jpg',
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
