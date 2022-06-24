define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'booth.viewer/index' + location.search,
                    add_url: 'booth.viewer/add',
                    edit_url: 'booth.viewer/edit',
                    del_url: 'booth.viewer/del',
                    multi_url: 'booth.viewer/multi',
                    import_url: 'booth.viewer/import',
                    table: 'booth_viewer',
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
                        {field: 'viewer_name', title: __('Viewer_name'), operate: 'LIKE'},
                        {field: 'job', title: __('Job'), operate: 'LIKE'},
                        {field: 'company', title: __('Company'), operate: 'LIKE'},
                        {field: 'country', title: __('Country'), operate: 'LIKE'},
                        {field: 'email', title: __('Email'), operate: 'LIKE'},
                        {field: 'tel', title: __('Tel'), operate: 'LIKE'},
                        {field: 'need', title: __('Need')},
                        {field: 'registrant_id', title: __('Registrant_id')},
                        {field: 'enimport', title: __('Enimport')},
                        {field: 'checkstate', title: __('Checkstate')},
                        {field: 'edit_time', title: __('Edit_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'is_download', title: __('Is_download')},
                        {field: 'is_export', title: __('Is_export')},
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
