function trace(){
    cc.log(Array.prototype.join.call(arguments, ", "));
}

var AnimationLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        var size = cc.winSize;
        var man = new cc.Sprite();
        var animation = new cc.Animation();
        for (var i = 0; i < animation_pngs.length; i++) {
            animation.addSpriteFrameWithFile(animation_pngs[i]);
        }
        animation.setDelayPerUnit(1/14);
        var action = cc.animate(animation);
        action.repeatForever();
        man.runAction(action);
        this.addChild(man);
        man.x = size.width/2;
        man.y = size.height/2;
    }
});

var ArmatureLayer = cc.Layer.extend({
    _armature:null,
    _direction:1,
    onEnter:function () {
        this._super();

        var winSize = cc.winSize;
        ccs.armatureDataManager.addArmatureFileInfo("res/DemoPlayer/DemoPlayer.ExportJson");
        this._armature = new ccs.Armature("DemoPlayer");
        this._armature.getAnimation().play("walk_fire");
        this._armature.scaleX = -0.25;
        this._armature.scaleY = 0.25;
        this._armature.x = winSize.width / 2 - 150;
        this._armature.y = winSize.height / 2;
        this._armature.getAnimation().setMovementEventCallFunc(this.animationEventHandler,this);
        this.addChild(this._armature);

        this._direction = 1;
    },

    animationEventHandler:function (armature, movementType, movementID) {
        if (movementType == ccs.MovementEventType.loopComplete) {
            if (movementID == "walk_fire") {
                var moveBy = cc.moveBy(2, cc.p(300 * this._direction, 0));
                this._armature.stopAllActions();
                this._armature.runAction(cc.sequence(moveBy, cc.callFunc(this.callback, this)));
                this._armature.getAnimation().play("walk");

                this._direction *= -1;
            }
        }
    },

    callback:function () {
        this._armature.runAction(cc.scaleTo(0.1, 0.25 * this._direction * -1, 0.25));
        this._armature.getAnimation().play("walk_fire", 10);
    }
});


var DragonBonesLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        ccs.armatureDataManager.addArmatureFileInfo("res/dragonbones/skeleton.png", "res/dragonbones/skeleton.plist", "res/dragonbones/skeleton.xml");
        var armature = new ccs.Armature("Dragon");
        armature.getAnimation().play("walk");
        armature.getAnimation().setSpeedScale(24/60);
        this.addChild(armature);
        armature.x = cc.winSize.width/2;
        armature.y = cc.winSize.height/2;
    }
});


var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
//        var layer = new AnimationLayer();
//        var layer = new ArmatureLayer();
        var layer = new DragonBonesLayer();
        this.addChild(layer);
    }
});











