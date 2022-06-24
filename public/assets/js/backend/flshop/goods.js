define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {
    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/goods/index' + location.search,
                    add_url: '',
                    edit_url: '',
                    del_url: 'flshop/goods/del',
                    multi_url: 'flshop/goods/multi',
                    table: 'flshop_goods',
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
						{field: 'shop_id', title: __('Shop_id'), visible: false},
						{field: 'shop.shopname', title: __('Shop.shopname')},
			        	// {field: 'title', title: __('Title')},
                        {field: 'image', title: __('Image'), events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'images', title: __('Images'), events: Table.api.events.image, formatter: Table.api.formatter.images},
                        // {field: 'flag', title: __('Flag'), searchList: {"hot":__('Flag hot'),"index":__('Flag index'),"recommend":__('Flag recommend')}, operate:'FIND_IN_SET', formatter: Table.api.formatter.label},
                        {field: 'category_id', title: __('Category_id'), operate:'IN'},
                        {field: 'category.name', title: __('Category.name'), formatter: Table.api.formatter.search},
                        {field: 'shopsort.name', title: __('Shopsort.name'), formatter: Table.api.formatter.search},
						{field: 'stock', title: __('Stock'), searchList: {"porder":__('Stock porder'),"payment":__('Stock payment')}, formatter: Table.api.formatter.normal},
                        {field: 'price', title: __('Price'), operate:'BETWEEN'},
                        // {field: 'freight_id', title: __('Freight_id')},
                        // {field: 'grounding', title: __('Grounding')},
                        {field: 'specs', title: __('Specs'), searchList: {"single":__('Specs single'),"multi":__('Specs multi')}, formatter: Table.api.formatter.normal},
                        // {field: 'distribution', title: __('Distribution'), searchList: {"true":__('Distribution true'),"false":__('Distribution false')}, formatter: Table.api.formatter.normal},
                        // {field: 'activity', title: __('Activity'), searchList: {"true":__('Activity true'),"false":__('Activity false')}, formatter: Table.api.formatter.normal},
                        {field: 'views', title: __('Views')},
                        {field: 'sales', title: __('Sales')},
                        {field: 'comment', title: __('Comment')},
                        {field: 'praise', title: __('Praise')},
                        {field: 'like', title: __('Like')},
                        {field: 'weigh', title: __('Weigh')},
                        {field: 'created', title: __('created'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'status', title: __('Status'), searchList: {"normal":__('Normal'),"hidden":__('Hidden')}, formatter: Table.api.formatter.status},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
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
                url: 'flshop/goods/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'title', title: __('Title'), align: 'left'},
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
                                    url: 'flshop/goods/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'flshop/goods/destroy',
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
		select: function () {
		    // 初始化表格参数配置
		    Table.api.init({
		        extend: {
		            index_url: 'flshop/goods/select',
		        }
		    });
		    var urlArr = [];
		
		    var table = $("#table");
		
		    table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, row) {
		        if (e.type == 'check' || e.type == 'uncheck') {
		            row = [row];
		        } else {
		            urlArr = [];
		        }
		        $.each(row, function (i, j) {
		            if (e.type.indexOf("uncheck") > -1) {
		                var index = urlArr.indexOf(j.id);
		                if (index > -1) {
		                    urlArr.splice(index, 1);
		                }
		            } else {
		                urlArr.indexOf(j.id) == -1 && urlArr.push(j.id);
		            }
		        });
		    });
		
		    // 初始化表格
		    table.bootstrapTable({
		        url: $.fn.bootstrapTable.defaults.extend.index_url,
		        sortName: 'id',
		        showToggle: false,
		        showExport: false,
		        columns: [
		            [
		                {checkbox: true},
						{field: 'id', title: __('Id')},
						{field: 'image', title: __('Image'), events: Table.api.events.image, formatter: Table.api.formatter.image},
						{field: 'title', title: __('Title')},
						{field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
		                {
		                    field: 'operate', title: __('Operate'), events: {
		                        'click .btn-chooseone': function (e, value, row, index) {
		                            var multiple = Backend.api.query('multiple');
		                            multiple = multiple == 'true' ? true : false;
		                            Fast.api.close({url: row.id, multiple: multiple});
		                        },
		                    }, formatter: function () {
		                        return '<a href="javascript:;" class="btn btn-danger btn-chooseone btn-xs"><i class="fa fa-check"></i> ' + __('Choose') + '</a>';
		                    }
		                }
		            ]
		        ]
		    });
		
		    // 选中多个
		    $(document).on("click", ".btn-choose-multi", function () {
		        var multiple = Backend.api.query('multiple');
		        multiple = multiple == 'true' ? true : false;
		        Fast.api.close({url: urlArr.join(","), multiple: multiple});
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