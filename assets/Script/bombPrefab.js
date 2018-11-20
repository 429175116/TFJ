cc.Class({
    extends: cc.Component,

    properties: {
        attackPower: {
            default: 0,
            displayName: '攻击力',
        },
        grade: {
            default: 0,
            displayName: '等级',
        },
        obstacleLife: {
            default: 3,
            displayName: '生命力',
        },
        upgradeNeed: 10, // 升级所需经验
        usedScore: 0, // 使用过的分数
    },
    onLoad () {
        this.playagain = cc.find("Canvas/playagain");
        this.playInfo = cc.find("Canvas/playInfo");
        this.scoreDisplay = cc.find("Canvas/score");
        let time = window.time;
        this.modulus = this.RandomNumBoth(time+300, time+850);
    },

    start () {
        this.node.attackPower = this.attackPower;
        this.node.grade = this.grade;
        this.node.obstacleLife = this.obstacleLife;
    },

    update(dt) {
        if (!window.gameStartStatus || this.playagain.active) {
            // this.node.stopAllActions()
            return
        }
        // let time = window.time;
        // this.modulus = this.RandomNumBoth(time+300, time+850);
        var sy = this.modulus*dt;
        // this.node.x += sx;
        this.node.y -= sy;
        if (this.node.y < -1000) {
            // 销毁节点destroy
            // this.node.removeFromParent();
            this.node.destroy();
            // // 分数计算
            // window.score += 1;
            // let experience = window.score - this.usedScore;
            // this.upGrade(experience)
        }
    },
    RandomNumBoth(Min, Max) {
        // 生产随机数
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range); //四舍五入
        return num;
    },
    // // 技能点获取函数封装
    // upGrade(experience) {
    //     // 升级经验为：当前等级乘以系数
    //     this.upgradeNeed = window.thisGrade * window.modulus;
    //     console.log(experience,this.upgradeNeed,window.modulus)
    //     if (experience >= this.upgradeNeed) {
    //         // 获取时间差距
    //         this.usedScore = window.score;
    //         // 等级+=1
    //         window.thisGrade += 1;
    //         // 获取技能点
    //         window.points += 1;
    //     }
    // },
});
