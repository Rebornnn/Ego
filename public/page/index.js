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


/**
 * 构建搜索框
 */
(function(App){
    /**
     * 
     * @param {Object} container  表单节点
     */
    function Search(container) {
        this.nForm=container;
        this.nKeyword=this.nForm.getElementsByTagName('input')[0];
        this.init();
    }
    //初始化
    Search.prototype.init=function(){
        this.nForm.addEventListener('submit',this.search.bind(this));
    }

    //搜索功能
    Search.prototype.search=function(event){
        var value=this.nKeyword.value;
        if(value){
            value.replace(/^\s|\s$/,'');
            return true;
        }else{
            return false;
        }
    }

    App.Search=Search;
}(window.App));

/**
 * 构建登录与注册
 */
(function(App){
    function Guest(){
        this.nLogin=document.getElementById('login');
        this.nRegister=document.getElementById('register');

        this.nLogin.addEventListener('click',function(){
            //弹出登录弹窗

        }.bind(this));
        this.nRegister.addEventListener('click',function(){
            //弹出注册弹窗

        }.bind(this));
    }

    App.Guest=Guest;
}(window.App));


/**
 * 构建顶栏
 */
(function(App){
    var nav={
        init:function(options){
            options=options||{};
            this.loginCallback=options.login;
            this.hdtab=new App.Tabs({
                container:_.$("hdtabs"),
                index:this.getTabIndex()
            });
            this.search=new App.Search(_.$("search"));
            this.guest=new App.Guest();
            //绑定登录，注册，登出事件
            this.initLoginStatus();
        },
        getTabIndex:function(){},
        initLoginStatus:function(){},
        initUserInfo:function(data){}
    }

    App.nav=nav;
}(window.App));