/*
 * @namespace   Lib
 * @Author:     yulianghuang
 * @CreateDate  2012/6/18
 * @description Thread Mode
 */
(function (window) {
    var _breathe = {
        _guid: 0,
        getGuid: function () {
            return this._guid++;
        },
        HEAD:document.getElementsByTagName("head")[0],
        ReleaseNo:0,
        JsonPDic:{}
    };

    _breathe.Algorithm = {
        /*
         * search item in the array
         * @param {array}
         * @param {function} the match
         *  case -1 search the first part
         *  case 1 search the latter part
         *  default match the case
         * @return {obj}
         */
        binarySearch: function (pObj, pDelegate) {
            var _start = 0,
                _end = pObj.length - 1,
                _mid,
                _sign,
                _obj;
            while (_start <= _end) {
                _mid = (_start + _end) / 2 >> 0,
                    _obj = pObj[_mid],
                    _sign = pDelegate(_obj);
                if (_sign === 1) {
                    _start = _mid + 1;
                } else if (_sign === -1) {
                    _end = _mid - 1;
                } else {
                    return {
                        Index: _mid,
                        Value: _obj
                    }
                }
            }
            return null;
        }
    };

    /*
     * ---------------------------  CPU MODE   ---------------------------
     */
    _breathe.CPU = new function () {
        var _threads = {},
            _options = {
                Interval: 50,
                Time: 10,
                WorkRate: 1.5,
                SleepWait:60000,
                Mode:2 //1 interval  2 timeout
            },
            _currentTime = 0,
            _currentDm = 0,
            _currentRate,
            _lastTime,
            _startTime,
            _clock,
            _freeStartTime=null,
            me=this,
        /*
         * excute the pqueues
         * @param {number} the current rate
         * @param {number} the pdm
         * @param {number} the pCpuDm
         */
            work = function (pRate, _pDm, pCpuDm) {
                if (pRate < _options.WorkRate) {
                    //to do
                    for (var t in _threads) {
                        _threads[t].PQueue.length > 0 && _threads[t].fire();
                    }
                }
                me.log(pRate, _pDm, pCpuDm);
            },
            stopInterval = function () { _clock && clearInterval(_clock); },
            startInterval = function () {
                _startTime=_lastTime = new Date();
                _clock = setInterval(function () {
                    _currentDm += new Date() - _lastTime;
                    _currentTime++;
                    me.onInterval(_currentDm, _currentTime);
                    if (_currentTime === _options.Time) {
                        var _cpuDm = _options.Time * _options.Interval;
                        _currentRate = _currentDm / _cpuDm;
                        //core
                        work(_currentRate, _currentDm, _cpuDm);
                        _currentTime = 0;
                        _currentDm = 0;
                        me.smartSleep();
                    }
                    _lastTime = new Date();
                }, _options.Interval);
            },
            stopTimeout=function(){
                _clock && clearTimeout(_clock);
            },
            startTimeout=function(){
                _freeStartTime=null;
                _startTime=_lastTime = new Date();
                _clock = setTimeout(function () {
                    _currentDm += new Date() - _lastTime;
                    _currentTime++;
                    me.onInterval(_currentDm, _currentTime);
                    if (_currentTime === _options.Time) {
                        var _cpuDm = _options.Time * _options.Interval;
                        _currentRate = _currentDm / _cpuDm;
                        //core
                        work(_currentRate, _currentDm, _cpuDm);
                        _currentTime = 0;
                        _currentDm = 0;
                    }
                    startTimeout.call(me);
                }, _options.Interval);
            };

        /*
         * sample set or get
         * @param {object|null}
         */
        this.option = function (pOptions) {
            if (pOptions) {
                for (var name in pOptions) {
                    _options[name] = pOptions[name];
                }
            } else {
                return _options;
            }
        };
        /*
         * start or restart the rolling
         */
        this.start = function () {
            if(_options.Mode===1){
                stopInterval();
                startInterval();
            }else{
                stopTimeout();
                startTimeout();
            }
        };
        /*
         * stop the rolling
         */
        this.pause = function () {
            if(_options.Mode===1){
                stopInterval();
            }else{
                stopTimeout();
            }
        };
        /*
         * stop the rolling and clear the threads stacks
         */
        this.stop=function(){
            me.pause();
            for(var id in _threads){
                delete _threads[id];
            }
            _threads={};
        };
        /*
         * create a new thread
         */
        this.create = function () {
            var _t = new _breathe.Thread();
            _threads[_t.Id] = _t;
            return _t;
        };
        /*
         * kill a thread
         * param {number}
         */
        this.kill = function (pId) {
            delete _threads[pId];
            _threads[pId] = undefined;
        };
        /*
         * get a thread instance in the stack
         * @param {number}
         * @return {objecj}
         */
        this.getThreads = function (pId) { return typeof pId === number ? (_threads[pId] || null) : _threads };
        /*
         * stop the cpu when needed ----can be overrided
         */
        this.smartSleep=function(){
            var pLength=0;
            for(var tId in _threads){
                pLength+=_threads[tId].PQueue.length;
            }
            if(pLength===0){
                if(_freeStartTime!==null){
                    if(new Date()- _startTime > _options.SleepWait){
                        this.stop();
                    }
                }else{
                    _freeStartTime = new Date();
                };
            }else{
                _freeStartTime=null;
            }
        };
        /*
         * log, excute with the function work excuting ----can be overrided
         */
        this.log = function () { };
        /*
         * excute every rolling
         */
        this.onInterval = function () { };

    };
    //Thread Mode
    _breathe.Thread = function () {
        this.TQueue = {};
        this.PQueue = [];
        this.Id = _breathe.getGuid();
        this.Lock = false; //1.normal 2.handle 3.close
    };
    _breathe.Thread.prototype = {
        /*
         * window.$e,_breathe.Event;
         * {
         *     Func:function(){},
         *     Priority:12,
         *     Id:12323,
         *     Args:[]
         * }
         */
        add: function (pEvent) {
            var _priority = pEvent.Priority;
            if (this.TQueue[_priority] === undefined) {
                this.PQueue.unshift(_priority);
                this.PQueue.sort();
                this.TQueue[_priority] = [];
            }
            this.TQueue[_priority].push(pEvent);
            pEvent.ThreadId = this.Id;
        },
        /*
         * remove an event
         * @param{event}
         */
        remove: function (pEvent) {
            var _priority = pEvent.Priority;
            for (var l = this.TQueue[_priority].length - 1; l !== -1; l--) {
                if (this.TQueue[_priority][l].ID === pEvent.ID) {
                    this.TQueue[_priority].splice(l, 1);
                    break;
                }
            }
            if (this.TQueue[_priority].length === 0) {
                var _index = _breathe.Algorithm.binarySearch(this.PQueue, function (pObj) {
                    return pObj === _priority ? 0 : (pObj < _priority ? 1 : -1);
                }).Index;
                this.PQueue.splice(_index, 1);
            }
            pEvent.ThreadId = undefined;
        },
        /*
         * fire
         */
        fire: function (pCallBack) {
            if (this.PQueue.length > 0 && !this.Lock) {
                var _priority = this.PQueue.shift();
                if (pCallBack) {
                    var _toDo = this.TQueue[_priority].length;
                    while (this.TQueue[_priority].length > 0) {
                        this.TQueue[_priority].shift().exc(function () {
                            _toDo--;
                            if (_toDo === 0) pCallBack();
                        });
                    }
                } else {
                    while (this.TQueue[_priority].length > 0) {
                        this.TQueue[_priority].shift().exc();
                    }
                }
            }
        }
    };
    /*
     * Event
     */
    _breathe.Event = function (pFunc, pPriority) {
        this.Func = pFunc;
        this.Priority = pPriority || this.Level.Normal;
        this.Id = _breathe.getGuid();
        //this.Args=[].slice.call(arguments, 2);
    };
    _breathe.Event.prototype = {
        attach: function (pThread) {
            if(pThread){
                pThread.add(this);
            }else if(this.ThreadId){
                _breathe.CPU.getThread(this.ThreadId).add(this);
            }
        },
        detach: function () {
            _breathe.CPU.getThread(this.ThreadId).remove(this);
        },
        exc: function (pCallBack) {
            this.Func.call(null, pCallBack);
        },
        /*
         * excute and cancel the relationship
         */
        excAndDetach: function () {
            this.Func();
            _breathe.CPU.getThread(this.ThreadId).remove(this);
        },
        Level:{
            High:1,
            AboveNormal:5,
            Normal:10,
            BellowNormal:15,
            Low:20
        }
    };

    /*
     * ---------------------------  LOAD MODE   ---------------------------
     */
    /*
     * cookie opreate
     */
    _breathe.Cookie= new function(){
        var _obj = {};
        /*
         * transform the cookie string to the javascript object
         * @return {object} cookie object
         */
        this.getCookieObj = function () {
            var cookies = document.cookie.split("; "),
                _temp;
            _obj={};
            for (var i = cookies.length - 1; i !== -1; i--) {
                _temp = cookies[i].split("=");
                if (_temp.length > 1) {
                    var _key=_temp[0];
                    _temp.shift();
                    _obj[_key] = _temp.join("=");
                }
            }
            return _obj;
        };
        /*
         * get the cookie value by key
         * @param   {string}        key
         * @return  {string|null}   value
         */
        this.get = function (key) {
            this.getCookieObj();
            return _obj[key];
        };
        /*
         * set the cookie value (temp use)
         */
        this.set=function(key,value){
            document.cookie = key+"="+value;
        };
    };
    /*
     * convert the string to object
     * @param {string} json string
     * @return {object} the javascript object
     */
    _breathe.fromJson=function(pData){
        var variable;
        try {
            variable=eval("("+pData+")");
        } catch(e){};
        return variable;
    };
    /*
     * dynamic script load
     * @param {string} src
     * @param {function} the callback method
     * @param {string} charset
     * @param {bool} whether to use releaseNo to clear the cache
     */
    _breathe.addJs=function(pSrc, pCallback,pCharset,pIsUseReleaseNo){
        var _js = document.createElement("SCRIPT"),
            _arguments=Array.prototype.slice.call(arguments,4),
            _debugInfo=_breathe.Cookie.get("DEBUGJS"),
            _src=pIsUseReleaseNo ? [pSrc,'?ReleaseNo=',_breathe.ReleaseNo].join("") :pSrc;
        if(_debugInfo){
            var _debugObj = _breathe.fromJson(_debugInfo);
            for(var name in _debugObj){
                _src=_src.replace(name,_debugObj[name]);
            }
        }
        _js.src=_src;
        _js.charset=pCharset|| 'UTF-8';
        _js.type='text/javascript';
        _js.onload=_js.onreadystatechange=function(){
            if(!this.readyState ||this.readyState ==="loaded" || this.readyState==='complete'){
                if(pCallback !=null){
                    pCallback.apply(this,_arguments);
                }
                _js.onload=_js.onreadystatechange=null;
            }
        };
        _breathe.HEAD.appendChild(_js);
    };
    /*
     * jsonp data
     * @param {string} the data's url
     * @param {function} the callback method
     * @param {string} charset
     * @param {bool} whether to use releaseNo to clear the cache
     * @the response should follow the format
     *   window.Shift.JsonPDic[pJsonKey]=....
     */
     _breathe.jsonp=function(pSrc,pCallback,pCharset,pJsonKey,pIsUseReleaseNo){
        var _src= pIsUseReleaseNo?[pSrc,"?Key=",pJsonKey,'&ReleaseNo=',_breathe.ReleaseNo].join(""):[pSrc,"?Key=",pJsonKey].join("");
         _breathe.addJs(_src,function(){
             pCallback(_breathe.JsonPDic[pJsonKey]);
         },pCharset,false);
    };
    /*
     * convert the object to the url query string
     * @param {object} the javascript object
     * @return {string} url query string
     */
    _breathe.joinParam=function(pParam){
        var _arr=[];
        for(var name in pParam){
            _arr.push(name);
            _arr.push("=");
            _arr.push(pParam[name]);
        }
        return _arr.join("&");
    };
    /*
     * make ajax request
     * @param {string} url
     * @param {string} request arguments
     * @param {function|null} the callback method
     */
    _breathe.ajax=function(pUrl, pContent, pCallback){
        var xmlVer=["Microsoft.XMLHTTP","MSXML2.XMLHTTP"],xmlObj;
        try{
            xmlObj = new XMLHttpRequest();
        }catch(e){
            for(var i=xmlVer.length-1;i!==-1;i--){
                try{
                    xmlObj=new ActiveXObject(xmlVer[i]);
                    break;
                }catch(e){}
            }
        }
        if(!xmlObj) return;
        xmlObj.open(pContent? "POST":"GET",pUrl || location.href,!!pCallback);
        xmlObj.setRequestHeader("Content-Type","application\/x-www-form-urlencoded");
        xmlObj.setRequestHeader("If-Modified-Since",new Date(0));
        function getReturnValue() {
            return (xmlObj.status == 200 ? (/xml/i.test(xmlObj.getResponseHeader("content-type")) ? xmlObj.responseXML : xmlObj.responseText) : null);
        }
        if(pCallback){
            xmlObj.onreadystatechange=function(){
                if(xmlObj.readyState ==4){
                    var _txt =getReturnValue();
                    if(pCallback(_txt) === true){
                        setTimeout(function(){
                            _breathe.ajax(pUrl, pContent, pCallback);
                        },1000);
                    }
                }
            };
        }
        //send param
        xmlObj.send(pContent,"");
        return pCallback ? xmlObj:getReturnValue();
    };
    /*
     * require load method
     * @param {array} sourcefile
     * [
     *     {src:'js/a.js',charset:'gb3212',noReleaseNo:false},//default false
     *     {src:'js/ab.js',charset:'utf-8'},
     *     [
     *         {src:'js/a.js',charset:'gb3212',noReleaseNo:false},//default false
     *         {src:'js/ab.js',charset:'utf-8'}
     *     ]
     * ]
     * @param {function} the callback function
     */
    _breathe.require=function(pSources,pCallback){
        var _callback=pCallback,
            _length=pSources.length;
        (function(pSource,pIndex){
            if(pIndex<_length){
                var _obj=pSource[pIndex],
                    me=this,
                    _self=arguments.callee;
                if (Object.prototype.toString.call(_obj) === '[object Array]') {
                    var _l=_obj.length,
                        _toDo=_l;
                    for (var i = 0; i < _l; i++) {
                        _breathe.addJs.call(me,_obj[i].src,function(){
                            _toDo--;
                            if(_toDo===0){
                                _self.call(me,pSource, pIndex + 1);
                            }
                        },_obj[i].charset,!_obj[i].noReleaseNo);
                    }
                } else  {
                    _breathe.addJs.call(me,_obj.src, function () {
                        _self.call(me, pSource, pIndex + 1);
                    },_obj.charset,!_obj.noReleaseNo);
                }
            }else{
                _callback();
            }
        })(pSources,0);
    };
    /*
     * the scripts which needs to be loaded
     * @param {array} sourcefile
     * [
     *     {src:'js/a.js',charset:'gb3212'},
     *     {src:'js/ab.js',charset:'utf-8'}
     * ]
     * @param {string} new file source
     * @param {function} the callback method
     */
    _breathe.combine=function(pSources,pNewSource,pCallback){
        if(pNewSource){
            _breathe.addJs(pNewSource,pCallback);
        }else{
            _breathe.require(pSources,pCallback);
        }
    };
    /*
     * add event
     * @param {dom} the dom which you bind event to
     * @param {string} the tpye name of the function
     * @param {function} the function
     */
    _breathe.addEvent=function(obj,type,fn){
        if(obj.addEventListener) obj.addEventListener(type,fn,false);
        else if(obj.attachEvent){
            obj["e"+type+fn]=fn;
            obj[type+fn]=function(){obj["e"+type+fn](window.event);}
            obj.attachEvent("on"+type,obj[type+fn]);
        }
    };
    /*
     * remove event
     * @param {dom} the dom which you bind event to
     * @param {string} the tpye name of the function
     * @param {function} the function
     */
    _breathe.removeEvent=function(obj,type,fn){
        if(obj.removeEventListener) obj.removeEventListener(type,fn,false);
        else if(obj.detachEvent){
            obj.detachEvent("on"+type,obj[type+fn]);
            obj[type+fn]=null;
            obj["e"+type+fn]=null;
        }
    };
    /*
     * add an iframe to the html document
     * @param {string} the src of the iframe
     * @param {function|null} the callback function
     * @param {string|null} the charset of the iframe
     * @param {function|null} the method will be called before loading iframe
     * @param {dom|null} the dom which the iframe will be added to
     * @return {dom} the new iframe
     */
    _breathe.addIFrame=function(pSrc,pCallback,pCharset,pBeforeAdd,pParentNode){
        var _iframe=document.createElement("IFRAME"),
            _parent=pParentNode||document.getElementsByTagName("BODY")[0];
        _iframe.src=pSrc,
            _iframe.charset = pCharset || "UTF-8";
        pBeforeAdd && pBeforeAdd(_iframe);
        pCallback && _breathe.addEvent(_iframe,"load",function(){
            pCallback(_iframe);
        });
        _parent.appendChild(_iframe);
        return _iframe;
    };

    window.$CPU = _breathe.CPU;
    window.$e = function (pFunc, pPriority) {
        return new _breathe.Event(pFunc, pPriority);
    };
    window.Breathe = window.$b = _breathe;

})(window);