define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/find/index' + location.search,
                    add_url: '',
                    edit_url: '',
                    del_url: 'flshop/find/del',
                    multi_url: 'flshop/find/multi',
                    import_url: '',
                    table: 'flshop_find',
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
						{field: 'user.avatar', title: __('User.avatar'), operate: 'LIKE', events: Table.api.events.image, formatter: Table.api.formatter.image},
						{field: 'user.nickname', title: __('User.nickname'), operate: 'LIKE'},
						{field: 'user_no', title: __('User_no'), operate: 'LIKE'},
                        {field: 'type', title: __('Type'), searchList: {"new":__('Type new'),"live":__('Type live'),"video":__('Type video'),"want":__('Type want'),"show":__('Type show'),"activity":__('Type activity')}, formatter: Table.api.formatter.normal},
                        {field: 'images', title: __('Images'), align:'left', operate: false, events: Table.api.events.image, formatter: Table.api.formatter.images},
                        {field: 'views', title: __('Views')},
                        {field: 'likes', title: __('Likes')},
						{field: 'comments', title: __('Comments')},
                        {field: 'state', title: __('State'), searchList: {"publish":__('State publish'),"examine":__('State examine'),"hazard":__('State hazard'),"transcoding":__('State transcoding'),"screenshot":__('State screenshot'),"normal":__('State normal')}, formatter: Table.api.formatter.normal},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {
							field: 'operate', 
							title: __('Operate'), 
							table: table, 
							events: Table.api.events.operate,
							buttons: [
						        {
						            name: 'examine',
                                    text: __('审核'),
                                    title: __('审核当前作品'),
                                    classname: 'btn btn-xs btn-warning btn-dialog',
                                    icon: 'fa fa-leaf',
                                    url: 'flshop/find/examine',
                                    callback: function (data) {
										$(".btn-refresh").trigger("click"); //刷新数据
                                    },
						            visible: function (row) {
						                return row.state === 'examine';
						            }
						        },
								{
								    name: 'detail',
								    text: __('查看'),
								    title: __('查看作品'),
								    classname: 'btn btn-xs btn-info btn-dialog',
								    icon: 'fa fa-paper-plane',
								    url: 'flshop/find/detail',
								    callback: function (data) {
										$(".btn-refresh").trigger("click");
								    },
								    visible: function (row) {
								        return row.state !== 'examine';
								    }
								},
								{
						            name: 'live',
                                    text: __('播放'),
                                    title: __('播放'),
                                    classname: 'btn btn-xs btn-success btn-dialog',
                        		    icon: 'fa fa-video-camera',
                        		    extend: 'data-area=\'["380px", "720px"]\'',
                                    url: function (row) {
										return `flshop/live/detail?live_id=${row.live_id}`;
								    },
						            visible: function (row) {
						                return row.type === 'live';
						            }
						        },
						        {
						            name: 'video',
                                    text: __('播放'),
                                    title: __('播放'),
                                    classname: 'btn btn-xs btn-success btn-dialog',
                        		    icon: 'fa fa-play',
                        		    extend: 'data-area=\'["380px", "720px"]\'',
                                    url: function (row) {
										return `flshop/video/detail?video_id=${row.video_id}`;
								    },
						            visible: function (row) {
						                return row.type === 'video';
						            }
						        },
								{
								    name: 'comments',
								    text: __('查看评论'),
								    title: __('评论'),
								    classname: 'btn btn-xs btn-success btn-dialog',
								    icon: 'fa fa-comments',
								    url: function (row) {
										return `flshop/comments/detail?find_id=${row.id}`;
								    },
								    callback: function (data) {
										$(".btn-refresh").trigger("click"); //刷新数据
								    },
								    visible: function (row) {
								        return row.state !== 'examine';
								    }
								},
                                {
                                    name: 'ajax',
                                    title: __('删除作品'),
                                    classname: 'btn btn-xs btn-danger btn-magic btn-ajax',
                                    icon: 'fa fa-trash',
                                    confirm: '删除作品时关联媒体也将同时删除，确认删除？',
                                    url: 'flshop/find/del',
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
                url: 'flshop/find/recyclebin' + location.search,
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
                                    url: 'flshop/find/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'flshop/find/destroy',
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
            $(".play").click(function(){
                let id = $(".play").data("id"),
                    type = $(".play").data("type");
                parent.Fast.api.open(`flshop/${type}/detail?${type}_id=${id}`, `${type === 'live' ? '播放直播':'播放视频'}`, {area:["380px", "720px"]});
            });
            Controller.api.bindevent();
        },
        examine: function () {
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