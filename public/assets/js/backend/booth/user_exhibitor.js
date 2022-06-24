define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'booth.user_exhibitor/index' + location.search,
                    add_url: 'booth.user_exhibitor/add',
                    edit_url: 'booth.user_exhibitor/edit',
                    del_url: 'booth.user_exhibitor/del',
                    multi_url: 'booth.user_exhibitor/multi',
                    import_url: 'booth.user_exhibitor/import',
                    table: 'booth_user_exhibitor',
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
                        {field: 'company_name', title: __('Company_name'), operate: 'LIKE'},
                        {field: 'company_name_en', title: __('Company_name_en'), operate: 'LIKE'},
                        {field: 'contact_address', title: __('Contact_address'), operate: 'LIKE'},
                        {field: 'contact_address_en', title: __('Contact_address_en'), operate: 'LIKE'},
                        {field: 'linkman', title: __('Linkman'), operate: 'LIKE'},
                        {field: 'linkman_en', title: __('Linkman_en'), operate: 'LIKE'},
                        {field: 'contact_number', title: __('Contact_number'), operate: 'LIKE'},
                        {field: 'fax', title: __('Fax'), operate: 'LIKE'},
                        {field: 'email', title: __('Email'), operate: 'LIKE'},
                        {field: 'siturl', title: __('Siturl'), operate: 'LIKE', formatter: Table.api.formatter.url},
                        {field: 'cellphone', title: __('Cellphone'), operate: 'LIKE'},
                        {field: 'postcode', title: __('Postcode'), operate: 'LIKE'},
                        {field: 'number', title: __('Number'), operate: 'LIKE'},
                        {field: 'editor_id', title: __('Editor_id')},
                        {field: 'phone_pre1', title: __('Phone_pre1'), operate: 'LIKE'},
                        {field: 'phone_pre2', title: __('Phone_pre2'), operate: 'LIKE'},
                        {field: 'fax_pre1', title: __('Fax_pre1'), operate: 'LIKE'},
                        {field: 'fax_pre2', title: __('Fax_pre2'), operate: 'LIKE'},
                        {field: 'boothNum', title: __('Boothnum'), operate: 'LIKE'},
                        {field: 'productServices', title: __('Productservices'), operate: 'LIKE'},
                        {field: 'product_services_en', title: __('Product_services_en'), operate: 'LIKE'},
                        {field: 'others', title: __('Others'), operate: 'LIKE'},
                        {field: 'others_en', title: __('Others_en'), operate: 'LIKE'},
                        {field: 'edit_user', title: __('Edit_user'), operate: 'LIKE'},
                        {field: 'edit_time', title: __('Edit_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'company_name_en2zh', title: __('Company_name_en2zh'), operate: 'LIKE'},
                        {field: 'exhibitor_id', title: __('Exhibitor_id'), operate: 'LIKE'},
                        {field: 'approved_flag', title: __('Approved_flag'), formatter: Table.api.formatter.flag},
                        {field: 'approved_time', title: __('Approved_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'approved_ip', title: __('Approved_ip'), operate: 'LIKE'},
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
