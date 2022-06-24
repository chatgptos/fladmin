define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'booth.shop_config/index' + location.search,
                    add_url: 'booth.shop_config/add',
                    edit_url: 'booth.shop_config/edit',
                    del_url: 'booth.shop_config/del',
                    multi_url: 'booth.shop_config/multi',
                    import_url: 'booth.shop_config/import',
                    table: 'booth_shop_config',
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
                        {field: 'shop_id', title: __('Shop_id')},
                        {field: 'freight', title: __('Freight'), searchList: {"0":__('Freight 0'),"1":__('Freight 1'),"2":__('Freight 2')}, formatter: Table.api.formatter.normal},
                        {field: 'iscloud', title: __('Iscloud'), searchList: {"0":__('Iscloud 0'),"1":__('Iscloud 1')}, formatter: Table.api.formatter.normal},
                        {field: 'isauto', title: __('Isauto'), searchList: {"0":__('Isauto 0'),"1":__('Isauto 1')}, formatter: Table.api.formatter.normal},
                        {field: 'secret', title: __('Secret'), operate: 'LIKE'},
                        {field: 'key', title: __('Key'), operate: 'LIKE'},
                        {field: 'partner_id', title: __('Partner_id'), operate: 'LIKE'},
                        {field: 'partner_key', title: __('Partner_key'), operate: 'LIKE'},
                        {field: 'siid', title: __('Siid'), operate: 'LIKE'},
                        {field: 'tempid', title: __('Tempid'), operate: 'LIKE'},
                        {field: 'send_name', title: __('Send_name'), operate: 'LIKE'},
                        {field: 'send_phone_num', title: __('Send_phone_num'), operate: 'LIKE'},
                        {field: 'return_name', title: __('Return_name'), operate: 'LIKE'},
                        {field: 'return_phone_num', title: __('Return_phone_num'), operate: 'LIKE'},
                        {field: 'created', title: __('Created')},
                        {field: 'modified', title: __('Modified')},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
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
