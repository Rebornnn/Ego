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
        this.nRecommend=_.$('recommendTags');

        this.initList();
        this.addEvent();
        this.initRecommend();
    }

    Tag.prototype.initList=function(){
        //最后的添加按钮
        this.addTag=_.createElement('li','tag',);
        _.addClass(this.addTag,'tag-add');
        //输入框
        this.tagInput=_.createElement('input','u-inp');
        this.tagInput.type='text';
        //默认文本
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
                    <span class="close">X</span>
                    <span>${tag}</span>
            </li>
            `;
            tagEl=_.html2node(html);
            this.element.insertBefore(tagEl,this.addTag);
            //将标签存入数组
            this.list.push(tag);
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
                    return index!=i;
                })
                //删除标签元素
                _.$(tag).parentElement.removeChild(_.$(tag));

                break;
            }
        }
    }


    Tag.prototype.addEvent=function(){
        //关闭按钮及添加tag的点击事件
        var clickHandler=function(e){
            var target=e.target;
            if(_.hasClass(target,'close')){
                this.remove(target.parentElement.id);
            }else if(_.hasClass(target,'txt')){
                //给this.addTag添加focused类
                _.addClass(this.addTag,'focused');
            }
        }.bind(this);

        this.element.addEventListener('click',clickHandler);

        //tag输入框失焦事件
        var tagInputBlurHandler=function(e){
            //清空输入框的值
            //删除this.addTag上的focused类
            e.target.value='';
            _.removeClass(this.addTag,'focused');
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
        this.tagInput.addEventListener('keydown',tagInputKeydownHandler);
    }

    Tag.prototype.getValue=function(){
        return this.list;
    }

    Tag.prototype.initRecommend=function(){
        _.ajax({
            type:'get',
            url:_.mockUrl('/api/tags?recommend','get'),
            success:function(data){
                data=JSON.parse(data);
                var result=data.result.split(',');
                var html='';

                for(var i=0;i<result.length;i++){
                    html+=`
                    <li class='tag f-ff' data-index=${i}>+ ${result[i]}</li>
                    `;
                }

                this.nRecommend.innerHTML=html;

                this.nRecommend.addEventListener('click',function(e){
                    var target=e.target;
                    this.add(result[target.dataset.index]);
                }.bind(this));
            }.bind(this),
            error:function(){}
        });

        
    }

    App.Tag=Tag;
}(window.App));

/**
 * 提醒框模板
 */
(function(App){
    function warnModal(options){
        App.Modal.call(this,options);
        //缓存节点
        this.nConfirm=_.$('confirm');

        this.initEvent();
        this.show();
    }

    warnModal.prototype=Object.create(App.Modal.prototype);

    warnModal.prototype.initEvent=function(){
        this.nConfirm.addEventListener('click',this.hide.bind(this));
    };

    App.warnModal=warnModal;
}(window.App));

/**
 * 图片上传
 */
(function(App){
    function UploadWorks(){
        

        //缓存节点
        this.fileInput=_.$('uUpload'); 
        this.nButton=_.$('uploadButton');
        this.nProgress=_.$('uProgress');
        this.nProgressBar=_.$('progressBar');
        this.nTotal=_.$('total');
        this.nFinished=_.$('finished');
        this.nUploading=_.$('uploading');
        this.nUpworks=_.$('up_Works');

        this.addEvent();
    }

    UploadWorks.prototype.addEvent=function(){
        this.fileInput.addEventListener('change',this.changeHandler.bind(this));
        this.nUpworks.addEventListener('click',this.setCover.bind(this));
    }

    UploadWorks.prototype.changeHandler=function(e){
        var files=e.target.files;
        var sizeExceeddFiles=[];
        var sizeOkFiles=[];
        var maxSize=1024*1024;

        //遍历文件，按照图片大小归档
        for(var i=0;i<files.length;i++){
            if(files[i].size>maxSize){
                sizeExceeddFiles.push(files[i]);
            }else{
                sizeOkFiles.push(files[i])
            }
        }

        if(sizeExceeddFiles.length>0){
            this.warn('图片大小不能超过1M!');
            return;
        }

        if(sizeOkFiles.length>10){
            this.warn('一次最多只能上传10张图片');
            return;
        }

        //缓存文件数组
        this.pictures=sizeOkFiles;
        //开始上传文件
        this.uploadFiles(sizeOkFiles);
    }

    //提醒框
    UploadWorks.prototype.warn=function(warnMsg){
        var html=`
        <div class="modal_warn">
            <div class="modal_head">
                <span class="u-tips">警告信息:</span>
            </div>
            <div class="u-content">
                ${warnMsg}
            </div>
            <div>
                <button class="u-btn u-btn-primary" id="confirm">确&nbsp;&nbsp;认</button>
            </div>
        </div>
        `;

        this.modal=new App.warnModal({
            parent:_.$('gMain'),
            content:html
        });
    }

    UploadWorks.prototype.uploadFiles=function(files){
        var success=this.upWorks;
        //计算文件总长度
        var totalSize=files.reduce(function(prev,cur,index,arr){
            return prev+cur.size;
        },0);

        //初始化progessBar的值
        var loadedSize=0;
        var uploadingFileIndex=1;
        this.nProgressBar.value=loadedSize;
        this.nProgressBar.max=totalSize;
        
        //更改样式，让用户知道正在上传
        //上传文件前禁用上传按钮
        _.addClass(this.nButton,'disabled');
        _.removeClass(this.nProgress,'f-dn');

        //计算已经上传的资源总长度
        var getLoadedSize=function(loaded){
            return loadedSize+=loaded;
        };

        var upload=function(){
            var file=files[uploadingFileIndex-1];
            if(!file){
                //上传完毕，恢复按钮及其他状态
                _.removeClass(this.nButton,'disabled');
                _.addClass(this.nProgress,'f-dn');
                return;
            }

            var fd=new FormData();
            fd.append('file',file,file.name);
            var xhr=new XMLHttpRequest();
            xhr.withCredentials=true;
            xhr.upload.onprogress=function(e){
                if(e.lengthComputable){
                    //更新progressBar的value为getLoadedSize
                    this.nProgressBar.value=getLoadedSize(e.loaded);
                    //设置progressInfo
                    this.nTotal.innerText=files.length;
                    this.nFinished.innerText=uploadingFileIndex;
                    this.nUploading.innerText=Math.ceil((loadedSize/totalSize)*100)>100?100:Math.ceil((loadedSize/totalSize)*100);
                }
            }.bind(this);
            xhr.onreadystatechange=function(){
                if(xhr.readyState===4){
                    if((xhr.status>=200&&xhr.status<300)||xhr.status===304){
                        success(xhr.responseText);
                        uploadingFileIndex+=1;
                        upload();
                    }
                }
            };

            xhr.open('POST','/api/works?upload');
            xhr.send(fd);
        }.bind(this);

        upload();
    }

    UploadWorks.prototype.upWorks=function(data){
        data=JSON.parse(data);
        var html=`
        <li class="u-picture f-ff" id=${data.result.id}>
            <img src=${data.result.url}>
            <div class="u-btn  u-btn-link" id="cover" data-id=${data.result.id} data-url=${data.result.url}>设为封面</div>
        </li>
        `;
        var node=_.html2node(html);
        _.$('up_Works').appendChild(node);
    };


    UploadWorks.prototype.setCover=function(e){
        if(e.target.id==='cover'){
            this.coverId=e.target.dataset.id;
            this.coverUrl=e.target.dataset.url;
        }
    }

    UploadWorks.prototype.getValue=function(){
        if(this.pictures){
            return {
                pictures:this.pictures,
                coverId:this.coverId||this.pictures[0].id,
                coverUrl:this.coverUrl||this.pictures[0].url
            };
        }
    }

    App.UploadWorks=UploadWorks;
}(window.App));

(function(App){
    var page={
        init:function(){
            App.nav.init();
            this.initForm();
            this.initSelect();
        },
        initForm:function(){
            this.tag=new App.Tag({
                parent:_.$('mTags'),
                tags:['少男']
            });
            this.uploadWorks=new App.UploadWorks();
            //绑定提交事件
            _.$('create').addEventListener('click',this.submit.bind(this));
        },
        initSelect:function(){
            var formData=[
                {name:'不限制作品用途',value:0},
                {name:'不限制作品用途',value:1},
                {name:'不限制作品用途',value:2},
            ];

            this.privilege=new App.Select({
                parent:_.$('uPrivilege'),
            });

            this.privilege.render(formData);
        },
        getRadioValue:function(form,name){
            var radioFields = _.$(form).elements[name];
            for (var i = 0; i < radioFields.length; i++) {
                if (radioFields[i].checked) {
                    return radioFields[i].value;
                }
            }
        },
        submit:function(){
            var data={
                name:_.$('workName').value,
                tag:this.tag.getValue().join(','),
                category:this.getRadioValue('formWork','category'),
                description:_.$('instructionArea').value,
                privilege:this.privilege.getValue(),
                authorization:this.getRadioValue('formWork','authorization')
            };

            this.uploadWorks.getValue()&&_.extend(data,this.uploadWorks.getValue());

            if(!data.name){
                _.removeClass(_.$('workError'),'f-dn');
            }else{
                _.ajax({
                    url:_.mockUrl('/api/works','post'),
                    type:_.switchType('POST'),
                    data:data,
                    success:function(){
                        window.location.pathname='/Ego/html/works/list.html';
                    }
                });
            }
        }
    };

    //页面初始化
    document.addEventListener('DOMContentLoaded',function(e){
        page.init();
    });
}(window.App));

