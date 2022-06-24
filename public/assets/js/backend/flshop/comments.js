define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'vue'], function($, undefined, Backend, Table, Form, Vue) {

	var Controller = {
		index: function() {
			// 初始化表格参数配置
			Table.api.init({
				extend: {
					index_url: 'flshop/comments/index' + location.search,
					add_url: '',
					edit_url: 'flshop/comments/edit',
					del_url: 'flshop/comments/del',
					multi_url: 'flshop/comments/multi',
					import_url: '',
					table: 'flshop_find_comments',
				}
			});

			var table = $("#table");

			// 初始化表格
			table.bootstrapTable({
				url: $.fn.bootstrapTable.defaults.extend.index_url,
				pk: 'id',
				sortName: 'id',
				columns: [
					[{
							checkbox: true
						},
						{
							field: 'id',
							title: __('Id')
						},
						{
							field: 'find_id',
							title: __('Find_id')
						},
						{
							field: 'user_id',
							title: __('User_id')
						},
						{
							field: 'user.nickname',
							title: __('User.nickname'),
							operate: 'LIKE'
						},
						{
							field: 'content',
							title: __('Content'),
							width: '260',
							formatter: Controller.api.formatter.content
						},
						{
							field: 'like',
							title: __('Like')
						},
						{
							field: 'created',
							title: __('created'),
							operate: 'RANGE',
							addclass: 'datetimerange',
							autocomplete: false,
							formatter: Table.api.formatter.datetime
						},
						{
							field: 'status',
							title: __('Status'),
							searchList: {
								"normal": __('Normal'),
								"hidden": __('Hidden')
							},
							formatter: Table.api.formatter.status
						},
						{
							field: 'operate',
							title: __('Operate'),
							table: table,
							events: Table.api.events.operate,
							buttons: [{
								name: 'detail',
								text: __('作品'),
								title: __('预览作品'),
								classname: 'btn btn-xs btn-info btn-dialog',
								icon: 'fa fa-paper-plane',
								url: function(row) {
									return `flshop/find/detail?ids=${row.find_id}`;
								},
								callback: function(data) {
									$(".btn-refresh").trigger("click"); //刷新数据
								}
							}],
							formatter: Table.api.formatter.operate,
						}
					]
				]
			});

			// 为表格绑定事件
			Table.api.bindevent(table);
		},
		recyclebin: function() {
			// 初始化表格参数配置
			Table.api.init({
				extend: {
					'dragsort_url': ''
				}
			});
			var table = $("#table");
			// 初始化表格
			table.bootstrapTable({
				url: 'flshop/comments/recyclebin' + location.search,
				pk: 'id',
				sortName: 'id',
				columns: [
					[{
							checkbox: true
						},
						{
							field: 'id',
							title: __('Id')
						},
						{
							field: 'deletetime',
							title: __('Deletetime'),
							operate: 'RANGE',
							addclass: 'datetimerange',
							formatter: Table.api.formatter.datetime
						},
						{
							field: 'operate',
							width: '130px',
							title: __('Operate'),
							table: table,
							events: Table.api.events.operate,
							buttons: [{
									name: 'Restore',
									text: __('Restore'),
									classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
									icon: 'fa fa-rotate-left',
									url: 'flshop/comments/restore',
									refresh: true
								},
								{
									name: 'Destroy',
									text: __('Destroy'),
									classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
									icon: 'fa fa-times',
									url: 'flshop/comments/destroy',
									refresh: true
								}
							],
							formatter: Table.api.formatter.operate
						}
					]
				]
			});
			// 为表格绑定事件
			Table.api.bindevent(table);
		},
		detail: function() {
			var vm = new Vue({
				el: '#app',
				data() {
					return {
						dataList: Config.list
					}
				},
				methods: {
					handleDel(type, index, keys) {
					    
						let ids = [];
						if (type === 'main') {
							let data = this.dataList[index];
							ids = [data.id];
							for (j = 0, len = data.childlist.length; j < len; j++) {
								ids.push(data.childlist[j].id);
							}
							Vue.delete(this.dataList, index);
						} else if (type === 'child') {
							ids = [this.dataList[index].childlist[keys].id];
							Vue.delete(this.dataList[index].childlist, keys);
						}
						// 加载网络
						Fast.api.ajax({
							url: 'flshop/comments/del',
							data: {
								'ids': ids.toString()
							}
						}, (data, ret) => {
						    return false;
						});
						
					}
				}
			});
		},
		edit: function() {
			Controller.api.bindevent();
		},
		api: {
			bindevent: function() {
				Form.api.bindevent($("form[role=form]"));
			},
			formatter: { //渲染的方法
				content: function(value, row, index) {
					return '<div class="input-group input-group-sm" style="width:250px;"><input type="text" class="form-control input-sm" value="' +
						value + '"></div>';
				}
			}
		}
	};
	return Controller;
});