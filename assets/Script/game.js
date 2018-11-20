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
        gameOverScore: {
            default: null,
            type: cc.Label,
            displayName: '死亡分数',
        },
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
        goLeaderboard: {
            default: null,
            type: cc.Node,
            displayName: '进入排行榜',
        },
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
        groundY: 0,
        randomMinNum: 0,
        randomMaxNum: 0,
        time: 0, // 玩家存活时间
        usedTime: 0, // 使用过的时间
        upgradeNeed: 10, // 升级所需经验
        thisGrade: 1, // 当前等级
        modulus: 5, // 升级经验系数
        points: 0, // 技能点
    },


    onLoad () {
        // 分数初始化
        window.score = 0;
        
        // 启动时间定时器
        this.gettimes();
        // 获取障碍物偏移量
        this.randomMinNum = -this.node.width/2;
        this.randomMaxNum = this.node.width/2;
        // touchstart 点击
        // touchend 离开
        this.player.on('touchmove', (e) => {
            this.player.position = this.player.parent.convertToNodeSpaceAR(e.getLocation())
        })
        // 用于开始游戏
        this.player.on('touchstart', (e) => {
        // this.node.on('touchstart', (e) => {
            // if (e.target.name != 'Canvas') {
            //     return;
            // }
            // 开始游戏
            this.gameStart(e);
        })
        // 用于暂停游戏
        this.player.on('touchend', (e) => {
        // this.node.on('touchend', (e) => {
            // if (e.target.name != 'Canvas') {
            //     return;
            // }
            // 暂停游戏
            this.gamePause();
        })
        this.playDescription.on('touchstart', (e) => {
            this.playDescription.active = false;
            // 控制摇杆隐藏
            // this.joystick.active = false;
        })
        // goLeaderboard
        this.goLeaderboard.on('touchstart', (e) => {
            // 场景切换--进入排行榜
            cc.director.loadScene("Leaderboard");
        })
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
        window.gameStartStatus = false;
        // 初始化等级
        if (!window.thisGrade) {
            window.thisGrade = this.thisGrade;
        }
        // 初始化经验系
        if (!window.modulus) {
            window.modulus = this.modulus;
        }
        // 初始化技能点
        if (!window.points) {
            window.points = this.points;
        }
        
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
        // 升级按钮隐藏
        // this.upAttr.active = window.upAttrActive;
        this.upAttr.active = false;
        window.time = 1;
        window.stage = 1;
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
            }
            this.timeData.string = this.time;
            window.time = this.time;
            // 加入时间和远古时代的关联算法
            // // 后期时间设置为-=  固定关卡时间，时间为0，进入下一关
            let gradeNeed = this.time - this.usedTime;
            
            this.upGrade(gradeNeed);
            // 修改升级属性按钮是否显示
            this.upAttr.active = window.upAttrActive;
        }, 1000);
    },
    // 技能点获取函数封装
    upGrade(experience) {
        // 升级经验为：当前等级乘以系数
        window.upgradeNeed = window.thisGrade * this.modulus;
        // console.log(experience, this.upgradeNeed);
        if (experience >= window.upgradeNeed) {
            // 获取时间差距
            this.usedTime = this.time
            // 等级+=1
            window.thisGrade += 1;
            // 获取技能点
            window.points += 1;
        }
        if (window.points > 0) {
            window.upAttrActive = true;
        } else {
            window.upAttrActive = false;
        }
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
        g.x = this.RandomNumBoth(this.randomMinNum, this.randomMaxNum);
        g.y = (Math.random()) * 100 + 500;
        // 判断游戏是否开始
        if (window.gameStartStatus) {
            this.node.addChild(g);
        }
        // this.scheduleOnce(this._gen_random_group.bind(this), Math.random() * 1 + 2);
        let setNodeTime = this.produceSpeed();
        console.log(setNodeTime+'----------')
        this.scheduleOnce(this._gen_random_group.bind(this), setNodeTime);
    },
    // 获取障碍物产生速度
    produceSpeed() {
        if (window.time == 0) {
            window.time = 1;
        }
        if (window.time % 20 == 0) {
            window.stage += 0.1;
        }
        console.log(window.time+'++++');
        // let setNodeTime = 2 - (window.stage / window.time);
        let setNodeTime = 2 - window.stage;
        if (setNodeTime <= 0.1) {
            setNodeTime = 0.1;
            return setNodeTime;
        }
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
        this.gameOverScore.string = window.score;
    },

    // spawnNewStar() {
    //     var scene = cc.director.getScene();
    //     // 使用给定的模板在场景中生成一个新节点
    //     var newStar = cc.instantiate(this.bombPrefab);
    //     // 将新增的节点添加到 Canvas 节点下面
    //     // this.node.addChild(newStar);
    //     newStar.parent = scene;
    //     // 为预制体设置一个随机位置

    //     newStar.setPosition(300,300);
    //     console.log(this.getNewStarPosition())
    //     // newStar.setPosition(this.getNewStarPosition());
    // },

    // getNewStarPosition: function () {
    //     var randX = 0;
    //     // 根据地平面位置和主角跳跃高度，随机得到一个星预制体的 y 坐标
    //     var randY = this.groundY;
    //     // 根据屏幕宽度，随机得到一个预制体 x 坐标
    //     var maxX = this.node.width/2;
    //     randX = (Math.random() - 0.5) * 2 * maxX;
    //     // 返回预制体坐标
    //     return cc.v2(randX, randY);
    // },

    
});
