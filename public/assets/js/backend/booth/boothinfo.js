define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'booth.boothinfo/index' + location.search,
                    add_url: 'booth.boothinfo/add',
                    edit_url: 'booth.boothinfo/edit',
                    del_url: 'booth.boothinfo/del',
                    multi_url: 'booth.boothinfo/multi',
                    import_url: 'booth.boothinfo/import',
                    table: 'booth_boothinfo',
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
                        {field: 'exhibition_id', title: __('Exhibition_id')},
                        {field: 'hall_id', title: __('Hall_id')},
                        {field: 'coordinate_x', title: __('Coordinate_x')},
                        {field: 'coordinate_y', title: __('Coordinate_y')},
                        {field: 'booth_widht', title: __('Booth_widht')},
                        {field: 'booth_height', title: __('Booth_height')},
                        {field: 'booth_area', title: __('Booth_area'), operate: 'LIKE'},
                        {field: 'booth_standard', title: __('Booth_standard'), operate: 'LIKE'},
                        {field: 'booth_num', title: __('Booth_num'), operate: 'LIKE'},
                        {field: 'booth_name', title: __('Booth_name'), operate: 'LIKE'},
                        {field: 'sales_status', title: __('Sales_status')},
                        {field: 'booth_tips', title: __('Booth_tips'), operate: 'LIKE'},
                        {field: 'company_name', title: __('Company_name'), operate: 'LIKE'},
                        {field: 'category', title: __('Category'), operate: 'LIKE'},
                        {field: 'country', title: __('Country'), operate: 'LIKE'},
                        {field: 'state', title: __('State'), operate: 'LIKE'},
                        {field: 'addr', title: __('Addr'), operate: 'LIKE'},
                        {field: 'moble_phone', title: __('Moble_phone'), operate: 'LIKE'},
                        {field: 'phone', title: __('Phone'), operate: 'LIKE'},
                        {field: 'email', title: __('Email'), operate: 'LIKE'},
                        {field: 'webaddr', title: __('Webaddr'), operate: 'LIKE'},
                        {field: 'contacts', title: __('Contacts'), operate: 'LIKE'},
                        {field: 'fax', title: __('Fax'), operate: 'LIKE'},
                        {field: 'position', title: __('Position'), operate: 'LIKE'},
                        {field: 'booth_type', title: __('Booth_type'), operate: 'LIKE'},
                        {field: 'open_angle', title: __('Open_angle')},
                        {field: 'booth_discount', title: __('Booth_discount')},
                        {field: 'sales_distribution', title: __('Sales_distribution'), operate: 'LIKE'},
                        {field: 'booth_price', title: __('Booth_price'), operate: 'LIKE'},
                        {field: 'angle_add', title: __('Angle_add'), operate: 'LIKE'},
                        {field: 'booth_amount', title: __('Booth_amount'), operate: 'LIKE'},
                        {field: 'build_state', title: __('Build_state'), operate: 'LIKE'},
                        {field: 'china_abbreviate', title: __('China_abbreviate'), operate: 'LIKE'},
                        {field: 'english_abbreviate', title: __('English_abbreviate'), operate: 'LIKE'},
                        {field: 'xiongk_num_free', title: __('Xiongk_num_free')},
                        {field: 'xiongk_num_change', title: __('Xiongk_num_change')},
                        {field: 'is_assigned', title: __('Is_assigned')},
                        {field: 'imp_buyernum', title: __('Imp_buyernum')},
                        {field: 'upload_batch', title: __('Upload_batch')},
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
