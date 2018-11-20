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
        levelPass: {
            default: null,
            type: cc.Prefab,
            displayName: '通关关卡',
        },
        levelNotPass: {
            default: null,
            type: cc.Prefab,
            displayName: '未通关关卡',
        },
        // let x = this.modulusX * series;
        // let y = this.modulusY * row;
        modulusX: 150, // 列系数
        modulusY: 150, // 行系数
    },

    onLoad () {
        // 获取关卡数据
        let levelList = [
            {'name':'GameScene0', 'status': 1},
            {'name':'GameScene1', 'status': 1},
            {'name':'GameScene2', 'status': 1},
            {'name':'GameScene3', 'status': 0},
            {'name':'GameScene4', 'status': 0},
            {'name':'GameScene4', 'status': 0},
            {'name':'GameScene4', 'status': 0},
            {'name':'GameScene4', 'status': 0},
            {'name':'GameScene4', 'status': 0},
            {'name':'GameScene4', 'status': 0},
        ]
        let row = 0;
        for (let i = 0; i < levelList.length; i++) {
            let node = null;
            if (levelList[i].status == 1) {
                node = cc.instantiate(this.levelPass);
            } else {
                node = cc.instantiate(this.levelNotPass);
            }
            let series = i % 3 + 1;
            if (i % 3 == 0) {
                row += 1;
            }
            let position = this.getPosition(row, series);
            // 全局坐标转局部坐标
            node.position = this.node.convertToNodeSpaceAR(cc.v2(position[0], position[1]))
            node.levelName = levelList[i].name;
            node.levelStatus= levelList[i].status;
            this.node.addChild(node);
        }
    },

    start () {

    },

    // update (dt) {},
    // 获取坐标
    getPosition(row, series) {
        let x = this.modulusX * series;
        let y = this.modulusY * row;
        return [x, y]
    },
});
