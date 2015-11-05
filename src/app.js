function trace() {
    cc.log(Array.prototype.join.call(arguments, ", "));
}

var TiledMapLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        var map = new cc.TMXTiledMap("res/map.tmx");
        this.addChild(map);
        var layer = map.getLayer("layer1");
        var tile0 = layer.getTileAt(cc.p(1, 1));
        var rotate = cc.rotateBy(2, 360);
        tile0.runAction(rotate);
        var properties = map.getPropertiesForGID(layer.getTileGIDAt(cc.p(3, 2)));
        trace("properties.block", properties.block);

        this.scheduleOnce(function () {
            layer.setTileGID(31, cc.p(0, 0));
        }, 2);
    }
});


screenSize = 10;
tileSize = 32;
var UnlimitedTiledMapLayer = cc.Layer.extend({

    map: null,
    mapRight:0,
    mapTop:0,
    mapLeft:0,
    mapBottom:0,
    ctor: function () {
        this._super();

        var map = new cc.SpriteBatchNode("res/tile0.png");
        for (var i = 0; i < screenSize+2; i++) {
            for (var j = 0; j < screenSize+2; j++) {
                var tile = new cc.Sprite("res/tile" + this.getGIDAt(i, j) + ".png");
                tile.x = i * tileSize + tileSize / 2;
                tile.y = j * tileSize + tileSize / 2;
                map.addChild(tile);
            }
        }
        this.map = map;
        map.x = -tileSize;
        map.y = -tileSize;
        this.mapRight = this.mapTop = screenSize+2;
        this.mapLeft = this.mapBottom = 0;
        this.addChild(map);

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: this.move.bind(this)
        }, this);
    },

    getGIDAt: function (i, j) {
        //可以扩展为真正配置，这里简单全部返回一样的
        return 0;
    },

    move: function (event) {
        if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
            this.map.x += event.getDeltaX();
            this.map.y += event.getDeltaY();
            if(this.map.x/tileSize + this.mapRight - screenSize < 1){
                for (var i = -this.mapBottom; i < this.mapTop; i++) {
                    var tile = new cc.Sprite("res/tile" + this.getGIDAt(this.mapRight, i) + ".png");
                    tile.x = this.mapRight * tileSize + tileSize / 2;
                    tile.y = i * tileSize + tileSize / 2;
                    this.map.addChild(tile);
                }
                this.mapRight++;
            }
            if(this.map.x/tileSize - this.mapLeft > -1){
                for (var i = -this.mapBottom; i < this.mapTop; i++) {
                    var tile = new cc.Sprite("res/tile" + this.getGIDAt(-this.mapLeft, i) + ".png");
                    tile.x = -this.mapLeft * tileSize + tileSize / 2;
                    tile.y = i * tileSize + tileSize / 2;
                    this.map.addChild(tile);
                }
                this.mapLeft++;
            }
            if(this.map.y/tileSize + this.mapTop - screenSize < 1){
                for (var i = -this.mapLeft; i < this.mapRight; i++) {
                    var tile = new cc.Sprite("res/tile" + this.getGIDAt(i, this.mapTop) + ".png");
                    tile.x = i * tileSize + tileSize / 2;
                    tile.y = this.mapTop * tileSize + tileSize / 2;
                    this.map.addChild(tile);
                }
                this.mapTop++;
            }
            if(this.map.y/tileSize - this.mapBottom > -1){
                for (var i = -this.mapLeft; i < this.mapRight; i++) {
                    var tile = new cc.Sprite("res/tile" + this.getGIDAt(i, this.mapBottom) + ".png");
                    tile.x = i * tileSize + tileSize / 2;
                    tile.y = -this.mapBottom * tileSize + tileSize / 2;
                    this.map.addChild(tile);
                }
                this.mapBottom++;
            }
        }
    }
});


var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
//        var layer = new TiledMapLayer();
        var layer = new UnlimitedTiledMapLayer();
        this.addChild(layer);
    }
});

