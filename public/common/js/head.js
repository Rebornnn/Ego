/**
 * 构建Tabs
 */
(function (App) {
    /**
     * @param {Object} options 配置信息 
     */
    function Tabs(options) {
        _.extend(this, options);
        this.index = this.index || 0;
        //缓存节点
        this.nTab = this.container.getElementsByTagName('ul')[0];
        this.nTabs = this.nTab.children;
        //动态构建滑动条
        this.nTrack = document.createElement('div');
        _.addClass(this.nTrack, 'tabs_track');
        this.nThumb = document.createElement('div');
        _.addClass(this.nThumb, 'tabs_thumb');
        this.nTrack.appendChild(this.nThumb);
        this.container.appendChild(this.nTrack);

        this.init();
    }

    //初始化
    Tabs.prototype.init = function () {
        //绑定事件
        for (var i = 0; i < this.nTabs.length; i++) {
            this.nTabs[i].addEventListener('mouseenter', function (index) {
                this.hightlight(index);
            }.bind(this, i));
            this.nTabs[i].addEventListener('click', function () {
                this.setCurrent(index);
            }.bind(this, i));
        }
        this.nTab.addEventListener('mouseleave', function () {
            this.hightlight(this.index);
        }.bind(this));

        this.setCurrent(this.index);
    };

    //高亮当前项
    Tabs.prototype.hightlight = function (index) {
        var tab = this.nTabs[index];
        this.nThumb.style.width = tab.offsetWidth + 'px';
        this.nThumb.style.left = tab.offsetLeft + 'px';
    };

    //设置当前选中项
    Tabs.prototype.setCurrent = function (index) {
        _.removeClass(this.nTabs[this.index], 'z-active');
        this.index = index;
        _.addClass(this.nTabs[this.index], 'z-active');
        this.hightlight(index);
    };

    App.Tabs = Tabs;
}(window.App));


/**
 * 构建搜索框
 */
(function (App) {
    /**
     * 
     * @param {Object} container  表单节点
     */
    function Search(container) {
        this.nForm = container;
        this.nKeyword = this.nForm.getElementsByTagName('input')[0];
        this.init();
    }
    //初始化
    Search.prototype.init = function () {
        this.nForm.addEventListener('submit', this.search.bind(this));
    }

    //搜索功能
    Search.prototype.search = function (event) {
        this.nKeyword.value = this.nKeyword.value.replace(/^\s+|\s+$/g, '');
        if (!this.nKeyword.value) {
            event.preventDefault();
        }
    }

    App.Search = Search;
}(window.App));

/**
 * 构建登录与注册
 */
(function (App) {
    function Guest() {
        this.nLogin = _.$('login');
        this.nRegister = _.$('register');

        this.nLogin.addEventListener('click', function () {
            //弹出登录弹窗
            this.modal = new App.LoginModal({
                parent: _.$('gHeader')
            });
            //注册ok事件
            this.modal.on('ok', function (event) {
                App.nav.initUserInfo(event.data);
                App.nav.loginCallback && App.nav.loginCallback(event.data);
            }.bind(this));
            this.modal.on('register', function () {
                this.modal.hide();
                this.nRegister.click();
            }.bind(this));
        }.bind(this));

        this.nRegister.addEventListener('click', function () {
            //弹出注册弹窗
            this.modal = new App.RegisterModal({
                parent: _.$('gHeader')
            });
            //注册ok事件
            this.modal.on('ok', function (event) {
                this.modal.hide();
                App.nav.initUserInfo(event.data);
                App.nav.loginCallback && App.nav.loginCallback(event.data);
            }.bind(this));

        }.bind(this));
    }

    App.Guest = Guest;
}(window.App));


/**
 * 构建登录弹窗
 */
