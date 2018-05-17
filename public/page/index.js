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
        _.addClass(this.nTrack,'tabs_track');
        this.nThumb=document.createElement('div');
        _.addClass(this.nThumb,'tabs_thumb');
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
        _.removeClass(this.nTabs[this.index],'z-active');
        this.index=index;
        _.addClass(this.nTabs[this.index],'z-active');
        this.hightlight(index);
    };

    App.Tabs=Tabs;
}(window.App));


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
        this.nKeyword.value=this.nKeyword.value.replace(/^\s+|\s+$/g,'');
        if(!this.nKeyword.value){
            event.preventDefault();
        }
    }

    App.Search=Search;
}(window.App));

/**
 * 构建登录与注册
 */
(function(App){
    function Guest(){
        this.nLogin=_.$('login');
        this.nRegister=_.$('register');

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
            //this.guest=new App.Guest();
            //绑定登录，注册，登出事件
            this.initLoginStatus();
        },
        //获取当前页面tabs中的index
        getTabIndex:function(){
            return window.location.href.search(/works/)>0?1:0;
        },
        //初始化登录状态
        initLoginStatus:function(){
            _.ajax({
                url:'api/users?getloginuser',
                success:function(data){
                    data=JSON.parse(data);
                    if(data.code===200){
                        this.initUserInfo(data.result);
                        //回调函数this.loginCallback
                    }
                }.bind(this),
                error:function(data){}
            });
        },
        //初始化用户信息
        initUserInfo:function(data){
            this.nSexIcon=_.$('sexIcon');
            this.nName=_.$('name');
            this.nGuest=_.$('guest');
            this.nUser=_.$('userDropdown');
            this.nLogout=_.$('logout');

            //设置用户姓名和性别icon
            this.nName.innerText=data.nickname;
            _.addClass(this.nSexIcon,App.iconConfig[data.sex]);

            //隐藏登录，注册按钮；显示用户信息
            _.addClass(this.nGuest,'f-dn');
            _.removeClass(this.nUser,'f-dn');

            this.nLogout.addEventListener('clcik',function(){
                _.ajax({
                    url:'/api/logout',
                    method:'POST',
                    data:{},
                    success:function(data){
                        if(data.code===200){
                            window.location.href='/index';
                        }
                    },
                    error:function(){}
                });
            });
        }
    }

    App.nav=nav;
}(window.App));


/**
 * 构建轮播图
 */
(function(App){
    var template='<div class="m-slider"><div>'
    function Slider(options){
        _.extend(this,options);

        //组件节点
        this.nSlider=_.html2node(template);
        this.nSliders=this.buildSliders();
        this.nCursors=this.buildCursor();
        //初始化事件
        this.nSlider.addEventListener('mouseenter',this.stop.bind(this));
        this.nSlider.addEventListener('mouseleave',this.autoPlay.bind(this));
        //初始化动作
        this.container.appendChild(this.slider);
        this.nav(this.initIndex||0);
        this.autoPlay();
    }
    
    //构造图片节点
    Slider.prototype.buildSliders=function(){

    }

    //构造指示器节点
    Slider.prototype.buildCursor=function(){
        var cursor=document.createElement('ul'),
            html='';

        cursor.className='m-cursor';
        for(var i=0;i<this.imgLength;i++){
            html+=`<li data-index=${i}></li>`;
        }
        cursor.innerHTML=html;
        this.nSlider.appendChild(cursor);

        //处理点击事件
        cursor.addEventListener('click',function(event){
            //index=点击节点的下标
            //this.nav(index);
        }.bind(this));

        return cursor.children;
    }

    //下一页
    Slider.prototype.next=function(){
        var index=(this.index+1)%this.imgLength;
        this.nav(index);
    }

    //跳到指定页
    Slider.prototype.nav=function(index){
        if(this.index===index) return;
        this.last=this.index;
        this.index=index;

        this.fade();
        this.setCurrent();
    }

    //设置当前选中状态
    Slider.prototype.setCurrent=function(){
        //去除之前选中节点的选中状态
        //添加当前选中节点的选中状态
    }

    //自动播放
    Slider.prototype.autoPlay=function(){
        this.timer=setInterval(function(){
            this.next();
        }.bind(this),this.interval);
    }

    //停止自动播放
    Slider.prototype.stop=function(){
        clearInterval(this.timer);
    }

    //切换效果
    Slider.prototype.fade=function(){
        if(this.last!==undefined){
            this.nSliders[this.last].style.opacity=0;
        }
        this.nSliders[this.index].style.opacity=1;
    }
    App.Slider=Slider;
}(window.App));

document.addEventListener('DOMContentLoaded',function(){
    App.nav.init();
});