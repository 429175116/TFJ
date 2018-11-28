cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on('touchstart', (e) => {
            let levelStatus = this.node.levelStatus;
            if (levelStatus) {
                let levelName = this.node.levelName;
                // 场景切换
                cc.director.loadScene(levelName);
            }
        });
    },

    start () {

    },

    // update (dt) {},
});
