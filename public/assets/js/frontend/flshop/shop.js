define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'vue'], function ($, undefined, Backend, Table, Form, Vue) {
    var Controller = {
		index: function () {
		    // 初始化表格参数配置
		    Table.api.init({
		        extend: {
		            index_url: 'flshop/page/index' + location.search,
		            add_url: '',
		            edit_url: 'flshop/page/edit',
		            del_url: 'flshop/page/del',
		            multi_url: '',
		            table: 'flshop_page',
		        }
		    });
			Fast.config.openArea = ['90%', '90%'];
		    var table = $("#table");
		
		    // 初始化表格
		    table.bootstrapTable({
		        url: $.fn.bootstrapTable.defaults.extend.index_url,
		        pk: 'id',
		        sortName: 'id',
		        columns: [
		            [
		                {checkbox: true},
		                {field: 'id', title: __('Id')},
						{field: 'page_token', title: __('Token')},
		                {field: 'name', title: __('Name')},
						{field: 'type', title: __('Type'), searchList: {"page":__('Page'),"shop":__('Shop'),"index":__('Index')}, formatter: Table.api.formatter.normal},
		                {field: 'created', title: __('created'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
		                {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
		                {field: 'status', title: __('Status'), searchList: {"normal":__('Normal'),"hidden":__('Hidden')}, formatter: Table.api.formatter.status},
		                {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
		            ]
		        ]
		    });
		
		    // 为表格绑定事件
		    Table.api.bindevent(table);
			// 新建页面
			$(document).on("click", ".btn-addnew", function () {
			    Backend.api.open('flshop/page/add/', __('新建页面'), {area:['800px', '400px']});
			});
		},
		profile: function () {
			// 给上传按钮添加上传成功事件
			$("#plupload-avatar").data("upload-success", function (data) {
			    var url = Backend.api.cdnurl(data.url);
			    $(".profile-user-img").prop("src", url);
			});
		    Controller.api.bindevent();
		},
		brand: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/brand/index' + location.search,
                    add_url: 'flshop/brand/add',
                    edit_url: 'flshop/brand/edit',
                    del_url: 'flshop/brand/del',
                    multi_url: 'flshop/brand/multi',
					dragsort_url: "",
                    table: 'flshop_brand',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'weigh',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
						{field: 'name', title: __('品牌名称'), formatter: Table.api.formatter.search},
						{field: 'image', title: __('Image'), events: Table.api.events.image, formatter: Table.api.formatter.image},
						{field: 'category.name', title: __('Category.name'), formatter: Table.api.formatter.search},
                        {field: 'created', title: __('created'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'state', title: __('State'), searchList: {"0":__('State 0'),"1":__('State 1')}, formatter: Table.api.formatter.status},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
		
		// 图片空间
		attachment: function () {
		    // 初始化表格参数配置
		    Table.api.init({
		        extend: {
		            index_url: 'flshop/attachment/index',
		            add_url: 'flshop/attachment/add',
		            edit_url: '',
		            del_url: 'flshop/attachment/del',
		            multi_url: '',
		            table: 'attachment'
		        }
		    });
		    
		    var table = $("#table");
		    
		    // 初始化表格
		    table.bootstrapTable({
		        url: $.fn.bootstrapTable.defaults.extend.index_url,
		        sortName: 'id',
		        columns: [
		            [
		                {field: 'state', checkbox: true},
		                {field: 'id', title: __('Id')},
		                {field: 'user_id', title: __('User_id'), visible: false, addClass: "selectpage", extend: "data-source='user/user/index' data-field='nickname'"},
		                {field: 'url', title: __('Preview'), formatter: Controller.api.formatter.thumb, operate: false},
		                {field: 'url', title: __('Url'), formatter: Controller.api.formatter.url},
		                {field: 'imagewidth', title: __('Imagewidth'), sortable: true},
		                {field: 'imageheight', title: __('Imageheight'), sortable: true},
		                {field: 'image_type', title: __('image_type'), formatter: Table.api.formatter.search},
		                {field: 'storage', title: __('Storage'), formatter: Table.api.formatter.search},
		                {
		                    field: 'filesize', title: __('Filesize'), operate: 'BETWEEN', sortable: true, formatter: function (value, row, index) {
		                        var size = parseFloat(value);
		                        var i = Math.floor(Math.log(size) / Math.log(1024));
		                        return (size / Math.pow(1024, i)).toFixed(i < 2 ? 0 : 2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
		                    }
		                },
		                {field: 'mime_type', title: __('mime_type'), formatter: Table.api.formatter.search},
		                {
		                    field: 'created',
		                    title: __('created'),
		                    formatter: Table.api.formatter.datetime,
		                    operate: 'RANGE',
		                    addclass: 'datetimerange',
		                    sortable: true
		                },
		                {
		                    field: 'operate',
		                    title: __('Operate'),
		                    table: table,
		                    events: Table.api.events.operate,
		                    formatter: Table.api.formatter.operate
		                }
		            ]
		        ],
		    });
		    
		    // 为表格绑定事件
		    Table.api.bindevent(table);
			require(['upload'], function (Upload) {
			    Upload.api.plupload($("#toolbar .plupload"), function () {
			        $(".btn-refresh").trigger("click");
			    });
			});
		},
		api: {
			formatter: {
				thumb: function (value, row, index) {
				    if (row.mime_type.indexOf("image") > -1) {
				        var style = row.storage == 'upyun' ? '!/fwfh/120x90' : '';
				        return '<a href="' + row.fullurl + '" target="_blank"><img src="' + row.fullurl + style + '" alt="" style="max-height:90px;max-width:120px"></a>';
				    } else {
				        return '<a href="' + row.fullurl + '" target="_blank"><img src="https://tool.fastadmin.net/icon/' + row.image_type + '.png" alt=""></a>';
				    }
				},
				url: function (value, row, index) {
				    return '<a href="' + row.fullurl + '" target="_blank" class="label bg-green">' + value + '</a>';
				},
				subnode: function (value, row, index) {
				    return '<a href="javascript:;" data-toggle="tooltip" title="' + __('Toggle sub menu') + '" data-id="' + row.id + '" data-pid="' + row.pid + '" class="btn btn-xs '
				        + (row.haschild == 1 || row.ismenu == 1 ? 'btn-success' : 'btn-default disabled') + ' btn-node-sub"><i class="fa fa-sitemap"></i></a>';
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