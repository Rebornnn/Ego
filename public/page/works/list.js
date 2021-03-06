/**
 * 通知框模板
 */
(function(App){
    function noticeModal(options){
        App.Modal.call(this,options);
        //缓存节点
        this.nConfirm=_.$('confirm');
        this.nCANCEL=_.$('cancel');
        this.nClose=_.$('modal_close');

        this.initEvent()
        this.show();
    }


    noticeModal.prototype=Object.create(App.Modal.prototype);
    //注意点：emitter混入到原型对象上，会导致事件的处理函数重复累加
    _.extend(noticeModal.prototype,App.emitter);

    noticeModal.prototype.initEvent=function(){
        this.nConfirm.addEventListener('click',function(){
            this.fire({type:'ok'});
            //清除ok事件,如果不清空ok事件处理函数，那么每注册一次ok事件就会
            //添加一个事件处理函数，且当触发ok事件来执行处理函数时会从注册的
            //第一个处理函数开始执行，但是第一个注册的处理函数中缓存的值在执行
            //完后会被销毁，从而导致一个bug。
            //BUG：通知modal的确认按钮只会在第一次点击时成功执行，
            //接下来创建的通知框中的确认按钮都不会执行
            this.offType('ok');
        }.bind(this));

        this.nCANCEL.addEventListener('click',function(){
            this.offType('ok');
            this.hide();
        }.bind(this));

        this.nClose.addEventListener('click',function(){
            this.offType('ok');
            this.hide();
        }.bind(this));
    }

    App.noticeModal=noticeModal;
}(window.App));




/**
 * 分页器
 */
(function(App){
    //默认选中的页码
    var DEFAULT_PAGE=1;
    //默认显示的页码个数
    var DEFAULT_SHOW_NUM=8;
    //每页显示的默认数量
    var DEFAULT_ITEMS_LIMIT=10;

    function Pagination(options){
        this.options=options;
        this.current=options.current||DEFAULT_PAGE;
        this.showNum=options.showNum||DEFAULT_SHOW_NUM;
        this.itemsLimit=options.itemsLimit||DEFAULT_ITEMS_LIMIT;
        this.init();
    }

    Pagination.prototype.init=function(){
        
        this.render();
        //设置页码状态
        this.setStatus();
        
    };

    Pagination.prototype.render=function(){
        this.container=_.createElement('ul','m-pagination','');
        this.first=_.createElement('li','first','第一页');
        this.first.dataset.page=1;
        this.container.appendChild(this.first);
        
        //类似的创建prev元素
        this.prev=_.createElement('li','prev','上一页');
        
        this.container.appendChild(this.prev);

        this.pageNum=Math.ceil(this.options.total/this.itemsLimit);
        this.startNum=Math.floor((this.current-1)/this.showNum)*this.showNum+1;
        this.numEls=[];
        for(var i=0;i<this.showNum;i++){
            var numEl=_.createElement('li'),
                num=this.startNum+i;
            
            if(num<=this.pageNum){
                numEl.innerText=num;
                numEl.dataset.page=num;
                this.numEls.push(numEl);
                this.container.appendChild(numEl);
            }
        }

        //类似地，创建next和last元素
        this.next=_.createElement('li','next','下一页');
        this.container.appendChild(this.next);

        this.last=_.createElement('li','last','尾页');
        this.last.dataset.page=this.pageNum;
        this.container.appendChild(this.last);

        this.options.parent.appendChild(this.container);
        this.addEvent();
    };

    Pagination.prototype.destroy=function(){
        if(this.container){
            this.options.parent.removeChild(this.container);
            this.container=null;
        }
    };

    Pagination.prototype.setStatus=function(){
        //判断是否为第一页，如果是，first和prev元素样式都为disabled
        //同理判断是否为最后一页，相应的设置next和last
        //设置prev和next两个元素的data-page值
        if(this.current===1){
            _.addClass(this.first,'disabled');
            _.addClass(this.prev,'disabled');
        }else{
            _.removeClass(this.first,'disabled');
            _.removeClass(this.prev,'disabled');
        }
        
        if(this.current===this.pageNum){
            _.addClass(this.next,'disabled');
            _.addClass(this.last,'disabled');
        }else{
            _.removeClass(this.next,'disabled');
            _.removeClass(this.last,'disabled');
        }

        this.numEls.forEach(function(numEl){
            numEl.className='';
            if(this.current===parseInt(numEl.dataset.page)){
                numEl.className='active';
            }
        }.bind(this));

        this.next.dataset.page=this.current;
        this.prev.dataset.page=this.current;
    }

    Pagination.prototype.addEvent=function(){
        var clickHandler=function(e){
            var numEl=e.target;
            //如果已经是disabled或者active状态，则不操作
            if(!_.hasClass(numEl,'disable')||!_.hasClass(numEl,'active')){
                this.current=parseInt(numEl.dataset.page);
            }
            if(_.hasClass(numEl,'prev')){this.current=this.current-1;}
            if(_.hasClass(numEl,'next')){this.current=this.current+1;}
            //判断是否需要翻篇
            if(this.current<this.startNum||this.current>=this.startNum+this.showNum){
                this.destroy();
                this.render();
            }else{
                this.setStatus();
            }
            //有切换动作需要回调来渲染列表
            this.options.callback(this.current);
        }.bind(this);
        this.container.addEventListener('click',clickHandler);
    }

    App.Pagination=Pagination;
}(window.App));

