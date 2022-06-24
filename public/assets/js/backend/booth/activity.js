define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'booth.activity/index' + location.search,
                    add_url: 'booth.activity/add',
                    edit_url: 'booth.activity/edit',
                    del_url: 'booth.activity/del',
                    multi_url: 'booth.activity/multi',
                    import_url: 'booth.activity/import',
                    table: 'booth_activity',
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
                        {field: 'act_name', title: __('Act_name'), operate: 'LIKE'},
                        {field: 'act_add', title: __('Act_add'), operate: 'LIKE'},
                        {field: 'act_date', title: __('Act_date')},
                        {field: 'act_time', title: __('Act_time'), operate: 'LIKE'},
                        {field: 'act_content', title: __('Act_content'), operate: 'LIKE'},
                        {field: 'linkman', title: __('Linkman'), operate: 'LIKE'},
                        {field: 'tel', title: __('Tel'), operate: 'LIKE'},
                        {field: 'registrant_id', title: __('Registrant_id')},
                        {field: 'pass', title: __('Pass')},
                        {field: 'act_time_minute', title: __('Act_time_minute'), operate: 'LIKE'},
                        {field: 'act_time_end', title: __('Act_time_end'), operate: 'LIKE'},
                        {field: 'act_time_minute_end', title: __('Act_time_minute_end'), operate: 'LIKE'},
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
