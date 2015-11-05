function trace(){
    cc.log(Array.prototype.join.call(arguments, ", "));
}

var MenuItemSpriteLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        var spriteNormal = new cc.Sprite("res/startgame.png");
        var spriteSelected = new cc.Sprite("res/startgame2.png");
        var spriteDisable = new cc.Sprite("res/startgame3.png");
//        var menuSprite = new cc.MenuItemSprite(spriteNormal, spriteSelected, spriteDisable, this.startGame.bind(this));
        var menuSprite = new cc.MenuItemSprite(spriteNormal, spriteSelected, spriteDisable, this.startGame);
        var menu = new cc.Menu(menuSprite);
        this.addChild(menu);
        menuSprite.setEnabled(false);
    },

    startGame: function () {
        trace("this is MenuItemSpriteLayer?", this instanceof MenuItemSpriteLayer);
    }
});

var MenuItemImageLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        var menuImage = new cc.MenuItemImage("res/startgame.png", "res/startgame2.png", "res/startgame3.png", this.startGame, this);
        var menu = new cc.Menu(menuImage);
        this.addChild(menu);
    },

    startGame: function () {
        trace("menuImage clicked");
    }
});

var MenuItemFontLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        var menuFont = new cc.MenuItemFont("START GAME", this.startGame, this);
        menuFont.fontSize = 32;
        menuFont.fontName = "Arial";
        var menu = new cc.Menu(menuFont);
        this.addChild(menu);
    },

    startGame: function () {
        trace("start game button clicked");
    }
});

var MenuItemLabelLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

//        var label = new cc.LabelTTF("START GAME", "Arial", 32);
//        var item = new cc.MenuItemLabel(label, this.startGame, this);

        var label = new cc.LabelBMFont("START GAME", "res/font.fnt");
        var item = new cc.MenuItemLabel(label, this.startGame, this);

        var menu = new cc.Menu(item);
        this.addChild(menu);
    },

    startGame: function () {
        trace("start game button clicked");
    }
});

var MenuItemToggleLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(32);
        var on = new cc.MenuItemFont("ON");
        var off = new cc.MenuItemFont("OFF");
        var item = new cc.MenuItemToggle(off, on, this.toggleMusic, this);

        var menu = new cc.Menu(item);
        this.addChild(menu);
    },

    toggleMusic: function () {
        if(this.musicOff){
            trace("music on");
            this.musicOff = false;
        }else{
            trace("music off");
            this.musicOff = true;
        }
    }
});


var MenuItemToggleLayer2 = cc.Layer.extend({

    ctor: function () {
        this._super();

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(32);
        var easy = new cc.MenuItemFont("EASY");
        var normal = new cc.MenuItemFont("NORMAL");
        var hard = new cc.MenuItemFont("HARD");
        var item = new cc.MenuItemToggle(easy, normal, hard, this.changeMode, this);

        var menu = new cc.Menu(item);
        this.addChild(menu);
    },

    changeMode: function () {
    }
});

var MenuLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(24);
        var one = new cc.MenuItemFont("one", this.clickHandler);
        var two = new cc.MenuItemFont("two", this.clickHandler);
        var three = new cc.MenuItemFont("three", this.clickHandler);
        var four = new cc.MenuItemFont("four", this.clickHandler);
        var five = new cc.MenuItemFont("five", this.clickHandler);
        var six = new cc.MenuItemFont("six", this.clickHandler);

        var menu = new cc.Menu(one, two, three, four, five, six);
        this.addChild(menu);
//        menu.alignItemsVertically();
//        menu.alignItemsHorizontally();
        menu.alignItemsHorizontallyWithPadding(20);
//        menu.alignItemsInRows(4,2);
//        menu.alignItemsInColumns(2,2,2);
    },

    clickHandler: function () {
    }
});

var TTFLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        var winSize = cc.director.getWinSize();
        var aboutText = new cc.LabelTTF("About the game ...", "Arial", 20, cc.size(350, 200), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        aboutText.x = winSize.width/2;
        aboutText.y = winSize.height/2;
        this.addChild(aboutText);
    }
});

var UIEditorLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        var root = ccs.uiReader.widgetFromJsonFile("res/FirstUI_1/FirstUI_1.json");
        this.addChild(root);

        var button = ccui.helper.seekWidgetByTag(root, 30);
        if("touches" in cc.sys.capabilities){
            button.addTouchEventListener(this.buttonTouched, this);
        }else{
            button.addClickEventListener(this.buttonClicked.bind(this));
        }

        var checkbox = ccui.helper.seekWidgetByName(root, "CheckBox_1");
        checkbox.addEventListener(this.selectedStateEvent, this);

        this.textField = ccui.helper.seekWidgetByTag(root, 36);
        this.textField.addEventListener(this.textFieldEvent, this);

        if(!cc.sys.isNative){
            this.textField.setString("");
        }
    },

    buttonTouched: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                trace("Touch Down");
                break;

            case ccui.Widget.TOUCH_MOVED:
                trace("Touch Move");
                break;

            case ccui.Widget.TOUCH_ENDED:
                trace("Touch Up");
                break;

            case ccui.Widget.TOUCH_CANCELED:
                trace("Touch Cancelled");
                break;
        }
    },

    buttonClicked: function (sender) {
        trace("buttonClicked");
        trace("textField input: " + this.textField.getString());
    },

    selectedStateEvent: function (sender, type) {
        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
                trace("Selected");
                break;
            case ccui.CheckBox.EVENT_UNSELECTED:
                trace("Unselected");
                break;
        }
    },

    textFieldEvent: function (sender, type) {
        switch (type) {
            case ccui.TextField. EVENT_ATTACH_WITH_IME:
                trace("attach with IME");
                break;
            case ccui.TextField. EVENT_DETACH_WITH_IME:
                trace("detach with IME");
                break;
            case ccui.TextField. EVENT_INSERT_TEXT:
                trace("insert words");
                break;
            case ccui.TextField. EVENT_DELETE_BACKWARD:
                trace("delete word");
                break;
        }
    }
});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
//        var layer = new MenuItemSpriteLayer();
//        var layer = new MenuItemImageLayer();
//        var layer = new MenuItemFontLayer();
//        var layer = new MenuItemLabelLayer();
//        var layer = new MenuItemToggleLayer();
//        var layer = new MenuItemToggleLayer2();
//        var layer = new MenuLayer();
//        var layer = new TTFLayer();
        var layer = new UIEditorLayer();
        this.addChild(layer);
    }
});