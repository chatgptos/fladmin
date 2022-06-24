define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/video/index' + location.search,
                    add_url: '',
                    edit_url: '',
                    del_url: 'flshop/video/del',
                    multi_url: 'flshop/video/multi',
                    import_url: '',
                    table: 'flshop_video',
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
						{field: 'flshopfind.id', title: __('flshopfind.id')},
						{field: 'suggestion', title: __('Suggestion'), searchList: {"block":__('Suggestion block'),"review":__('Suggestion review'),"pass":__('Suggestion pass')}, formatter: Table.api.formatter.normal},
                        {field: 'video_id', title: __('Video_id'), operate: 'LIKE'},
                        {field: 'cover_url', title: __('Cover_url'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.images},
                        {field: 'snapshots', title: __('Snapshots'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.images},
                        {field: 'bitrate', title: __('Bitrate'), formatter: Controller.api.formatter.bitrate},
                        {field: 'definition', title: __('Definition'), operate: 'LIKE'},
                        {field: 'duration', title: __('Duration'), formatter: Controller.api.formatter.duration},
                        {field: 'format', title: __('Format'), operate: 'LIKE'},
                        {field: 'fps', title: __('Fps'), formatter: Controller.api.formatter.fps},
                        {field: 'id', title: __('分辨率'), formatter: Controller.api.formatter.resolving},
                        {field: 'size', title: __('Size'), formatter: Controller.api.formatter.size},
                        {field: 'created', title: __('created'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
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
                        		    icon: 'fa fa-play',
                        		    extend: 'data-area=\'["380px", "720px"]\'',
                        		    url: 'flshop/video/detail',
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
                                    name: 'ajax',
                                    title: __('删除作品'),
                                    classname: 'btn btn-xs btn-danger btn-magic btn-ajax',
                                    icon: 'fa fa-trash',
                                    confirm: '删除媒体时作品也将一并删除，确认删除？',
                                    url: 'flshop/video/del',
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
                url: 'flshop/video/recyclebin' + location.search,
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
                                    url: 'flshop/video/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'flshop/video/destroy',
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
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            },
			formatter: {
				size: function (value, row, index) {
					if(null==value||value==''){
				        return "0 Bytes";
				    }
				    var unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB");
				    var index=0;
				    var srcsize = parseFloat(value);
				    index=Math.floor(Math.log(srcsize)/Math.log(1024));
				    var size =srcsize/Math.pow(1024,index);
				    size=size.toFixed(2);//保留的小数位数
				    return size+unitArr[index];
				},
				bitrate: function (value, row, index) {
					return `${value?value:0} Kbps`;
				},
				duration: function (value, row, index) {
					return `${value?value:0}s`;
				},
				fps: function (value, row, index) {
					return `${value?value:0} fps`;
				},
				resolving: function (value, row, index) {
					return `${row.width}*${row.height}`;
				},
				
			}
        }
    };
    return Controller;
});