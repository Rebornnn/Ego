/**
 * 设定命名空间
 */
(function () {
    //App为全局对象,_为通用工具对象
    window.App = Object.create(null);
    window._ = Object.create(null);

    window.App.iconConfig = ['icon-male', 'icon-female'];
    window.App.followConfig = [{
        class: 'z-unfollow'
    }, {
        class: 'z-follow'
    }];
    window.App.emitter = {};
    window.App.user = {};
}());


/**
 * 对象浅复制
 */
(function (_) {
    function extend(receiver, supplier) {
        Object.keys(supplier).forEach(function (key) {
            receiver[key] = supplier[key];
        });
        return receiver;
    }

    _.extend = extend;
}(window._));


/**
 * 选取单个元素节点
 */
(function (_) {
    /**
     * 
     * @param   {String} id 元素的id名 
     * @returns {Object}  返回元素对象
     */
    function $(id) {
        return document.getElementById(id);
    }

    _.$ = $;
}(window._));

/**
 * html转换成节点对象
 */
(function (_) {
    /**
     * 
     * @param {String} str html的字符串形式 
     */
    function html2node(str) {
        var container = document.createElement('div');
        container.innerHTML = str;
        return container.children[0];
    }

    _.html2node = html2node;
}(window._));





/**
 * 添加类名
 * 
 * @param   {Object} el 选中的元素
 * @param   {String} className 要添加的类名
 */
(function (_) {
    function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }

    _.addClass = addClass;
}(window._));


/**
 * 删除类名
 * 
 * @param   {Object} el 选中的元素
 * @param   {String} className 要删除的类名
 */
(function (_) {
    function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp("(^|\\b)" + className.spilt(" ").join("|") + "(\\b|$)", "gi"), " ");
        }
    }

    _.removeClass = removeClass;
}(window._));


/**
 * 检测类名
 * 
 * @param   {Object} el 选中的元素
 * @param   {String} className 要检测的类名
 * @returns {Boolean}  返回布尔值
 */
(function (_) {
    function hasClass(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp("(^| )" + className + "( |$)", "gi").test(el.className);
        }
    }

    _.hasClass = hasClass;
}(window._));


/**
 * 创建元素
 */
(function (_) {
    /**
     * 
     * @param {String} tag 元素名
     * @param {String} val 元素值
     * @param {String} clas 类名
     */
    function createElement(tag, clas, val) {
        var elem = document.createElement(tag);
        if (val) {
            elem.innerText = val;
        }
        if (clas) {
            _.addClass(elem, clas);
        }

        return elem;
    }

    _.createElement = createElement;
}(window._));



/**
 * 计算年龄
 */
