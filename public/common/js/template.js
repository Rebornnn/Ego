(function(App){
    var template={
        /**
         * 首页
         * 侧边栏圈子
         */
        aside_circle: Handlebars.compile(`<div class="m-aside">
			<div class="circle_header">
				<label class="title"><input class="f-dn" type="radio" name="circle" value="0" checked /><div>活 跃 圈 子</div></label><label class="title"><input class="f-dn" type="radio" name="circle" value="1" /><div>创 建 圈 子</div></label>
			</div>
			<ul class="circle_cnt">
			{{#each list}}
				<li class="f-cb">
					<img class="f-fl" src="{{img_url}}" />
					<div class="f-oh">
						<h6>{{circle_name}}</h6>
						<p><span>已圈 {{circle_members}}人</span></p>
					</div>
				</li>
			{{/each}}
			</ul>
			<h4 class="aside_more">更 多<i class="u-icon u-icon-moreright"></i></h4>
        </div>`),

        /**
         * 首页
         * 热门话题
         */
        aside_hottopic: Handlebars.compile(`<div class="m-aside">
			<div class="hottopic_header">
				<div class="title">热 门 话 题</div>
			</div>
			<ul class="hottopic_cnt">
			{{#each list}}
				<li class="f-cb">
					<div class="f-oh">
						<div class="title">{{title}}</div>
					</div>
				</li>
			{{/each}}
			</ul>
			<h4 class="aside_more">更 多<i class="u-icon u-icon-moreright"></i></h4>
        </div>`),
        
        /**
         * 首页
         * 排行榜
         */
        aside_ranking: Handlebars.compile(`<div class="m-aside">
			<div class="ranking_header">
				<div class="f-fl title">排 行</div>
				<div  class="f-oh">
					<div class=" m-tabs-aside" id="ranking_tabs">	
						<ul>
                    		<li class="z-active"><a href="#">原创</a></li>
                    		<li><a  href="#">同人</a></li>
                    		<li><a href="#">临摹</a></li>
						</ul>
					</div>
				</div>
			</div>
			<ul class="ranking_cnt">
			{{#each list}}
				<li class="f-cb">
					<img class="f-fl" src="{{img_url}}" />
					<div class="f-oh">
						<h6>{{work_name}}</h6>
						<p>{{author_name}}</p>
						<p><span>查看 {{visit_num}}</span><span>收藏 {{collection_num}}</span></p>
					</div>
				</li>
			{{/each}}
			<i class="u-icon u-icon-morebottom"></i>
			</ul>
		</div>`),

        /**
         * 首页
         * 达人排行榜
         */
        aside_authorranking: Handlebars.compile(`<div class="m-aside">
			<div class="authorranking_header">
				<div class="title">达 人 排 行 榜</div>
			</div>
			<ul class="authorranking_cnt">
			{{#each list}}
				<li class="f-cb">
					<img class="f-fl" src="{{img_url}}" />
					<div class="f-oh">
						<h6>{{author_name}}</h6>
						<p><span>作品 {{works_num}}</span><span>粉丝 {{fans_num}}</span></p>
					</div>
				</li>
			{{/each}}
			<i class="u-icon u-icon-morebottom"></i>
			</ul>
        </div>`)
    }

    App.template=template;
}(window.App));