
cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node,
        label: cc.Label,
        userBlock: cc.Node
    },

    start () {
        this._isShow = true;
        this._show = cc.moveTo(0.5, 0, 110);
        this._hide = cc.moveTo(0.5, 0, 1000);
        // the UserInfoButton is set position by screen size.
        let systemInfo =  wx.getSystemInfoSync();
        let width = systemInfo.windowWidth;
        let height = systemInfo.windowHeight;
        // https://developers.weixin.qq.com/minigame/dev/document/open-api/user-info/wx.createUserInfoButton.html
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '获取用户信息',
            style: {
                left: width * 0.33,
                top: height * 0.81,
                width: width * 0.13,
                height: height * 0.1,
                lineHeight: 40,
                backgroundColor: '#eeeeee',
                color: '#000000',
                textAlign: 'center',
                fontSize: 10,
                borderRadius: 3
            }
        });

        let userInfo = null;
        let _self = this;
        button.onTap((res) => {
            if (userInfo) return;
            switch(res.errMsg) {
                case 'getUserInfo:ok': 
                    userInfo = res.userInfo;
                    let nickName = userInfo.nickName;
                    let avatarUrl = userInfo.avatarUrl;
                    _self.setUserConfig(nickName, avatarUrl);

                    wx.getOpenDataContext().postMessage({
                        message: "User info get success."    
                    });
                default:
                    // this.setTips(res.errMsg);
                    break;
            }
        });
    },

    onClick () {
        this._isShow = !this._isShow;
        if (this._isShow) {
            this.display.runAction(this._show);
        }
        else {
            this.display.runAction(this._hide);
        }
    },

    setUserConfig (nickName, avatarUrl) {
        // let userAvatarSprite = this.userBlock.getChildByName('userPortrait').getComponentInChildren(cc.Sprite);
        // let nickNameLabel = this.userBlock.getChildByName('userName').getComponent(cc.Label);

        nickNameLabel.string = nickName;
        cc.loader.load({
            url: avatarUrl,
            type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            userAvatarSprite.spriteFrame = new cc.SpriteFrame(texture);
        });
    },

    // setTips (str) {
    //     this.label.string = str;
    // }
});




// import * as Consts from "./consts"
// import {appdata} from './appdata'
// import {POP_UI_BASE} from './common/ui/pop_ui_base'
// import {pop_mgr, UI_CONFIG} from "./common/ui/pop_mgr"
// import {TimerMgr} from "./common/timer/timer_mgr"
// import * as utils from "./common/util"
// import * as wxapi from "./common/wxapi"
// import * as Audio from "./common/audio/audioplayer"

// const {ccclass, property} = cc._decorator;
// @ccclass
// export class RankView2 extends POP_UI_BASE {

//     @property(cc.Sprite)
//     img_head: cc.Sprite = null;

//     @property(cc.Label)
//     txt_name: cc.Label = null;

//     @property(cc.Sprite)
//     img_rank: cc.Sprite = null;

//     timerId:number;
//     isDirty:boolean;
//     rankTexture:cc.Texture2D;
//     rankSpriteFrame:cc.SpriteFrame;

//     on_show(...params)
//     {
//         console.log("on_show");
//         const appUserInfo = appdata.appUserInfo;
//         const wxUserInfo = appdata.wxUserInfo;
//         const avatarUrl = wxUserInfo.avatarUrl132;
//         console.log()
//         if(avatarUrl.length > 0)
//         {
//             this.txt_name.string = wxUserInfo.nickName;
//             utils.load_external_img(this.img_head, avatarUrl, "png");
//         }

//         //只能在主域设置大小, 且要先于赋值到sprite才起作用
//         const sharedCanvas = wxapi.wxOpenData.wxGetSharedCanvas();
//         sharedCanvas.width = this.img_rank.node.width;
//         sharedCanvas.height = this.img_rank.node.height;

//         this.rankTexture = new cc.Texture2D();
//         this.rankSpriteFrame = new cc.SpriteFrame();
        
//         //拿好友排行榜
//         this.isDirty = true;
//         wxapi.wxOpenData.wxPostMessageToSubDomain({
//             action:wxapi.WxDomainAction.FetchFriend,
//         });
//         this.timerId = TimerMgr.getInst().loop(0.1, utils.gen_handler(this.updateRankList, this));
//     }

//     on_hide() 
//     {
//         console.log("on_hide");
//         this.rankTexture = null;
//         this.rankSpriteFrame = null;
//         this.isDirty = false;
//         TimerMgr.getInst().remove(this.timerId);
//     }

//     updateRankList()
//     {
//         console.log("updateRankList");
//         if(!this.isDirty)
//         {
//             return;
//         }
//         const sharedCanvas = wxapi.wxOpenData.wxGetSharedCanvas();
//         this.rankTexture.initWithElement(sharedCanvas);
//         this.rankTexture.handleLoadedTexture();
//         this.rankSpriteFrame.setTexture(this.rankTexture);
//         this.img_rank.spriteFrame = this.rankSpriteFrame;
//     }

//     onTouchPageBtn(event, delta)
//     {
//         console.log("onTouchPageBtn");
//         this.isDirty = true;
//         wxapi.wxOpenData.wxPostMessageToSubDomain({
//             action:wxapi.WxDomainAction.Paging,
//             data:parseInt(delta),
//         });
//     }

