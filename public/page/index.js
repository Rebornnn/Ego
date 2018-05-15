/**
 * 构建Tabs
 */
(function(App){
    /**
     * @param {Object} options 配置信息 
     */
    function Tabs(options){
        _.extend(this,options);
        this.index=this.index||0;
        //缓存节点
        this.nTab=this.container.getElementsByTagName('ul')[0];
        this.nTabs=this.nTab.children;
        //动态构建滑动条
        this.nTrack=document.createElement('div');
        _.addClassName(this.nTrack,'tabs_track');
        this.nThumb=document.createElement('div');
        _.addClassName(this.nThumb,'tabs_thumb');
        this.nTrack.appendChild(this.nThumb);
        this.container.appendChild(this.nTrack);

        this.init();
    }

    //初始化
    Tabs.prototype.init=function(){
        //绑定事件
        for(var i=0;i<this.nTabs.length;i++){
            this.nTabs[i].addEventListener('mouseenter',function(index){
                this.hightlight(index);
            }.bind(this,i));
            this.nTabs[i].addEventListener('click',function(){
                this.setCurrent(index);
            }.bind(this,i));
        }
        this.nTab.addEventListener('mouseleave',function(){
            this.hightlight(this.index);
        }.bind(this));

        this.setCurrent(this.index);
    };

    //高亮当前项
    Tabs.prototype.hightlight=function(index){
        var tab=this.nTabs[index];
        this.nThumb.style.width=tab.offsetWidth+'px';
        this.nThumb.style.left=tab.offsetLeft+'px';
    };

    //设置当前选中项
    Tabs.prototype.setCurrent=function(index){
        _.removeClassName(this.nTabs[this.index],'z-active');
        this.index=index;
        _.addClassName(this.nTabs[this.index],'z-active');
        this.hightlight(index);
    };

    App.Tabs=Tabs;
}(window.App))