(function(App){
    var page={
        init:function(){
            this.initNav();
            new App.Pagination({
                parent:document.querySelector('#pagination'),
                total:80,
                current:1,
                showNum:6,
                itemsLimit:8,
                callback:function(currentPage){
                    this.loadList({
                        query:{
                            total:0,
                            offset:(currentPage-1)*10,
                            limit:10
                        },
                        callback:function(data){
                            this.renderList(data.result.data);
                        }.bind(this)
                    });
                }.bind(this)
            });
        },
        initNav:function(){
            App.nav.init({
                login:function(data){
                    this.initProfile(data);
                    this.initList();
                    this.addEvent();
                }.bind(this)
            });
        },
        //初始化个人信息
        initProfile:function(data){
            var html=`
            <img src="../../res/avatar.png">
            <div class="u-info">
                <em class="name" title="Amber">${data.nickname}</em>
                <span class="sex"><em class="u-icon u-icon-male"></em></span>
            </div>
            <div class="u-info">
                <em class="age">${_.getAge(data.birthday)}岁</em>
                <em class="constellation">${_.getConstellation(data.birthday)}</em>
                <span class="address-info">
                    <em class="u-icon u-icon-address"></em>
                    <em class="address">${_.getCity(ADDRESS_CODES,data)}</em>
                </span>
            </div>`;
            _.$('gProfile').innerHTML=html;
        },
        //初始化列表
        initList:function(){
            this.loadList({
                query:{
                    total:0,
                    offset:0,
                    limit:10,
                },
                callback:function(data){
                    _.addClass(_.$('g-bd'),'list-loaded');
                    if(!data.result.data.length){
                        _.$('mWorks').innerHTML='你还没创建过作品～';
                        return;
                    }
                    this.renderList(data.result.data);
                    _.removeClass(_.$('g-bd'),'list-loaded');
                }.bind(this)
            });
        },
        //加载列表
        loadList:function(options){
            _.$('mWorks').innerHTML='你还没有登录～';
            _.ajax({
                url:'api/works?',
                data:options.query,
                success:function(data){
                    data=JSON.parse(data);
                    if(data.code===200){
                        options.callback(data);
                    }
                },
            });
        },
        //渲染列表
        renderList:function(data){
            var rawTemplate=`
                {{#each works}}
                <li class="item" data-id={{this.id}}>
                    <a href='#'>
                        {{#if this.coverUrl}}
                        <img src="{{this.coverUrl}}" alt="{{this.name}}">
                        {{else}}
                        <img src="../../res/images/work7.jpg" alt="作品默认封面">
                        {{/if}}
                        <h3>{{this.name}}</h3>
                    </a>
                    <div class="icons">
                        <i class="u-icon u-icon-edit"></i>
                        <i class="u-icon u-icon-delete"></i> 
                    </div>
                </li>
                {{/each}}
            `;

            var template=Handlebars.compile(rawTemplate);
            var context={
                "works":data
            };
            var html=template(context);
            _.$('mWorks').innerHTML=html;
        },
        //添加事件
        addEvent:function(){
            var self=this;
            _.$('mWorks').addEventListener('click',function(e){
                var target=e.target;
                if(target.classList.contains('u-icon')){
                    var worksEl=target.parentNode.parentNode;
                    var options={
                        name:worksEl.getElementsByTagName('h3')[0].innerText,
                        id:worksEl.dataset.id
                    };
                    if(target.classList.contains('u-icon-delete')){
                        self.deleteWorks(options);
                    }else if(target.classList.contains('u-icon-edit')){
                        self.editWorks(options,worksEl);
                    }
                }       
            });
        },
        //删除方法
        deleteWorks:function(works){
            var html=`
            <div class="modal-list modal_delete">
                <div class="modal_head">
                    <span class="u-tips">提示信息:</span>
                    <i class="u-close" id="modal_close">X</i>
                </div>
                <div class="u-content">
                    确定要删除作品<em class="del-item-name">"${works.name}"</em>吗
                </div>
                <div class='u-buttons'>
                    <button class="u-btn u-btn-primary" id="confirm">确&nbsp;&nbsp;认</button>
                    <button class="u-btn u-btn-link" id="cancel">取&nbsp;&nbsp;消</button>
                </div>
            </div>
            `;
            this.modal=new App.noticeModal({
                parent:_.$('gBody'),
                content:html
            });
            this.modal.on('ok',function(){
                this.modal.hide();
                _.ajax({
                    url:'api/works/'+works.id,
                    type:'delete',
                    success:function(data){
                        this.initList();
                    }.bind(this)
                });
            }.bind(this));
        },
        //编辑方法
        editWorks:function(works,worksEl){
            var input;
            var html=`
            <div class="modal-list modal_edit">
                <div class="modal_head">
                    <span class="u-tips">请输入新的作品名称：</span>
                    <i class="u-close" id="modal_close">X</i>
                </div>
                <div class=u-content>
                    <input id="name-inp" class="item-name-inp" value="${works.name}" autofocus placeholder="名称不能为空"/>
                </div>
                <div class='u-buttons'>
                    <button class="u-btn u-btn-primary" id="confirm">确&nbsp;&nbsp;认</button>
                    <button class="u-btn u-btn-link" id="cancel">取&nbsp;&nbsp;消</button>
                </div>
            </div>
            `;
            this.modal=new App.noticeModal({
                parent:_.$('gBody'),
                content:html
            });
            //注册事件
            this.modal.on('ok',function(){
                var newName=_.$('name-inp').value.trim();
                //检查name是否为空，为空则提示用户，并结束程序运行
                if(!newName){
                    return;
                }

                if(newName!==works.name){
                    this.modal.hide();
                    _.ajax({
                        url:'/api/works/'+works.id,
                        type:'patch',
                        data:{name:newName},
                        // contentType:'application/x-www-form-urlencoded;charset=UTF-8',
                        success:function(data){
                            data=JSON.parse(data);
                            worksEl.getElementsByTagName('h3')[0].innerText=data.result.name;
                        },
                        error:function(status,statusText){
                            console.log(status,statusText);
                        }
                    });
                }
            }.bind(this));
        }
    }

    //页面初始化
    document.addEventListener('DOMContentLoaded',function(e){
        page.init();
    });
}(window.App));