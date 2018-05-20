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
            this.modal=new App.LoginModal({parent:_.$('gHeader')});
            this.modal.on('ok',function(event){
                App.nav.initUserInfo(event.data);
                App.nav.loginCallback&&App.nav.loginCallback(event.data);
            }.bind(this));
            this.modal.on('register',function(){
                this.modal.hide();
                this.nRegister.click();
            }.bind(this));
        }.bind(this));

        this.nRegister.addEventListener('click',function(){
            //弹出注册弹窗
            
        }.bind(this));
    }

    App.Guest=Guest;
}(window.App));


/**
 * 构建登录弹窗
 */
(function(App){
    var validator=App.validator;
    var html=`
    <div class="modal_login">
        <div class="u-close">X</div>
        <div class="modal_tt">
            <strong>欢迎回来</strong><span>还没有帐号？<a class="u-link" id="goregister">立即注册</a></span>
        </div>
        <form class="m-form m-form-1" id="loginform">
            <div class="u-formitem">
                <input id="username" type="text" placeholder="手机号" class="formitem_ct u-ipt">
            </div>
            <div class="u-formitem u-formitem-1">
                <input id="password" type="password" placeholder="密码" class="formitem_ct u-ipt">
            </div>
            <div class="u-formitem u-formitem-2 u-remember">
                <label for="remember" class="u-checkbox u-checkbox-remember">
                    <input type="checkbox" id="remember">
                    <i class="u-icon u-icon-checkbox"></i>
                    <i class="u-icon u-icon-checkboxchecked"></i>
                    <span>保持登录</span>
                </label>
                <span class="f-fr">忘记密码？</span>
            </div>
            <div class="u-error f-dn">
                <span class="u-icon u-icon-error"></span>
                <span id="errormsg"></span>
            </div>
            <button class="u-btn u-btn-primary" type="submit">登录&nbsp;&nbsp;</button>
        </form>
    </div>`;

    function LoginModal(options){
        options.content=html;
        App.Modal.call(this,options);
        //缓存节点
        this.nForm=_.$('loginform');
        this.nUsername=_.$('username');
        this.nPassword=_.$('password');
        this.nRemember=_.$('remember');
        this.nError=_.$('errormsg');
        this.nRegister=_.$('goregister');

        this.initLoginEvent();
        this.show();
    }

    //扩展原型
    LoginModal.prototype=Object.create(App.Modal.prototype);
    _.extend(LoginModal.prototype,App.emitter);

    LoginModal.prototype.initLoginEvent=function(){
        //绑定提交事件
        this.nForm.addEventListener('submit',this.submit.bind(this));
        //绑定跳转注册事件
        this.nRegister.addEventListener('click',function(){
                this.fire({type:'register'});
        }.bind(this));
    }

    LoginModal.prototype.check=function(){
        var isValid=true,flag=true;

        //验证用户名
        flag=flag && !validator.isEmpty(this.nUsername.value);
        flag=flag && validator.isPhone(this.nUsername.value);
        !flag && this.showError(this.nUsername,true);
        isValid=isValid && flag;

        //验证密码
        flag=true;
        flag=flag && !validator.isEmpty(this.nPassword.value);
        !flag && this.showError(this.nPassword,true);
        isValid=isValid && flag;

        //显示错误
        return isValid;
    }

    LoginModal.prototype.submit=function(event){
        event.preventDefault();
        if(this.check()){
            var data={
                username:this.nUsername.value.trim(),
                password:hex_md5(this.nPassword.value),
                remember:!!this.nRemember.checked
            };

            _.ajax({
                url:'/api/login',
                type:'post',
                data:data,
                success:function(data){
                    data=JSON.parse(data);
                    if(data.code===200){
                        this.hide();
                        this.fire({type:'ok',data:data.result});
                    }else{
                        //根据错误码显示不同的错误提示
                        switch(data.code){
                            case 400:
                                this.nError.innerText='密码错误，重新输入';
                                break;
                            case 404:
                                this.nError.innerText='用户不存在，请重新输入';
                                break;
                        }
                        this.showError(this.nForm,true);
                    }
                }.bind(this),
                error:function(){}
            });
        }
    }

    LoginModal.prototype.showError=function(node,boo){
        if(boo){
            _.addClass(node,'error');
        }
    }

    App.LoginModal=LoginModal;
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
                        this.loginCallback(data.result);
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
                        data=JSON.parse(data);
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


