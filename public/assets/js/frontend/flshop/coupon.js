define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'vue'], function ($, undefined, Backend, Table, Form, Vue) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/coupon/index' + location.search,
                    add_url: 'flshop/coupon/add',
                    edit_url: 'flshop/coupon/edit',
                    del_url: 'flshop/coupon/del',
                    multi_url: '',
                    import_url: '',
                    table: 'flshop_coupon',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
				fixedColumns: true,
				fixedNumber: 3,
				fixedRightNumber: 2,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
						{field: 'name', title: __('Name'),align: 'left', operate: 'LIKE'},
                        {field: 'usenum', title: __('Usenum'), formatter: Controller.api.formatter.alreadygrant},//上色
						{field: 'type', title: __('Type'), searchList: {"reduction":__('Type reduction'),"discount":__('Type discount'),"shipping":__('Type shipping'),"vip":__('Type vip')}, formatter: Table.api.formatter.normal},
						{field: 'rangetype', title: __('Rangetype'), searchList: {"all":__('Rangetype all'),"goods":__('Rangetype goods'),"category":__('Rangetype category')}, formatter: Table.api.formatter.normal},
                        {field: 'limit', title: __('Limit'), operate:'BETWEEN'},
						{field: 'id', title: __('优惠方式'), operate: false, formatter: Controller.api.formatter.mode},  //根据条件判断
						{field: 'grant', title: __('Grant'), operate: false, formatter: Controller.api.formatter.grant},  //上色 且-1等于不限
						{field: 'alreadygrant', title: __('Alreadygrant'), formatter: Controller.api.formatter.alreadygrant},//上色
						{field: 'id', title: __('有效期'), formatter: Controller.api.formatter.overdue},
						{field: 'invalid', title: __('Invalid'), formatter: Controller.api.formatter.invalid},
						{field: 'created', title: __('created'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
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
                url: 'flshop/coupon/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'name', title: __('Name'), align: 'left'},
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
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-restoreit',
                                    icon: 'fa fa-rotate-left',
                                    url: 'flshop/coupon/restore',
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
			var vm = new Vue({
				el: "#app",
				data: {
					type: 'reduction', // 券类型
					rangetype: 'all', // 范围类型
					rangename: {
						'goods': '选择商品',
						'category': '选择类目'
					}, // 范围类型名
					range: '', // 范围
					usertype: 'reduction', //赠送会员优惠券类型
					pretype: 'appoint' // 到期类型
				},
				methods: {
					rangeChange(e){
						this.range = '';
					},
					// 类目链接
					categoryLink(){
						parent.Fast.api.open("flshop/shopsort/select?sort=true&multiple=false", __('选择类目链接'), {
							area: ['800px', '600px'],
						    callback: (data)=> {
								this.range = data.url;
						    }
						});
					},
					// 商品链接
					goodsLink(){
						parent.Fast.api.open("flshop/goods/select?multiple=true", __('选择商品链接'), {
							area: ['800px', '600px'],
						    callback: (data)=> {
								this.range = data.url;
						    }
						});
					}
				}
			});
        },
        edit: function () {
            Controller.api.bindevent();
			var vm = new Vue({
				el: "#app",
				data: {
					data: Config.row.data,
					type: Config.row.type, // 券类型
					rangetype: Config.row.rangetype, // 范围类型
					rangename: {
						'goods': '选择商品',
						'category': '选择类目'
					}, // 范围类型名
					range: Config.row.range, // 范围
					usertype: Config.row.usertype, //赠送会员优惠券类型
					pretype: Config.row.pretype // 到期类型
				},
				methods: {
					rangeChange(e){
						this.range = '';
					},
					// 类目链接
					categoryLink(){
						parent.Fast.api.open("flshop/shopsort/select?sort=true&multiple=false", __('选择类目链接'), {
							area: ['800px', '600px'],
						    callback: (data)=> {
								this.range = data.url;
						    }
						});
					},
					// 商品链接
					goodsLink(){
						parent.Fast.api.open("flshop/goods/select?multiple=true", __('选择商品链接'), {
							area: ['800px', '600px'],
						    callback: (data)=> {
								this.range = data.url;
						    }
						});
					}
				}
			});
        },
        api: {
			formatter: {
				mode: function (value, row, index) {
					var tpl = '';
					if (row.type == 'reduction' || (row.type == 'vip' && row.usertype == 'reduction')) {
						tpl = '<span>满 '+Number(row.limit)+' 元减'+Number(row.price)+'</span>';
					}
					if (row.type == 'discount' || (row.type == 'vip' && row.usertype == 'discount')) {
						tpl = '<span class="text-success">满 '+Number(row.limit)+' 元打'+Number(row.discount)+'折</span>';
					}
					if (row.type == 'shipping') {
						tpl = '<span class="text-danger">满 '+Number(row.limit)+' 元包邮</span>';
					}
					return tpl;
				},
				invalid: function (value, row, index) {
					if(value == 0){
						if(row.pretype == 'fixed' && new Date(row.startdate).getTime() > new Date().getTime()){
							return '<span class="text-primary"><i class="fa fa-circle"></i> 尚未开始</span>';
						}else{
							return '<span class="text-success"><i class="fa fa-circle"></i> 发放中</span>';
						}
					}
					if(value == 1){
						return '<span class="text-danger"><i class="fa fa-circle"></i> 已失效</span>';
					}
				},
				usenum: function (value, row, index) {
					if(value == 0){
						return value;
					}else{
						return '<span class="label label-danger">'+value+'</span>';
					}
				},
				alreadygrant: function (value, row, index) {
					if(value == 0){
						return value;
					}else{
						return '<span class="label label-success">'+value+'</span>';
					}
				},
				overdue: function (value, row, index) {
					if(row.pretype == 'fixed'){
						return row.enddate;
					}else{
						return row.validity == 0 ? '长期有效': '领取 '+row.validity+' 天';
					}
				},
				grant: function (value, row, index) {
				    return value == '-1'? '不限': value+' 张';
				}
			},
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});