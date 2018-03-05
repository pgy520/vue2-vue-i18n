var page1BgInit = function () {
    var initWrap = function (index) {
        var $wrap = $("#page"+ index +"canvasWrap");
        var isInit = $wrap.html() == '' ? false : true;
        var html = "<canvas id=\"page"+ index +"canvas\"></canvas>";
        if(!isInit){
            $wrap.html(html);
        }
    }
    initWrap(1);

    var canvasW = function(){
        return $("#page1canvasWrap").width();
    }
    var canvasH = function(){
        return $("#page1canvasWrap").height();
    }
    function project3D(x,y,z,vars){

        var p,d;
        x-=vars.camX;
        y-=vars.camY-8;
        z-=vars.camZ;
        p=Math.atan2(x,z);
        d=Math.sqrt(x*x+z*z);
        x=Math.sin(p-vars.yaw)*d;
        z=Math.cos(p-vars.yaw)*d;
        p=Math.atan2(y,z);
        d=Math.sqrt(y*y+z*z);
        y=Math.sin(p-vars.pitch)*d;
        z=Math.cos(p-vars.pitch)*d;
        var rx1=-1000;
        var ry1=1;
        var rx2=1000;
        var ry2=1;
        var rx3=0;
        var ry3=0;
        var rx4=x;
        var ry4=z;
        var uc=(ry4-ry3)*(rx2-rx1)-(rx4-rx3)*(ry2-ry1);
        var ua=((rx4-rx3)*(ry1-ry3)-(ry4-ry3)*(rx1-rx3))/uc;
        var ub=((rx2-rx1)*(ry1-ry3)-(ry2-ry1)*(rx1-rx3))/uc;
        if(!z)z=0.000000001;
        if(ua>0&&ua<1&&ub>0&&ub<1){
            return {
                x:vars.cx+(rx1+ua*(rx2-rx1))*vars.scale,
                y:vars.cy+y/z*vars.scale,
                d:(x*x+y*y+z*z)
            };
        }else{
            return { d:-1 };
        }
    }
    function elevation(x,y,z){

        var dist = Math.sqrt(x*x+y*y+z*z);
        if(dist && z/dist>=-1 && z/dist <=1) return Math.acos(z / dist);
        return 0.00000001;
    }
    function rgb(col){

        col += 0.000001;
        var r = parseInt((0.5+Math.sin(col)*0.5)*16);
        var g = parseInt((0.5+Math.cos(col)*0.5)*16);
        var b = parseInt((0.5-Math.sin(col)*0.5)*16);
        return "#"+r.toString(16)+g.toString(16)+b.toString(16);
    }
    function interpolateColors(RGB1,RGB2,degree){

        var w2=degree;
        var w1=1-w2;
        return [w1*RGB1[0]+w2*RGB2[0],w1*RGB1[1]+w2*RGB2[1],w1*RGB1[2]+w2*RGB2[2]];
    }
    function rgbArray(col){

        col += 0.000001;
        var r = parseInt((0.5+Math.sin(col)*0.5)*256);
        var g = parseInt((0.5+Math.cos(col)*0.5)*256);
        var b = parseInt((0.5-Math.sin(col)*0.5)*256);
        return [r, g, b];
    }
    function colorString(arr){

        var r = parseInt(arr[0]);
        var g = parseInt(arr[1]);
        var b = parseInt(arr[2]);
        return "#"+("0" + r.toString(16) ).slice (-2)+("0" + g.toString(16) ).slice (-2)+("0" + b.toString(16) ).slice (-2);
    }
    function process(vars){


        if(vars.points.length<vars.initParticles) for(var i=0;i<5;++i) spawnParticle(vars);
        var p,d,t;

        p = Math.atan2(vars.camX, vars.camZ);
        d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ);
        d -= Math.sin(vars.frameNo / 80) / 25;
        t = Math.cos(vars.frameNo / 300) / 165;
        vars.camX = Math.sin(p + t) * d;
        vars.camZ = Math.cos(p + t) * d;
        vars.camY = -Math.sin(vars.frameNo / 220) * 15;
        vars.yaw = Math.PI + p + t;
        vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;

        var t;
        for(var i=0;i<vars.points.length;++i){

            x=vars.points[i].x;
            y=vars.points[i].y;
            z=vars.points[i].z;
            d=Math.sqrt(x*x+z*z)/1.0075;
            t=.1/(1+d*d/5);
            p=Math.atan2(x,z)+t;
            vars.points[i].x=Math.sin(p)*d;
            vars.points[i].z=Math.cos(p)*d;
            vars.points[i].y+=vars.points[i].vy*t*((Math.sqrt(vars.distributionRadius)-d)*2);
            if(vars.points[i].y>vars.vortexHeight/2 || d<.25){
                vars.points.splice(i,1);
                spawnParticle(vars);
            }
        }
    }
    function drawFloor(vars){

        var x,y,z,d,point,a;
        for (var i = -25; i <= 25; i += 1) {
            for (var j = -25; j <= 25; j += 1) {
                x = i*2;
                z = j*2;
                y = vars.floor;
                d = Math.sqrt(x * x + z * z);
                point = project3D(x, y-d*d/85, z, vars);
                if (point.d != -1) {
                    size = 1 + 15000 / (1 + point.d);
                    a = 0.15 - Math.pow(d / 50, 4) * 0.15;
                    if (a > 0) {
                        vars.ctx.fillStyle = colorString(interpolateColors(rgbArray(d/26-vars.frameNo/40),[0,128,32],.5+Math.sin(d/6-vars.frameNo/8)/2));
                        vars.ctx.globalAlpha = a;
                        vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
                    }
                }
            }
        }
        vars.ctx.fillStyle = "#82f";
        for (var i = -25; i <= 25; i += 1) {
            for (var j = -25; j <= 25; j += 1) {
                x = i*2;
                z = j*2;
                y = -vars.floor;
                d = Math.sqrt(x * x + z * z);
                point = project3D(x, y+d*d/85, z, vars);
                if (point.d != -1) {
                    size = 1 + 15000 / (1 + point.d);
                    a = 0.15 - Math.pow(d / 50, 4) * 0.15;
                    if (a > 0) {
                        vars.ctx.fillStyle = colorString(interpolateColors(rgbArray(-d/26-vars.frameNo/40),[32,0,128],.5+Math.sin(-d/6-vars.frameNo/8)/2));
                        vars.ctx.globalAlpha = a;
                        vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
                    }
                }
            }
        }
    }
    function sortFunction(a,b){
        return b.dist-a.dist;
    }
    function draw(vars){

        vars.ctx.globalAlpha=.15;
        vars.ctx.fillStyle="#000";
        vars.ctx.fillRect(0, 0, vars.canvas.width, vars.canvas.height);

        drawFloor(vars);

        var point,x,y,z,a;
        for(var i=0;i<vars.points.length;++i){
            x=vars.points[i].x;
            y=vars.points[i].y;
            z=vars.points[i].z;
            point=project3D(x,y,z,vars);
            if(point.d != -1){
                vars.points[i].dist=point.d;
                size=1+vars.points[i].radius/(1+point.d);
                d=Math.abs(vars.points[i].y);
                a = .8 - Math.pow(d / (vars.vortexHeight/2), 1000) * .8;
                vars.ctx.globalAlpha=a>=0&&a<=1?a:0;
                vars.ctx.fillStyle=rgb(vars.points[i].color);
                if(point.x>-1&&point.x<vars.canvas.width&&point.y>-1&&point.y<vars.canvas.height)vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
            }
        }
        vars.points.sort(sortFunction);
    }
    function spawnParticle(vars){

        var p,ls;
        pt={};
        p=Math.PI*2*Math.random();
        ls=Math.sqrt(Math.random()*vars.distributionRadius);
        pt.x=Math.sin(p)*ls;
        pt.y=-vars.vortexHeight/2;
        pt.vy=vars.initV/20+Math.random()*vars.initV;
        pt.z=Math.cos(p)*ls;
        pt.radius=200+800*Math.random();
        pt.color=pt.radius/1000+vars.frameNo/250;
        vars.points.push(pt);
    }
    function frame(vars) {

        if(vars === undefined){
            var vars={};
            vars.canvas = document.querySelector("#page1canvas");
            vars.ctx = vars.canvas.getContext("2d");
            vars.canvas.width = canvasW();
            vars.canvas.height = canvasH();
            window.addEventListener("resize", function(){
                vars.canvas.width = canvasW();
                vars.canvas.height = canvasH();
                vars.cx=vars.canvas.width/2;
                vars.cy=vars.canvas.height/2;
            }, true);
            vars.frameNo=0;

            vars.camX = 0;
            vars.camY = 0;
            vars.camZ = -14;
            vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;
            vars.yaw = 0;
            vars.cx=vars.canvas.width/2;
            vars.cy=vars.canvas.height/2;
            vars.bounding=10;
            vars.scale=500;
            vars.floor=26.5;

            vars.points=[];
            vars.initParticles=700;
            vars.initV=.01;
            vars.distributionRadius=800;
            vars.vortexHeight=25;
        }

        vars.frameNo++;
        requestAnimationFrame(function() {
            frame(vars);
        });

        process(vars);
        draw(vars);
    }
    frame();
}
var page1BgDestroy = function (show) {
        //$("#page1canvasWrap").html("");
        if(show){
            $("#page1canvasWrap").css('display','block');
        }else{
            $("#page1canvasWrap").css('display','none');
        }
    }