(function (App) {
    var validator = App.validator;
    var html = `
    <div class="modal_login">
        <div class="u-close" id="login_close">X</div>
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
            <div class="u-error f-dn" id="uError">
                <span class="u-icon u-icon-error"></span>
                <span id="errormsg"></span>
            </div>
            <button class="u-btn u-btn-primary" type="submit">登录&nbsp;&nbsp;</button>
        </form>
    </div>`;

    function LoginModal(options) {
        options.content = html;
        App.Modal.call(this, options);
        //缓存节点
        this.nForm = _.$('loginform');
        this.nUsername = _.$('username');
        this.nPassword = _.$('password');
        this.nRemember = _.$('remember');
        this.nError = _.$('uError');
        this.nErrormsg = _.$('errormsg');
        this.nRegister = _.$('goregister');
        this.nClose = _.$('login_close');

        this.initLoginEvent();
        this.show();
    }

    //扩展原型
    LoginModal.prototype = Object.create(App.Modal.prototype);
    _.extend(LoginModal.prototype, App.emitter);

    LoginModal.prototype.initLoginEvent = function () {
        //绑定提交事件
        this.nForm.addEventListener('submit', this.submit.bind(this));

        //绑定跳转注册事件
        this.nRegister.addEventListener('click', function () {
            this.fire({
                type: 'register'
            });
        }.bind(this));

        //绑定关闭事件
        this.nClose.addEventListener('click', function () {
            this.hide();
        }.bind(this));
    }

    LoginModal.prototype.check = function () {
        var isValid = true,
            flag = true;

        //验证用户名
        flag = flag && !validator.isEmpty(this.nUsername.value);
        flag = flag && validator.isPhone(this.nUsername.value);
        !flag && this.showError(this.nUsername, flag);
        isValid = isValid && flag;

        //验证密码
        flag = true;
        flag = flag && !validator.isEmpty(this.nPassword.value);
        !flag && this.showError(this.nPassword, flag);
        isValid = isValid && flag;

        //显示错误
        return isValid;
    }

    LoginModal.prototype.submit = function (event) {
        event.preventDefault();
        if (this.check()) {
            var data = {
                username: this.nUsername.value.trim(),
                password: hex_md5(this.nPassword.value),
                remember: !!this.nRemember.checked
            };

            _.ajax({
                url: '/api/login',
                type: 'post',
                data: data,
                success: function (data) {
                    data = JSON.parse(data);
                    if (data.code === 200) {
                        this.hide();
                        this.fire({
                            type: 'ok',
                            data: data.result
                        });
                        this.offType('ok');
                    } else {
                        //根据错误码显示不同的错误提示
                        switch (data.code) {
                            case 400:
                                _.removeClass(this.nError, 'f-dn');
                                this.nErrormsg.innerText = '密码错误，重新输入';
                                break;
                            case 404:
                                _.removeClass(this.nError, 'f-dn');
                                this.nErrormsg.innerText = '用户不存在，请重新输入';
                                break;
                        }
                        this.showError(this.nForm, false);
                    }
                }.bind(this),
                error: function () {}
            });
        }
    }

    LoginModal.prototype.showError = function (node, boo) {
        if (!boo) {
            _.addClass(node, 'error');
        }
    }

    App.LoginModal = LoginModal;
}(window.App));


/**
 * 构建注册框
 */
