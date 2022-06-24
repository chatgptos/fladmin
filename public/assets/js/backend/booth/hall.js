define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'booth.hall/index' + location.search,
                    add_url: 'booth.hall/add',
                    edit_url: 'booth.hall/edit',
                    del_url: 'booth.hall/del',
                    multi_url: 'booth.hall/multi',
                    import_url: 'booth.hall/import',
                    table: 'booth_hall',
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
                        {field: 'exhibitionId', title: __('Exhibitionid')},
                        {field: 'hall_name', title: __('Hall_name'), operate: 'LIKE'},
                        {field: 'booths_num', title: __('Booths_num')},
                        {field: 'hall_map', title: __('Hall_map'), operate: 'LIKE'},
                        {field: 'hall_addr', title: __('Hall_addr'), operate: 'LIKE'},
                        {field: 'map_height', title: __('Map_height')},
                        {field: 'map_width', title: __('Map_width')},
                        {field: 'hall_namein', title: __('Hall_namein'), operate: 'LIKE'},
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