var page2BgInit = function () {
    var initWrap = function (index) {
        var $wrap = $("#page"+ index +"canvasWrap");
        var isInit = $wrap.html() == '' ? false : true;
        var html = "<canvas class=\"canvas canvas-pattern js-canvas\" style=\"display: none; border-radius: 50%;  margin-left: 40%;\"></canvas>";
        html += "<canvas class=\"canvas js-duplicate\" style=\"display: block; border-radius: 50%; margin-left: 40%;\"></canvas>";
        if(!isInit){
            $wrap.html(html);
        }
    }
    initWrap(2);

    var canvasW = function(){
        return $("#page2canvasWrap").width();
    }
    var canvasH = function(){
        return $("#page2canvasWrap").height();
    }

    const canvas = document.querySelector('.js-canvas');
    const ctx = canvas.getContext('2d');

    const canvas2 = document.querySelector('.js-duplicate');
    const ctx2 = canvas2.getContext('2d');

    const dim = Math.min(canvasW(), canvasH()) * 0.95;
    const w = dim;
    const h = dim;
    const midX = w >> 1;
    const midY = h >> 1;

    const PI = Math.PI;
    const TO_RADIAN = PI / 180;

    const maxDepth = 5;
    const maxSpread = 90 * TO_RADIAN;

    let autoAnimate = true;
    let divergeAt = 0.5;
    let spread = 45 * TO_RADIAN;
    let tick = 0;

    let autoSpeed = 0.004;
    let autoTick = 0;

    canvas.width = canvas2.width = w;
    canvas.height = canvas2.height = h;

    class Branch {
        constructor(position = {x : 0, y: 0}, length = 100, divergeAt = 0.5, angle = 0, depth = 0, spread = 45 * TO_RADIAN) {
            this.position = position;
            this.length = length;
            this.divergeAt = divergeAt;
            this.angle = angle;
            this.depth = depth;

            this.color = '#000';
            this.spread = spread;
            this.branches = [];

            this.grow();
        }

        grow() {
            if (!this.canBranch) {
                return;
            }

            this.branches = [];

            const nextLength = this.length * 0.75;
            const nextDepth = this.depth + 1;

            this.branches.push(
                new Branch(
                    this.growPosition,
                    nextLength,
                    this.divergeAt,
                    this.angle + this.spread,
                    nextDepth,
                    this.spread
                ),
                new Branch(
                    this.growPosition,
                    nextLength,
                    this.divergeAt,
                    this.angle - this.spread,
                    nextDepth,
                    this.spread
                )
            );
        }

        update(spread, divergeAt) {
            this.spread = spread;
            this.divergeAt = divergeAt;

            this.grow();
        }

        get growPosition() {
            const dl = this.length * this.divergeAt;

            return {
                x: this.position.x + (Math.cos(this.angle) * dl),
                y: this.position.y + (Math.sin(this.angle) * dl),
            };
        }

        get canBranch() {
            return this.depth < maxDepth;
        }
    }

    const rootBranch = new Branch(
        { x: midX, y: midY },
        midY * 0.5,
        divergeAt,
        -90 * TO_RADIAN,
        0,
        spread
    );

    const drawBranch = (branch, phase) => {
        const h = ~~(200 + (160 * phase));
        const l = 50 + ~~(((branch.depth / (maxDepth + 1))) * 50);

        const endX = branch.length;
        const endY = 0;
        const r = 2;

        ctx.save();

        ctx.strokeStyle = `hsl(${h}, 100%, ${l}%)`;
        ctx.translate(branch.position.x, branch.position.y);
        ctx.rotate(branch.angle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
        ctx.arc(endX, endY, r, 0, PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.restore();

        branch.branches.forEach((b) => {
            drawBranch(b, phase);
    });
    };

    const map = (value, start1, stop1, start2, stop2) => ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;

    const clear = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
    };

    const loop = () => {
        let phase = rootBranch.spread / maxSpread;

        clear(phase);

        if (autoAnimate) {
            phase = map(Math.sin(autoTick), -1, 1, 0, 1);

            spread = phase * maxSpread;
            divergeAt = map(Math.sin(autoTick), -1, 1, 0, 0.5);

            autoTick += autoSpeed;
        }

        rootBranch.update(spread, divergeAt);

        drawBranch(rootBranch, phase);

        const numSegments = 12;
        const angleInc = PI * 2 / numSegments;
        let angle = tick;

        for (let i = 0; i < numSegments; i++) {
            ctx2.save();
            ctx2.translate(midX, midY);
            ctx2.rotate(angle);
            ctx2.drawImage(canvas, -w / 2, -h / 2);
            ctx2.restore();
            angle += angleInc;
        }

        tick += 0.002;

        requestAnimationFrame(loop);
    };

    const onPointerMove = (e) => {
        if (autoAnimate) {
            return;
        }

        const target = (e.touches && e.touches.length) ? e.touches[0] : e;
        const { clientX: x, clientY: y } = target;

        const width = canvasW();
        const height = canvasH();

        spread = (x / width) * maxSpread;
        divergeAt = y / height;
    };

    document.body.addEventListener('mousemove', onPointerMove);
    //document.body.addEventListener('touchmove', onPointerMove);

    document.addEventListener('mouseenter', () => {
        autoAnimate = false;
});

    document.addEventListener('mouseleave', () => {
        autoAnimate = true;
});
    loop();
}
var page2BgDestroy = function (show) {
    //$("#page2canvasWrap").html("");
    if(show){
        $("#page2canvasWrap").show();
    }else{
        $("#page2canvasWrap").hide();
    }
}
var page3BgInit = function () {
    var initWrap = function (index) {
        var $wrap = $("#page"+ index +"canvasWrap");
        var isInit = $wrap.html() == '' ? false : true;
        var html = "<canvas id=\"page"+ index +"canvas\"></canvas>";
        if(!isInit){
            $wrap.html(html);
        }
    }
    initWrap(3);

    var canvasW = function(){
        return $('#page3canvasWrap').width();
    };
    var canvasH = function(){
        return (canvasW() / 1.2);
    }
    var renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("#page3canvas"),
        antialias: true,
        alpha : true
    });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(canvasW(), canvasH());
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
        45,
        canvasW() / canvasH(),
        1,
        1000
    );
    camera.position.z = 60;
    var length = 30;
    var mouseJump = {
        x: 0,
        y: 0
    };
    var offset = 0;
    function Spline() {
        this.geometry = new THREE.Geometry();
        this.color = Math.floor(Math.random() * 80 + 180);
        for (var j = 0; j < 180; j++) {
            this.geometry.vertices.push(
                new THREE.Vector3(j / 180 * length * 2 - length, 0, 0)
            );
            this.geometry.colors[j] = new THREE.Color(
                "hsl(" + (j * 0.6 + this.color) + ",70%,70%)"
            );
        }
        this.material = new THREE.LineBasicMaterial({
            vertexColors: THREE.VertexColors
        });
        this.mesh = new THREE.Line(this.geometry, this.material);
        this.speed = (Math.random() + 0.1) * 0.0002;
        scene.add(this.mesh);
    }
    var isMouseDown = false;
    var prevA = 0;
    function render(a) {
        requestAnimationFrame(render);
        for (var i = 0; i < splines.length; i++) {
            for (var j = 0; j < splines[i].geometry.vertices.length; j++) {
                var vector = splines[i].geometry.vertices[j];
                vector.y =
                    noise.simplex2(j * 0.05 + i - offset, a * splines[i].speed) * 8;
                vector.z = noise.simplex2(vector.x * 0.05 + i, a * splines[i].speed) * 8;

                vector.y *= 1 - Math.abs(vector.x / length);
                vector.z *= 1 - Math.abs(vector.x / length);
            }
            splines[i].geometry.verticesNeedUpdate = true;
        }
        scene.rotation.x = a * 0.0003;
        if (isMouseDown) {
            mouseJump.x += 0.001;
            if (a - prevA > 100) {
                updateColor();
                prevA = a;
            }
        } else {
            mouseJump.x -= 0.001;
        }
        mouseJump.x = Math.max(0, Math.min(0.07, mouseJump.x));
        offset += mouseJump.x;
        renderer.render(scene, camera);
        $('#page3canvas').css('margin-top',canvasH() * (-0.5));
    }
    var splines = [];
    for (var i = 0; i < 12; i++) splines.push(new Spline());
    function onResize() {
        camera.aspect = canvasW() / canvasH();
        camera.updateProjectionMatrix();
        renderer.setSize(canvasW(), canvasH());
        $('#page3canvas').css('margin-top',canvasH() * (-0.5));
    }
    function updateColor() {
        for (var i = 0; i < splines.length; i++) {
            var color = Math.abs((splines[i].color - offset * 10) % 360);
            for (var j = 0; j < splines[i].geometry.vertices.length; j++) {
                splines[i].mesh.geometry.colors[j] = new THREE.Color(
                    "hsl(" + (j * 0.6 + color) + ",70%,70%)"
                );
            }
            splines[i].mesh.geometry.colorsNeedUpdate = true;
        }
    }
    function onMouseDown(e) {
        isMouseDown = true;
        e.preventDefault();
        return false;
    }
    function onMouseUp() {
        isMouseDown = false;
    }
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onMouseDown);
    document.body.addEventListener("mousedown", onMouseDown);
    document.body.addEventListener("mouseup", onMouseUp);
    //document.body.addEventListener("touchstart", onMouseDown);
    //document.body.addEventListener("touchend", onMouseUp);
    requestAnimationFrame(render);

}
var page3BgDestroy = function (show) {
    //$("#page3canvasWrap").html("");
    if(show){
        $("#page3canvasWrap").show();
    }else{
        $("#page3canvasWrap").hide();
    }
}
var page4BgInit = function () {
    var initWrap = function (index) {
        var $wrap = $("#page"+ index +"canvasWrap");
        var isInit = $wrap.html() == '' ? false : true;
        var html = "<canvas id=\"page"+ index +"canvas\"></canvas>";
        if(!isInit){
            $wrap.html(html);
        }
    }
    initWrap(4);

    var canvasW = function(){
        return $("#page4canvasWrap").width();
    }
    var canvasH = function(){
        return $("#page4canvasWrap").height();
    }

    const PHI = (1 + Math.sqrt(5)) / 2, // 1.618033988749895
        maxGeneration = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) ? 5 : 6,
        frameDuration = 1000 / 60,
        duration = 3000,
        rotationSpeed = 0.3,
        totalIterations = Math.floor(duration / frameDuration),
        maxBaseSize = 50,
        baseSizeSpeed = 0.02;

    var canvas = $("#page4canvas")[0],
        ctx = canvas.getContext("2d"),
        canvasWidth = canvasW(),
        canvasHeight = canvasH(),
        shapes = [],
        sizeVariation,
        iteration = 0,
        animationDirection = 1,
        sizeVariationRange = .15,
        baseRotation = 0,
        baseSize = 30,
        c1 = 43,
        c1S = 1,
        c2 = 205,
        c2S = 1,
        c3 = 255,
        c3S = 1;

    canvas.setAttribute("width", canvasWidth);
    canvas.setAttribute("height", canvasHeight);

    function Shape(gen, x, y, size, rotation) {
        this.generation = gen;
        this.size = size;
        this.rotation = -rotation;
        this.start = {
            x: x,
            y: y
        };
        this.end = {
            x_1: this.start.x + Math.cos(degToRad(this.rotation)) * this.size,
            y_1: this.start.y + Math.sin(degToRad(this.rotation)) * this.size,
            x_2: this.start.x + Math.cos(degToRad(this.rotation + 360 / 3)) * this.size,
            y_2: this.start.y + Math.sin(degToRad(this.rotation + 360 / 3)) * this.size,
            x_3:
            this.start.x +
            Math.cos(degToRad(this.rotation + 360 / 3 * 2)) * this.size,
            y_3:
            this.start.y + Math.sin(degToRad(this.rotation + 360 / 3 * 2)) * this.size
        };

        this.init();
    }

    Shape.prototype.init = function() {
        if (this.generation < maxGeneration) {
            var gen = this.generation + 1,
                newSize = this.size * sizeVariation,
                newRotation = this.rotation;

            shapes.push(
                new Shape(gen, this.end.x_1, this.end.y_1, newSize, newRotation)
            );
            shapes.push(
                new Shape(gen, this.end.x_2, this.end.y_2, newSize, newRotation)
            );
            shapes.push(
                new Shape(gen, this.end.x_3, this.end.y_3, newSize, newRotation)
            );
        }
        this.draw();
    };

    Shape.prototype.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x_1, this.end.y_1);
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x_2, this.end.y_2);
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x_3, this.end.y_3);
        //ctx.closePath();
        ctx.strokeStyle =
            "rgba(" + c1 + "," + c2 + "," + c3 + "," + 1 / this.generation / 5 + ")";
        ctx.stroke();
        //ctx.fill();
    };

    function animate() {
        //ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0,17,35,.5)";
        //ctx.fillStyle = "rgba(0,0,0,.1)";
        //ctx.fillStyle = "rgb(23,30,50)";
        //ctx.fillStyle = "#012";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        //ctx.globalCompositeOperation = "lighter";
        shapes = [];
        shapes.push(
            new Shape(0, canvasWidth / 2, canvasHeight / 2, baseSize, baseRotation)
        );

        changeColor();
        iteration++;
        if (baseSize < maxBaseSize) baseSize += baseSizeSpeed;
        baseRotation += rotationSpeed;
        sizeVariation = easeInOutSine(
            iteration,
            1 - sizeVariationRange * animationDirection,
            sizeVariationRange * 2 * animationDirection,
            totalIterations
        );
        if (iteration >= totalIterations) {
            iteration = 0;
            animationDirection *= -1;
        }
        requestAnimationFrame(animate);
    }

    function degToRad(deg) {
        return Math.PI / 180 * deg;
    }

    function easeInOutSine(
        currentIteration,
        startValue,
        changeInValue,
        totalIterations
    ) {
        return (
            changeInValue /
            2 *
            (1 - Math.cos(Math.PI * currentIteration / totalIterations)) +
            startValue
        );
    }

    function changeColor() {
        if (c1 == 0 || c1 == 255) c1S *= -1;
        if (c2 == 0 || c2 == 255) c2S *= -1;
        if (c3 == 0 || c3 == 255) c3S *= -1;
        c1 += 1 * c1S;
        c2 += 1 * c2S;
        c3 += 1 * c3S;
    }

    ctx.globalCompositeOperation = "lighter";
    animate();

    window.addEventListener("resize", function() {
        canvasWidth = canvasW();
        canvasHeight = canvasH();

        canvas.setAttribute("width", canvasWidth);
        canvas.setAttribute("height", canvasHeight);
        ctx.strokeStyle = "rgba(66,134,240,.1)";
        ctx.globalCompositeOperation = "lighter";
    });
}
var page4BgDestroy = function (show) {
    //$("#page4canvasWrap").html("");
    if(show){
        $("#page4canvasWrap").show();
    }else{
        $("#page4canvasWrap").hide();
    }
}
var page5BgInit = function () {
    $("#page5canvasWrap").show();
}
var page5BgDestroy = function (show) {
    if(show){
        $("#page5canvasWrap").show();
    }else{
        $("#page5canvasWrap").hide();
    }
}
var page7BgInit = function () {
    var container = $("#page7canvasWrap")[0];

    var canvasW = function(){
        return $(container).width();
    }
    var canvasH = function(){
        return $(container).height();
    }
    var SEPARATION = 100, AMOUNTX = 30, AMOUNTY = 30;

    var camera, scene, renderer;

    var particles, particle, count = 0;

    var mouseX = 0, mouseY = -500;

    var windowHalfX = canvasW() / 2;
    var windowHalfY = canvasH() / 2;

    init();
    animate();

    function init() {

        //container = document.createElement('div');
        //document.body.appendChild(container);

        camera = new THREE2.PerspectiveCamera(75, canvasW() / canvasH(), 1, 10000);
        camera.position.z = 1000;

        scene = new THREE2.Scene();

        particles = new Array();

        var PI2 = Math.PI * 2;
        var material = new THREE2.ParticleCanvasMaterial({

            color: 0xffffff,
            program: function (context) {

                context.beginPath();
                context.arc(0, 0, 1, 0, PI2, true);
                context.fill();

            }

        });

        var i = 0;

        for (var ix = 0; ix < AMOUNTX; ix++) {

            for (var iy = 0; iy < AMOUNTY; iy++) {

                particle = particles[i++] = new THREE2.Particle(material);
                particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
                particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
                scene.add(particle);

            }

        }

        renderer = new THREE2.CanvasRenderer();
        renderer.setSize(canvasW(), canvasH());
        container.appendChild(renderer.domElement);

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        //document.addEventListener('touchstart', onDocumentTouchStart, false);
        //document.addEventListener('touchmove', onDocumentTouchMove, false);

        //

        window.addEventListener('resize', onWindowResize, false);

    }

    function onWindowResize() {

        windowHalfX = canvasW() / 2;
        windowHalfY = canvasH() / 2;

        camera.aspect = canvasW() / canvasH();
        camera.updateProjectionMatrix();

        renderer.setSize(canvasW(), canvasH());

    }

    //

    function onDocumentMouseMove(event) {

        mouseX = event.clientX - windowHalfX;
        //mouseY = event.clientY - windowHalfY;

    }

    function onDocumentTouchStart(event) {

        if (event.touches.length === 1) {

            event.preventDefault();

            mouseX = event.touches[0].pageX - windowHalfX;
            //mouseY = event.touches[0].pageY - windowHalfY;

        }

    }

    function onDocumentTouchMove(event) {

        if (event.touches.length === 1) {

            event.preventDefault();

            mouseX = event.touches[0].pageX - windowHalfX;
            //mouseY = event.touches[0].pageY - windowHalfY;

        }

    }

    //

    function animate() {

        requestAnimationFrame(animate);

        render();


    }

    function render() {

        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( -mouseY - camera.position.y ) * .05;
        camera.lookAt(scene.position);

        var i = 0;

        for (var ix = 0; ix < AMOUNTX; ix++) {

            for (var iy = 0; iy < AMOUNTY; iy++) {

                particle = particles[i++];
                particle.position.y = ( Math.sin(( ix + count ) * 0.3) * 50 ) + ( Math.sin(( iy + count ) * 0.5) * 50 );
                particle.scale.x = particle.scale.y = ( Math.sin(( ix + count ) * 0.3) + 1 ) * 2 + ( Math.sin(( iy + count ) * 0.5) + 1 ) * 2;

            }

        }

        renderer.render(scene, camera);

        count += 0.1;

    }
}
var page7BgDestroy = function (show) {
    //$("#page7canvasWrap").html("");
    if(show){
        $("#page7canvasWrap").show();
    }else{
        $("#page7canvasWrap").hide();
    }
}