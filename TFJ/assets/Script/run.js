cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        wx.showShareMenu({
            withShareTicket: true,
        });
        //监听右上角的分享调用 
        // cc.loader.loadRes("texture/startBg",function(err,data){
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
        // });
        // 手机点击事件
        // this.node.on('touchstart', function ( event ) {
        //     // 场景切换--进入关卡选择场景
        //     // cc.director.loadScene("LevelList");
        //     cc.director.loadScene("GameScene0");
        // });

    },
// backgroundColor: '#ff0000',
    start () {
        // 获取用户信息按钮生成
        this.getUserInfoButton();
        // this.getcode();
        // this.sendHttpGet();
        // this.sendHttpPost();
    },

    // update (dt) {},
    getUserInfoButton() {
        var sysInfo = wx.getSystemInfoSync();
        var button = wx.createUserInfoButton({
            type: 'image',
            // text: '获取用户信息',
            image: 'http://ac.beaconway.cn/uploads/images/run.png',
            style: {
                left: sysInfo.windowWidth / 4,
                top: sysInfo.windowHeight / 4 * 3,
                width: sysInfo.windowWidth / 4 * 2,
                height: sysInfo.windowWidth / 4 * 2 / 3,
                lineHeight: sysInfo.windowWidth / 4 * 2 / 3,
                color: '#ffffff',
                // backgroundColor: '#ff0000',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: sysInfo.windowWidth / 4 * 2 / 3 / 2,
            }
        })
        button.show();
        button.onTap( res => {
            var userInfo = res.userInfo;
            wx.login({
                success: res2 => {
                    var code = res2.code;
                    window.userInfo = userInfo;
                    this.updateUserInfo(userInfo, code, button);
                }
            })
        })
    },
    // 获取code
    // getcode(){
    //     wx.login({
    //         success(res){
    //             console.log('-----------------')
    //             console.log(res)
    //         }
    //     })
    // },
    // 提交用户信息
    updateUserInfo(userInfo, code, button) {
        // 隐藏授权/获取用户信息按钮
        button.hide();
        cc.director.loadScene("GameScene0");
        // var self = this;
        // var request = cc.loader.getXMLHttpRequest();
        // var url = `http://hongbao?code=${code}&nickName=${userInfo.nickName}&avatarUrl=${userInfo.avatarUrl}`;
        // console.log(url)
        // url = "http://localhost:3000"
        // request.open("POST", url, true);
        // // header设置
        // request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        // request.onreadystatechange = () => {
        //     if (request.readyState == 4 && (request.status >= 200 && request.status < 300)) {
        //         var response = request.responseText;
        //         console.log('POST');
        //         console.log(response);
        //         var responseJson = JSON.parse(response);
        //         // 获取关卡数据信息
        //         window.levelList = responseJson["data"];
        //         window.userInfo = responseJson["data"];
        //         // 隐藏授权/获取用户信息按钮
        //         button.hide();
        //         // 进入关卡选择场景
        //         cc.director.loadScene("LevelList");
        //     }
        // }
        // request.send();
    },
    // GET实例(不参与调用执行)
    sendHttpGet() {
        var self = this;
        var request = cc.loader.getXMLHttpRequest();
        var url = 'https://hongbao.test/api/activity/store';
        // var formData = new FormData();
        // formData.append("serialnumber", 111111);
        request.open("GET", url, true);
        // header设置
        request.setRequestHeader('mingzi0', '111');
        request.setRequestHeader('mingzi1', '222');
        request.setRequestHeader('mingzi2', '333');
        request.onreadystatechange = () => {
            if (request.readyState == 4 && (request.status >= 200 && request.status < 300)) {
                var response = request.responseText;
                console.log('get');
                console.log(response);
                var responseJson = JSON.parse(response);
                self.httpGetRes.String = responseJson["headers"]["Accept-Encoding"]
            }
        }
        request.send();
    },
    // POST实例(不参与调用执行)
    sendHttpPost() {
        var self = this;
        var request = cc.loader.getXMLHttpRequest();
        var url = 'http://hongbao.test/api/activity/store';
        request.open("POST", url, true);
        
        // header设置
        // request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        request.setRequestHeader('mingzi0', '111');
        request.setRequestHeader('mingzi1', '222');
        request.setRequestHeader('mingzi2', '333');
        request.onreadystatechange = () => {
            if (request.readyState == 4 && (request.status >= 200 && request.status < 300)) {
                var response = request.responseText;
                console.log('POST');
                console.log(response);
                var responseJson = JSON.parse(response);
                self.httpGetRes.String = responseJson["data"];
            }
        }
        request.send(new Uint8Array(1,2,3));
    },
});
