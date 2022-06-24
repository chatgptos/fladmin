define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function($, undefined, Backend, Table, Form) {

	var Controller = {
		index: function() {
			// 初始化表格参数配置
			Table.api.init({
				extend: {
					index_url: 'flshop/refund/index' + location.search,
					add_url: '',
					edit_url: '',
					del_url: '',
					multi_url: '',
					table: 'flshop_refund',
				}
			});

			var table = $("#table");

			// 初始化表格
			table.bootstrapTable({
				url: $.fn.bootstrapTable.defaults.extend.index_url,
				pk: 'id',
				sortName: 'id',
				columns: [
					[
						{checkbox: true},
						{field: 'id',title: __('Id')},
						{field: 'goods_ids',title: __('Goods_ids'),align: 'left',formatter: Controller.api.formatter.goods},
						{field: 'order_type', title: __('Order_type'), searchList: {"goods":__('Order_type goods'),"groups":__('Order_type groups'),"seckill":__('Order_type seckill')}, formatter: Table.api.formatter.normal},
						{field: 'expressType',title: __('Expresstype'),searchList: {"0": __('Expresstype 0'),"1": __('Expresstype 1')},formatter: Table.api.formatter.normal},
						{field: 'price',title: __('Price'),operate: 'BETWEEN'},
						{field: 'type',title: __('Type'),searchList: {"0": __('Type 0'),"1": __('Type 1')},formatter: Table.api.formatter.normal},
						{field: 'reason',title: __('Reason'),searchList: {"0": __('Reason 0'),"1": __('Reason 1'),"2": __('Reason 2'),"3": __('Reason 3'),"4": __('Reason 4'),"5": __('Reason 5'),"6": __('Reason 6')},formatter: Table.api.formatter.normal},
						{field: 'images',title: __('Images'),events: Table.api.events.image,formatter: Table.api.formatter.images},
						{field: 'created',title: __('created'),operate: 'RANGE',addclass: 'datetimerange',formatter: Table.api.formatter.datetime},
						{field: 'state',title: __('State'),searchList: {"0": __('State 0'),"1": __('State 1'),"2": __('State 2'),"3": __('State 3'),"4": __('State 4'),"5": __('State 5'),"6": __('State 6')},align: 'left',formatter: Table.api.formatter.status},
						{
							field: 'operate',
							title: __('Operate'),
							table: table,
							events: Table.api.events.operate,
							buttons: [
								{
									name: 'detail',
									title: __('查看退款'),
									text: '查看退款',
									classname: 'btn btn-xs btn-info btn-dialog',
									icon: 'fa fa-eye',
									url: 'flshop/refund/detail'
								}, 
								{
									name: 'agreeGoods',
									title: __('同意退货'),
									text: '同意退货',
									classname: 'btn btn-xs btn-success btn-magic btn-ajax',
									icon: 'fa fa-check',
									confirm: '确认同意买家退款退货？',
									url: 'flshop/refund/agree',
									visible: function(row) {
										if (row.state == 0) {
											if (row.type == 1) {
												return true;
											}
										}
									},
									success: function(data, ret) {
										table.bootstrapTable('refresh');
										return false;
									},
									error: function(data, ret) {
										Toastr.error(ret.msg);
										return false;
									}
								}, 
								{
									name: 'agree',
									title: __('同意退款'),
									text: '同意退款',
									classname: 'btn btn-xs btn-success btn-magic btn-ajax',
									icon: 'fa fa-check',
									confirm: '确认同意买家退款，款项会直接转到用户余额？',
									url: 'flshop/refund/agree',
									visible: function(row) {
										if (row.state == 0) {
											if (row.type == 0) {
												return true;
											}
										}
									},
									success: function(data, ret) {
										table.bootstrapTable('refresh');
										return false;
									},
									error: function(data, ret) {
										console.log(data, ret);
										Layer.alert(ret.msg);
										return false;
									}
								}, 
								{
									name: 'receiving',
									title: __('确定收到买家退货'),
									text: '确认收货',
									classname: 'btn btn-xs btn-success btn-magic btn-ajax',
									icon: 'fa fa-check',
									confirm: '确定收到买家退货？确认后此退货订单自动完成退款！',
									url: 'flshop/refund/receiving',
									visible: function(row) {
										if (row.state == 6) {
											return true;
										}
									},
									success: function(data, ret) {
										table.bootstrapTable('refresh');
										return false;
									},
									error: function(data, ret) {
										console.log(data, ret);
										Layer.alert(ret.msg);
										return false;
									}
								}, 
								{
									name: 'refuse',
									title: __('拒绝退款'),
									text: '拒绝退款',
									classname: 'btn btn-xs btn-danger btn-dialog',
									icon: 'fa fa-times',
									url: 'flshop/refund/refuse',
									visible: function(row) {
										if (row.state == 0) {
											return true;
										}
									},
									extend: 'data-area=["500px","270px"]'
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

		},
		refuse: function() {
			Controller.api.bindevent();
		},
		api: {
			bindevent: function() {
				Form.api.bindevent($("form[role=form]"));
			},
			formatter: {
				goods: function(value, row, index) {
					if(row.order_type === 'groups'){
						var image = Fast.api.cdnurl(row.groupsgoods.image);
						return '<a href="javascript:" style="margin-right: 6px;"><img class="img-sm img-center" src="' + image +'"></a>' + row.groupsgoods.title;
					}else{
						var image = Fast.api.cdnurl(row.goods.image);
						return '<a href="javascript:" style="margin-right: 6px;"><img class="img-sm img-center" src="' + image +'"></a>' + row.goods.title;
					}
				}
			}
		}
	};
	return Controller;
});
