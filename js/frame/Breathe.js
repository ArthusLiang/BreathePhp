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
        }
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
     * contrl mode
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

    window.$CPU = _breathe.CPU;
    window.$e = function (pFunc, pPriority) {
        return new _breathe.Event(pFunc, pPriority);
    };
    window.Breathe = window.$b = _breathe;

})(window);