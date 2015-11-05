function trace(){
    cc.log(Array.prototype.join.call(arguments, ", "));
}

var BMFontLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        var size = cc.winSize;
        var bmFont1 = new cc.LabelBMFont("I am Kenko.", "res/font.fnt", 500, cc.TEXT_ALIGNMENT_CENTER);
        bmFont1.color = cc.color(255, 0, 0);
        this.addChild(bmFont1);
        bmFont1.x = size.width/2;
        bmFont1.y = size.height/2 + 50;
        var bmFont2 = new cc.LabelBMFont("AABBCCDDEEFFGG.", "res/bm.fnt", 500, cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(bmFont2);
        bmFont2.x = size.width/2;
        bmFont2.y = size.height/2 - 50;
    }
});


var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new BMFontLayer();
        this.addChild(layer);
    }
});











