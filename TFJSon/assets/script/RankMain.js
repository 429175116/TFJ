cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        prefab: cc.Prefab
    },

    start () {
        wx.onMessage( data => {
            window.windowTime = data.message;
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                lang: 'zh_CN',
                success: (res) => {
                    this.userInfo = res.data[0];
                    wx.getFriendCloudStorage({
                        keyList: ['time'],
                        success: res => {
                            let dom = this.content.children;
                            // 删除原有列表中的元素
                            for (let i = 0;i < dom.length;i++) {
                                dom[i].destroy();
                            }
                            // 列表排序
                            let listData = this.dataSort(res.data);
                            // return
                            for (let i = 0; i < listData.length; i++) {
                                let friendInfo = listData[i];
                                if (!friendInfo) {
                                    this.createPrefab();
                                    continue;
                                }
                                // 生成列表，渲染
                                this.createUserBlock(friendInfo, i+1);
                            }
                        },
                        fail: function (res) {
                            console.error(res);
                        }
                    });
                },
                fail: (res) => {
                    reject(res);
                }
            });
        });
    },
    onLoad () {

    },
    createUserBlock (user, rankingData) {
        let node = this.createPrefab();
        let nickName = user.nickName ? user.nickName : user.nickname;
        let avatarUrl = user.avatarUrl;
        let scoreData = user.KVDataList[0].value + '分';
        let ranking = node.getChildByName('ranking').getComponent(cc.Label);
        let score = node.getChildByName('score').getComponent(cc.Label);
        let userName = node.getChildByName('userName').getComponent(cc.Label);
        let userIcon = node.getChildByName('mask').children[0].getComponent(cc.Sprite);
        ranking.string = rankingData;
        score.string = scoreData;
        userName.string = nickName;
        console.log(nickName + '\'s info has been getten.');
        cc.loader.load({
            url: avatarUrl, type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            userIcon.spriteFrame = new cc.SpriteFrame(texture);
        });                   
    },

    createPrefab () {
        let node = cc.instantiate(this.prefab);
        node.parent = this.content;
        return node;
    },
    
    // 排行榜数据排序
    dataSort (data) {
        data.sort(this.sortId);
        return data;
        // for(var j=0;j<data.length-1;j++){
        // //两两比较，如果前一个比后一个大，则交换位置。
        //     for(var i=0;i<data.length-j-1;i++){
        //         console.log(data[i].KVDataList[0].value, data[i+1].KVDataList[0].value)
        //         if(data[i].KVDataList[0].value < data[i+1].KVDataList[0].value) {
        //             var temp = data[i];
        //             data[i] = data[i+1];
        //             data[i+1] = temp;
        //         }
        //     }

        //     // console.log(data)
        // }
        // return data;
    },
    sortId(a,b){  
        return b.KVDataList[0].value - a.KVDataList[0].value
     }
});
