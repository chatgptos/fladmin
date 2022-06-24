define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'template'], function ($, undefined, Backend, Table, Form, Template) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/order/index' + location.search,
                    add_url: '',
                    edit_url: '',
                    del_url: 'flshop/order/del',
                    multi_url: 'flshop/order/multi',
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
			    Backend.api.open('flshop/order/detail/id/' + $(this).data('id'), __('查看详情'),{area:['1200px', '780px']});
			});
			//点击详情
			$(document).on("click", ".comment[data-id]", function () {
			    Backend.api.open('flshop/comment/detail/order_id/' + $(this).data('id'), __('查看详情'));
			});
			$(document).on("click", ".kuaidisub[data-id]", function () {
			    Backend.api.open('flshop/order/relative/id/' + $(this).data('id'), __('快递查询'),{area:['800px', '600px']});
			});
        },
        recyclebin: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    'dragsort_url': ''
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: 'flshop/order/recyclebin' + location.search,
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
                                    url: 'flshop/order/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'flshop/order/destroy',
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
        add: function () {
            Controller.api.bindevent();
        },
		relative: function () {
        },
		detail: function () {
			// 查询物流状态
			$(document).on("click", ".kuaidisub[data-id]", function () {
			    Backend.api.open('flshop/order/relative/id/' + $(this).data('id'), __('快递查询'),{area:['800px', '600px']});
			});
		},
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});