(function (_) {
    /**
     * 
     * @param {String} birthday 格式为“1991-10-10” 
     */
    function getAge(birthday) {
        var today = new Date();
        var birthDate = new Date(birthday);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    _.getAge = getAge;
}(window._));

/**
 * 计算星座
 */
(function (_) {
    /**
     * 
     * @param {String} birthday 格式为“1991-10-10”
     */
    function getConstellation(birthday) {
        birthday = new Date(birthday);
        var month = birthday.getMonth() + 1;
        var date = birthday.getDate();
        var constellations = ['摩羯', '水瓶', '双鱼', '白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天枰', '天蝎', '射手', '魔羯'];
        return constellations[month - (date - 14 < '657778999988'.charAt(month - 1))];
    }

    _.getConstellation = getConstellation;
}(window._));

/**
 * 计算城市
 */
(function (_) {
    function getCity(lib, address) {
        var province = lib.filter(function (item) {
            return parseInt(item[0]) === address.province;
        })[0];
        var city = province[2].filter(function (item) {
            return parseInt(item[0]) === address.city;
        })[0];

        return city[1];
    }

    _.getCity = getCity;
}(window._));


/**
 * 自定义事件
 */
(function (App) {
    /**
     * 注册事件
     * 
     * @param     {String} type 自定义事件名称
     * @param     {Function} func 事件处理函数 
     */
    function on(type, func) {
        this.handlers={};
        if (typeof this.handlers[type] == "undefined") {
            this.handlers[type] = [];
        }

        this.handlers[type].push(func);
    }

    /**
     * 删除事件处理函数
     * 
     * @param      {String} type 自定义事件名称
     * @param     {Function} func 事件处理函数 
     */
    function off(type, func) {
        if (this.handlers[type] instanceof Array) {
            var handlers = this.handlers[type];
            for (var i = 0, len = handlers.length; i < len; i++) {
                if (handlers[i] === func) {
                    break;
                }
            }

            handlers.splice(i, 1);
        }
    }


    function offType(type) {
        if (this.handlers[type] instanceof Array) {
            this.handlers[type] = [];
        }
    }

    /**
     * 触发事件
     * 
     * @param {Object} event 一个至少包含type属性的对象 
     */
    function fire(event) {
        if (!event.target) {
            event.target = this;
        }
        if (this.handlers[event.type] instanceof Array) {
            var handlers = this.handlers[event.type];
            for (var i = 0, len = handlers.length; i < len; i++) {
                handlers[i](event);
            }
        }
    }

    App.emitter ={
        on: on,
        off: off,
        offType: offType,
        fire: fire
    };
}(window.App));


/**
 * ajax封装
 * 
 * @param   {Object} options 配置参数
 * {
 *      type:"post",
 *      url:"", //添加自己的接口链接
 *      timeOut:5000,
 *      before:function(){
 *          console.log("before");  
 *       },
 *      success:function(str){
 *          console.log(str);
 *      },
 *      error:function(){
 *           console.log("error");
 *      }
 * }
 */
(function (_) {
    function ajax(options) {

        //编码数据
        function setData() {
            //设置对象的遍码
            function setObjData(data, parentName) {
                function encodeData(name, value, parentName) {
                    var items = [];
                    name = parentName === undefined ? name : parentName + "[" + name + "]";
                    if (typeof value === "object" && value !== null) {
                        items = items.concat(setObjData(value, name));
                    } else {
                        name = encodeURIComponent(name);
                        value = encodeURIComponent(value);
                        items.push(name + "=" + value);
                    }
                    return items;
                }
                var arr = [],
                    value;
                if (Object.prototype.toString.call(data) == '[object Array]') {
                    for (var i = 0, len = data.length; i < len; i++) {
                        value = data[i];
                        arr = arr.concat(encodeData(typeof value == "object" ? i : "", value, parentName));
                    }
                } else if (Object.prototype.toString.call(data) == '[object Object]') {
                    for (var key in data) {
                        value = data[key];
                        arr = arr.concat(encodeData(key, value, parentName));
                    }
                }
                return arr;
            };
            //设置字符串的遍码，字符串的格式为：a=1&b=2;
            function setStrData(data) {
                var arr = data.split("&");
                for (var i = 0, len = arr.length; i < len; i++) {
                    name = encodeURIComponent(arr[i].split("=")[0]);
                    value = encodeURIComponent(arr[i].split("=")[1]);
                    arr[i] = name + "=" + value;
                }
                return arr;
            }

            if (data) {
                if (typeof data === "string") {
                    data = setStrData(data);
                } else if (typeof data === "object") {
                    data = setObjData(data);
                }
                data = data.join("&").replace("/%20/g", "+");
                //若是使用get方法或JSONP，则手动添加到URL中
                if (type === "get" || dataType === "jsonp") {
                    url += url.indexOf("?") > -1 ? (url.indexOf("=") > -1 ? "&" + data : data) : "?" + data;
                }
            }
        }
        // JSONP
        function createJsonp() {
            var script = document.createElement("script"),
                timeName = new Date().getTime() + Math.round(Math.random() * 1000),
                callback = "JSONP_" + timeName;

            window[callback] = function (data) {
                clearTimeout(timeout_flag);
                document.body.removeChild(script);
                success(data);
            }
            script.src = url + (url.indexOf("?") > -1 ? "&" : "?") + "callback=" + callback;
            script.type = "text/javascript";
            document.body.appendChild(script);
            setTime(callback, script);
        }
        //设置请求超时
        function setTime(callback, script) {
            if (timeOut !== undefined) {
                timeout_flag = setTimeout(function () {
                    if (dataType === "jsonp") {
                        delete window[callback];
                        document.body.removeChild(script);

                    } else {
                        timeout_bool = true;
                        xhr && xhr.abort();
                    }
                    console.log("timeout");

                }, timeOut);
            }
        }

        // XHR
        function createXHR() {
            //由于IE6的XMLHttpRequest对象是通过MSXML库中的一个ActiveX对象实现的。
            //所以创建XHR对象，需要在这里做兼容处理。
            function getXHR() {
                if (window.XMLHttpRequest) {
                    return new XMLHttpRequest();
                } else {
                    //遍历IE中不同版本的ActiveX对象
                    var versions = ["Microsoft", "msxm3", "msxml2", "msxml1"];
                    for (var i = 0; i < versions.length; i++) {
                        try {
                            var version = versions[i] + ".XMLHTTP";
                            return new ActiveXObject(version);
                        } catch (e) {}
                    }
                }
            }
            //创建对象。
            xhr = getXHR();
            xhr.withCredentials = true;

            //添加监听
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (timeOut !== undefined) {
                        //由于执行abort()方法后，有可能触发onreadystatechange事件，
                        //所以设置一个timeout_bool标识，来忽略中止触发的事件。
                        if (timeout_bool) {
                            return;
                        }
                        clearTimeout(timeout_flag);
                    }
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                        success(xhr.responseText);
                    } else {
                        error(xhr);
                    }
                }
            };


            xhr.open(type, url, async);

            //设置请求头
            if (type === "post" && !contentType) {
                //若是post提交，则设置content-Type 为application/x-www-four-urlencoded
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
            } else if (contentType) {
                xhr.setRequestHeader("Content-Type", contentType);
            }
            //发送请求
            xhr.send(type === "get" ? null : data);
            setTime(); //请求超时
        }


        var url = options.url || "", //请求的链接
            type = (options.type || "get").toUpperCase(), //请求的方法,默认为get
            data = options.data || null, //请求的数据
            contentType = options.contentType || "", //请求头
            dataType = options.dataType || "", //请求的类型
            async = options.async === undefined ? true : options.async, //是否异步，默认为true.
            timeOut = options.timeOut, //超时时间。 
            before = options.before || function () {}, //发送之前执行的函数
            error = options.error || function () {}, //错误执行的函数
            success = options.success || function () {}; //请求成功的回调函数
        var timeout_bool = false, //是否请求超时
            timeout_flag = null, //超时标识
            xhr = null; //xhr对象
        setData();
        before();
        if (dataType === "jsonp") {
            createJsonp();
        } else {
            createXHR();
        }
    }

    _.ajax = ajax;
}(window._));



