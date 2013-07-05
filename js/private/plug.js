(function () {
    var DisPlayCpu = function () {
        this.MaxLength=100;
        this.CPULog=[];
        this.Zoom=200;
        this.Canvas=null;
    };
    DisPlayCpu.prototype={
        push:function(pVal){
            if(this.CPULog.length>=this.MaxLength){
                this.CPULog.shift();
            }
            this.CPULog.push(pVal);
        },
        pop:function(){
            return this.CPULog.pop();
        },
        attachCanvas:function(pCanvas,pThinLineThickness,pStrokeStyle,pHCenter){
            this.Canvas=pCanvas;
            this.Ctx=pCanvas.getContext("2d");
            this.ThinLineThickness = pThinLineThickness || 1;
            this.StrokeStyle=pStrokeStyle || "rgba(100,50,50,.7)";
            var _w=pCanvas.width,
                _h=pCanvas.height;
            this.StepX=(_w/this.MaxLength)>> 0;
            this.YPoint= pHCenter* _h;
        },
        draw:function(){
            var me =this,
                _ctx=me.Ctx,
                pointsData=me.CPULog,
                getX=function(pVal){
                    return me.StepX*pVal;
                },
                getY=function(pVal){
                    return me.YPoint-(pVal-1)*me.Zoom;
                };
            if(pointsData.length>2){
                _ctx.clearRect(0,0,me.Canvas.width,me.Canvas.height);
                _ctx.beginPath();
                _ctx.moveTo(getX(0),getY(pointsData[0]));
                for(var i= 1,l=me.MaxLength;i<l;i++){
                    _ctx.lineTo(getX(i),getY(pointsData[i]));
                }
                _ctx.lineWidth=me.ThinLineThickness;
                _ctx.strokeStyle=me.StrokeStyle;
                _ctx.stroke();
                _ctx.closePath();
            }
        }
    };

    var _addCpuWatchDom=function(){
        var _head= document.getElementsByTagName("HEAD")[0],
            _body=document.getElementsByTagName("BODY")[0],
            _style=document.createElement("STYLE");
        _style.setAttribute("type","text/css");
        _style.innerHTML='#breatheBoard{ margin:0px; height:0px;font-family:Arial @宋体;position:fixed; top:20px; left:5px; font-size:14px;}\
         #breatheBoard a{ display:inline-block; height:15px; width:90px; text-align:center; line-height:15px;}\
        .cpuUnit{ display:block; width:320px; height:140px;border-radius:20px;border:1px solid #C6E2FF; margin-top:5px;background:-webkit-gradient(linear, left top, left bottom, from(#E0FFFF), color-stop(0.5, #B0E2FF), to(#AEEEEE));}\
        .cpuUnit div{ margin:5px 0 0 8px;}\
        #cpuDom {background:#63B8FF;}\
        #cpuText{ color:#63B8FF; }\
        #cpuDomLog {background:#FFB90F;}\
        #cpuTextLog{ color:#FFB90F; }\
        .cpuShow{display:block; width:300px; height:20px;overflow:hidden;}\
        canvas{ border:1px solid #C6E2FF; height:100px; width:300px;border-radius:10px; background:white;}';
        _head.appendChild(_style);

        var _breatheBoard=document.createElement("DIV");
        _breatheBoard.setAttribute("id","breatheBoard");
        _breatheBoard.innerHTML='<div class="cpuUnit">\
        <div class="cpuShow">\
            <a id="cpuText">RATE:1.00000</a>\
            <a id="cpuDom">&nbsp;</a>\
        </div>\
        <div>\
            <canvas id="c1" width="300" height="100"></canvas>\
        </div>\
    </div>\
    <div class="cpuUnit">\
        <div class="cpuShow">\
            <a id="cpuTextLog">RATE:1.00000</a>\
            <a id="cpuDomLog">&nbsp;</a>\
        </div>\
        <div>\
        <canvas id="c2" width="300" height="100"></canvas>\
        </div>\
    </div>';
        _body.appendChild(_breatheBoard);

    },
    showPlus=function(){
        _addCpuWatchDom();

        var c1=document.getElementById("c1"),
            c2=document.getElementById("c2"),
            cb1=new DisPlayCpu(),
            cb2=new DisPlayCpu();
        cb1.attachCanvas(c1,2,null,0.5);
        cb2.attachCanvas(c2,2,null,0.5);

        //CPU Board
        var cpuDom = document.getElementById("cpuDom"),
            cpuText = document.getElementById("cpuText"),
            cpuDomLog = document.getElementById("cpuDomLog"),
            cpuTextLog = document.getElementById("cpuTextLog");
        $CPU.option({Mode:1});
        $CPU.onInterval = function (pCurrentDm, pCurrentTime) {
            var _rate = (pCurrentDm / (pCurrentTime * $CPU.option().Interval)).toFixed(5);
            cb1.push(_rate);
            cb1.draw();
            cpuDom.style.width = 100 + 2000 * (_rate - 1) + "px";
            cpuText.innerHTML = ["RATE:", _rate].join("");
        };
        $CPU.log = function (pCurrentRate) {
            var _rate = pCurrentRate.toFixed(5);
            cb2.push(_rate);
            cb2.draw();
            cpuDomLog.style.width = 100 + 2000 * (_rate - 1) + "px";
            cpuTextLog.innerHTML = ["RATE:", _rate].join("");
        };

        var T1 = $CPU.create(),
            T2 = $CPU.create();

        $CPU.start();
    };

    if(document.getElementsByTagName("BODY")[0]){
        showPlus();
    }else{
        window.onload=showPlus;
    }
})();