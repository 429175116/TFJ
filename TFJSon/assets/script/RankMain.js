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
                            var blockPrefab = this.content.getChildByName('block');
                            if (blockPrefab) {
                                // 删除原有列表
                                blockPrefab.destroy();
                            }
                            for (let i = 0; i < res.data.length; i++) {
                                let friendInfo = res.data[i];
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
        let scoreData = user.KVDataList[0].value;
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
    }

});