/**
 * 通用modal
 */
(function (App) {
    var template = '<div class="m-modal f-dn"></div>';

    /**
     * 
     * @param {Object} options 配置参数，parent为挂载的父节点，content为内容
     */
    function Modal(options) {
        // 继承配置
        _.extend(this, options);
        // 缓存节点
        this.container = _.html2node(template);
        this.container.innerHTML = this.content || '';
        // 挂载到父节点
        this.parent.appendChild(this.container);
    }

    // 展示弹窗
    Modal.prototype.show = function () {
        _.removeClass(this.container, 'f-dn');
    };
    // 关闭弹窗
    Modal.prototype.hide = function () {
        //_.addClass(this.container, 'f-dn');
        this.parent.removeChild(this.container);
        this.container = null;
    };

    App.Modal = Modal;
}(window.App));


/**
 * 选择器
 */
(function (App) {
    var template = `
    <div class="m-select">
        <div class="select_hd">
            <span class="select_val"></span>
            <span class="u-icon-dropdown"></span>
        </div>
        <ul class="select_opt f-dn">
        </ul>
    </div>`;

    /**
     * 
     * @param {Object} options parent为父容器节点
     */
    function Select(options) {
        _.extend(this, options);
        this.body = _.html2node(template);
        //缓存节点
        this.nOption = this.body.getElementsByTagName('ul')[0];
        this.nValue = this.body.getElementsByTagName('span')[0];

        this.init();
    }
    //扩展原型
    _.extend(Select.prototype, App.emitter);

    //初始化
    Select.prototype.init = function () {
        this.parent.appendChild(this.body);
        this.initEvent();
    }
    //绑定事件
    Select.prototype.initEvent = function () {
        this.body.addEventListener('click', this.clickHandler.bind(this));
        //document.addEventListener('click', this.close.bind(this));
    }
    //渲染下拉列表
    Select.prototype.render = function (data, defaultIndex) {
        var optionsHTML = '';
        var format_data=[];

        for (var i = 0; i < data.length; i++) {
            //格式化数据{name:value}
            format_data[i]={
                'code':data[i][0],
                'name':data[i][1],
                'other':data[i][2]
            };
            optionsHTML += `<li data-index=${i}>${format_data[i].name}</li>`;
        }

        this.nOption.innerHTML = optionsHTML;
        this.nOptions = this.nOption.children;
        this.options = format_data;
        this.selectedIndex = undefined;
        //默认选中第一项
        this.setSelect(defaultIndex || 0);
    }
    //处理函数
    Select.prototype.clickHandler = function (event) {
        var index = event.target.dataset.index;
        if (event.target.tagName === 'LI') {
            this.setSelect(index);
        } else {
            this.toggle();
        }
    }
    //打开下拉菜单
    Select.prototype.open = function () {
        _.removeClass(this.nOption, 'f-dn');
    }
    //关闭下拉菜单
    Select.prototype.close = function () {
        _.addClass(this.nOption, 'f-dn');
    }
    //下拉菜单的开关
    Select.prototype.toggle = function () {
        _.hasClass(this.nOption, 'f-dn') ? this.open() : this.close();
    }
    //获取当前选中项的值
    Select.prototype.getValue = function () {
        return this.options[this.selectedIndex].code;
    }
    //设置选中项的选中状态并发出事件
    Select.prototype.setSelect = function (index) {
        //取消上次选中效果
        if (this.selectedIndex !== undefined) {
            _.removeClass(this.nOptions[this.selectedIndex], 'z-select');
        }
        //设置选中
        this.selectedIndex = index;
        this.nValue.innerText = this.nOptions[this.selectedIndex].innerText;
        _.addClass(this.nOptions[this.selectedIndex], 'z-select');

        this.fire({
            type: 'select',
            code: this.getValue()
        });
    }

    App.Select = Select;
}(window.App));