(function (App) {
    var validator = App.validator;
    var html = `
    <div class="modal_signin">
        <div class="u-close" id="signin_close">X</div>
        <div><i class="logo"></i></div>
        <form class="m-form" id="registerform">
            <div class="u-formitem">
                <label for="phone" class="formitem_tt">手机号</label>
                <input type="text" id="phone" name="phone" placeholder="请输入11位手机号码" class="formitem_ct u-ipt">
            </div>
            <div class="u-formitem">
                <label for="nickname" class="formitem_tt">昵称</label>
                <input type="text" id="nickname" name="nickname" placeholder="中英文均可，至少8个字符" class="formitem_ct u-ipt">
            </div>
            <div class="u-formitem">
                <label for="password" class="formitem_tt">密码</label>
                <input type="password" id="password_signin" name="password" placeholder="长度6-16字符，不包含空格" class="formitem_ct u-ipt">
            </div>
            <div class="u-formitem">
                <label for="confirm_password" class="formitem_tt">确认密码</label>
                <input type="password" id="confirm_password" name="confirm_password" placeholder="再次输入密码" class="formitem_ct u-ipt">
            </div>
            <div class="u-formitem">
                <label for class="formitem_tt">性别</label>
                <div class="formitem_ct">
                    <div class="sex_box">
                        <label>
                            <input type="radio" name="sex" checkded value="1">
                            <i class="u-icon u-icon-radio"></i>
                            <i class="u-icon u-icon-radiochecked"></i>
                            少男
                        </label>
                        <label>
                            <input type="radio" name="sex" value="0">
                            <i class="u-icon u-icon-radio"></i>
                            <i class="u-icon u-icon-radiochecked"></i>
                            少女
                        </label>
                    </div>
                </div>
            </div>
            <div class="u-formitem">
                <label for="" class="formitem_tt">生日</label>
                <div class="formitem_ct">
                    <div class="m-cascadeselect birthday_select" id="birthday"></div>
                </div>
            </div>
            <div class="u-formitem">
                <label for="" class="formitem_tt">所在地</label>
                <div class="formitem_ct">
                    <div class="m-cascadeselect loation_select" id="location"></div>
                </div>
            </div>
            <div class="u-formitem">
                <label for="" class="formitem_tt">验证码</label>
                <div class="formitem_ct formitem_ct-captcha f-cb">
                    <input type="text" id="captcha" class="u-ipt">
                    <img id="captchaimg" src="/captcha" alt="验证码">
                </div>
            </div>
            <div class="u-formitem u-formitem-2 u-remember">
                <label for="read" class="u-checkbox u-checkbox-remember">
                    <input type="checkbox" id="read">
                    <i class="u-icon u-icon-checkbox"></i>
                    <i class="u-icon u-icon-checkboxchecked"></i>
                    <span>我已阅读相关条款</span>
                </label>
            </div>
            <div class="u-error f-dn" id="uError">
                <span class="u-icon u-icon-error"></span>
                <span id="errormsg"></span>
            </div>
            <button class="u-btn u-btn-primary" type="submit">注&nbsp;&nbsp;册</button>
        </form>
    </div>`;

    function RegisterModal(options) {
        options.content = html;
        App.Modal.call(this, options);
        //缓存节点
        this.nForm = _.$('registerform');
        this.nPhone = _.$('phone');
        this.nNick = _.$('nickname');
        this.pwd = _.$('password_signin');
        this.nConfirmpwd = _.$('confirm_password');
        this.nCaptcha = _.$('captcha');
        this.nCaptchImg = _.$('captchaimg');
        this.nRead = _.$('read');
        this.nClose = _.$('signin_close');
        this.nError = _.$('uError');
        this.nErrormsg = _.$('errormsg');

        this.initSelect();
        this.initRegisterEvent();
        this.show();
    }

    //扩展原型
    RegisterModal.prototype = Object.create(App.Modal.prototype);
    _.extend(RegisterModal.prototype, App.emitter);

    RegisterModal.prototype.initRegisterEvent = function () {
        //绑定验证码图片事件
        this.nCaptchImg.addEventListener('click', function () {
            this.resetCaptcha();
        }.bind(this));

        //绑定提交事件
        this.nForm.addEventListener('submit', this.submit.bind(this));


        //绑定关闭事件
        this.nClose.addEventListener('click', function () {
            this.hide();
        }.bind(this));
    }

    //初始化选择器
    RegisterModal.prototype.initSelect = function () {
        this.initBirthdaySelect();
        this.initLocationSelect();
    }

    //重置验证码图片
    RegisterModal.prototype.resetCaptcha = function () {
        this.nCaptchImg.src = '/captcha?t=' + +new Date();
    }



    //表单校验
    RegisterModal.prototype.check = function () {
        var isValid = true,
            errorMsg = '';
        var checkList = [
            [this.nNick, ['required', 'nickname']],
            [this.pwd, ['required', 'length']],
            [this.nConfirmpwd, ['required', 'length']],
            [this.nCaptcha, ['required']]
        ];

        isValid = this.checkRules(checkList);
        if (!isValid) {
            errorMsg = '输入有误';
        }

        //验证两次密码是否一致
        isValid = this.pwd.value === this.nConfirmpwd.value;
        if (!isValid) {
            errorMsg = '两次密码输入不一致';
        }
        //验证条款是否为空
        isValid = this.nRead.checked;
        if (!isValid) {
            errorMsg = '没有勾选验证条款';
        }
        //显示错误
        _.removeClass(this.nError, 'f-dn');
        this.nErrormsg.innerText = errorMsg;

        return isValid;
    }

    //校验规则配置
    RegisterModal.prototype.checkRules = function (checkList) {

        for (var i = 0; i < checkList.length; i++) {
            var checkItem = checkList[i][0],
                rules = checkList[i][1],
                flag;

            for (var j = 0; j < rules.length; j++) {
                var key = rules[j];
                switch (key) {
                    case 'nickname':
                        flag = validator.isNickName(checkItem.value);
                        break;
                    case 'length':
                        flag = validator.isLength(checkItem.value, 6, 16);
                        break;
                    case 'required':
                        flag = !validator.isEmpty(checkItem.value);
                        break;
                }
            }
            if (!flag) {
                break;
            }
        }
        //显示错误
        this.showError(checkItem, flag);

        return flag;
    }

    RegisterModal.prototype.showError = function (node, boo) {
        if (!boo) {
            _.addClass(node, 'error');
        }
    }

    RegisterModal.prototype.getRadioValue = function (form, name) {
        var sexFields = _.$(form).elements[name];
        for (var i = 0; i < sexFields.length; i++) {
            if (sexFields[i].checked) {
                return sexFields[i].value;
            }
        }
    }
    RegisterModal.prototype.initBirthdaySelect = function () {
        var formatDate = _.formatDate(1970);

        this.birthdaySelect = new App.CascadeSelect({
            parent: _.$('birthday'),
            data: formatDate
        });
    }
    RegisterModal.prototype.initLocationSelect = function () {
        var formatData = _.formatData(ADDRESS_CODES);

        this.locationSelect = new App.CascadeSelect({
            parent: _.$('location'),
            data: formatData
        });
    }

    //表单提交
    RegisterModal.prototype.submit = function (event) {
        event.preventDefault();
        this.check();
        if (this.check()) {
            var data = {
                username: this.nPhone.value.trim(),
                nickname: this.nNick.value.trim(),
                password: hex_md5(this.pwd.value),
                sex: this.getRadioValue('registerform', 'sex'),
                captcha: this.nCaptcha.value.trim()
            };
            this.birthday = this.birthdaySelect.getValue().join('-');
            data.birthday = this.birthday;
            this.location = this.locationSelect.getValue();
            data.province = this.location[0];
            data.city = this.location[1];
            data.district = this.location[2];

            _.ajax({
                url: '/api/register',
                type: 'post',
                data: data,
                success: function (data) {
                    data = JSON.parse(data);
                    if (data.code === 200) {
                        this.fire({
                            type: 'ok',
                            data: data.result
                        });
                        this.offType('ok');
                    } else {
                        this.nError.innerText = data.msg;
                        this.showError(this.nForm, true);
                    }
                }.bind(this),
                fail: function () {}
            });

        }
    }

    App.RegisterModal = RegisterModal;
}(window.App));


