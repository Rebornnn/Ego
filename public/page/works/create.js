//标签函数
(function(App){
    function Tag(options) {
        this.options=options;
        if(!this.options.parent){
            console.log('请传入标签容器');
            return;
        }
        this.list=[];
        this.element=_.createElement('ul','m-tag');
        this.options.parent.appendChild(this.element);
        this.initList();
        this.addEvent();
    }

    Tag.prototype.initList=function(){
        //最后的添加按钮
        this.addTag=_.createElement('li','tag',);
        _.addClass(this.addTag,'tag-add');
        //输入框
        this.tagInput=_.createElement('input','u-inp');
        this.tagInput.type='text';
        //默认提升文本
        this.tagTxt=_.createElement('span','txt','+ 自定义标签');

        this.addTag.appendChild(this.tagInput);
        this.addTag.appendChild(this.tagTxt);
        this.element.appendChild(this.addTag);
        //初始化传入的标签
        this.add(this.options.tags);
    }


    Tag.prototype.add=function(tags){
        var add=function(tag){
            //判断标签是否存在
            if(this.list.includes(tag)){
                return;
            }
            var tagEl;
            
            //按html结构组装标签元素
            var html=`
            <li class="tag" id="${tag}">
                    <button class="close">X</button>
                    <span>${tag}</span>
            </li>
            `;
            tagEl=_.html2node(html);
            this.element.insertBefore(tagEl,this.addTag);
            //将标签存入数组
            this.list.push(push);
        };
        //tags也支持数组
        if(tags&&!Array.isArray(tags)){
            tags=[tags];
        }
        (tags||[]).forEach(add,this);
    }


    Tag.prototype.remove=function(tag){
        for(var i=0;i<this.list.length;i++){
            if(this.list[i]===tag){
                //从数组中删除标签
                this.list=this.list.filter(function(item,index,arr){
                    return arr[index]!==item;
                })
                //删除标签元素
                _.$('tag').parent.removeChild(_.$('tag'));

                break;
            }
        }
    }


    Tag.prototype.addEvent=function(){
        //关闭按钮及添加tag的点击事件
        var clickHandler=function(){
            var target=e.target;
            if(_.hasClass(target,'close')){
                this.remove(e.innerText);
            }else if(_.hasClass(target,'text')){
                //给this.addTag添加focused类
                _.addClass(this.addTag,'focused');
            }
        }.bind(this);

        this.element.addEventListener('click',clickHandler);

        //tag输入框失焦事件
        var inputBlurHandler=function(e){
            //清空输入框的值
            //删除this.addTag上的focused类
            e.target.value='';
            _.removeClass(target,'focused');
        }.bind(this);

        //tag输入框回车事件
        var tagInputKeydownHandler=function(e){
            if(e.keyCode===13){
                var value=this.tagInput.value.trim();
                if(this.list.indexOf(value)<0){
                    this.add(value);
                    value='';
                }
            }
        }.bind(this);

        this.tagInput.addEventListener('blur',tagInputBlurHandler);
        this.tagInput.addEventListener('keydown',tagInputKeydownHandle);
    }
    Tag.prototype.getValue=function(){
        return this.list;
    }

    App.Tag=Tag;
}(window.App));

(function(App){
    var page={
        init:function(){
            App.nav.init();
            new App.Tag({
                parent:_.$('mTags'),
                tags:['少男','少女']
            });
        }
    };

    //页面初始化
    document.addEventListener('DOMContentLoaded',function(e){
        page.init();
    });
}(window.App));

