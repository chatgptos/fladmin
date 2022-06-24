define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'booth/index' + location.search,
                    add_url: 'booth/add',
                    edit_url: 'booth/edit',
                    del_url: 'booth/del',
                    multi_url: 'booth/multi',
                    import_url: 'booth/import',
                    table: 'booth',
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
                        {field: 'id', title: __('Id')},
                        {field: 'user_id', title: __('User_id')},
                        {field: 'booth_name', title: __('Booth_name'), operate: 'LIKE'},
                        {field: 'keywords', title: __('Keywords'), operate: 'LIKE'},
                        {field: 'description', title: __('Description'), operate: 'LIKE'},
                        {field: 'service_ids', title: __('Service_ids'), operate: 'LIKE'},
                        {field: 'avatar', title: __('Avatar'), operate: 'LIKE', events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'state', title: __('State'), searchList: {"0":__('State 0'),"1":__('State 1'),"2":__('State 2')}, formatter: Table.api.formatter.normal},
                        {field: 'level', title: __('Level')},
                        {field: 'islive', title: __('Islive')},
                        {field: 'isself', title: __('Isself')},
                        {field: 'city', title: __('City'), operate: 'LIKE'},
                        {field: 'return', title: __('Return'), operate: 'LIKE'},
                        {field: 'like', title: __('Like')},
                        {field: 'score_describe', title: __('Score_describe'), operate:'BETWEEN'},
                        {field: 'score_service', title: __('Score_service'), operate:'BETWEEN'},
                        {field: 'score_deliver', title: __('Score_deliver'), operate:'BETWEEN'},
                        {field: 'score_logistics', title: __('Score_logistics'), operate:'BETWEEN'},
                        {field: 'weigh', title: __('Weigh'), operate: false},
                        {field: 'verify', title: __('Verify'), searchList: {"0":__('Verify 0'),"1":__('Verify 1'),"2":__('Verify 2'),"3":__('Verify 3'),"4":__('Verify 4')}, formatter: Table.api.formatter.normal},
                        {field: 'created', title: __('Created')},
                        {field: 'modified', title: __('Modified')},
                        {field: 'deleted', title: __('Deleted')},
                        {field: 'status', title: __('Status'), searchList: {"normal":__('Normal'),"hidden":__('Hidden')}, formatter: Table.api.formatter.status},
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
