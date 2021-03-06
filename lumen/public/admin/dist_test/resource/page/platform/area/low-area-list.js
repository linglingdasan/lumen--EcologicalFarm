/**
 * 县级地区列表
 */
$wk.page.createPage('low-area-list', new $wk.page.newPage({
	init: function () {
		this.templateData = {
			search: {
				name: '',
				startAt: 0,
				endAt: 0,
				pageSize: 10,
				pageNumber: parseInt(this.params[1] || 0)
			}
		};
		this.template = '' +
			'<div class="page-view">' +
			'	<div class="page-right">' +
			'		<div class="page-nav ui-nav">' +
			'			<div class="left">' +
			'               <a class="ui-btn ui-btn-success" href="#/low-area-save/{{search.regionId}}">添加县级</a>' +
			'			</div>' +
			'			<div class="left">' +
			'               <div class="item">'+
			'					<label>县级名称 ：</label>' +		
			'					<input id="low-area-list-name" style="width:90px;" type="text" class="ui-input" onchange="{{$page}}.templateData.search.name=this.value;" value="{{search.name}}" />' +
			'               </div>'+
			'               <div class="item">'+
			'					<label>创建时间：</label>' +
			'					<input type="text" class="ui-input page-input-date ui-form-datetime" onchange="{{$page}}.templateData.search.startAt=this.value;" value="{{search.startAt}}" />' +
			'					<span>至</span>' +
			'					<input type="text" class="ui-input page-input-date ui-form-datetime" onchange="{{$page}}.templateData.search.endAt=this.value;" value="{{search.endAt}}" />' +
			'               </div>'+
			'			</div>' +			
			'			<div class="right">' +
			'				<a class="ui-btn" onclick="{{$page}}.doSearch();">查询</a>' +
			'			</div>' +
			'		</div>' +
			'		{{if countyList}}' +
			'		<div class="page-table ui-table ui-table-hover">' +
			'			<div class="ui-th">' +
			'				<div class="ui-td" style="width:90px;">' +
			'					<div class="ui-con">县级名称</div>' +
			'				</div>' +			
			'				<div class="ui-td" style="width:150px;">' +
			'					<div class="ui-con">创建时间</div>' +
			'				</div>' +
			'				<div class="ui-td" style="width:150px;">' +
			'					<div class="ui-con">更新时间</div>' +
			'				</div>' +
			'				<div class="ui-td" style="width:200px;">' +
			'					<div class="ui-con">操作</div>' +
			'				</div>' +
			'			</div>' +
			'			{{each countyList}}' +
			'			<div class="ui-tr ui-tr-status{{$value.status}}">' +			
			'				<div class="ui-td" style="width:90px;">' +
			'					<div class="ui-con">{{$value.name}}</div>' +
			'				</div>' +			
			'				<div class="ui-td" style="width:150px;">' +
			'					<div class="ui-con" title="{{$value.createAt | datetime}}">'+
			'                   	{{if $value.createAt}}'+
			'						<p style="margin:0;">{{$value.createAt | datetime}}</p>'+
			'                   	{{/if}}'+
			'					</div>' +
			'				</div>' +
			'				<div class="ui-td" style="width:150px;">' +
			'					<div class="ui-con" title="{{$value.updateAt | datetime}}">'+
			'                   	{{if $value.updateAt}}'+
			'						<p style="margin:0;">{{$value.updateAt | datetime}}</p>'+
			'                   	{{/if}}'+
			'					</div>' +
			'				</div>' +
			'				<div class="ui-td" style="width:200px;">' +
			'					<div class="ui-con ui-btns">' +
			'						<a onclick="{{$page}}.doEdit({{search.regionId}},{{$value.id}})">编辑</a> -' +
			'						<a onclick="{{$page}}.doDelete({{$value.id}})">删除</a> -' +
			'						<a onclick="{{$page}}.gotoLowAreaList()">查看市级列表</a>' +
			'					</div>' +
			'				</div>' +
			'			</div>' +
			'			{{/each}}' +
			'			{{if countyList.length==0}}' +
			'			<div class="ui-tr ui-tr-nohover">' +
			'				<div class="page-empty">没有任何数据</div>' +
			'			</div>' +
			'			{{/if}}' +
			'		</div>' +
			'		<div class="page-btns">' +
			'			<div class="left">' +
			'			</div>' +
			'			<div class="right">{{#pageHtml}}</div>' +
			'		</div>' +
			'		{{else}}' +
			'		<div class="page-loading">正在加载中...</div>' +
			'		{{/if}}' +
			'	</div>' +
			'</div>' +
			'';
	},
	load: function () {
		this.templateData.search.regionId = parseInt(this.params[0] || 0);
	},
	loaded: function () {
		this.doSearch();
	}
}, {
	/**
	 * 执行查询
	 */
	doSearch: function () {
		var that = this;
		that.templateData.countyList = null;
		that.templateData.search.name = $("#low-area-list-name").val() || '';
		that.templateData.search.startAt = $wk.date.unixtime(that.templateData.search.startAt);
		that.templateData.search.endAt = $wk.date.unixtime(that.templateData.search.endAt + ' 23:59:59');
		$wk.api.showLoading();
		$wk.api.area.subRegionGet(that.templateData.search, function (result) {
			that.templateData.countyList = result.data.dataList;
			that.templateData.pageHtml = $wk.pagination.eachHtml('low-area-list',
				that.templateData.search.pageNumber + 1,
				that.templateData.search.pageSize,
				result.data.dataCount,
				5,
				function (pageIndex) {
					that.templateData.search.pageNumber = pageIndex - 1;
					that.doSearch();
				}
			);
			that.templateData.search.startAt = $wk.date.date(that.templateData.search.startAt);
			that.templateData.search.endAt = $wk.date.date(that.templateData.search.endAt);
			that.drawView(that.parseTemplate(that.template, that.templateData));
			$wk.api.hideLoading();
		});
	},
	/**
	 * 执行编辑
	 * @param id
	 */
	doEdit: function (regionId,countyId) {
		$wk.page.load('low-area-save', [regionId,countyId]);
	},
	/**
	 * 执行删除
	 * @param id
	 */
	doDelete: function (id) {
		var that = this;
		$wk.msg.showConfirm('此操作为真实删除数据，你确定要执行吗？', function () {
			$wk.api.area.subRegionDelete(id, function () {
				that.pageLoaded();
			});
		});
	},
	/**
	 * 查看县级地区
	 */
	gotoLowAreaList: function () {
		$wk.page.load('high-area-list');
	}
}));