//     onTouchGroupRank()
//     {
//         console.log("onTouchGroupRank");
//         wxapi.wxShare.share({
//             title:"分享文本", 
//             imageUrl:"shareimg/bg02.png",
//             query:`openID=${appdata.appUserInfo.openid}`,
//         }, utils.gen_handler((shareTickets:string[]) => {
//             if(!shareTickets || !shareTickets.length)
//             {
//                 console.log('本次分享无shareTicket');
//                 return;
//             }
//             const shareTicket = shareTickets[0];
//             this.isDirty = true;
//             wxapi.wxOpenData.wxPostMessageToSubDomain({
//                 action:wxapi.WxDomainAction.FetchGroup,
//                 data:shareTicket,
//             });
//         }));
//     }
// }














// // var common = require('Common'); //全局变量
// cc.Class({
//     extends: cc.Component,
//     properties: {
//         subTitle: cc.Label, //标题
//         tipsUINode: cc.Node, //提示文本节点
//         lookGroupBtnNode: cc.Node, //查看群排行按钮
//         subDomainCanvas: cc.Sprite, //子域画布
//     },
//     onLoad: function() {
//         console.log("排行榜通知子域：friendRank");
//         wx.postMessage({ message: "friendRank" }); //通知子域运行场景friendRank
//         // //用于临时保存子域画布的纹理
//         // this.subDomainTexture = new cc.Texture2D();
//         // //返回按钮只一次的开关
//         // this.playing = 0;
//         // //是否可以显示好友排行
//         // this.isCanShowFriendRank = false;
//         // //是否可以显示群排行
//         // this.isCanShowGroupRank = false;
//         // //发起群排行按钮
//         // this.lookGroupBtnNode.active = false;
//         // //隐藏自动消失提示框
//         // this.tipsUINode.active = false;
// 		// //预加载开始界面
// 		// cc.director.preloadScene("start");
//         // //初始化到好友榜页面
//         // this.reset();
//     },
//     reset: function(){ //恢复到默认的好友排行页
//         this.subTitle.string = "好友排行榜";
//         this.playing = 0;
//         this.isCanShowFriendRank = true;
//         this.isCanShowGroupRank = false;
//         this.lookGroupBtnNode.active = true;


//         // if(!common.isHasWXRank) return;
//         console.log("排行榜通知子域：friendRank");
//         wx.postMessage({ message: "friendRank" }); //通知子域运行场景friendRank
//     },
//     onReturnBtnClicked: function(){ //返回按钮
//         cc.log("点击返回按钮");
//         if(this.playing == 0){
//             this.playing = 1;
//             // common.previousSceneIndex = 3;
//             cc.director.loadScene("start"); //从好友排行页面返回开始界面


//             // if(!common.isHasWXRank) return;
//             console.log("排行榜通知子域:关闭");
//             wx.postMessage({ message: "rankMain" }); 
//         }
//     },
//     onLookGroupBtnClicked: function(){ //查看群排行按钮(实际是分享)
//         cc.log("点击查看群排行按钮");
//         // if(!common.isHasWXRank) return;
//         var self = this;
//         cc.loader.loadRes("texture/share",function(err,data){
//             wx.shareAppMessage({
//                 title: "不怕，就来PK！",
//                 imageUrl: data.url,
//                 success(res){
//                     console.log("转发成功!!!")
//                     if(res.shareTickets == null || res.shareTickets == undefined || res.shareTickets == ""){ //没有群信息，说明分享的是个人
//                         console.log("排行榜res.shareTickets is null");
//                         self.showTipsUI("查看群排行请分享到群"); //自动消失提示框
//                     }else{ //有群信息
//                         console.log("排行榜res.shareTickets is not null");
//                         console.log(res);
//                         self.subTitle.string = "群排行榜";
//                         if(res.shareTickets.length > 0){
//                             console.log("res.shareTickets:" + res.shareTickets);
//                             self.lookGroupBtnNode.active = false;
//                             wx.postMessage({ message: "groupRank" + res.shareTickets[0] }); //通知子域运行场景groupRank
//                         }
//                     }
//                 },
//                 fail(res){
//                     console.log("转发失败!!!")
//                 } 
//             })
//         }); 
//     },
//     showTipsUI: function(content){ //显示自动消失提示框
//         if(this.tipsUINode.active){
//             this.tipsUINode.getComponent("FadeOut").init();
//         }
//         this.tipsUINode.getComponent("FadeOut").fadeDuration = 2;
//         this.tipsUINode.getComponent("SetContent").setContent(content);
//         this.tipsUINode.active = true;
//     },
//     update: function(dt){
//         // if(!common.isHasWXRank) return;
//         // if(this.isCanShowFriendRank || this.isCanShowGroupRank){ //显示子域的画布
//         //     if (!this.subDomainTexture) return;
//         //     this.subDomainTexture.initWithElement(sharedCanvas);
//         //     this.subDomainTexture.handleLoadedTexture();
//         //     this.subDomainCanvas.spriteFrame = new cc.SpriteFrame(this.subDomainTexture);
//         // }
//     },
// });