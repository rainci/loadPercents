/**
 * Created by liufeifeng on 1/18/18.
 */
;(function() {
    var isFunction = function(fun) {
        return typeof fun === 'function';
    };

    function  LoadPercent(config) {
        this.config = {
            imgResource:config && config.imgResource || [],
            audioResource:config && config.audioResource || [],
            baseUrl:config && config.baseUrl || '' ,
            begin:config && config.begin || null,
            progress:config && config.progress || null,
            complete:config && config.complete || null
        };
        this.total = this.config.imgResource.length + this.config.audioResource.length || 0;//资源总数
        this.currentIndex = 0; //当前正在加载的资源索引
    };
    LoadPercent.prototype.countScale = function(index) {
        return Math.round(index / this.total *100);
    };
    LoadPercent.prototype.start = function() {
        var _this = this,
            total = _this.tatal,
            baseUrl = this.config.baseUrl,
            imgResourceLen = _this.config.imgResource.length,
            audioResourceLen = _this.config.audioResource.length;

        if(isFunction(this.config.begin)){//初始化判断网络
            if(!navigator.onLine)
                return this.config.begin(navigator.onLine);
        }

        for(var i = 0; i<imgResourceLen; i++){//imgResource load
            var url = _this.config.imgResource[i];
            var image = new Image();
            if(url.indexOf('http') !== 0 || url.indexOf('https') !== 0){
                url = baseUrl + url;
            }
            image.onload = function(){_this.loaded();};
            image.src = url;
        }
        for(var i = 0; i<audioResourceLen; i++){//audioResource load
            var url2 = _this.config.audioResource[i];
            var audioElement = document.createElement('audio');

            if(url2.indexOf('http') !== 0 || url2.indexOf('https') !== 0){
                url2 = baseUrl + url2;
            }
            audioElement.src = url2;
            audioElement.setAttribute('preload', 'preload');
            audioElement.addEventListener('loadeddata',function() {
                if(audioElement.readyState >= 2){
                    _this.loaded();
                }
            });
        }
    };
    LoadPercent.prototype.loaded = function() {
        if(isFunction(this.config.progress)){
            var process = this.countScale(++this.currentIndex)
            this.config.progress(process);
        }
        //load complete
        if(this.currentIndex===this.total){
            if(isFunction(this.config.complete)){
                this.config.complete(this.total);
            }
        }
    };

    window.LoadPercent = LoadPercent;
})();