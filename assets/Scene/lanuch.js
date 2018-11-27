
cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node,
        returnRun: {
            default: null,
            type: cc.Node,
            displayName: '返回',
        },
    },

    start () {
    },
    onLoad () {
        // 返回
        this.returnRun.on('touchend', (e) => {
            cc.director.loadScene("GameScene0");
        })
    },
});
