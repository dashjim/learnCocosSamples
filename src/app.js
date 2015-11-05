function trace() {
    cc.log(Array.prototype.join.call(arguments, ", "));
}

var PriorityLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        var child1 = new cc.Sprite("res/bg.jpg");
        var child2 = new cc.Sprite("res/1.png");
        this.addChild(child1, 1);
        this.addChild(child2, 2);
        child1.x = child2.x = cc.winSize.width / 2;
        child1.y = child2.y = cc.winSize.height / 2;

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function () {
                trace("child1 clicked");
            }
        }, child1);
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function () {
                trace("child2 clicked");
            }
        }, child2);
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function () {
                trace("GameLayer clicked");
            }
        }, this);

        return true;
    }
});


var StopLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        var child1 = new cc.Sprite("res/bg.jpg");
        var child2 = new cc.Sprite("res/1.png");
        this.addChild(child1, 1);
        this.addChild(child2, 2);
        child1.x = child2.x = cc.winSize.width / 2;
        child1.y = child2.y = cc.winSize.height / 2;

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function (event) {
                trace("child1 clicked");
            }
        }, child1);
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function (event) {
                trace("child2 clicked first handler");
                event.stopPropagation();
            }
        }, child2);
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function (event) {
                trace("child2 clicked second handler");
            }
        }, child2);

        return true;
    }
});


var CustomSprite = cc.Sprite.extend({

    ctor: function () {
        this._super("res/1.png");
        cc.eventManager.dispatchCustomEvent("myEvent", {a: 1, b: 2});
        return true;
    }
});

var ListenerLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        cc.eventManager.addCustomListener("myEvent", function (event) {
            var data = event.getUserData();
            trace("event.getEventName", event.getEventName());
            trace("event.getUserData", data.a, data.b);
            cc.eventManager.removeCustomListeners("eventName");
        });

        var module = new CustomSprite();
        this.addChild(module, 1);
        module.x = cc.winSize.width / 2;
        module.y = cc.winSize.height / 2;

        return true;
    }
});


var CustomEventCenter = cc.Class.extend({

    ctor: function () {
        this._listenerMap = new Object();
    },

    addListener: function (event, callback) {
        if (!callback || !event)
            return;
        var listenerList = this._listenerMap[event];
        if (!listenerList)
            listenerList = this._listenerMap[event] = new Array();

        for (var i = 0; i < listenerList.length; i++) {
            if (listenerList[i] == callback)
                return;
        }
        listenerList.push(callback);
    },

    removeListener: function (event, callback) {
        if (!callback || !event)
            return;
        var listenerList = this._listenerMap[event];
        if (listenerList) {
            for (var i = 0; i < listenerList.length; i++) {
                if (listenerList[i] == callback) {
                    listenerList.splice(i, 1);
                    return;
                }
            }
        }
    },

    dispatchEvent: function (event, userData) {
        if (this._listenerMap[event]) {
            var listeners = this._listenerMap[event].slice();
            for (var i = 0; i < listeners.length; i++) {
                listeners[i](userData);
            }
        }
    }
});
MyEventCenter = new CustomEventCenter();


var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
//        var layer = new PriorityLayer();
//        var layer = new StopLayer();
//        var layer = new ListenerLayer();
//        this.addChild(layer);

        function handler1(data){
            trace("testEventHandler1", data);
        }
        function handler2(data){
            trace("testEventHandler2", data);
        }
        MyEventCenter.addListener("testEvent", handler1);
        MyEventCenter.addListener("testEvent", handler2);
        MyEventCenter.dispatchEvent("testEvent", "test1");
        MyEventCenter.removeListener("testEvent", handler1);
        MyEventCenter.dispatchEvent("testEvent", "test2");

    }
});