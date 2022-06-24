define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/comment/index' + location.search,
                    add_url: 'flshop/comment/add',
                    edit_url: 'flshop/comment/edit',
                    del_url: 'flshop/comment/del',
                    multi_url: 'flshop/comment/multi',
                    table: 'flshop_goods_comment',
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
                        {field: 'user.nickname', title: __('User.nickname'), formatter: Table.api.formatter.search},
                        {field: 'shop.shopname', title: __('shop.shopname'), formatter: Table.api.formatter.search},
                        {field: 'goods.title', title: __('goods.title'), formatter: Table.api.formatter.search},
                        {field: 'order_type', title: __('Order_type'), searchList: {"goods":__('Order_type goods'),"groups":__('Order_type groups'),"seckill":__('Order_type seckill')}, formatter: Table.api.formatter.normal},
                        {field: 'state', title: __('State'), searchList: {"0":__('State 0'),"1":__('State 1'),"2":__('State 2')}, formatter: Table.api.formatter.normal},
                        {field: 'images', title: __('Images'), events: Table.api.events.image, formatter: Table.api.formatter.images},
                        {field: 'score', title: __('Score'), operate:'BETWEEN'},
                        {field: 'score_describe', title: __('Score_describe'), operate:'BETWEEN'},
                        {field: 'score_service', title: __('Score_service'), operate:'BETWEEN'},
                        {field: 'score_deliver', title: __('Score_deliver'), operate:'BETWEEN'},
                        {field: 'score_logistics', title: __('Score_logistics'), operate:'BETWEEN'},
                        {field: 'switch', title: __('Switch'), searchList: {"1":__('Yes'),"0":__('No')}, formatter: Table.api.formatter.toggle},
                        {field: 'created', title: __('created'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'status', title: __('Status'), searchList: {"normal":__('Normal'),"hidden":__('Hidden')}, formatter: Table.api.formatter.status},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate,buttons: [{name: 'detail',title: __('查看评论'),classname: 'btn btn-xs btn-info btn-dialog',icon: 'fa fa-eye',url: 'flshop/comment/detail'}],formatter: Table.api.formatter.operate}
                    ]
                ]
            });
			
            // 为表格绑定事件
            Table.api.bindevent(table);
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
                url: 'flshop/comment/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                fixedColumns: true,
                fixedRightNumber: 1,
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
                                    url: 'flshop/comment/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'flshop/comment/destroy',
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
		detail: function () {
            //点击详情
            $(document).on("click", ".detail[data-id]", function () {
				parent.window.Fast.api.open('flshop/order/detail/id/' + $(this).data('id'), __('查看详情'),{area:['1200px', '780px']});
            });
			
			$(document).on("click", ".groups[data-id]", function () {
				parent.window.Fast.api.open('flshop/groups/orderDetail/id/' + $(this).data('id'), __('查看详情'),{area:['1200px', '780px']});
			});
        },
        add: function () {
            Controller.api.bindevent();
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