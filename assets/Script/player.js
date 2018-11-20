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
        joystick: {
            default: null,
            type: cc.Node,
            displayName: '摇杆节点',
        },
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
        upAttack: {
            default: null,
            type: cc.Node,
            displayName: '升级攻击',
        },
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
        manager.enabledDebugDraw = true
        // 点击事件
        this.node.on('touchmove', (e) => {
            this.node.position = this.node.parent.convertToNodeSpaceAR(e.getLocation())
        })
        // this.ShowScore = setInterval(() => {
        //     this.getScore()
        // }, 1000);
        
        this.upLife.on('touchstart', (e) => {
            // 升级血量
            if (window.points <= 0) {
                return
            }
            this.life += this.getLift;
            window.life = this.life
            window.points -= 1;
            if (window.points <= 0) {
                window.upAttrActive = false;
            }
            // 发送请求
        });
        this.upAttack.on('touchstart', (e) => {
            // 升级攻击
            if (window.points <= 0) {
                return
            }
            this.attack += this.getAttack;
            window.attack = this.attack;
            window.points -= 1;
            if (window.points <= 0) {
                window.upAttrActive = false;
            }
            // 发送请求
        });
    },

    // 死亡控制
    died() {
        // 控制摇杆隐藏
        this.joystick.active = false;
        // 显示游戏失败
        this.playagain.active = true;


        // clearInterval(this.ShowScore);
        this.updatraScore();
        
    },
    updatraScore() {
        // 玩家等级thisGrade;
        // 吞噬等级DevouringGrade;
        // 吞噬等级time(游戏时间，用于计算分数);

        // 保存玩家等级,吞噬等级,时间(用于排行榜)
        wx.setUserCloudStorage({
            // KVDataList: [{ key: 'score', value: '10' }],
            KVDataList: [{ key: 'thisGrade', value: `${window.thisGrade}` },{ key: 'DevouringGrade', value: `${window.DevouringGrade}` },{ key: 'time', value: `${window.time}` }],
            success: res => {
                console.log(res);
                // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
                let openDataContext = wx.getOpenDataContext();
                openDataContext.postMessage({
                    type: 'updateMaxScore',
                });
            },
            fail: res => {
                console.log(res);
            }
        });
        // var KVDataList = [{ key: 'score', value: 50 }]
        // wx.setUserCloudStroage({
        //     // KVDataList: [{ key: 'score', value: 50 }],
        //     KVDataList,
        //     // KVDataList: [{ key: 'thisGrade', value: window.thisGrade },{ key: 'DevouringGrade', value: window.DevouringGrade },{ key: 'time', value: window.time }],
        //     success: res => {
        //         console.log(res);
        //         // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
        //         let openDataContext = wx.getOpenDataContext();
        //         openDataContext.postMessage({
        //             type: 'updateMaxScore',
        //         });
        //     }
        //     // ,
        //     // fail: res => {
        //     //     console.log(res);
        //     // }
        // });
        // wx.getFriendCloudStorage({
        //     // keyList: ['thisGrade', 'DevouringGrade', 'time'], // 你要获取的、托管在微信后台都key
        //     keyList: ['score'], // 你要获取的、托管在微信后台都key
        //     success: res => {
        //         console.log(res.data);
        //     }
        // });
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
            // 计算吞噬经验(+=障碍物生命值)

            window.DevouringScore += other.node.obstacleLife;
            let experience = window.DevouringScore - this.usedDevouringScore;
            console.log(window.DevouringScore,other.node.obstacleLife,experience)
            // 提升吞噬等级
            this.upDevouringGrade(experience)
            return
        } else if (self.node.DevouringGrade == other.node.grade) {
            // 等级相同，则不做处理
            return
        }
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
    // 碰撞中，未分开则持续调用
    onCollisionStay(other, self) {
        console.log('在作死的路上越走越远')
    },
    // 碰撞结束(分离)
    onCollisionExit(other, self) {
        console.log('你死透了')
    },
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
        // console.log(window.DevouringScore+'----')
        // 初始化吞噬经验
        if (!window.DevouringScore) {
            // 如果不存在全局吞噬经验,则赋给0
            window.DevouringScore = 0;
        }
        // console.log(window.DevouringScore+'----')
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
        // console.log(experience, this.upgradeNeed);
        if (experience >= this.upgradeNeed) {
            // 获取经验差距
            this.usedDevouringScore = window.DevouringScore;
            // 吞噬等级+=1
            window.DevouringGrade += 1;
            this.node.DevouringGrade = window.DevouringGrade;
            // console.log(this.node.DevouringGrade+'-----------')
        }
    },
});
