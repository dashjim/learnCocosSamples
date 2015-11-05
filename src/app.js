function trace() {
    cc.log(Array.prototype.join.call(arguments, ", "));
}


var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var bg = new cc.Sprite("res/bg.jpg");
        this.addChild(bg);
        bg.x = cc.director.getVisibleSize().width/2;
        bg.y = cc.director.getVisibleSize().height/2;
        bg.x = 360;

        //NO BORDER
//        bg.x = cc.director.getVisibleSize().width/2 + cc.director.getVisibleOrigin().x;
//        bg.y = cc.director.getVisibleSize().height/2 + cc.director.getVisibleOrigin().y;

        trace("FrameSize", cc.view.getFrameSize().width, cc.view.getFrameSize().height);
        trace("WinSize", cc.director.getWinSize().width, cc.director.getWinSize().height);
        trace("VisibleSize", cc.director.getVisibleSize().width, cc.director.getVisibleSize().height);
        trace("VisibleOrigin", cc.director.getVisibleOrigin().x, cc.director.getVisibleOrigin().y);
    }
});