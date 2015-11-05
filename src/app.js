function trace(){
    cc.log(Array.prototype.join.call(arguments, ", "));
}

var MouseEventLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        if( 'mouse' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function(event){
                    var pos = event.getLocation();
                    var target = event.getCurrentTarget();
                    if(event.getButton() === cc.EventMouse.BUTTON_RIGHT)
                        trace("onRightMouseDown at: " + pos.x + " " + pos.y );
                    else if(event.getButton() === cc.EventMouse.BUTTON_LEFT)
                        trace("onLeftMouseDown at: " + pos.x + " " + pos.y );
                },
                onMouseMove: function(event){
                    var pos = event.getLocation(), target = event.getCurrentTarget();
                    trace("onMouseMove at: " + pos.x + " " + pos.y );
                },
                onMouseUp: function(event){
                    var pos = event.getLocation(), target = event.getCurrentTarget();
                    trace("onMouseUp at: " + pos.x + " " + pos.y );
                }
            }, this);
        } else {
            trace("MOUSE Not supported");
        }

        return true;
    }
});

var TouchOneByOneLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        if( 'touches' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan,
                onTouchMoved: this.onTouchMoved,
                onTouchEnded: this.onTouchEnded,
                onTouchCancelled: this.onTouchCancelled
            }, this);
        } else {
            trace("TOUCH-ONE-BY-ONE test is not supported on desktop");
        }

        return true;
    },

    onTouchBegan:function(touch, event) {
        var pos = touch.getLocation();
        var id = touch.getID();
        trace("onTouchBegan at: " + pos.x + " " + pos.y + " Id:" + id );
        var winSize = cc.director.getWinSize();
        if( pos.x < winSize.width/2) {
            return true;
        }
        return false;
    },
    onTouchMoved:function(touch, event) {
        var pos = touch.getLocation();
        var id = touch.getID();
        trace("onTouchMoved at: " + pos.x + " " + pos.y + " Id:" + id );
    },
    onTouchEnded:function(touch, event) {
        var pos = touch.getLocation();
        var id = touch.getID();
        trace("onTouchEnded at: " + pos.x + " " + pos.y + " Id:" + id );
    },
    onTouchCancelled:function(touch, event) {
        var pos = touch.getLocation();
        var id = touch.getID();
        trace("onTouchCancelled at: " + pos.x + " " + pos.y + " Id:" + id );
    }
});

var TouchAllAtOnceLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        if( 'touches' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesBegan: this.onTouchesBegan,
                onTouchesMoved: this.onTouchesMoved,
                onTouchesEnded: this.onTouchesEnded,
                onTouchesCancelled: this.onTouchesCancelled
            }, this);
        } else {
            trace("TOUCHES not supported");
        }
    },

    onTouchesBegan:function(touches, event) {
        for (var i=0; i < touches.length;i++ ) {
            var touch = touches[i];
            var pos = touch.getLocation();
            var id = touch.getID();
            trace("Touch #" + i + ". onTouchesBegan at: " + pos.x + " " + pos.y + " Id:" + id);
        }
    },
    onTouchesMoved:function(touches, event) {
        for (var i=0; i < touches.length;i++ ) {
            var touch = touches[i];
            var pos = touch.getLocation();
            var id = touch.getID();
            trace("Touch #" + i + ". onTouchesMoved at: " + pos.x + " " + pos.y + " Id:" + id);
        }
    },
    onTouchesEnded:function(touches, event) {
        for (var i=0; i < touches.length;i++ ) {
            var touch = touches[i];
            var pos = touch.getLocation();
            var id = touch.getID();
            trace("Touch #" + i + ". onTouchesEnded at: " + pos.x + " " + pos.y + " Id:" + id);
        }
    },
    onTouchesCancelled:function(touches, event) {
        for (var i=0; i < touches.length;i++ ) {
            var touch = touches[i];
            var pos = touch.getLocation();
            var id = touch.getID();
            trace("Touch #" + i + ". onTouchesCancelled at: " + pos.x + " " + pos.y + " Id:" + id);
        }
    }
});


var KeyboardTestLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        if( 'keyboard' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased: function(keyCode, event) {
                    if (keyCode == cc.KEY.back) {
                        cc.log("return button clicked. keycode:" + keyCode);
                        cc.director.end();
                    }
                    else if (keyCode == cc.KEY.menu) {
                        cc.log("menu button clicked. keycode:" + keyCode);
                    }
                }
            }, this);
        } else {
            cc.log("KEYBOARD Not supported");
        }
    }
});


var AccelerometerLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        var winSize = cc.director.getWinSize();

        if( 'accelerometer' in cc.sys.capabilities ) {
            cc.inputManager.setAccelerometerInterval(1/30);
            cc.inputManager.setAccelerometerEnabled(true);
            cc.eventManager.addListener({
                event: cc.EventListener.ACCELERATION,
                callback: function(accelerometerInfo, event){
                    var target = event.getCurrentTarget();
                    cc.log('Accel x: '+ accelerometerInfo.x + ' y:' + accelerometerInfo.y + ' z:' + accelerometerInfo.z + ' time:' + accelerometerInfo.timestamp );

                    var w = winSize.width;
                    var h = winSize.height;

                    var x = w * accelerometerInfo.x + w/2;
                    var y = h * accelerometerInfo.y + h/2;

                    x = x*0.2 + target.prevX*0.8;       //使小球慢慢移动到目标位置
                    y = y*0.2 + target.prevY*0.8;

                    target.prevX = x;
                    target.prevY = y;
                    target.sprite.x = x;
                    target.sprite.y = y ;
                }
            }, this);

            var sprite = this.sprite = new cc.Sprite("res/item_2.png");
            this.addChild( sprite );
            sprite.x = winSize.width/2;
            sprite.y = winSize.height/2;

            this.prevX = 0;
            this.prevY = 0;
        } else {
            cc.log("ACCELEROMETER not supported");
        }
    }
});



var ControlScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
//        var layer = new MouseEventLayer();
//        var layer = new TouchOneByOneLayer();
//        var layer = new KeyboardTestLayer();
        var layer = new AccelerometerLayer();

        this.addChild(layer);
    }
});