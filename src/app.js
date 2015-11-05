function trace(){
    cc.log(Array.prototype.join.call(arguments, ", "));
}

var ParticleLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        var particleSystem = new cc.ParticleSystem(100);
        this.addChild(particleSystem);
        particleSystem.texture = cc.textureCache.addImage("res/star.png");

        var size = cc.director.getWinSize();
        particleSystem.x = size.width / 2;
        particleSystem.y = size.height / 2;
        particleSystem.posVar = cc.p(0, 0);

        particleSystem.duration = cc.ParticleSystem.DURATION_INFINITY;
        particleSystem.emitterMode = cc.ParticleSystem.MODE_RADIUS;

        particleSystem.startRadius = 0;
        particleSystem.startRadiusVar = 30;
        particleSystem.endRadius = 240;
        particleSystem.endRadiusVar = 30;

        particleSystem.rotatePerS = 180;
        particleSystem.rotatePerSVar = 0;

        particleSystem.angle = 90;
        particleSystem.angleVar = 0;

        particleSystem.life = 10;
        particleSystem.lifeVar = 0;

        particleSystem.startSpin = 0;
        particleSystem.startSpinVar = 0;
        particleSystem.endSpin = 0;
        particleSystem.endSpinVar = 0;

        particleSystem.startColor = cc.color(128, 128, 128, 255);
        particleSystem.startColorVar = cc.color(128, 128, 128, 255);
        particleSystem.endColor = cc.color(128, 128, 128, 50);
        particleSystem.endColorVar = cc.color(26, 26, 26, 50);

        particleSystem.startSize = 32;
        particleSystem.startSizeVar = 0;
        particleSystem.endSize = cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE;

        particleSystem.emissionRate = particleSystem.totalParticles / particleSystem.life;
    }
});


var ParticleDemoLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

//        var particleSystem = new cc.ParticleFireworks();
//        particleSystem.texture = cc.textureCache.addImage("res/firework.png");
//        var particleSystem = new cc.ParticleFire();
//        particleSystem.texture = cc.textureCache.addImage("res/fire.png");
//        var particleSystem = new cc.ParticleSun();
//        particleSystem.texture = cc.textureCache.addImage("res/fire.png");
//        particleSystem.scale = 5;
//        var particleSystem = new cc.ParticleGalaxy();
//        particleSystem.texture = cc.textureCache.addImage("res/fire.png");
//        var particleSystem = new cc.ParticleFlower();
//        particleSystem.texture = cc.textureCache.addImage("res/firework.png");
//        var particleSystem = new cc.ParticleSnow();
//        particleSystem.texture = cc.textureCache.addImage("res/snow.png");
//        var particleSystem = new cc.ParticleMeteor();
//        particleSystem.texture = cc.textureCache.addImage("res/fire.png");
//        var particleSystem = new cc.ParticleSmoke();
//        particleSystem.texture = cc.textureCache.addImage("res/fire.png");
//        particleSystem.scale = 2;
//        var particleSystem = new cc.ParticleSpiral();
//        particleSystem.texture = cc.textureCache.addImage("res/fire.png");
        var particleSystem = new cc.ParticleExplosion();
        particleSystem.texture = cc.textureCache.addImage("res/firework.png");

        this.addChild(particleSystem);
        var size = cc.director.getWinSize();
        particleSystem.x = size.width / 2;
        particleSystem.y = size.height / 2;
    }
});


var ParticleEditorLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        var particleSystem = new cc.ParticleSystem("res/particle.plist");
        this.addChild(particleSystem);
        particleSystem.duration = 3;
        var size = cc.director.getWinSize();
        particleSystem.x = size.width / 2;
        particleSystem.y = size.height / 2;
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
//        var layer = new ParticleLayer();
//        var layer = new ParticleDemoLayer();
        var layer = new ParticleEditorLayer();
        this.addChild(layer);
    }
});











