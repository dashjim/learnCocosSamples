
var HelloWorldLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        var bg = new cc.LayerColor(cc.color(100,100,100), 200, 200);
        bg.x = 100;
        bg.y = 100;
        this.addChild(bg, 1);

        var ball1 = new cc.Sprite("res/item_2.png");
        ball1.x = 100;
        ball1.y = 300;
        this.addChild(ball1, 2);

        var ball2 = new cc.Sprite("res/item_3.png");
        ball2.x = 100;
        ball2.y = 100;
        bg.addChild(ball2, 1);

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = new HelloWorldLayer();
        this.addChild(layer);

        setTimeout(function(){
//            cc.director.runScene(new SecondScene());
            cc.director.runScene(new cc.TransitionSplitCols(2, new SecondScene()));
        }, 3000);
    }
});

var SecondScene = cc.Scene.extend({

    onEnter: function () {
        this._super();

        var layer = new cc.LayerGradient(cc.color(255,0,0),cc.color(0,0,255));
        this.addChild(layer);
    }
});



