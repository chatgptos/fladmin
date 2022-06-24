define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/groups/index' + location.search,
                    add_url: '',
                    edit_url: '',
                    del_url: '',
                    multi_url: 'flshop/groups/multi',
                    import_url: 'flshop/groups/import',
                    table: 'flshop_groups',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                fixedColumns: true,
                fixedRightNumber: 1,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'id', title: __('店铺'), operate: false, align:'left', formatter: Controller.api.formatter.shop},
                        {field: 'group_no', title: __('Group_no'), operate: 'LIKE'},
                        {field: 'group_type', title: __('Group_type'), searchList: {"alone":__('Group_type alone'),"group":__('Group_type group'),"ladder":__('Group_type ladder')}, formatter: Table.api.formatter.normal},
                        {field: 'id', title: __('商品'), operate: false, align:'left', formatter: Controller.api.formatter.goods},
                        {field: 'id', title: __('拼团团长'), operate: false, formatter: Controller.api.formatter.user},
                        {field: 'id', title: __('拼团进度'), operate: false, formatter: Controller.api.formatter.groups},
                        {field: 'state', title: __('State'), searchList: {"ready":__('State ready'),"start":__('State start'),"success":__('State success'),"fail":__('State fail'),"auto":__('State auto')}, formatter: Table.api.formatter.normal},
                        {field: 'validitytime', title: __('Validitytime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'grouptime', title: __('Grouptime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {
							field: 'operate', 
							title: __('Operate'), 
							table: table, 
							events: Table.api.events.operate,
							buttons: [
								{
								    name: 'detail',
								    text: __('查看拼团'),
								    title: __('查看拼团'),
								    classname: 'btn btn-xs btn-info btn-dialog',
								    extend: 'data-area=\'["420px", "700px"]\'',
								    icon: 'fa fa-users',
								    url: 'flshop/groups/detail'
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
        detail: function () {
            Controller.api.bindevent();
        },
        goods: function() {
			// 初始化表格参数配置
			Table.api.init({
				extend: {
					index_url: 'flshop/groups/goods' + location.search,
					add_url: '',
					edit_url: '',
					del_url: 'flshop/groups/goodsDel',
					multi_url: '',
					dragsort_url: "",
					table: 'flshop_groups',
				}
			});
			var table = $("#table");
			// 初始化表格
			table.bootstrapTable({
				url: $.fn.bootstrapTable.defaults.extend.index_url,
				pk: 'id',
				sortName: 'weigh',
				fixedColumns: true,
				fixedRightNumber: 1,
				columns: [
					[
						{checkbox: true},
						{field: 'id',title: __('Id')},
						{field: 'shop_id', title: __('Shop_id'), visible: false},
						// {field: 'title',title: __('Title')},
						{field: 'image',title: __('Image'),events: Table.api.events.image,formatter: Table.api.formatter.image},
						{field: 'images',title: __('Images'),events: Table.api.events.image,formatter: Table.api.formatter.images},
						
						{field: 'is_ladder',title: __('Is_ladder'), formatter: Controller.api.formatter.isladder},
						{field: 'is_alone',title: __('Is_alone'), formatter: Controller.api.formatter.isalone},
						{field: 'purchase_limit',title: __('Purchase_limit'), formatter: Controller.api.formatter.limit},
						
						{field: 'category_id', title: __('Category_id'), operate:'IN'},
						{field: 'category.name', title: __('Category.name'), formatter: Table.api.formatter.search},
						{field: 'shopsort.name', title: __('Shopsort.name'), formatter: Table.api.formatter.search},
						{field: 'price',title: __('Price'),operate: 'BETWEEN'},
						{field: 'views',title: __('Views')},{field: 'sales',title: __('Sales')},
						{field: 'comment',title: __('Comment')},{field: 'praise',title: __('Praise')},
						{field: 'like',title: __('Like')},
						// {field: 'created',title: __('created'),operate: 'RANGE',addclass: 'datetimerange',formatter: Table.api.formatter.datetime},
						{field: 'updatetime',title: __('Updatetime'),operate: 'RANGE',addclass: 'datetimerange',formatter: Table.api.formatter.datetime},
						{field: 'status',title: __('Status'),searchList: {"normal": __('Normal'),"hidden": __('Hidden')},formatter: Table.api.formatter.status},
						{field: 'operate',title: __('Operate'),table: table, events: Table.api.events.operate,formatter: Table.api.formatter.operate}
					]
				]
			});
			// 为表格绑定事件
			Table.api.bindevent(table);
			table.on('load-success.bs.table',function(data){
			   $(".btn-editone").data("area", ["90%","80%"]);
			   $(".btn-add").data("area", ["90%","80%"]);
			});
		},
		goodsrecyclebin: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    'dragsort_url': ''
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: 'flshop/groups/goodsRecyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
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
                            buttons: [
                                {
                                    name: 'Restore',
                                    text: __('Restore'),
                                    classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
                                    icon: 'fa fa-rotate-left',
                                    url: 'flshop/groups/goodsRestore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'flshop/groups/goodsDestroy',
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
        order: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/groups/order' + location.search,
                    add_url: '',
                    edit_url: '',
                    del_url: 'flshop/groups/orderDel',
                    multi_url: '',
                    table: 'flshop_order',
                }
            });
			
            var table = $("#table");
			Template.helper("cdnurl", function(image) {
				return Fast.api.cdnurl(image); 
			}); 
			Template.helper("Moment", Moment);
			
            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
				templateView: true,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'user.nickname', title: __('User.nickname'), align: 'left', formatter: Table.api.formatter.search},
                        {field: 'shop.shopname', title: __('Shop_id'), align: 'left', formatter: Table.api.formatter.search},
                        {field: 'order_no', title: __('Order_no')},
                        {field: 'express_no', title: __('Express_no')},
                        {field: 'state', title: __('State'), searchList: {"1":__('State 1'),"2":__('State 2'),"3":__('State 3'),"4":__('State 4'),"6":__('State 6'),"7":__('State 7')}, formatter: Table.api.formatter.normal},
                        {field: 'created', title: __('created'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'paymenttime', title: __('Paymenttime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'delivertime', title: __('Delivertime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'dealtime', title: __('Dealtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'status', title: __('Status'), searchList: {"normal":__('Normal'),"hidden":__('Hidden')}, formatter: Table.api.formatter.status},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
            //点击详情
			$(document).on("click", ".detail[data-id]", function () {
			    Backend.api.open('flshop/groups/orderDetail/id/' + $(this).data('id'), __('查看详情'),{area:['1200px', '780px']});
			});
			//点击详情
			$(document).on("click", ".comment[data-id]", function () {
			    Backend.api.open('flshop/comment/detail/order_id/' + $(this).data('id'), __('查看详情'));
			});
			$(document).on("click", ".kuaidisub[data-id]", function () {
			    Backend.api.open('flshop/groups/orderRelative/id/' + $(this).data('id'), __('快递查询'),{area:['800px', '600px']});
			});
            
        },
        orderrecyclebin: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    'dragsort_url': ''
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: 'flshop/groups/orderRecyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
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
                            buttons: [
                                {
                                    name: 'Restore',
                                    text: __('Restore'),
                                    classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
                                    icon: 'fa fa-rotate-left',
                                    url: 'flshop/groups/orderRestore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'flshop/groups/orderDestroy',
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
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            },
            formatter: {
                isladder: function (value, row, index) {
				    return row.is_ladder == 0 ? '<span class="text-aqua">普通拼团</span>' : '<span class="text-red">阶梯拼团</span>';
				},
				isalone: function (value, row, index) {
				     return row.is_alone == 0 ? '允许' : '禁止';
				},
				limit: function (value, row, index) {
					return row.purchase_limit == 0 ? '<span>不限</span>' : `<span class="text-red">限制${row.purchase_limit}人</span>`;
				},
                groups: function (value, row, index) {
				    return `${row.people_num} / ${row.join_num}`;
				},
                shop: function (value, row, index) {
				    return `<a href="javascript:" style="margin-right: 6px;"><img class="img-sm img-center" src="${Fast.api.cdnurl(row.shop.avatar)}"></a> ${row.shop.shopname}`;
				},
				goods: function (value, row, index) {
				    return `<a href="javascript:" style="margin-right: 6px;"><img class="img-sm img-center" src="${Fast.api.cdnurl(row.goods.image)}"></a> ${row.goods.title}`;
				},
				user: function (value, row, index) {
				    return `<a href="javascript:" style="margin-right: 6px;"><img class="img-sm img-center" src="${Fast.api.cdnurl(row.user.avatar)}"></a> ${row.user.nickname}`;
				}
			}
        }
    };
    return Controller;
});