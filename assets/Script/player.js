// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        bg1: {
            default: null,
            type: cc.Node,
            displayName: '背景节点1',
        },
        bg2: {
            default: null,
            type: cc.Node,
            displayName: '背景节点2',
        },
        // joystick: {
        //     default: null,
        //     type: cc.Node,
        //     displayName: '摇杆节点',
        // },
        Prefab: {
            default: null,
            type: cc.Prefab,
            displayName: '障碍物节点',
        },
        playagain: {
            default: null,
            type: cc.Node,
            displayName: '死亡',
        },
        mask: {
            default: null,
            type: cc.Node,
            displayName: '蒙板',
        },
        diedAudio: {
            default: null,
            type: cc.AudioClip,
            displayName: '音效',
        },
        playGrade: {
            default: 1,
            displayName: '玩家等级',
        },
        DevouringGrade: {
            default: 3,
            displayName: '吞噬等级',
        },
        upAttr: {
            default: null,
            type: cc.Node,
            displayName: '升级攻击/血量',
        },
        upLife: {
            default: null,
            type: cc.Node,
            displayName: '升级血量',
        },
        lifeShow: {
            default: null,
            type: cc.Label,
            displayName: '血量',
        },
        timeData: {
            default: null,
            type: cc.Label,
            displayName: '时间',
        },
        // upAttack: {
        //     default: null,
        //     type: cc.Node,
        //     displayName: '升级攻击',
        // },
        score:0, // 分数
        life: 10, // 生命值
        getLift: 10, // 升级增加的血量
        attack: 10, // 攻击值
        getAttack: 10, // 升级增加的攻击
        modulus: 10, // 吞噬升级系数
        usedDevouringScore: 0, // 
    },

    // LIFE-CYCLE CALLBACKS:
    // touchstart 点击
    // touchmove 滑动
    // touchend 离开
    onLoad () {
        
        // 拿到碰撞管理器
        let manager = cc.director.getCollisionManager();
        // 发生碰撞请告诉我
        manager.enabled = true;
        // 显示轮廓
        // manager.enabledDebugDraw = true;
        // 获取动画
        this.animationComponent = this.getComponent(cc.Animation);
        // 点击事件
        // this.node.on('touchmove', (e) => {
        //     this.node.position = this.node.parent.convertToNodeSpaceAR(e.getLocation())
        // })
        // this.ShowScore = setInterval(() => {
        //     this.getScore()
        // }, 1000);
        
        this.upLife.on('touchstart', (e) => {
            // 升级血量
            if (window.points <= 0) {
                return
            }
            this.life += this.getLift;
            window.life = this.life;
            this.lifeShow.string = window.life;
            window.points -= 1;
            if (window.points <= 0) {
                window.upAttrActive = false;
            }
            // 发送请求
        });
        // this.upAttack.on('touchstart', (e) => {
        //     // 升级攻击
        //     if (window.points <= 0) {
        //         return
        //     }
        //     this.attack += this.getAttack;
        //     window.attack = this.attack;
        //     window.points -= 1;
        //     if (window.points <= 0) {
        //         window.upAttrActive = false;
        //     }
        //     // 发送请求
        // });
    },

    // 死亡控制
    died() {
        // // 控制摇杆隐藏
        // this.joystick.active = false;
        this.animationComponent.play('play');
        var that = this;
        console.log("window.time-------------"+ window.time);
        cc.sys.localStorage.setItem("windowTime",window.time);
        let time = cc.sys.localStorage.getItem("windowTime");
        
        console.log("----------cc.sys.localStorage.getItem-----------"+time);
        time = parseInt(time);
        console.log(time)
        
        // 本次游戏分数大于之前的最高分，则替换之前的最高分
        if (window.time > time) {
            // 提交分数
            this.updatraScore();
        }
        // 显示游戏失败
        that.playagain.active = true;
        // 蒙板
        that.mask.active = true; 
    },
    // // 提交用户信息
    // updateInfo(userInfo, code) {
    //     // 隐藏授权/获取用户信息按钮
    //     button.hide();
    //     var self = this;
    //     var request = cc.loader.getXMLHttpRequest();
    //     var url = `http://hongbao?code=${code}&nickName=${userInfo.nickName}&avatarUrl=${userInfo.avatarUrl}`;
    //     console.log(url)
    //     request.open("POST", url, true);
    //     // header设置
    //     request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    //     request.onreadystatechange = () => {
    //         if (request.readyState == 4 && (request.status >= 200 && request.status < 300)) {
    //             var response = request.responseText;
    //             console.log('POST');
    //             console.log(response);
    //             var responseJson = JSON.parse(response);
    //             // 获取关卡数据信息
    //             window.levelList = responseJson["data"];
    //             window.userInfo = responseJson["data"];
    //             // 隐藏授权/获取用户信息按钮
    //             button.hide();
    //             // 进入关卡选择场景
    //             cc.director.loadScene("LevelList");
    //         }
    //     }
    //     request.send();
    // },
    // 排行榜信息存储
    updatraScore() {
        // wx.postMessage({ message: "friendRank" },{ windowTime: 20}); //通知子域运行场景friendRank
        wx.postMessage({ message: window.time },{ windowTime: 20}); //通知子域运行场景friendRank
        // 玩家等级thisGrade;
        // 吞噬等级DevouringGrade;
        // 吞噬等级time(游戏时间，用于计算分数);
        // 保存玩家等级,吞噬等级,时间(用于排行榜)
        // 开放数据获取的为最后存储的数据，所以此处加入判断，给本机存入最高分，当前分数超越最高分则存入开放数据，不超过则不保存
        cc.sys.localStorage.setItem("windowTime",window.time);
        wx.setUserCloudStorage({
            KVDataList: [{ key: 'time', value: `${window.time}` }],
            // KVDataList: [{ key: 'thisGrade', value: `${window.thisGrade}` },{ key: 'DevouringGrade', value: `${window.DevouringGrade}` },{ key: 'time', value: `${window.time}` }],
            success: res => {
                console.log(res);
                console.log('-------------------');
                // cc.director.loadScene("Rank");
                // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
                // let openDataContext = wx.getOpenDataContext();
                // console.log(openDataContext)
                // // openDataContext.postMessage({
                // //     type: 'updateMaxScore',
                // //     // friendRank
                // // });
                // console.log("排行榜通知子域：friendRank");
                // wx.postMessage({ message: "friendRank" }); //通知子域运行场景friendRank
                // cc.director.loadScene("Rank");
            },
            fail: res => {
                console.log(res);
            }
        });
    },
    // 获取分数
    // getScore() {
    //     this.score += 1;
    //     this.scoreDisplay.string = this.score;
    // },
    // 对方的组件other
    // 当前组件self
    // 碰撞开始
    onCollisionEnter(other, self) {
        // other 障碍物
        // self 玩家
        // 获取other节点:other.node
        // 获取self节点:self = this.getComponent(cc.xxx);
        // console.log(other)
        // console.log(self)
        // 如果玩家等级大于障碍物等级，则吃掉障碍物
        if (self.node.DevouringGrade > other.node.grade) {
            // 删除节点
            other.node.destroy();
            // 执行吞噬动画
            this.animationComponent.play('devouring');
            // 计算吞噬经验(+=障碍物生命值)
            window.time += Math.round(other.node.obstacleLife * window.time / 50);
            this.timeData.string = window.time;
            // window.DevouringScore += other.node.obstacleLife;
            // let experience = window.DevouringScore - this.usedDevouringScore;
            // console.log(window.DevouringScore,other.node.obstacleLife,experience)
            // // 提升吞噬等级
            // this.upDevouringGrade(experience)
            return
        } else if (self.node.DevouringGrade == other.node.grade) {
            // 等级相同，则不做处理
            return
        }
        // 执行掉血动画
        this.animationComponent.play('play');
        // 等级低于障碍物，则掉血
        let attackPower = other.node.attackPower;
        // 生命值减攻击力
        this.life -= attackPower;
        window.life = this.life;
        // 生命消耗完则死亡
        if (this.life <= 0) {
            // 你死啦
            this.died();
            // 播放死亡音效
            cc.audioEngine.playEffect(this.diedAudio, false);
        }
    },
    update() {
        
    },
    // // 碰撞中，未分开则持续调用
    // onCollisionStay(other, self) {
    //     console.log('在作死的路上越走越远')
    // },
    // // 碰撞结束(分离)
    // onCollisionExit(other, self) {
    //     console.log('你死透了')
    // },
    start () {
        // 存在关卡,信息需要传递
        // 初始化全局吞噬等级
        if (!window.DevouringGrade) {
            // 如果不存在全局吞噬等级,则赋给最低的吞噬等级
            window.DevouringGrade = this.DevouringGrade;
            this.node.DevouringGrade = this.DevouringGrade;
        } else {
            this.node.DevouringGrade = window.DevouringGrade;
        }
        // 初始化吞噬经验
        if (!window.DevouringScore) {
            // 如果不存在全局吞噬经验,则赋给0
            window.DevouringScore = 0;
        }
        // 初始生命
        if (!window.life) {
            window.life = this.life;
        }
        // 初始攻击
        if (!window.attack) {
            window.attack = this.attack;
        }
    },
    // 提升吞噬等级
    upDevouringGrade(experience) {
        // 升级经验为：当前等级乘以系数
        this.upgradeNeed = window.DevouringGrade * this.modulus;
        if (experience >= this.upgradeNeed) {
            // 获取经验差距
            this.usedDevouringScore = window.DevouringScore;
            // 吞噬等级+=1
            window.DevouringGrade += 1;
            this.node.DevouringGrade = window.DevouringGrade;
        }
    },
});
