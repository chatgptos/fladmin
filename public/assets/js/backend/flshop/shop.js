define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {
    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/shop/index' + location.search,
                    add_url: 'flshop/shop/add',
                    edit_url: 'flshop/shop/edit',
                    del_url: 'flshop/shop/del',
                    multi_url: 'flshop/shop/multi',
                    table: 'flshop_shop',
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
                        {field: 'avatar', title: __('Avatar'), events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'state', title: __('State'), searchList: {"0":__('State 0'),"1":__('State 1'),"2":__('State 2')}, formatter: Table.api.formatter.normal},
                        {field: 'shopname', title: __('Shopname')},
                        {field: 'islive', title: __('Islive'), searchList: {"1": __('Yes'), "0": __('No')}, formatter: Table.api.formatter.toggle},
						{field: "isself",title: __("IsSelf"), searchList: {"1": __('Yes'), "0": __('No')}, formatter: Table.api.formatter.toggle},
						{field: 'user.username', title: __('User.username'), formatter: Table.api.formatter.search},
                        {field: 'city', title: __('City')},
                        {field: 'score_describe', title: __('Score_describe'), operate:'BETWEEN'},
                        {field: 'score_service', title: __('Score_service'), operate:'BETWEEN'},
                        {field: 'score_logistics', title: __('Score_logistics'), operate:'BETWEEN'},
                        {field: 'created', title: __('created'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
						{field: 'like', title: __('Like')},
                        {field: 'status', title: __('Status'), searchList: {"normal":__('Normal'),"hidden":__('Hidden')}, formatter: Table.api.formatter.status},
                        {
							field: 'operate', 
							title: __('Operate'), 
							table: table, 
							events: Table.api.events.operate,
							buttons: [
							    {
						            name: 'goods',
                                    text: __('商品'),
                                    title: function (row) {
										return `${row.shopname}  店铺 商品`;
								    },
                                    classname: 'btn btn-xs btn-info btn-dialog',
                                    icon: 'fa fa-shopping-bag',
                                    extend: 'data-area=\'["90%", "80%"]\'',
                                    url: function (row) {
										return `flshop/goods?shop_id=${row.id}`;
								    },
                                    callback: function (data) {
										$(".btn-refresh").trigger("click"); //刷新数据
                                    }
						        },
						        {
						            name: 'groups',
                                    text: __('拼团'),
                                    title: function (row) {
										return `${row.shopname}  店铺 拼团`;
								    },
                                    classname: 'btn btn-xs btn-warning btn-dialog',
                                    icon: 'fa fa-shopping-bag',
                                    extend: 'data-area=\'["90%", "80%"]\'',
                                    url: function (row) {
										return `flshop/groups/goods?shop_id=${row.id}`;
								    },
                                    callback: function (data) {
										$(".btn-refresh").trigger("click"); //刷新数据
                                    }
						        },
						        {
						            name: 'brand',
                                    text: __('品牌'),
                                    title: function (row) {
										return `${row.shopname}  店铺 品牌`;
								    },
                                    classname: 'btn btn-xs btn-danger btn-dialog',
                                    icon: 'fa fa-star',
                                    extend: 'data-area=\'["80%", "70%"]\'',
                                    url: function (row) {
										return `flshop/brand?shop_id=${row.id}`;
								    },
                                    callback: function (data) {
										$(".btn-refresh").trigger("click"); //刷新数据
                                    }
						        },
						        {
						            name: 'freight',
                                    title: function (row) {
										return `${row.shopname}  店铺 运费模板`;
								    },
                                    classname: 'btn btn-xs btn-info btn-dialog',
                                    icon: 'fa fa-truck',
                                    extend: 'data-area=\'["80%", "70%"]\'',
                                    url: function (row) {
										return `flshop/freight?shop_id=${row.id}`;
								    },
                                    callback: function (data) {
										$(".btn-refresh").trigger("click"); //刷新数据
                                    }
						        },
						        {
						            name: 'find',
                                    title: function (row) {
										return `${row.shopname}  店铺 种草`;
								    },
                                    classname: 'btn btn-xs btn-warning btn-dialog',
                                    icon: 'fa fa-envira',
                                    extend: 'data-area=\'["90%", "80%"]\'',
                                    url: function (row) {
										return `flshop/find?user_no=${row.user_no}`;
								    },
                                    callback: function (data) {
										$(".btn-refresh").trigger("click"); //刷新数据
                                    }
						        },
						        {
						            name: 'shopsort',
                                    title: function (row) {
										return `${row.shopname}  店铺 类目`;
								    },
                                    classname: 'btn btn-xs btn-success btn-dialog',
                                    icon: 'fa fa-list-ol',
                                    extend: 'data-area=\'["80%", "70%"]\'',
                                    url: function (row) {
										return `flshop/shopsort?shop_id=${row.id}`;
								    },
                                    callback: function (data) {
										$(".btn-refresh").trigger("click"); //刷新数据
                                    }
						        }
						    ], 
							formatter: Table.api.formatter.buttons
						}
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
                url: 'flshop/shop/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
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
                                    url: 'flshop/shop/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'flshop/shop/destroy',
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