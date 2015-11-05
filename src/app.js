function trace(){
    cc.log(Array.prototype.join.call(arguments, ", "));
}

var SpriteFrameLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("res/candy.plist");
        var size = cc.winSize;
        var ball = new cc.Sprite("#1.png");
        this.addChild(ball, 1);
        ball.x = size.width/2;
        ball.y = size.height/2;
        return true;
    }
});

var BatchNodeLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("res/candy.plist");

        var batchNode = new cc.SpriteBatchNode("res/candy.png");
        this.addChild(batchNode);
        var size = cc.winSize;
        for (var i = 0; i < 4000; i++) {
            var ball = new cc.Sprite("#"+ (parseInt(Math.random()*5)+1) +".png");
            batchNode.addChild(ball, 1);
            ball.x = Math.random()*size.width;
            ball.y = Math.random()*size.height;
            ball.runAction(cc.rotateBy(1, 360*Math.random(), 360*Math.random()).repeatForever());
        }
        return true;
    }
});

var BatchNodeContrastLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("res/candy.plist");

        var size = cc.winSize;

        for (var i = 0; i < 4000; i++) {
            var ball = new cc.Sprite("#"+ (parseInt(Math.random()*5)+1) +".png");
            this.addChild(ball, 1);
            ball.x = Math.random()*size.width;
            ball.y = Math.random()*size.height;
            ball.runAction(cc.rotateBy(1, 360*Math.random(), 360*Math.random()).repeatForever());
        }
        return true;
    }
});

var ReuseSprite = cc.Sprite.extend({
    ctor: function (url) {
        this._super(url);
    },

    reuse: function (param) {
        trace("reuse", param);
    },

    unuse: function () {
        trace("unuse");
    }
});

var PoolLayer = cc.Layer.extend({
    tag:0,
    deleteTag:0,
    ctor: function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("res/candy.plist");
        deleteTag = tag = 0;
        this.scheduleUpdate();
    },

    update: function () {
        var size = cc.winSize;
        if(this.tag - this.deleteTag > 500){
            for (var i = 0; i < 250; i++) {
                var ball = this.getChildByTag(this.deleteTag);
                cc.pool.putInPool(ball);
                this.removeChild(ball);
                this.deleteTag++;
            }
        }
        var param = "anything";
        for (var i = 0; i < 250; i++) {
            var ball = null;
            if(cc.pool.hasObject(ReuseSprite)){
                ball = cc.pool.getFromPool(ReuseSprite, param);
            } else {
                ball = new ReuseSprite("#" + (parseInt(Math.random() * 5) + 1) + ".png");
            }
            this.addChild(ball, 1, this.tag);
            this.tag++;
            ball.x = Math.random()*size.width;
            ball.y = Math.random()*size.height;
        }
    }
});

var PoolContrastLayer = cc.Layer.extend({
    tag:0,
    deleteTag:0,
    ctor: function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("res/candy.plist");
        deleteTag = tag = 0;
        this.scheduleUpdate();
    },

    update: function () {
        var size = cc.winSize;
        if(this.tag - this.deleteTag > 500){
            for (var i = 0; i < 250; i++) {
                this.removeChildByTag(this.deleteTag, false);
                this.deleteTag++;
            }
        }
        for (var i = 0; i < 250; i++) {
            var ball = new cc.Sprite("#"+ (parseInt(Math.random()*5)+1) +".png");
            this.addChild(ball, 1, this.tag);
            this.tag++;
            ball.x = Math.random()*size.width;
            ball.y = Math.random()*size.height;
        }
    }
});

var BakeLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        cc.spriteFrameCache.addSpriteFrames("res/candy.plist");
        var size = cc.winSize;
        var layer = new cc.Layer();
        this.addChild(layer);
        for (var i = 0; i < 8000; i++) {
            var node = new cc.Sprite("#"+ (parseInt(Math.random()*5)+1) +".png");
            node.x = Math.random()*size.width;
            node.y = Math.random()*size.height + 200;
            layer.addChild(node);
        }
        layer.bake();
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
//        var layer = new SpriteFrameLayer();
//        var layer = new BatchNodeLayer();
//        var layer = new BatchNodeContrastLayer();
//        var layer = new PoolContrastLayer();
//        var layer = new PoolLayer();
        var layer = new BakeLayer();
        this.addChild(layer);
    }
});