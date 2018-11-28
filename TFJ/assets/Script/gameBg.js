cc.Class({
    extends: cc.Component,
 
    properties: {
        far_bg: [cc.Node],  //用于管理背景图片结点的数组,记得回cocos面板中添加数组的结点数量
        bg_speed: 1,   //移动时控制速度的变量
    },
 
    onLoad() {
        // active设置为false  元素不可操作   可用于停止背景滚动
        // this.far_bg[0].active = false
        // this.far_bg[1].active = false
        this.playagain = cc.find("Canvas/playagain");
        this.playInfo = cc.find("Canvas/playInfo");
        this.Canvas = cc.find("Canvas");
    },
 
    update(dt) {
        this.bg_speed = Math.round((300+window.time*5)*1/60);
        this.bgMove(this.far_bg, this.bg_speed);
    },
    bgMove: function (bgList, speed) {
        // this.stopAllActions()
        if (!window.gameStartStatus || this.playagain.active) {
            return
        }
        //每次循环二张图片一起滚动
        for (var index = 0; index < bgList.length; index++) {
            bgList[index].y -= speed;
        }
        //y坐标减去自身的height得到这张背景刚好完全离开场景时的y值
        if (bgList[0].y <= 0 - bgList[0].height) {
            bgList[0].y = this.Canvas.height; //离开场景后将此背景图的y重新赋值，位于场景的上方
        }
        if (bgList[1].y <= this.Canvas.height - 2 * bgList[1].height) {
            bgList[1].y = this.Canvas.height;
        }
    },
    
});