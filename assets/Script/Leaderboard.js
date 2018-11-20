
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log('getFriendCloudStorage');
        wx.getFriendUserGameData({
            keyList:["score"],
            success:res=> {
                console.log("getFriendUserGameData:",res);
            },
            fail:res=>{
                console.log("getFriendUserGameData fail:",res);
            }
        });
        // wx.getFriendCloudStorage({
        //     keyList: ['thisGrade', 'DevouringGrade', 'time'], // 你要获取的、托管在微信后台都key
        //     // keyList: ['score'], // 你要获取的、托管在微信后台都key
        //     success: res => {
        //         console.log(res.data);
        //     }
        // });
        
    },

    start () {

    },

    // update (dt) {},
});
