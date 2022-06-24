define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/live/index' + location.search,
                    add_url: '',
                    edit_url: 'flshop/live/edit',
                    del_url: 'flshop/live/del',
                    multi_url: 'flshop/live/multi',
                    import_url: '',
                    table: 'flshop_live',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                //启用固定列
                fixedColumns: true,
                //固定右侧列数
                fixedRightNumber: 1,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
						{field: 'shop_id', title: __('Shop_id')},
						{field: 'flshopshop.shopname', title: __('flshopshop.shopname'), operate: 'LIKE'},
						{field: 'flshopfind.id', title: __('flshopfind.id')},
						{field: 'image', title: __('Image'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
						{field: 'state', title: __('State'), searchList: {"0":__('State 0'),"1":__('State 1'),"2":__('State 2'),"3":__('State 3')}, formatter: Table.api.formatter.normal},
                        {field: 'liveid', title: __('Liveid'), operate: 'LIKE'},
                        {field: 'liveurl', title: __('Liveurl'), operate: 'LIKE', formatter: Table.api.formatter.url},
                        {field: 'views', title: __('Views')},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {
                        	field: 'operate', 
                        	title: __('Operate'), 
                        	table: table, 
                        	events: Table.api.events.operate,
                        	buttons: [
                        		{
                        		    name: 'detail',
                        		    text: __('播放'),
                        		    title: __('播放'),
                        		    classname: 'btn btn-xs btn-success btn-dialog',
                        		    icon: 'fa fa-video-camera',
                        		    extend: 'data-area=\'["380px", "720px"]\'',
                        		    url: function (row) {
                        		    	return `flshop/live/detail?live_id=${row.id}`;
                        		    },
                        		    visible: function (row) {
                        		        return row.state !== 'examine';
                        		    }
                        		},
                        		{
                        		    name: 'find',
                        		    text: __('作品'),
                        		    title: __('预览作品'),
                        		    classname: 'btn btn-xs btn-info btn-dialog',
                        		    icon: 'fa fa-paper-plane',
                        		    url: function (row) {
										return `flshop/find/detail?ids=${row.flshopfind.id}`;
								    },
                        		    callback: function (data) {
                        				$(".btn-refresh").trigger("click"); //刷新数据
                        		    }
                        		},
                        		{
                        		    name: 'edit',
                        		    title: __('编辑直播'),
                        		    classname: 'btn btn-xs btn-success btn-dialog',
                        		    icon: 'fa fa-pencil',
                        		    url: 'flshop/live/edit',
                        		    callback: function (data) {
                        				$(".btn-refresh").trigger("click"); //刷新数据
                        		    }
                        		},
                                {
                                    name: 'ajax',
                                    title: __('删除作品'),
                                    classname: 'btn btn-xs btn-danger btn-magic btn-ajax',
                                    icon: 'fa fa-trash',
                                    confirm: '删除媒体时作品也将一并删除，确认删除？',
                                    url: 'flshop/live/del',
                                    success: function (data, ret) {
                                        $(".btn-refresh").trigger("click"); //刷新数据
                                    },
                                    error: function (data, ret) {
                                        console.log(data, ret);
                                        Layer.alert(ret.msg);
                                        return false;
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
                url: 'flshop/live/recyclebin' + location.search,
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
                                    url: 'flshop/live/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'flshop/live/destroy',
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
        detail: function () {
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