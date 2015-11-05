
function trace(){
    cc.log(Array.prototype.join.call(arguments, ", "));
}

var ParallaxLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        var bg = new cc.ParallaxNode();
        var bg1 = new cc.Sprite("res/bgLayer.jpg");
        var bg2 = new cc.Sprite("res/bgLayer2.png");
        var bg3 = new cc.Sprite("res/bgLayer3.png");
        var bg4 = new cc.Sprite("res/bgLayer4.png");
        bg.addChild(bg1, 1, cc.p(0.1, 0), cc.p(bg1.width/2, bg1.height/2));
        bg.addChild(bg2, 2, cc.p(0.3, 0), cc.p(bg2.width/2, bg2.height/2));
        bg.addChild(bg3, 3, cc.p(0.5, 0), cc.p(bg3.width/2, bg3.height/2));
        bg.addChild(bg4, 4, cc.p(1, 0), cc.p(bg4.width/2, bg4.height/2));
        var action = cc.moveBy(1, -200, 0);
        bg.runAction(cc.sequence(action, action.clone().reverse()).repeatForever());
        this.addChild(bg);
    }
});

var UnlimitedParallaxLayer = cc.Layer.extend({

    _bg1:null,
    _bg2:null,
    _bg3:null,
    _bg4:null,

    speed:5,

    ctor:function () {
        this._super();
        this.scheduleUpdate();

        var buildParallaxBackground = function(texture){
            var layer = new cc.Layer();
            var bg1 = new cc.Sprite(texture);
            bg1.x = bg1.width/2;
            bg1.y = bg1.height/2;
            layer.addChild(bg1);
            var bg2 = new cc.Sprite(texture);
            bg2.x = bg2.width/2 + bg2.width;
            bg2.y = bg2.height/2;
            layer.addChild(bg2);
            return layer;
        };

        //sky
        this._bg1 = buildParallaxBackground("res/bgLayer.jpg");
        this.addChild(this._bg1);
        //hill
        this._bg2 = buildParallaxBackground("res/bgLayer2.png");
        this.addChild(this._bg2);
        //buildings
        this._bg3 = buildParallaxBackground("res/bgLayer3.png");
        this.addChild(this._bg3);
        //trees
        this._bg4 = buildParallaxBackground("res/bgLayer4.png");
        this.addChild(this._bg4);

        return true;
    },

    update:function(dt) {
        var winSize = cc.director.getWinSize();
        this._bg1.x -= Math.ceil(this.speed * 0.1);
        if (this._bg1.x < -parseInt(winSize.width))
            this._bg1.x = 0;

        this._bg2.x -= Math.ceil(this.speed * 0.3);
        if (this._bg2.x < -parseInt(winSize.width))
            this._bg2.x = 0;

        this._bg3.x -= Math.ceil(this.speed * 0.5);
        if (this._bg3.x < -parseInt(winSize.width))
            this._bg3.x = 0;

        this._bg4.x -= Math.ceil(this.speed * 1);
        if (this._bg4.x < -parseInt(winSize.width))
            this._bg4.x = 0;
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
//        var layer = new ParallaxLayer();
        var layer = new UnlimitedParallaxLayer();
        this.addChild(layer);
    }
});

