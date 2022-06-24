define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/complaint/index' + location.search,
                    add_url: '',
                    edit_url: '',
                    del_url: '',
                    multi_url: 'flshop/complaint/multi',
                    table: 'flshop_complaint',
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
                        {field: 'id', title: __('Id')},
                        {field: 'type', title: __('Type'), searchList: {"0":__('Type 0'),"1":__('Type 1'),"2":__('Type 2'),"3":__('Type 3')}, formatter: Table.api.formatter.normal},
                        {field: 'user.nickname', title: __('User.nickname')},
                        // {field: 'complaint_user_id', title: __('Complaint_user_id')},
                        // {field: 'complaint_shop_id', title: __('Complaint_shop_id')},
                        // {field: 'complaint_goods_id', title: __('Complaint_goods_id')},
                        {field: 'images', title: __('Images'), events: Table.api.events.image, formatter: Table.api.formatter.images},
                        {field: 'reason', title: __('Reason'), searchList: {"0":__('Reason 0'),"1":__('Reason 1'),"2":__('Reason 2'),"3":__('Reason 3'),"4":__('Reason 4'),"5":__('Reason 5'),"6":__('Reason 6'),"7":__('Reason 7'),"8":__('Reason 8'),"9":__('Reason 9'),"10":__('Reason 10'),"11":__('Reason 11'),"12":__('Reason 12'),"13":__('Reason 13')}, formatter: Table.api.formatter.normal},
                        {field: 'created', title: __('created'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'state', title: __('State'), searchList: {"normal":__('State normal'),"hidden":__('State hidden')}, formatter: Table.api.formatter.normal},
                        // {field: 'flshopgoods.title', title: __('flshopgoods.title')},
                        // {field: 'flshopshop.shopname', title: __('flshopshop.shopname')},
						{
							field: 'operate',
							title: __('Operate'),
							table: table,
							events: Table.api.events.operate,
							buttons: [{
								name: 'detail',
								title: __('处理举报'),
								classname: 'btn btn-xs btn-success btn-dialog',
								icon: 'fa fa-pencil-square-o',
								text: '处理',
								url: 'flshop/complaint/detail',
								visible: function(row) {
									if (row.state == 'normal') {
										return true;
									}
								}
							},
							{
								name: 'detail',
								title: __('举报详情'),
								classname: 'btn btn-xs btn-info btn-dialog',
								icon: 'fa fa-eye',
								text: '查看',
								url: 'flshop/complaint/detail',
								visible: function(row) {
									if (row.state == 'hidden') {
										return true;
									}
								}
							}],
							formatter: Table.api.formatter.operate
						}
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
                url: 'flshop/complaint/recyclebin' + location.search,
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
                                    url: 'flshop/complaint/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'flshop/complaint/destroy',
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