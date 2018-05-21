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
        }
    }

    //页面初始化
    document.addEventListener('DOMContentLoaded',function(e){
        page.init();
    });
}(window.App));