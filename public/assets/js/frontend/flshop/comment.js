define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function($, undefined, Backend,Table, Form) {
    var Controller = {
		detail: function () {
		   $(document).on("click", ".detail[data-id]", function () {
			   parent.window.Fast.api.open('flshop/order/detail/id/' + $(this).data('id'), __('查看详情'),{area:['1200px', '780px']});
		   });
		   $(document).on("click", ".groups[data-id]", function () {
		   		parent.window.Fast.api.open('flshop/groupsorder/detail/id/' + $(this).data('id'), __('查看详情'),{area:['1200px', '780px']});
		   });
		},
		select: function () {
		    // 初始化表格参数配置
		    Table.api.init({
		        extend: {
		            index_url: 'flshop/comment/select',
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
						{field: 'user.nickname', title: __('User.nickname'), formatter: Table.api.formatter.search},
						{field: 'content', title: __('Content')},
						{field: 'images', title: __('Images'), events: Table.api.events.image, formatter: Table.api.formatter.images},
						{field: 'state', title: __('States'), searchList: {"0":__('States 0'),"1":__('States 1'),"2":__('States 2')}, formatter: Table.api.formatter.normal},
		                {field: 'score', title: __('Score'), operate:'BETWEEN'},
						{
		                    field: 'operate', title: __('Operate'), events: {
		                        'click .btn-chooseone': function (e, value, row, index) {
		                            var multiple = Backend.api.query('multiple');
		                            multiple = multiple == 'true' ? true : false;
		                            Fast.api.close({url: row.id, data: {
										id: row.id,
										goods_id: row.goods_id,
										images: row.images,
										user: row.user.nickname,
										content: row.content
									}, multiple: multiple});
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
		        Fast.api.close({
					url: urlArr.join(","), 
					multiple: multiple
				});
		    });
		
		    // 为表格绑定事件
		    Table.api.bindevent(table);
		},
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});