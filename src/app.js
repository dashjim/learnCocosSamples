
var BallLayer = cc.Layer.extend({

    deltaX:1,
    ball:null,
    frame:0,
    bg:null,

    ctor:function () {
        this._super();

        var size = cc.director.getWinSize();
        var ball = new cc.Sprite("res/item_2.png");
        ball.x = 0;
        ball.y = size.height/2;
        this.addChild(ball, 1);
        this.ball = ball;

        this.bg = new cc.DrawNode();      //用于记录球的运动轨迹
        this.addChild(this.bg);

        this.scheduleUpdate();
        return true;
    },

    update: function () {
        var size = cc.director.getWinSize();
        this.ball.x += this.deltaX;
        if(this.ball.x >= size.width || this.ball.x <= 0){
            this.deltaX *= -1;
        }
        this.ball.y = Math.sin(this.frame/20)*50 + size.height/2;

        this.bg.drawDot(new cc.Point(this.ball.x, this.ball.y), 2, cc.color(255,0,0));  //把球的运动轨迹画到背景板上
        this.frame++;
    }
});


var SimpleActionLayer = cc.Layer.extend({

    ctor:function () {
        this._super();

        var size = cc.director.getWinSize();
        var ball = new cc.Sprite("res/item_2.png");
        ball.x = 0;
        ball.y = size.height/2;
        this.addChild(ball, 1);

//        var action = cc.moveTo(2, cc.p(size.width, size.height/2));
//        var action = cc.moveBy(1, cc.p(size.width, 100));
        ball.x = size.width/2;
//        var action = cc.scaleTo(1, 2, 2);
//        var action = cc.scaleBy(1, 2, 2);
//        ball.runAction(action);

        //镜面测试
//        ball.scale = 2;
//        var action = cc.scaleTo(2, -2, 2);
//        ball.runAction(action);

//        var action = cc.fadeTo(2, 100);
//        var action = cc.fadeOut(2);
//        ball.opacity = 0;
//        var action = cc.fadeIn(2);
//        ball.runAction(action);

//        var action = cc.blink(2, 10);
//        ball.runAction(action);

        var action1 = cc.tintTo(0.3, 100, 0, 0);
        var action2 = cc.tintTo(0.3, 255, 255, 255);
        ball.runAction(cc.sequence(action1, action2));

        return true;
    }
});


var ComposeActionLayer = cc.Layer.extend({

    ctor:function () {
        this._super();

        var size = cc.director.getWinSize();
        var ball = new cc.Sprite("res/item_2.png");
        ball.x = 0;
        ball.y = size.height/2;
        this.addChild(ball, 1);

//        var action1 = cc.moveTo(2, cc.p(size.width/2, size.height/2));
//        var action2 = cc.scaleTo(1, 2, 2);
//        var sequence1 = cc.sequence(action1,action2);
//        var action3 = cc.scaleTo(1, 1, 1);
//        var sequence2 = cc.sequence(sequence1, action3);
//        ball.runAction(sequence2);

//        ball.x = size.width/2;
//        var action1 = cc.scaleTo(1, 2, 2);
//        var action2 = cc.scaleTo(1, 1, 1);
//        var sequence = cc.sequence(action1, action2);
//        var repeat = cc.repeat(sequence, 5);
//        var repeat = cc.repeatForever(sequence);
//        ball.runAction(repeat);

//        var action1 = cc.moveTo(2, cc.p(size.width/2, size.height/2));
//        var action2 = cc.scaleTo(2, 2, 2);
//        var spawn = cc.spawn(action1, action2);
//        ball.runAction(spawn);

//        var action1 = cc.moveTo(2, cc.p(size.width/2, size.height/2));
//        var reverseTime = cc.reverseTime(action1);
//        ball.runAction(reverseTime);

//        var action = cc.moveBy(2, cc.p(size.width/2, 0));
//        var reverse = cc.reverseTime(action);
////        var reverse = action.reverse();
//        var sequence = cc.sequence(action, reverse);
//        ball.runAction(sequence);

        var action1 = cc.moveBy(5, cc.p(size.width/2, 0));
        var action2 = cc.scaleBy(1, 2);
        var reverse = action2.reverse();
        var sequence = cc.sequence(action2, cc.delayTime(0.5), reverse);
        var repeat = cc.repeat(sequence, 2);
        var spawn = cc.spawn(action1, repeat);
        ball.runAction(spawn);

        return true;
    }
});


var ControlActionLayer = cc.Layer.extend({

    ctor:function () {
        this._super();

        var size = cc.director.getWinSize();
        var ball = new cc.Sprite("res/item_2.png");
        ball.x = 0;
        ball.y = size.height/2;
        this.addChild(ball, 1);

//        var action = cc.moveBy(3, cc.p(size.width/2, 0));
//        action.tag = 123;
//        ball.runAction(action);
//        setTimeout(function(){
//            ball.stopActionByTag(123);
//        }, 2000);

        var action = cc.moveBy(3, cc.p(size.width/2, 0));
        ball.runAction(action);
        setTimeout(function(){
            ball.pause();
        }, 2000);
        setTimeout(function(){
            ball.resume();
        }, 3000);

        cc.director.pause();
        cc.director.resume();

//        var action = cc.moveBy(1, cc.p(size.width/2, 0));
//        var callback = cc.callFunc(this.callback, this, "message");
//        var sequence = cc.sequence(action, callback);
//        ball.runAction(sequence);

        return true;
    },
    
    callback: function (nodeExecutingAction, data) {
        trace(nodeExecutingAction instanceof cc.Sprite, data);
    }
});


var TrickyActionLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        var size = cc.director.getWinSize();
        var ball = new cc.Sprite("res/item_2.png");
        ball.x = size.width/2;
        ball.y = size.height;
        this.addChild(ball, 1);

        var action = cc.moveBy(2, 0, -(size.height-ball.height/2));
        action.easing(cc.easeIn(2));
        var back = action.clone().reverse();
        back.easing(cc.easeBounceIn());
        ball.runAction(cc.sequence(action, back));
    }
});


var ActionScene = cc.Scene.extend({

    onEnter: function () {
        this._super();

        //每个layer对应不同章节的内容，请自行去掉注释
//        var layer = new BallLayer();
//        var layer = new SimpleActionLayer();
//        var layer = new ComposeActionLayer();
//        var layer = new ControlActionLayer();
        var layer = new TrickyActionLayer();

        this.addChild(layer);
    }
});


var trace = function() {
    cc.log(Array.prototype.join.call(arguments, ", "));
};

























