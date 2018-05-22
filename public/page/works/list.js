(function(App){
    var page={
        init:function(){
            this.initNav();
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
                query:{},
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
            _.ajax({
                url:'api/works',
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
            var self=this;
            var html=`
            <div class="modal-list modal_delete">
                <div class="modal_head">
                    <span class="u-tips">提示信息:</span>
                    <i class="u-close" id="modal_close">X</i>
                </div>
                <div class=u-content>
                    确定要删除作品<em class="del-item-name">"${works.name}"</em>吗
                </div>
                <div>
                    <button class="u-btn u-btn-primary" id="confirm">确&nbsp;&nbsp;认</button>
                    <button class="u-btn u-btn-primary" id="cancel">取&nbsp;&nbsp;消</button>
                </div>
            </div>
            `;
            self.modal=new App.Modal({
                parent:_.$('gBody'),
                content:html
            });
            self.modal.show();
            _.extend(self.modal,App.emitter);
            //注册事件
            self.modal.on('ok',function(){
                //这里不能直接用modal.hide()，因为事件注册函数on()会将第一次创建的modal缓存起来，当执行hide()删除节点后，
                //第一次创建的modal不在DOM树中仍然还在内存中，但是没有父元素，也就不能执行removeChildren()操作
                self.modal.hide();
                _.ajax({
                    url:'/api/works/'+works.id,
                    type:'delete',
                    success:function(data){
                        //删除成功后，重新刷新列表
                        self.initList();
                    }
                });
            }.bind(self));
            //触发事件
            _.$('confirm').addEventListener('click',function(){
                self.modal.fire({type:'ok'});
            });
            _.$('cancel').addEventListener('click',function(){
                self.modal.hide();
            });
        },
        //编辑方法
        editWorks:function(works,workEl){
            var self=this;
            var input;
            var html=`
            <div class="modal-list modal_edit">
                <div class="modal_head">
                    <span class="u-tips">请输入新的作品名称：</span>
                    <i class="u-close" id="modal_close">X</i>
                </div>
                <div class=u-content>
                    <input id="name-inp" class="item-name-inp" value="${works.name}" autofocus="autofocus" placeholder="名称不能为空"/>
                </div>
                <div>
                    <button class="u-btn u-btn-primary" id="confirm">确&nbsp;&nbsp;认</button>
                    <button class="u-btn u-btn-primary" id="cancel">取&nbsp;&nbsp;消</button>
                </div>
            </div>
            `;
            var modal=new App.Modal({
                parent:_.$('gBody'),
                content:html
            });
            modal.show();
            _.extend(modal,App.emitter);
            //注册事件
            modal.on('edit',function(){
                var newName=_.$('name-inp').value.trim();
                //检查name是否为空，为空则提示用户，并结束程序运行
                if(!newName){
                    
                    return;
                }

                if(newName!==works.name){
                    _.ajax({
                        url:'/api/works/'+works.id,
                        type:'patch',
                        data:{name:newName},
                        success:function(data){
                            data=JSON.parse(data);
                            worksEl.getElementsByTagName('h3')[0].innerText=data.result.name;
                        }
                    });
                }
            });
            //触发事件
            _.$('confirm').addEventListener('click',function(){
                modal.fire({type:'edit'});
            });
            _.$('cancel').addEventListener('click',function(){
                modal.hide();
            });
        }
    }

    //页面初始化
    document.addEventListener('DOMContentLoaded',function(e){
        page.init();
    });
}(window.App));