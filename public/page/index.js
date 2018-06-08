/**
 * 构建轮播图
 */
(function(App){
    var template='<div class="m-slider"><div>';
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
        this.container.appendChild(this.nSlider);
        this.nav(this.initIndex||0);
        this.autoPlay();
    }
    
    //构造图片节点
    Slider.prototype.buildSliders=function(){
        var sliders=document.createElement('ul'),
            html='';

        for(var i=0;i<this.imgLength;i++){
            html+=`<li class="slider_img"><img src=${this.imgSrc[i]}></li>`
        }
        sliders.innerHTML=html;
        this.nSlider.appendChild(sliders);

        return sliders.children;
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
            var el=event.target;
            var index=el.dataset.index;
            this.nav(index);
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
        if(this.last!==undefined){
            _.removeClass(this.nCursors[this.last],'z-active');
        }
        _.addClass(this.nCursors[this.index],'z-active');
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


/**
 * 构建明日之星
 */
(function(App){
    function StarList(container,data){
        this.listInfo=data;
        this.container=container;
        //绑定事件
        this.container.addEventListener('click',this.follwHandler.bind(this));
        this.render(data);
    }

    //扩展StarList原型
    _.extend(StarList.prototype,App.emitter);
    
    //渲染整个ul 
    StarList.prototype.render=function(data){
        var html='';
        data.forEach(function(item){
            html+=this.renderItem(item);
        }.bind(this));
        this.container.innerHTML=html;
    }
    //渲染单个ul
    StarList.prototype.renderItem=function(data){
        var config=App.followConfig[Number(!!data.isFollow)];
        var html=`
        <li class="m-card f-cb">
            <span class="card_avatar"></span>
            <div class="card_info">
                <div>${data.nickname}</div>
                <div><span>作品&nbsp;&nbsp;${data.workCount}</span><span>&nbsp;&nbsp;粉丝&nbsp;&nbsp;${data.followCount}</span></div>
            </div>
            <button class="u-btn u-btn-icon ${config.class}" data-userid="${data.id}"></button>
        </li>`;

        return html;
    }
    //点击按钮的处理函数
    StarList.prototype.follwHandler=function(event){
        var target=event.target;
        if(event.target.tagName==='BUTTON'){
            var user=window.App.user;

            //未登录情况
            if(user.username===undefined){
                this.fire({type:'login'});
                return;
            }
            //已经登录的情况
            var userId=target.dataset.userid,
                //data=点击的用户信息
                data=this.listInfo.filter(function(item){
                    return (item.id===parseInt(userId));
                })[0];
            if(_.hasClass(target,'z-unfollow')){
                this.follow(data,target.parentNode);
            }else{
                this.unfollow(data,target.parentNode);
            }
        }
    }
    //点击关注操作
    StarList.prototype.follow=function(followInfo,replaceNode){
        _.ajax({
            url:'/api/users?follow',
            type:'post',
            data:{id:followInfo.id},
            contentType:'application/json',
            success:function(data){
                data=JSON.parse(data);
                if(data.code===200){
                    followInfo.isFollow=true;
                    followInfo.followCount++;
                    var newNode=_.html2node(this.renderItem(followInfo));
                    replaceNode.parentNode.replaceChild(newNode,replaceNode);
                }
            }.bind(this),
            error:function(){}
        });
    }
    //点击取消关注操作
    StarList.prototype.unfollow=function(followInfo,replaceNode){
        _.ajax({
            url:'/api/users?unfollow',
            type:'post',
            data:{id:followInfo.id},
            contentType:'application/json',
            success:function(data){
                data=JSON.parse(data);
                if(data.code===200){
                    followInfo.isFollow=false;
                    followInfo.followCount--;
                    var newNode=_.html2node(this.renderItem(followInfo));
                    replaceNode.parentNode.replaceChild(newNode,replaceNode);
                }
            }.bind(this),
            error:function(){}
        });
    }

    App.StarList=StarList;
}(window.App));




/**
 * 页面的初始化
 */
(function(App){
    var page={
        init:function(){
            this.initNav();
            this.initStarList();
            this.Slider=new App.Slider({
                container:_.$('slider'),
                initIndex:0,
                imgLength:4,
                imgSrc:['public/res/banner0.jpg','public/res/banner1.jpg','public/res/banner2.jpg','public/res/banner3.jpg'],
                interval:2000
            });
            this.compileTemplateAside();
            this.sideTab=new App.Tabs({
                container:_.$("ranking_tabs")
            });
        },
        initNav:function(argument){
            App.nav.init({
                login:function(data){
                    if(!window.App.user.username){
                        window.App.user=data;
                        this.initStarList();
                    }
                }.bind(this)
            });
        },
        initStarList:function(){
            _.ajax({
                url:'/api/users?getstarlist',
                success:function(data){
                    data=JSON.parse(data);
                    if(data.code===200){
                        if(!this.starList){
                            this.starList=new App.StarList(_.$('starList'),data.result);
                            this.starList.on('login',function(){
                                App.nav.showLogin();
                            }.bind(this));
                        }else{
                            this.starList.render(data.result);
                        }
                    }
                }.bind(this),
                error:function(){}
            });
        },

        //编译侧边栏
        compileTemplateAside: function(){
			var html = '';

            html += `<div class="m-mywork"><img src="public/res/images/myWork.png" alt="我的作品"></div>`;
			// 圈子
			html += App.template.aside_circle({
				list: [
					{img_url: 'public/res/images/community1.jpg', circle_name: '门口小贩',circle_members:5221},
					{img_url: 'public/res/images/community2.jpg', circle_name: '原画集中营',circle_members:5221},
					{img_url: 'public/res/images/community3.jpg', circle_name: '—— Horizon ——',circle_members:5221}
				]
			});

			// 热门话题
			html += App.template.aside_hottopic({
				list: [
					{title: '1. [萝莉学院] 你不知道的那些事儿 这是标题标题 这是标题标题 这是标题标题 这是标题标题'},
					{title: '1. [萝莉学院] 你不知道的那些事儿 这是标题标题 这是标题标题 这是标题标题 这是标题标题'},
					{title: '1. [萝莉学院] 你不知道的那些事儿 这是标题标题 这是标题标题 这是标题标题 这是标题标题'},
					{title: '1. [萝莉学院] 你不知道的那些事儿 这是标题标题 这是标题标题 这是标题标题 这是标题标题'},
					{title: '1. [萝莉学院] 你不知道的那些事儿 这是标题标题 这是标题标题 这是标题标题 这是标题标题'}
				]
			});

			// 排行
			html += App.template.aside_ranking({
				list: [
					{img_url: 'public/res/images/work5.jpg',work_name: '我是作品名称',author_name: '用户名',visit_num: 2348,collection_num: 421},
					{img_url: 'public/res/images/work6.jpg',work_name: '我是作品名称',author_name: '用户名',visit_num: 2348,collection_num: 421},
					{img_url: 'public/res/images/work8.jpg',work_name: '我是作品名称',author_name: '用户名',visit_num: 2348,collection_num: 421},
					{img_url: 'public/res/images/work9.jpg',work_name: '我是作品名称',author_name: '用户名',visit_num: 2348,collection_num: 421},
					{img_url: 'public/res/images/work10.jpg',work_name: '我是作品名称',author_name: '用户名',visit_num: 2348,collection_num: 421}
				]
			});

			// 达人排行
			html += App.template.aside_authorranking({
				list: [
					{img_url: 'public/res/avatar1.png',author_name: 'Grinch',works_num: 2348,fans_num: 421},
					{img_url: 'public/res/avatar1.png',author_name: 'Grinch',works_num: 2348,fans_num: 421},
					{img_url: 'public/res/avatar1.png',author_name: 'Grinch',works_num: 2348,fans_num: 421},
					{img_url: 'public/res/avatar1.png',author_name: 'Grinch',works_num: 2348,fans_num: 421},
					{img_url: 'public/res/avatar1.png',author_name: 'Grinch',works_num: 2348,fans_num: 421}
				]
			});

			// 编译结果，载入页面主内容区
			_.$('gSide').innerHTML = html;
		},
    };

    //页面初始化
    document.addEventListener('DOMContentLoaded',function(e){
        page.init();
    });
}(window.App));