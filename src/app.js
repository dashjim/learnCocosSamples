function trace(){
    cc.log(Array.prototype.join.call(arguments, ", "));
}

var AutoReleaseLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        var ball = new cc.Sprite("res/item_2.png");
        ball.retain();  //计数器加1
        this.scheduleOnce(function(){
            this.addChild(ball);
            ball.release();     //计数器减1
            ball.x = cc.winSize.width/2;
            ball.y = cc.winSize.height/2;
        }.bind(this), 2);
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new AutoReleaseLayer();
        this.addChild(layer);
    }
});











