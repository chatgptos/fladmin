define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/freight/index' + location.search,
                    add_url: 'flshop/freight/add',
                    edit_url: 'flshop/freight/edit',
                    del_url: 'flshop/freight/del',
                    multi_url: 'flshop/freight/multi',
                    table: 'flshop_shop_freight',
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
						{field: 'name', title: __('Name')},
						{field: 'shop_id', title: __('Shop_id'), visible: false},
                        {field: 'shop.shopname', title: __('shop.shopname'), formatter: Table.api.formatter.search},
                        {field: 'delivery', title: __('Delivery'), searchList: {"0":__('Delivery 0'),"1":__('Delivery 1'),"2":__('Delivery 2'),"3":__('Delivery 3'),"4":__('Delivery 4'),"5":__('Delivery 5'),"6":__('Delivery 6'),"7":__('Delivery 7'),"8":__('Delivery 8'),"9":__('Delivery 9'),"10":__('Delivery 10'),"11":__('Delivery 11'),"12":__('Delivery 12'),"13":__('Delivery 13'),"14":__('Delivery 14'),"15":__('Delivery 15'),"16":__('Delivery 16'),"17":__('Delivery 17'),"18":__('Delivery 18')}, formatter: Table.api.formatter.normal},
                        {field: 'isdelivery', title: __('Isdelivery'), searchList: {"0":__('Isdelivery 0'),"1":__('Isdelivery 1')}, formatter: Table.api.formatter.normal},
                        {field: 'valuation', title: __('Valuation'), searchList: {"0":__('Valuation 0'),"1":__('Valuation 1'),"2":__('Valuation 2')}, formatter: Table.api.formatter.normal},
                        {field: 'created', title: __('created'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'status', title: __('Status'), searchList: {"normal":__('Normal'),"hidden":__('Hidden')}, formatter: Table.api.formatter.status}
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
                url: 'flshop/freight/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'name', title: __('Name'), align: 'left'},
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
                                    url: 'flshop/freight/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'flshop/freight/destroy',
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