/**
 * 级联选择器
 */
(function (App) {

    /**
     * 
     * @param {Object} options parent为父容器节点
     */
    function CascadeSelect(options) {
        _.extend(this, options);
        this.selectList = [];
        this.init();
    }

    CascadeSelect.prototype.init = function () {
        for (var i = 0; i < 3; i++) {
            var select = new App.Select({
                parent: this.parent
            });
            select.on('select', this.onChange.bind(this, i));
            this.selectList[i] = select;
        }
        this.selectList[0].render(this.data);
    }
    CascadeSelect.prototype.getValue = function () {
        this.province=this.selectList[0].getValue();
        this.city=this.selectList[1].getValue();
        this.district=this.selectList[2].getValue();
    }
    //响应select事件，渲染下一个Select数据
    CascadeSelect.prototype.onChange = function (index,event) {
        var next = index + 1;
        if (next === this.selectList.length) return;
        this.selectList[next].render(this.getList(index,event));
    }
    //获取第N个Select的数据
    CascadeSelect.prototype.getList = function (index,event) {
        var data_02=this.selectList[index].options.filter(function(item){
            return item['code']===event.code;
        })[0];
        return data_02['other'];
    }

    App.CascadeSelect = CascadeSelect;
}(window.App));

/**
 * 验证器
 */
(function (App) {

    var validator = {
        // 1. 验证是否为空
        isEmpty: function (value) {
            return typeof value === 'undefined' || !value.trim();
        },
        // 2. 验证电话号码
        isPhone: function (value) {
            return /^\d{11}$/.test(value);
        },
        // 3. 验证昵称
        isNickName: function (value) {
            // 中英文数字均可，至少8个字符
            return /^[\u4e00-\u9fa5a-zA-Z0-9]{8}[\u4e00-\u9fa5a-zA-Z0-9]*$/.test(value);
        },
        // 4. 长度限制
        isLength: function (value, min, max) {
            var length = value.toString().length;
            // 验证结果
            var result = true;
            // 长度 大于等于最小值，小于等于最大值
            typeof min !== 'undefined' && (result = result && length >= min);
            typeof max !== 'undefined' && (result = result && length <= max);
            return result;
        }
    };

    App.validator = validator;
}(window.App));