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
        var sy = 300*dt;
        // this.node.x += sx;
        this.node.y -= sy;

        // if (this.flag == 0) {
        //     if (this.game_scene.game_level >=5) {
        //         this.flag = 1;
        //         this.schedule(this.shoot_enemy_more_bullet.bind(this), 1);
        //     }
        // }
        // console.log(this.node.x, this.node.y);
        // console.log(this.node.y)
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
