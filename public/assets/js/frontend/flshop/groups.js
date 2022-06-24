define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'vue', 'template', 'jquery-jqprint', 'jquery-migrate'], function ($, undefined, Backend, Table, Form, Vue, Template, Jqprint, Migrate) {
	var Controller = {
		goods: function() {
			// 初始化表格参数配置
			Table.api.init({
				extend: {
					index_url: 'flshop/groups/goods' + location.search,
					add_url: 'flshop/groups/goodsAdd',
					edit_url: 'flshop/groups/goodsEdit',
					del_url: 'flshop/groups/goodsDel',
					multi_url: '',
					dragsort_url: "",
					table: 'flshop_groups',
				}
			});
			var table = $("#table");
			
			table.on('post-common-search.bs.table', function (event, table) {
			    $('ul.nav-tabs li a[data-value="normal"]').trigger('click');
			    $(".form-commonsearch select[name=status]").val("normal");
			});
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
						{field: 'id',title: __('Id')},
						{field: 'shop_category_id', title: __('Shop_category_id'), operate:'RANGE', visible: false},
						// {field: 'title',title: __('Title')},
						{field: 'image',title: __('Image'),events: Table.api.events.image,formatter: Table.api.formatter.image},
						{field: 'images',title: __('Images'),events: Table.api.events.image,formatter: Table.api.formatter.images},
						
						{field: 'is_ladder',title: __('Is_ladder'), formatter: Controller.api.formatter.isladder},
						{field: 'is_alone',title: __('Is_alone'), formatter: Controller.api.formatter.isalone},
						{field: 'purchase_limit',title: __('Purchase_limit'), formatter: Controller.api.formatter.limit},
						
						
						{field: 'category.name', title: __('Category.name'), formatter: Table.api.formatter.search},
						{field: 'shopsort.name', title: __('Shopsort.name'), formatter: Table.api.formatter.search},
						{field: 'price',title: __('Price'),operate: 'BETWEEN'},
						{field: 'views',title: __('Views')},{field: 'sales',title: __('Sales')},
						{field: 'comment',title: __('Comment')},{field: 'praise',title: __('Praise')},
						{field: 'like',title: __('Like')},
						// {field: 'created',title: __('created'),operate: 'RANGE',addclass: 'datetimerange',formatter: Table.api.formatter.datetime},
						{field: 'updatetime',title: __('Updatetime'),operate: 'RANGE',addclass: 'datetimerange',formatter: Table.api.formatter.datetime},
						{field: 'status',title: __('Status'),searchList: {"normal": __('Normal'),"hidden": __('Hidden')},formatter: Table.api.formatter.status},
						{field: 'operate',title: __('Operate'),table: table, events: Table.api.events.operate,formatter: Table.api.formatter.operate}
					]
				]
			});
			// 为表格绑定事件
			Table.api.bindevent(table);
			table.on('load-success.bs.table',function(data){
			   $(".btn-editone").data("area", ["90%","80%"]);
			   $(".btn-add").data("area", ["90%","80%"]);
			});
		},
		goodsrecyclebin: function() {
			// 初始化表格参数配置
			Table.api.init({
				extend: {
					'dragsort_url': ''
				}
			});
			var table = $("#table");
			// 初始化表格
			table.bootstrapTable({
				url: 'flshop/groups/goodsRecyclebin' + location.search,
				pk: 'id',
				sortName: 'id',
				columns: [
					[{
							checkbox: true
						},
						{
							field: 'id',
							title: __('Id')
						},
						{
							field: 'title',
							title: __('Title'),
							align: 'left'
						},
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
							buttons: [{
									name: 'Restore',
									text: __('Restore'),
									classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
									icon: 'fa fa-rotate-left',
									url: 'flshop/groups/goodsRestore',
									refresh: true
								},
								{
									name: 'Destroy',
									text: __('Destroy'),
									classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
									icon: 'fa fa-times',
									url: 'flshop/groups/goodsDestroy',
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
		goodscopy: function() {
			// 初始化表格参数配置
			Table.api.init({
			    extend: {
			        index_url: 'flshop/goods/select',
			    }
			});
			var table = $("#table");
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
						    field: 'copy', 
							title: __('复制'), 
							events: {
						        'click .btn-copy': function (e, value, row, index) {
						            Fast.api.close();
									parent.Fast.api.open(`flshop/groups/goodsEdit/type/copy/ids/${row.id}`, "编辑 复制商品", {area: ['90%', '80%']});
						        },
						    }, formatter: function () {
						        return '<a href="javascript:;" class="btn btn-danger btn-copy btn-xs"><i class="fa fa-clipboard"></i> ' + __('复制') + '</a>';
						    }
						}
			        ]
			    ]
			});
			Table.api.bindevent(table);
		},
		goodsadd: function() {
			var vm = new Vue({
				el: '#app',
				data() {
					return {
						spu: [],
						spuItem: [],
						sku: [],
						skuImg: [],
						batch: 0,
						is_ladder: 0,
						ladderList: [
							{
								people_num: 2,
								discount: 90
							}
						],
						categoryId: '',
						categoryList :Config.channelList,
						categoryOne: null,
						categoryTwo: null,
						categoryThree: null,
						categoryFour: null,
						categoryFive: null,
						attributeData: []
					}
				},
				methods: {
					// 页面上传图片
					changeImage(event, key){
						let files = event.target.files[0]; //获取input的图片file值
						let formData = new FormData();
						let upload = Config.upload;
						if(upload.storage !== 'local'){
							let multipart = Object.entries(upload.multipart)[0];
							formData.append(multipart[0], multipart[1]);
						}
						formData.append('file', files, files.name);
						Fast.api.ajax({
						    url: upload.uploadurl, 
							data:formData,
							processData:false,
							contentType:false,
						}, function(data, ret){
							Vue.set(vm.skuImg, key, data.url);
						});
					},
					getCategory(e){
						if(e == 1){
							this.categoryTwo = null;
							this.categoryThree = null;
							this.categoryFour = null;
							this.categoryFive = null;
						}
						if(this.categoryOne != null){
							this.categoryId = this.categoryList[this.categoryOne].id;
						}
						if(this.categoryTwo != null){
							this.categoryId = this.categoryList[this.categoryOne].childlist[this.categoryTwo].id;
						}
						if(this.categoryThree != null){
							this.categoryId = this.categoryList[this.categoryOne].childlist[this.categoryTwo].childlist[this.categoryThree].id;
						}
						if(this.categoryFour != null){
							this.categoryId = this.categoryList[this.categoryOne].childlist[this.categoryTwo].childlist[this.categoryThree].childlist[this.categoryFour].id;
						}
						if(this.categoryFive != null){
							this.categoryId = this.categoryList[this.categoryOne].childlist[this.categoryTwo].childlist[this.categoryThree].childlist[this.categoryFour].childlist[this.categoryFive].id;
						}
						// 查询类目属性
						Fast.api.ajax("flshop.goods/attribute?id=" + this.categoryId, (data, ret) =>{
							this.attributeData = data;
						    //返回false时将不再有右上角的操作成功的提示
						    return false;
						});
					},
					ladderAdd(){
						let ladder = this.ladderList,
							num = ladder.length,
							discount = 100 - (ladder.length + 1) * 10;
						ladder.push({
							people_num: num + 2,
							discount: discount < 10 ? 10 : discount
						})
					},
					ladderDel(key){
						if(this.ladderList.length > 1){
							Vue.delete(vm.ladderList, key); 
						}else{
							layer.msg('至少剩余一组规则');
						}
					},
					// 添加属性
					spuAdd(){
						var str = this.$refs['specs-name'].value || ''
						str = str.trim();
						if (!str){
							layer.msg('产品属性不能为空！');
							return
						}
						// 遍历
						var arr = str.split(/\s+/);
						for (var i=0;i<arr.length;i++)
						{ 
						    this.spu.push(arr[i])
						}
						// 清空表单
						this.$refs['specs-name'].value = ''
					},
					// 删除属性
					spuRemove(key){
						Vue.delete(vm.spuItem, key); 
						Vue.delete(vm.spu, key); 
						this.skuCreate();
					},
					// 添加规格
					skuAdd(index) {
						var str = this.$refs['specs-name-' + index][0].value || ''
						str = str.trim();
						if (!str){
							layer.msg('产品属性不能为空！');
							return
						}
						// 遍历
						var arr = str.split(/\s+/);
						for (var i=0;i<arr.length;i++)
						{ 
							if (this.spuItem[index]) {
								this.spuItem[index].push(arr[i])
							} else {
								this.spuItem.push([arr[i]])
							}
						}
						// 清空表单
						this.$refs['specs-name-' + index][0].value = ""
						this.skuCreate();
					},
					// 删除规格
					skuRemove(i,key){
						Vue.delete(vm.spuItem[i], key); 
						this.skuCreate();
					},
					// 生成Sku
					skuCreate() {
						this.sku = this.skuDesign(this.spuItem)
					},
					skuDesign(array) {
						if (array.length == 0) return []
						if (array.length < 2) {
							var res = []
							array[0].forEach(function(v) {
								res.push([v])
							})
							return res
						}
						return [].reduce.call(array, function(col, set) {
							var res = [];
							col.forEach(function(c) {
								set.forEach(function(s) {
									var t = [].concat(Array.isArray(c) ? c : [c]);
									t.push(s);
									res.push(t);
								})
							});
							return res;
						});
					},
					// 是否开启批量
					skuBatch(){
						this.batch = this.batch == 0 ? 1 : 0;
					},
					cdnurl(url) {
						if(url) return Fast.api.cdnurl(url);
					}
				}
			})
			window.batchSet = function(field) {
				$('.wanl-' + field).val($('#batch-' + field).val())
			}
			// 完善寄件信息
			$(document).on("click", ".btn-send", function () {
				Backend.api.open('flshop/config/index/type/mailing/', __('完善寄件人信息'), {
					callback:function(value){
						console.log(value);
					}
				});
			});
			// 完善退件信息
			$(document).on("click", ".btn-return", function () {
				Backend.api.open('flshop/config/index/type/return/', __('完善退货信息'), {
					callback:function(value){
						console.log(value);
					}
				});
			});
			// 申请品牌
			$(document).on("click", ".btn-brand", function () {
				Backend.api.open('flshop/brand/add/', __('申请品牌'), {
					callback:function(value){
						console.log(value);
					}
				});
			});
			// 新建运费模板
			$(document).on("click", ".btn-freight", function () {
				Backend.api.open('flshop/freight/add', __('新建运费模板'), {
					callback:function(value){
						console.log(value);
					}
				});
			});
			// 新建店铺分类
			$(document).on("click", ".btn-shopsort", function () {
				Backend.api.open('flshop/shopsort/add', __('新建店铺分类'), {
					callback:function(value){
						console.log(value);
					}
				});
			});
			// 打开方式
			if(Config.isdialog){
				Controller.api.bindevent();
			}else{
				Form.api.bindevent($("form[role=form]"), function (data, ret) {
				    setTimeout(function () {
				    	location.href = Fast.api.fixurl('flshop.goods/index.html');
				    }, 500);
				});
			}
		},
		goodsedit: function() {
			var vm = new Vue({
				el: '#app',
				data() {
					return {
						spu: Config.spu,
						spuItem: Config.spuItem,
						sku: Config.sku,
						skuItem: Config.skuItem,
						is_ladder: Config.is_ladder,
						ladderList: Config.ladderList,
						categoryId: Config.categoryId,
						categoryList: Config.channelList,
						categoryOne: null,
						categoryTwo: null,
						categoryThree: null,
						categoryFour: null,
						categoryFive: null,
						attribute: Config.attribute,
						attributeData: [],
						batch: 0
					}
				},
				mounted() {
					this.categoryList.forEach((item,index)=>{
						if (item.id == Config.categoryId ) {
							this.categoryOne = index;
						}else{
							item.childlist.forEach((item1,index1)=>{
								if (item1.id == Config.categoryId ) {
									this.categoryOne = index;
									this.categoryTwo = index1;
								}else{
									item1.childlist.forEach((item2,index2)=>{
										if (item2.id == Config.categoryId ) {
											this.categoryOne = index;
											this.categoryTwo = index1;
											this.categoryThree = index2;
										}else{
											item2.childlist.forEach((item3,index3)=>{
												if (item3.id == Config.categoryId ) {
													this.categoryOne = index;
													this.categoryTwo = index1;
													this.categoryThree = index2;
													this.categoryFour = index3;
												}else{
													item3.childlist.forEach((item4,index4)=>{
														if (item4.id == Config.categoryId ) {
															this.categoryOne = index;
															this.categoryTwo = index1;
															this.categoryThree = index2;
															this.categoryFour = index3;
															this.categoryFive = index4;
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
		            Fast.api.ajax("flshop.goods/attribute?id=" + this.categoryId, (data, ret) =>{
		            	this.attributeData = data;
		                //返回false时将不再有右上角的操作成功的提示
		                return false;
		            });
		        },
				methods: {
					// 页面上传图片
					changeImage(event, key){
						let files = event.target.files[0]; //获取input的图片file值
						let formData = new FormData();
						let upload = Config.upload;
						if(upload.storage !== 'local'){
							let multipart = Object.entries(upload.multipart)[0];
							formData.append(multipart[0], multipart[1]);
						}
						formData.append('file', files, files.name);
						Fast.api.ajax({
						    url: upload.uploadurl, 
							data:formData,
							processData:false,
							contentType:false,
						}, function(data, ret){
							// 1.0.8 修复
							if(vm.skuItem[key]){
								vm.skuItem[key]['thumbnail'] = data.url;
							}else{
								Vue.set(vm.skuItem, key, {
									thumbnail: data.url
								})
							}
						});
					},
					getCategory(e){
						if(e == 1){
							this.categoryTwo = null;
							this.categoryThree = null;
							this.categoryFour = null;
							this.categoryFive = null;
						}
						if(this.categoryOne != null){
							this.categoryId = this.categoryList[this.categoryOne].id;
						}
						if(this.categoryTwo != null){
							this.categoryId = this.categoryList[this.categoryOne].childlist[this.categoryTwo].id;
						}
						if(this.categoryThree != null){
							this.categoryId = this.categoryList[this.categoryOne].childlist[this.categoryTwo].childlist[this.categoryThree].id;
						}
						if(this.categoryFour != null){
							this.categoryId = this.categoryList[this.categoryOne].childlist[this.categoryTwo].childlist[this.categoryThree].childlist[this.categoryFour].id;
						}
						if(this.categoryFive != null){
							this.categoryId = this.categoryList[this.categoryOne].childlist[this.categoryTwo].childlist[this.categoryThree].childlist[this.categoryFour].childlist[this.categoryFive].id;
						}
						// 查询类目属性
						Fast.api.ajax("flshop.goods/attribute?id=" + this.categoryId, (data, ret) =>{
							this.attributeData = data;
						    //返回false时将不再有右上角的操作成功的提示
						    return false;
						});
					},
					ladderAdd(){
						let ladder = this.ladderList,
							num = ladder.length,
							discount = 100 - (ladder.length + 1) * 10;
						ladder.push({
							people_num: num + 2,
							discount: discount < 10 ? 10 : discount
						})
					},
					ladderDel(key){
						if(this.ladderList.length > 1){
							Vue.delete(vm.ladderList, key); 
						}else{
							layer.msg('至少剩余一组规则');
						}
					},
					// 添加属性
					spuAdd(){
						var str = this.$refs['specs-name'].value || ''
						str = str.trim();
						if (!str){
							layer.msg('产品属性不能为空！');
							return
						}
						// 遍历
						var arr = str.split(/\s+/);
						for (var i=0;i<arr.length;i++)
						{ 
						    this.spu.push(arr[i])
						}
						// 清空表单
						this.$refs['specs-name'].value = ''
					},
					// 添加规格
					skuAdd(index) {
						console.log(this.spuItem);
						var str = this.$refs['specs-name-' + index][0].value || ''
						str = str.trim();
						if (!str){
							layer.msg('产品属性不能为空！');
							return
						}
						// 遍历
						var arr = str.split(/\s+/);
						for (var i=0;i<arr.length;i++)
						{ 
							if (this.spuItem[index]) {
								this.spuItem[index].push(arr[i])
							} else {
								this.spuItem.push([arr[i]])
							}
						}
						// 清空表单
						this.$refs['specs-name-' + index][0].value = ""
						this.skuCreate();
					},
					
					
					// 删除属性
					spuRemove(key){
						Vue.delete(vm.spuItem, key); 
						Vue.delete(vm.spu, key); 
						this.skuCreate();
					},
					// 删除规格
					skuRemove(i,key){
						Vue.delete(vm.spuItem[i], key); 
						this.skuCreate();
					},
					// 生成Sku
					skuCreate() {
						this.sku = this.skuDesign(this.spuItem)
					},
					skuDesign(array) {
						if (array.length == 0) return []
						if (array.length < 2) {
							var res = []
							array[0].forEach(function(v) {
								res.push([v])
							})
							return res
						}
						return [].reduce.call(array, function(col, set) {
							var res = [];
							col.forEach(function(c) {
								set.forEach(function(s) {
									var t = [].concat(Array.isArray(c) ? c : [c]);
									t.push(s);
									res.push(t);
								})
							});
							return res;
						});
					},
					// 是否开启批量
					skuBatch(){
						this.batch = this.batch == 0 ? 1 : 0;
					},
					cdnurl(url) {
						if(url) return Fast.api.cdnurl(url);
					}
				}
			})
			window.batchSet = function(field) {
				$('.wanl-' + field).val($('#batch-' + field).val())
			}
			// 申请品牌
			$(document).on("click", ".btn-brand", function () {
				Backend.api.open('flshop/brand/add/', __('申请品牌'), {
					callback:function(value){
						console.log(value);
					}
				});
			});
			// 新建运费模板
			$(document).on("click", ".btn-freight", function () {
				Backend.api.open('flshop/freight/add', __('新建运费模板'), {
					callback:function(value){
						console.log(value);
					}
				});
			});
			// 新建店铺分类
			$(document).on("click", ".btn-shopsort", function () {
				Backend.api.open('flshop/shopsort/add', __('新建店铺分类'), {
					callback:function(value){
						console.log(value);
					}
				});
			});
			
			Controller.api.bindevent();
		},
		groups: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'flshop/groups/groups' + location.search,
                    add_url: '',
                    edit_url: '',
                    del_url: '',
                    multi_url: '',
                    import_url: '',
                    table: 'flshop_groups',
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
                        {field: 'group_no', title: __('Group_no'), operate: 'LIKE'},
                        {field: 'group_type', title: __('Group_type'), searchList: {"alone":__('Group_type alone'),"group":__('Group_type group'),"ladder":__('Group_type ladder')}, formatter: Table.api.formatter.normal},
                        {field: 'id', title: __('商品'), operate: false, align:'left', formatter: Controller.api.formatter.goods},
                        {field: 'id', title: __('拼团团长'), operate: false, formatter: Controller.api.formatter.user},
                        {field: 'id', title: __('拼团进度'), operate: false, formatter: Controller.api.formatter.groups},
                        {field: 'state', title: __('State'), searchList: {"ready":__('State ready'),"start":__('State start'),"success":__('State success'),"fail":__('State fail'),"auto":__('State auto')}, formatter: Table.api.formatter.normal},
                        {field: 'validitytime', title: __('Validitytime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'grouptime', title: __('Grouptime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {
							field: 'operate', 
							title: __('Operate'), 
							table: table, 
							events: Table.api.events.operate,
							buttons: [
								{
								    name: 'detail',
								    text: __('查看拼团'),
								    title: __('查看拼团'),
								    classname: 'btn btn-xs btn-info btn-dialog',
								    extend: 'data-area=\'["420px", "700px"]\'',
								    icon: 'fa fa-users',
								    url: 'flshop/groups/groupsDetail'
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
        groupsdetail: function () {
            Controller.api.bindevent();
        },
		api: {
			bindevent: function() {
				Form.api.bindevent($("form[role=form]"));
			},
			formatter: {
				isladder: function (value, row, index) {
				    return row.is_ladder == 0 ? '<span class="text-aqua">普通拼团</span>' : '<span class="text-red">阶梯拼团</span>';
				},
				isalone: function (value, row, index) {
				     return row.is_alone == 0 ? '关闭' : '开启';
				},
				limit: function (value, row, index) {
					return row.purchase_limit == 0 ? '<span>不限</span>' : `<span class="text-red">限制${row.purchase_limit}人</span>`;
				},
                groups: function (value, row, index) {
				    return `${row.people_num} / ${row.join_num}`;
				},
				goods: function (value, row, index) {
				    if(row.goods){
				        return `<a href="javascript:" style="margin-right: 6px;"><img class="img-sm img-center" src="${Fast.api.cdnurl(row.goods.image)}"></a> ${row.goods.title}`;
				    }else{
				        return '商品已下架'
				    }
				},
				user: function (value, row, index) {
				    return `<a href="javascript:" style="margin-right: 6px;"><img class="img-sm img-center" src="${Fast.api.cdnurl(row.user.avatar)}"></a> ${row.user.nickname}`;
				}
			}
		}
	};
	return Controller;
});
