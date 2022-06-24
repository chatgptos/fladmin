define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'vue'], function ($, undefined, Backend, Table, Form, Vue) {
    var Controller = {
		bill: function () {
		    // 初始化表格参数配置
		    Table.api.init({
		        extend: {
		            index_url: 'flshop/finance/bill' + location.search,
		            add_url: '',
		            edit_url: '',
		            del_url: '',
		            multi_url: '',
		            table: 'flshop_page',
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
		                {field: 'money', title: __('Money'), operate:'BETWEEN'},
                        {field: 'before', title: __('Before'), operate:'BETWEEN'},
                        {field: 'after', title: __('After'), operate:'BETWEEN'},
                        {field: 'type', title: __('Type'), searchList: {"pay":__('Type pay'),"groups":__('Type groups'),"recharge":__('Type recharge'),"withdraw":__('Type withdraw'),"refund":__('Type refund'),"sys":__('Type sys')}, formatter: Table.api.formatter.normal},
                        {field: 'service_ids', title: __('Service_ids'), operate: 'LIKE'},
                        {field: 'created', title: __('created'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate,buttons: [
							{name: 'detail',title: __('查看'),text: __('查看'),classname: 'btn btn-xs btn-info btn-dialog',
							icon: 'fa fa-eye',url: 'flshop/finance/billDetail'},
							{
								name: 'type',
								title: function (row) {
									return `${__('Type ' + row.type)}详情`;
								},
								text: function (row) {
									return `${__('Type ' + row.type)}详情`;
								},
								classname: 'btn btn-xs btn-danger btn-dialog',
								icon: 'fa fa-eye',
								extend: 'data-area=\'["980px", "650px"]\'',
								url: function (row) {
									var url = '链接异常';
									switch(row.type) {
									    case "pay": url = 'flshop/order/detail/order_no'; break; // 商品交易
										case "groups": url = 'flshop/groupsorder/detail/order_no'; break; // 拼团交易
										case "withdraw": url = 'flshop/finance/withdrawDetail/ids'; break; // 提现
										case "refund": url = 'flshop/refund/detail/order_no'; break; // 退款 1.1.3升级
									}
									return `${url}/${row.service_ids}`;
								},
								visible: function (row) {
								    return row.type && row.type !== 'sys' && row.type !== 'recharge';
								}
							},
						],formatter: Table.api.formatter.operate}
		            ]
		        ]
		    });
		    // 为表格绑定事件
		    Table.api.bindevent(table);
			$(".btn-paypal").click(function() {
				Fast.api.open(`flshop/finance/payment`, `提现`, {
					area: ["420px", "720px"],
					callback: res =>{
						table.bootstrapTable('refresh', {});
					}
				});
			});
			
		},
		withdraw: function () {
		    // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/finance/withdraw' + location.search,
                    add_url: '',
                    edit_url: '',
                    del_url: '',
                    multi_url: '',
                    import_url: '',
                    table: 'withdraw',
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
                        {field: 'id', title: __('ID')},
                        {field: 'money', title: __('Money'), operate:'BETWEEN'},
                        {field: 'handingfee', title: __('Handingfee'), operate:'BETWEEN'},
                        {field: 'taxes', title: __('Taxes'), operate:'BETWEEN'},
                        {field: 'type', title: __('Type')},
                        {field: 'account', title: __('Account')},
						{field: 'created', title: __('created'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
						{field: 'status', title: __('提现状态'), searchList: {"created":__('Status created'),"successed":__('Status successed'),"rejected":__('Status rejected')}, formatter: Table.api.formatter.status},
                        // {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
						// {field: 'transfertime', title: __('Transfertime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
						{field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate,buttons: [
							{name: 'detail',title: __('提现详情'),text: __('提现详情'),
							classname: 'btn btn-xs btn-info btn-dialog',icon: 'fa fa-eye',url: 'flshop/finance/withdrawDetail'}
						],formatter: Table.api.formatter.operate}
                    ]
                ]
            });
            // 为表格绑定事件
            Table.api.bindevent(table);
			$(".btn-bankuser").click(function() {
				Fast.api.open(`flshop/finance/user`, `提现账户`, {
					callback: res =>{
						table.bootstrapTable('refresh', {});
					}
				});
			});
			$(".btn-paypal").click(function() {
				Fast.api.open(`flshop/finance/payment`, `提现`, {
					area: ["420px", "720px"],
					callback: res =>{
						table.bootstrapTable('refresh', {});
					}
				});
			});
		},
		payment: function () {
			var vm = new Vue({
				el: '#app',
				data() {
					return {
						bankData: Config.bankData,
						usermoney: Config.usermoney,
						money: null,
						servicemoney: 0,
						servicefee: Config.servicefee,
						loading: false
					}
				},
				mounted() {
					
				},
				methods: {
					choiceUser(){
						parent.Fast.api.open("flshop/finance/user?multiple=true", __("提现账户"), {
							callback: res => {
								this.bankData = res;
							}
						});
					},
					replaceInput(e){
						this.money = e.currentTarget.value;
						this.servicemoney = e.currentTarget.value > 0 ? (e.currentTarget.value * this.servicefee / 1000).toFixed(2) : 0;
					},
					emptyInput(){
						this.money = null;
					},
					moneyAll(){
						this.servicemoney =this.usermoney > 0 ? (this.usermoney * this.servicefee / 1000).toFixed(2) : 0;
						this.money = (this.usermoney - this.servicemoney).toFixed(2);
					},
					getCode(str){
						str = str.replace(/\s+/g,"");
						return str.substring(str.length-4);
					},
					getType(key){
						return ['储蓄卡', '信用卡'][key];
					},
					withdraw(){
						// 1.0.5升级 修复针对多次点击
						if(this.loading) return;
						// 1.0.6升级
						let money = parseFloat(this.money),
							usermoney = parseFloat(this.usermoney);
							console.log(money,usermoney);
						if(!this.bankData){
							layer.msg('请选择账号');
							return;
						}
						if(!money){
							layer.msg('金额不能为空');
							return;
						}
						if(money <= 0){
							layer.msg('请填写正确金额');
							return;
						}
						if(money > usermoney){
							layer.msg('提现金额不能超过 ' + usermoney + ' 元');
							return;
						}
						this.loading = true;
						Fast.api.ajax({
						    url: "flshop/finance/payment",
							data: {
								money: money,
								account_id: this.bankData.id
							}
						}, function(data, ret){
							this.loading = false;
							Fast.api.close();
						});
					},
				}
			});
		},
		user: function () {
			// 初始化表格参数配置
			Table.api.init({
			    extend: {
			        index_url: 'flshop/finance/user' + location.search,
			        add_url: 'flshop/finance/userAdd',
			        edit_url: 'flshop/finance/userEdit',
			        del_url: 'flshop/finance/userDel',
			        multi_url: '',
			        table: 'flshop_page',
			    }
			});
			var table = $("#table");
			// 初始化表格
			table.bootstrapTable({
			    url: $.fn.bootstrapTable.defaults.extend.index_url,
			    sortName: 'id',
			    showToggle: false,
			    showExport: false,
				fixedColumns: true,
                fixedRightNumber: 1,
				columns: [
				    [
				        {checkbox: true},
						{field: 'id', title: __('Id')},
						{field: 'bankName', title: __('Bankname'), operate: 'LIKE'},
						{field: 'cardCode', title: __('Cardcode'), operate: 'LIKE'},
						{field: 'username', title: __('Username'), operate: 'LIKE'},
				        {field: 'mobile', title: __('Mobile'), operate: 'LIKE'},
						{
				            field: 'operate', title: __('Operate'), events: {
				                'click .btn-chooseone': function (e, value, row, index) {
				                    Fast.api.close(row);
				                },
								'click .btn-edit': function (e, value, row, index) {
								    parent.Fast.api.open(`${$.fn.bootstrapTable.defaults.extend.edit_url}/ids/${row.id}`, __("编辑"), {
								    	callback: res => {
								    		Layer.close();
								    	}
								    });
								},
								'click .btn-del': function (e, value, row, index) {
								   Layer.open({
								       title: '提示',
								       content: '确认删除',
								       yes:function(index){
								            Fast.api.ajax({
                                                url: "flshop/finance/userDel",
                                                data: {ids: row.id},
                                            }, function (data, ret) {
                                                 parent.Layer.close(parent.Layer.getFrameIndex(window.name));                        
                                            });
								       }
								   });
								},
				            }, formatter: function () {
								var multiple = Backend.api.query('multiple');
								var btn = '';
								var operation = '<a href="javascript:;" class="btn btn-success btn-edit btn-xs"><i class="fa fa-pencil"></i> 编辑</a> <a href="javascript:;" class="btn btn-danger btn-del btn-xs"><i class="fa fa-trash"></i> 删除</a>';
								if(multiple == 'true'){
									btn = '<a href="javascript:;" class="btn btn-info btn-chooseone btn-xs"><i class="fa fa-check"></i> 选择</a> ';
								}
				                return btn + operation;
				            }
				        }
				    ]
				]
			});
			// 为表格绑定事件
			Table.api.bindevent(table);
		},
		useradd: function () {
			Controller.api.bindevent();
			var vm = new Vue({
				el: '#app',
				data() {
					return {
						bankCode: '',
						bankName: '',
						bankList: {ALIPAY: '支付宝账户',WECHAT: '微信账户',ICBC: '工商银行',ABC: '农业银行',PSBC: '邮储银行',CCB: '建设银行',CMB: '招商银行',BOC: '中国银行',COMM: '交通银行',SPDB: '浦发银行',GDB: '广发银行',CMBC: '民生银行',PAB: '平安银行',CEB: '光大银行',CIB: '兴业银行',CITIC: '中信银行'}
					}
				},
				methods: {
					changeSelect(e){
						this.bankCode = e.target.value;
						this.bankName = this.bankList[e.target.value];
					}
				}
			});
		},
		useredit: function () {
			Controller.api.bindevent();
			var vm = new Vue({
				el: '#app',
				data() {
					return {
						bankCode: Config.bankCode,
						bankName: Config.bankName,
						bankList: {ALIPAY: '支付宝账户',WECHAT: '微信账户',ICBC: '工商银行',ABC: '农业银行',PSBC: '邮储银行',CCB: '建设银行',CMB: '招商银行',BOC: '中国银行',COMM: '交通银行',SPDB: '浦发银行',GDB: '广发银行',CMBC: '民生银行',PAB: '平安银行',CEB: '光大银行',CIB: '兴业银行',CITIC: '中信银行'}
					}
				},
				methods: {
					changeSelect(e){
						this.bankCode = e.target.value;
						this.bankName = this.bankList[e.target.value];
					}
				}
			});
		},
		api: {
			formatter: {
				url: function (value, row, index) {
				    return '<a href="' + row.fullurl + '" target="_blank" class="label bg-green">' + value + '</a>';
				}
			},
		    bindevent: function () {
		        Form.api.bindevent($("form[role=form]"));
		    }
		}
	};
    return Controller;
});