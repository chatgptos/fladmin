define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {
    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/category/index' + location.search,
                    add_url: 'flshop/category/add',
                    edit_url: 'flshop/category/edit',
                    del_url: 'flshop/category/del',
                    multi_url: 'flshop/category/multi',
                    table: 'flshop_category',
                }
            });
            var table = $("#table");
            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'weigh',
				pagination: false,
				// escape: false,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
						{field: 'name', title: __('Name'), align: 'left', formatter: Controller.api.formatter.escape2Html},
						{field: 'type',title: __('Type'),custom: {article: 'info', goods: 'success'},formatter: Table.api.formatter.flag},
                        // {field: 'flag', title: __('Flag'), searchList: {"hot":__('Hot'),"new":__('New'),"recommend":__('Recommend')}, operate:'FIND_IN_SET', formatter: Table.api.formatter.label},
                        {field: 'image', title: __('Image'), events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'status', title: __('Status'), searchList: {"normal":__('Normal'),"hidden":__('Hidden')}, formatter: Table.api.formatter.status},
						{field: 'id',title: __('展开'),operate: false,formatter: Controller.api.formatter.subnode},
						// {field: 'id',title: '<a href="javascript:;" class="btn btn-success btn-xs btn-toggle"><i class="fa fa-chevron-up"></i></a>',operate: false,formatter: Controller.api.formatter.subnode},
						{field: 'isnav', title: __('Isnav'), searchList: {"1": __('Yes'), "0": __('No')}, formatter: Table.api.formatter.toggle},
						{field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ],
				search: false,
				commonSearch: false
            });
            //当内容渲染完成后
            table.on('post-body.bs.table', function (e, settings, json, xhr) {
                //默认隐藏所有子节点
                //$("a.btn[data-id][data-pid][data-pid!=0]").closest("tr").hide();
                $(".btn-node-sub.disabled[data-pid!=0]").closest("tr").hide();
            
                //显示隐藏子节点
                $(".btn-node-sub").off("click").on("click", function (e) {
                    var status = $(this).data("shown") || $("a.btn[data-pid='" + $(this).data("id") + "']:visible").size() > 0 ? true : false;
                    $("a.btn[data-pid='" + $(this).data("id") + "']").each(function () {
                        $(this).closest("tr").toggle(!status);
                        if (!$(this).hasClass("disabled")) {
                            $(this).trigger("click");
                        }
                    });
                    $(this).data("shown", !status);
                    return false;
                });
            
            });
            //展开隐藏一级
            $(document.body).on("click", ".btn-toggle", function (e) {
                $("a.btn[data-id][data-pid][data-pid!=0].disabled").closest("tr").hide();
                var that = this;
                var show = $("i", that).hasClass("fa-chevron-down");
                $("i", that).toggleClass("fa-chevron-down", !show);
                $("i", that).toggleClass("fa-chevron-up", show);
                $("a.btn[data-id][data-pid][data-pid!=0]").not('.disabled').closest("tr").toggle(show);
                $(".btn-node-sub[data-pid=0]").data("shown", show);
            });
            //展开隐藏全部
            $(document.body).on("click", ".btn-toggle-all", function (e) {
                var that = this;
                var show = $("i", that).hasClass("fa-plus");
                $("i", that).toggleClass("fa-plus", !show);
                $("i", that).toggleClass("fa-minus", show);
                $(".btn-node-sub.disabled[data-pid!=0]").closest("tr").toggle(show);
                $(".btn-node-sub[data-pid!=0]").data("shown", show);
            });
            
            // 为表格绑定事件
            Table.api.bindevent(table);
        },
		goods: function () {
		    // 初始化表格参数配置
		    Table.api.init({
		        extend: {
		            index_url: 'flshop/category/goods' + location.search,
		            add_url: 'flshop/category/add?type=goods',
		            edit_url: 'flshop/category/edit?type=goods',
		            del_url: 'flshop/category/del',
		            multi_url: 'flshop/category/multi',
		            table: 'flshop_category',
		        }
		    });
		    var table = $("#table");
		    // 初始化表格
		    table.bootstrapTable({
		        url: $.fn.bootstrapTable.defaults.extend.index_url,
		        pk: 'id',
		        sortName: 'weigh',
				pagination: false,
				fixedColumns: true,
                fixedRightNumber: 1,
		        columns: [
		            [
		                {checkbox: true},
		                {field: 'id', title: __('Id')},
						{field: 'name', title: __('Name'), align: 'left', formatter: Controller.api.formatter.escape2Html},
						{field: 'type',title: __('Type'),custom: {article: 'info', goods: 'success'},formatter: Table.api.formatter.flag},
		                {field: 'image', title: __('Image'), events: Table.api.events.image, formatter: Table.api.formatter.image},
		                {field: 'status', title: __('Status'), searchList: {"normal":__('Normal'),"hidden":__('Hidden')}, formatter: Table.api.formatter.status},
						{field: 'id',title: __('展开'),operate: false,formatter: Controller.api.formatter.subnode},
						{field: 'isnav', title: __('Isnav'), searchList: {"1": __('Yes'), "0": __('No')}, formatter: Table.api.formatter.toggle},
		                {
							field: 'operate', 
							title: __('Operate'), 
							table: table, 
							events: Table.api.events.operate,
							buttons: [
						        {
						            name: 'attribute',
                                    text: __('属性'),
                                    title: function (row) {
										return `[${row.name}] 类目及子类目 属性`;
								    },
                                    classname: 'btn btn-xs btn-danger btn-dialog',
                                    icon: 'fa fa-list-ol',
                                    extend: 'data-area=\'["90%", "80%"]\'',
                                    url: function (row) {
										return `flshop/attribute?category_id=${row.channel}`;
								    },
                                    callback: function (data) {
										$(".btn-refresh").trigger("click"); //刷新数据
                                    }
						        },
						        {
						            name: 'goods',
                                    text: __('商品'),
                                    title: function (row) {
										return `[${row.name}] 类目及子类目 商品`;
								    },
                                    classname: 'btn btn-xs btn-info btn-dialog',
                                    icon: 'fa fa-shopping-bag',
                                    extend: 'data-area=\'["90%", "80%"]\'',
                                    url: function (row) {
										return `flshop/goods?category_id=${row.channel}`;
								    },
                                    callback: function (data) {
										$(".btn-refresh").trigger("click"); //刷新数据
                                    }
						        },
						        {
						            name: 'groups',
                                    text: __('拼团'),
                                    title: function (row) {
										return `[${row.name}] 类目及子类目 拼团`;
								    },
                                    classname: 'btn btn-xs btn-warning btn-dialog',
                                    icon: 'fa fa-shopping-bag',
                                    extend: 'data-area=\'["90%", "80%"]\'',
                                    url: function (row) {
										return `flshop/groups/goods?category_id=${row.channel}`;
								    },
                                    callback: function (data) {
										$(".btn-refresh").trigger("click"); //刷新数据
                                    }
						        }
						    ], 
							formatter: Table.api.formatter.operate
						}
		            ]
		        ],
				search: false,
				commonSearch: false
		    });
		    //当内容渲染完成后
		    table.on('post-body.bs.table', function (e, settings, json, xhr) {
		        //默认隐藏所有子节点
		        //$("a.btn[data-id][data-pid][data-pid!=0]").closest("tr").hide();
		        $(".btn-node-sub.disabled[data-pid!=0]").closest("tr").hide();
		    
		        //显示隐藏子节点
		        $(".btn-node-sub").off("click").on("click", function (e) {
		            var status = $(this).data("shown") || $("a.btn[data-pid='" + $(this).data("id") + "']:visible").size() > 0 ? true : false;
		            $("a.btn[data-pid='" + $(this).data("id") + "']").each(function () {
		                $(this).closest("tr").toggle(!status);
		                if (!$(this).hasClass("disabled")) {
		                    $(this).trigger("click");
		                }
		            });
		            $(this).data("shown", !status);
		            return false;
		        });
		    
		    });
		    //展开隐藏一级
		    $(document.body).on("click", ".btn-toggle", function (e) {
		        $("a.btn[data-id][data-pid][data-pid!=0].disabled").closest("tr").hide();
		        var that = this;
		        var show = $("i", that).hasClass("fa-chevron-down");
		        $("i", that).toggleClass("fa-chevron-down", !show);
		        $("i", that).toggleClass("fa-chevron-up", show);
		        $("a.btn[data-id][data-pid][data-pid!=0]").not('.disabled').closest("tr").toggle(show);
		        $(".btn-node-sub[data-pid=0]").data("shown", show);
		    });
		    //展开隐藏全部
		    $(document.body).on("click", ".btn-toggle-all", function (e) {
		        var that = this;
		        var show = $("i", that).hasClass("fa-plus");
		        $("i", that).toggleClass("fa-plus", !show);
		        $("i", that).toggleClass("fa-minus", show);
		        $(".btn-node-sub.disabled[data-pid!=0]").closest("tr").toggle(show);
		        $(".btn-node-sub[data-pid!=0]").data("shown", show);
		    });
			
			
			//点击详情
			$(document).on("click", ".btn-create", function () {
			    Backend.api.open('flshop/category/create/', __('批量生成菜单'));
			});
			
			
		    // 为表格绑定事件
		    Table.api.bindevent(table);
		},
		article: function () {
		    // 初始化表格参数配置
		    Table.api.init({
		        extend: {
		            index_url: 'flshop/category/article' + location.search,
		            add_url: 'flshop/category/add?type=article',
		            edit_url: 'flshop/category/edit?type=article',
		            del_url: 'flshop/category/del',
		            multi_url: 'flshop/category/multi',
		            table: 'flshop_category',
		        }
		    });
		
		    var table = $("#table");
		
		    // 初始化表格
		    table.bootstrapTable({
		        url: $.fn.bootstrapTable.defaults.extend.index_url,
		        pk: 'id',
		        sortName: 'weigh',
				pagination: false,
				// escape: false,
		        columns: [
		            [
		                {checkbox: true},
		                {field: 'id', title: __('Id')},
						{field: 'name', title: __('Name'), align: 'left', formatter: Controller.api.formatter.escape2Html},
						{field: 'type',title: __('Type'),custom: {article: 'info', goods: 'success'},formatter: Table.api.formatter.flag},
		                {field: 'image', title: __('Image'), events: Table.api.events.image, formatter: Table.api.formatter.image},
		                {field: 'status', title: __('Status'), searchList: {"normal":__('Normal'),"hidden":__('Hidden')}, formatter: Table.api.formatter.status},
						{field: 'id',title: __('展开'),operate: false,formatter: Controller.api.formatter.subnode},
						{field: 'isnav', title: __('Isnav'), searchList: {"1": __('Yes'), "0": __('No')}, formatter: Table.api.formatter.toggle},
		                {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
		            ]
		        ],
				search: false,
				commonSearch: false
		    });
		    //当内容渲染完成后
		    table.on('post-body.bs.table', function (e, settings, json, xhr) {
		        //默认隐藏所有子节点
		        //$("a.btn[data-id][data-pid][data-pid!=0]").closest("tr").hide();
		        $(".btn-node-sub.disabled[data-pid!=0]").closest("tr").hide();
		    
		        //显示隐藏子节点
		        $(".btn-node-sub").off("click").on("click", function (e) {
		            var status = $(this).data("shown") || $("a.btn[data-pid='" + $(this).data("id") + "']:visible").size() > 0 ? true : false;
		            $("a.btn[data-pid='" + $(this).data("id") + "']").each(function () {
		                $(this).closest("tr").toggle(!status);
		                if (!$(this).hasClass("disabled")) {
		                    $(this).trigger("click");
		                }
		            });
		            $(this).data("shown", !status);
		            return false;
		        });
		    
		    });
		    //展开隐藏一级
		    $(document.body).on("click", ".btn-toggle", function (e) {
		        $("a.btn[data-id][data-pid][data-pid!=0].disabled").closest("tr").hide();
		        var that = this;
		        var show = $("i", that).hasClass("fa-chevron-down");
		        $("i", that).toggleClass("fa-chevron-down", !show);
		        $("i", that).toggleClass("fa-chevron-up", show);
		        $("a.btn[data-id][data-pid][data-pid!=0]").not('.disabled').closest("tr").toggle(show);
		        $(".btn-node-sub[data-pid=0]").data("shown", show);
		    });
		    //展开隐藏全部
		    $(document.body).on("click", ".btn-toggle-all", function (e) {
		        var that = this;
		        var show = $("i", that).hasClass("fa-plus");
		        $("i", that).toggleClass("fa-plus", !show);
		        $("i", that).toggleClass("fa-minus", show);
		        $(".btn-node-sub.disabled[data-pid!=0]").closest("tr").toggle(show);
		        $(".btn-node-sub[data-pid!=0]").data("shown", show);
		    });
		    
		    // 为表格绑定事件
		    Table.api.bindevent(table);
		},
        select: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/category/select',
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
                        var index = urlArr.indexOf(j.route);
                        if (index > -1) {
                            urlArr.splice(index, 1);
                        }
                    } else {
                        urlArr.indexOf(j.route) == -1 && urlArr.push(j.route);
                    }
                });
            });
        
            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                sortName: 'id',
                pagination: false,
                // escape: false,
                columns: [
                    [
                        {checkbox: true},
        				{field: 'id', title: __('Id')},
						{field: 'image', title: __('Image'), events: Table.api.events.image, formatter: Table.api.formatter.image},
						{field: 'type',title: __('Type'),custom: {article: 'info', goods: 'success'},formatter: Table.api.formatter.flag},
        				{field: 'name', title: __('Name'), align: 'left', formatter: Controller.api.formatter.escape2Html},
						{field: 'id',title: __('Route'), operate: false, formatter: Controller.api.formatter.route},
                        {
                            field: 'operate', title: __('Operate'), events: {
                                'click .btn-chooseone': function (e, value, row, index) {
                                    var multiple = Backend.api.query('multiple');
                                    multiple = multiple == 'true' ? true : false;
                                    Fast.api.close({url: '/pages/product/list?data=' + encodeURIComponent(JSON.stringify({"category_id":row.id,"category_name":row.name.replace(row.spacer,'')})), name: row.name.replace(row.spacer,""), multiple: multiple});
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
		create: function () {
		    Controller.api.bindevent();
		},
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
			formatter: {
				subnode: function (value, row, index) {
				    return '<a href="javascript:;" data-toggle="tooltip" title="' + __('Toggle sub menu') + '" data-id="' + row.id + '" data-pid="' + row.pid + '" class="btn btn-xs '
				        + (row.haschild == 1 || row.ismenu == 1 ? 'btn-success' : 'btn-default disabled') + ' btn-node-sub"><i class="fa fa-sitemap"></i></a>';
				},
				route: function (value, row, index) {
					return '/pages/product/list?data=' + {"category_id":row.id,"category_name":row.name.replace(row.spacer,'')};
				},
				//转意符换成普通字符
				escape2Html: function (value, row, index) {
					return value.toString().replace(/(&|&amp;)nbsp;/g, '');
				}
			},
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});