/**
 * 构建顶栏
 */
(function (App) {
    var nav = {
        init: function (options) {
            options = options || {};
            this.loginCallback = options.login;
            this.hdtab = new App.Tabs({
                container: _.$("hdtabs"),
                index: this.getTabIndex()
            });
            this.search = new App.Search(_.$("search"));
            this.guest = new App.Guest();
            //绑定登录，注册，登出事件
            this.initLoginStatus();
        },
        //获取当前页面tabs中的index
        getTabIndex: function () {
            return window.location.href.search(/works/) > 0 ? 1 : 0;
        },
        //初始化登录状态
        initLoginStatus: function () {
            _.ajax({
                url: '/api/users?getloginuser',
                success: function (data) {
                    data = JSON.parse(data);
                    if (data.code === 200) {
                        this.initUserInfo(data.result);
                        if (typeof this.loginCallback === 'function') {
                            this.loginCallback(data.result);
                        }
                    }
                }.bind(this),
                error: function (data) {}
            });
        },
        //初始化用户信息
        initUserInfo: function (data) {
            this.nSexIcon = _.$('sexIcon');
            this.nName = _.$('name');
            this.nGuest = _.$('guest');
            this.nUser = _.$('userDropdown');
            this.nLogout = _.$('logout');

            //设置用户姓名和性别icon
            this.nName.innerText = data.nickname;
            _.addClass(this.nSexIcon, App.iconConfig[data.sex]);

            //隐藏登录，注册按钮；显示用户信息
            _.addClass(this.nGuest, 'f-dn');
            _.removeClass(this.nUser, 'f-dn');

            this.nLogout.addEventListener('click', function () {
                _.ajax({
                    url: '/api/logout',
                    type: 'post',
                    success: function (data) {
                        data = JSON.parse(data);
                        if (data.code === 200) {
                            // _.addClass(this.nUser,'f-dn');
                            // _.removeClass(this.nGuest,'f-dn');
                            window.location.reload();
                        }
                    }.bind(this),
                    error: function () {}
                });
            }.bind(this));
        },
        //构建登录框
        showLogin: function () {
            this.guest.nLogin.click();
        }
    }

    App.nav = nav;
}(window.App));