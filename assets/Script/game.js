cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node,
            displayName: '自己',
        },
        playagain: {
            default: null,
            type: cc.Node,
            displayName: '死亡',
        },
        again: {
            default: null,
            type: cc.Node,
            displayName: '再来一次',
        },
        // 炸弹资源
        bombPrefab: {
            default: null,
            type: cc.Prefab
        },
        groups_prefab: {
            default: [],
            type: cc.Prefab,
            displayName: '障碍物数组',
        },
        // joystick: {
        //     default: null,
        //     type: cc.Node,
        //     displayName: '摇杆节点',
        // },
        // scoreDisplay: {
        //     default: null,
        //     type: cc.Label,
        //     displayName: '分数',
        // },
        // gameOverScore: {
        //     default: null,
        //     type: cc.Label,
        //     displayName: '死亡分数',
        // },
        timeDataCon: {
            default: null,
            type: cc.Node,
            displayName: '时间容器',
        },
        timeData: {
            default: null,
            type: cc.Label,
            displayName: '时间',
        },
        upAttr: {
            default: null,
            type: cc.Node,
            displayName: '升级攻击/血量',
        },
        playDescription: {
            default: null,
            type: cc.Node,
            displayName: '玩法介绍',
        },
        playInfo: {
            default: null,
            type: cc.Node,
            displayName: '玩家信息',
        },
        mask: {
            default: null,
            type: cc.Node,
            displayName: '蒙板',
        },
        // goLeaderboard: {
        //     default: null,
        //     type: cc.Node,
        //     displayName: '进入排行榜',
        // },
        leftInfo: {
            default: null,
            type: cc.Label,
            displayName: '玩家生命值',
        },
        attackInfo: {
            default: null,
            type: cc.Label,
            displayName: '玩家攻击力',
        },
        pointsInfo: {
            default: null,
            type: cc.Label,
            displayName: '玩家技能点',
        },
        gradeInfo: {
            default: null,
            type: cc.Label,
            displayName: '玩家等级',
        },
        DevouringGrade: {
            default: null,
            type: cc.Label,
            displayName: '吞噬等级',
        },
        goleft: {
            default: null,
            type: cc.Node,
            displayName: '向左',
        },
        goright: {
            default: null,
            type: cc.Node,
            displayName: '向右',
        },
        groundY: 0,
        randomMinNum: 0,
        randomMaxNum: 0,
        time: 0, // 玩家存活时间
        usedTime: 0, // 使用过的时间
        upgradeNeed: 10, // 升级所需经验
        left: 10, // 初始生命
        thisGrade: 1, // 当前等级
        modulus: 5, // 升级经验系数
        points: 0, // 技能点
        // randomX: [-200,-50,100,150], // 技能点
    },


    onLoad () {
        // 分数初始化
        window.score = 0;
        
        // 启动时间定时器
        this.gettimes();
        // 获取障碍物偏移量
        this.randomX = [-220,-90,20,90,220]
        // this.randomMinNum = -this.node.width/2;
        // this.randomMaxNum = this.node.width/2;
        // touchstart 点击
        // touchend 离开
        // this.player.on('touchmove', (e) => {
        //     this.player.position = this.player.parent.convertToNodeSpaceAR(e.getLocation())
        // })
        
        // 用于开始游戏
        // this.player.on('touchstart', (e) => {
        this.node.on('touchstart', (e) => {
            // if (e.target.name != 'Canvas') {
            //     return;
            // }
            // 开始游戏
            this.gameStart(e);
        })
        // 用于暂停游戏
        // this.mode.on('touchend', (e) => {
        this.node.on('touchend', (e) => {
            // if (e.target.name != 'Canvas') {
            //     return;
            // }
            // 暂停游戏
            // this.gamePause();
        })
        this.playDescription.on('touchstart', (e) => {
            this.playDescription.active = false;
            // 控制摇杆隐藏
            // this.joystick.active = false;
        })
        
        this.again.on('touchstart', (e) => {
            this.playagain.active = true;
            window.gameStartStatus = false;
            // 再来一次
            cc.director.loadScene("GameScene0");
        })
        // // goLeaderboard
        // this.goLeaderboard.on('touchstart', (e) => {
        //     // 场景切换--进入排行榜
        //     cc.director.loadScene("Leaderboard");
        // })
        this.goleft.on('touchstart', (e) => {
            this.goLeftRun();
        })
        this.goright.on('touchstart', (e) => {
            this.goRightRun();
        })
        this.goleft.on('touchend', (e) => {
            this.stopLeftRun();
        })
        this.goright.on('touchend', (e) => {
            this.stopRightRun();
        })
    },
    goLeftRun() {
        clearInterval(this.playRun);   
        this.playRun = window.setInterval((e) => {
            if (this.player.x <= -this.node.width/2) {
                return;
            }
            this.player.x -= 10;
        }, 10);
    },
    stopLeftRun() {
        clearInterval(this.playRun);   
    },
    goRightRun() {
        clearInterval(this.playRun);   
        this.playRun = window.setInterval((e) => {
            if (this.player.x >= this.node.width/2) {
                return;
            }
            this.player.x += 10;
        }, 10);
    },
    stopRightRun() { 
        clearInterval(this.playRun);  
    },
    // 开始游戏
    gameStart(e) {
        if (this.playagain.active) {
            return;
        }
        // let location = e.getPreviousLocation();
        // this.joystick.x = location.x;
        // this.joystick.y = location.y;
        // this.joystick.active = true;
        this.playInfo.active = false;
        this.mask.active = false;
        // 游戏是否开启
        window.gameStartStatus = true;
    },
    // 暂停游戏
    gamePause() {
        if (this.playagain.active) {
            return;
        }
        window.gameStartStatus = false;
        // // 控制摇杆隐藏
        // this.joystick.active = false;
        // 显示生命值
        this.leftInfo.string = window.life;
        // 玩家攻击力
        this.attackInfo.string = window.attack;
        // 玩家技能点
        this.pointsInfo.string = window.points;
        // 玩家等级
        this.gradeInfo.string = window.thisGrade;
        // 吞噬等级
        this.DevouringGrade.string = window.DevouringGrade;
        // 人物信息隐藏
        this.playInfo.active = true;
        // 蒙板
        this.mask.active = true;
    },
    start() {
        // 初始游戏为暂停状态
        // window.gameStartStatus = false;
        // // 初始化等级
        // if (!window.thisGrade) {
        //     window.thisGrade = this.thisGrade;
        // }
        // // 初始化经验系
        // if (!window.modulus) {
        //     window.modulus = this.modulus;
        // }
        // // 初始化技能点
        // if (!window.points) {
        //     window.points = this.points;
        // }
        window.thisGrade = this.thisGrade;
        window.modulus = this.modulus;
        window.points = this.points;
        window.life = this.left;
        // 隐藏升级按钮
        window.upAttrActive = false;
        // // 控制摇杆隐藏
        // this.joystick.active = false;
        // 初始失败界面隐藏
        this.playagain.active = false;
        this.playagain.zIndex = 10;
        this.playDescription.zIndex = 10;
        this.timeDataCon.zIndex = 10;
        // 人物信息隐藏
        this.playInfo.active = false;
        this.playInfo.zIndex = 10;
        this.player.zIndex = 9;
        // 蒙板
        this.mask.active = false;
        this.mask.zIndex = 9;
        this.goleft.zIndex = 8;
        this.goright.zIndex = 8;
        // 升级按钮隐藏
        // this.upAttr.active = window.upAttrActive;
        this.upAttr.active = false;
        window.time = 1;
        window.stage = 0;
        // 产生障碍物
        this._gen_random_group();
        this.playagain = cc.find("Canvas/playagain");
    },
    // 时间计算
    gettimes() {
        this.times = setInterval((e) => {
            if (this.playagain.active) {
                clearInterval(this.times);
                return
            }
            if (window.gameStartStatus) {
                this.time += 1;
                window.time += 1;
            }
            // window.time = this.time;
            this.timeData.string = window.time;
           
            // 加入时间和远古时代的关联算法
            // // 后期时间设置为-=  固定关卡时间，时间为0，进入下一关
            let gradeNeed = this.time - this.usedTime;
            
            this.upGrade(gradeNeed);
            // 修改升级属性按钮是否显示
            // this.upAttr.active = window.upAttrActive;
        }, 1000);
    },
    // 技能点获取函数封装
    upGrade(experience) {
        // 升级经验为：当前等级乘以系数
        window.upgradeNeed = window.thisGrade * this.modulus;
        if (experience >= window.upgradeNeed) {
            // 获取时间差距
            this.usedTime = this.time
            // 等级+=1
            window.thisGrade += 1;
            // 获取技能点
            window.points += 1;
        }
        // if (window.points > 0) {
        //     window.upAttrActive = true;
        // } else {
        //     window.upAttrActive = false;
        // }
    },
    // 随机&无限的产生一组敌人
    _gen_random_group() {
        if (this.playagain.active) {
            // 游戏为暂停状态
            return;
        }
        var g_type = Math.random() * this.groups_prefab.length + 1;
        g_type = Math.floor(g_type);
        if (g_type >= this.groups_prefab.length) {
            g_type = this.groups_prefab.length;
        }
        var g = cc.instantiate(this.groups_prefab[g_type - 1]);
        // g.x = this.RandomNumBoth(this.randomMinNum, this.randomMaxNum);
        g.x = this.randomX[this.RandomNumBoth(0, 4)];
        // this.randomMinNum = -this.node.width/2;
        // this.randomMaxNum = this.node.width/2;
        // // -269.86506746626685 269.86506746626685
        g.y = (Math.random()) * 100 + 500;
        // 判断游戏是否开始
        if (window.gameStartStatus) {
            this.node.addChild(g);
        }
        // this.scheduleOnce(this._gen_random_group.bind(this), Math.random() * 1 + 2);
        // let setNodeTime = this.produceSpeed();
        this.scheduleOnce(this._gen_random_group.bind(this), this.produceSpeed());
        // this.scheduleOnce(this._gen_random_group.bind(this), 0.8);
    },
    // 获取障碍物产生速度
    produceSpeed() {
        if (window.time == 0) {
            window.time = 1;
        }
        if (window.time % 1 == 0) {
            window.stage += 0.02;
        }
        // let setNodeTime = 1 - window.stage;

        let setNodeTime = 300 / (300 + window.time*3);
        // if (setNodeTime <= 0.3) {
        //     setNodeTime = 0.3;
        //     return setNodeTime;
        // }
        return setNodeTime;
    },
    RandomNumBoth(Min, Max) {
        // 生产随机数
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range); //四舍五入
        return num;
    },
    update (dt) {
        // this.scoreDisplay.string = window.score;
        // this.gameOverScore.string = window.score;
    },

});
