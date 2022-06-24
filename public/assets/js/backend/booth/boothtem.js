define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'booth.boothtem/index' + location.search,
                    add_url: 'booth.boothtem/add',
                    edit_url: 'booth.boothtem/edit',
                    del_url: 'booth.boothtem/del',
                    multi_url: 'booth.boothtem/multi',
                    import_url: 'booth.boothtem/import',
                    table: 'booth_boothtem',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'temid',
                sortName: 'temid',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'temid', title: __('Temid')},
                        {field: 'stand', title: __('Stand'), operate: 'LIKE'},
                        {field: 'area', title: __('Area'), operate: 'LIKE'},
                        {field: 'booth_height', title: __('Booth_height')},
                        {field: 'booth_width', title: __('Booth_width')},
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
