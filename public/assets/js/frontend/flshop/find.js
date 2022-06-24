define(['jquery', 'bootstrap', 'table', 'backend', 'form', 'vue'], function($, undefined, Table, Backend, Form, Vue) {
	var Controller = {
		index: function() {
			// 初始化表格参数配置
			Table.api.init({
				extend: {
					index_url: 'flshop/find/index' + location.search,
					add_url: 'flshop/find/add',
					edit_url: '',
					del_url: 'flshop/find/del',
					multi_url: '',
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
					[{
							checkbox: true
						},
						{
							field: 'id',
							title: __('Id')
						},
						{
							field: 'type',
							title: __('Type'),
							searchList: {
								"new": __('Type new'),
								"live": __('Type live'),
								"video": __('Type video'),
								"want": __('Type want'),
								"activity": __('Type activity'),
								"show": __('Type show')
							},
							formatter: Table.api.formatter.normal
						},
						{
							field: 'images',
							title: __('Images'),
							align: 'left',
							operate: false,
							events: Table.api.events.image,
							formatter: Table.api.formatter.images
						},
						{
							field: 'user_no',
							title: __('User_no'),
							operate: 'LIKE'
						},
						{
							field: 'views',
							title: __('Views')
						},
						{
							field: 'likes',
							title: __('Likes')
						},
						{
							field: 'comments',
							title: __('Comments')
						},
						{
							field: 'state',
							title: __('State'),
							searchList: {
								"publish": __('State publish'),
								"examine": __('State examine'),
								"hazard": __('State hazard'),
								"transcoding": __('State transcoding'),
								"screenshot": __('State screenshot'),
								"normal": __('State normal')
							},
							formatter: Table.api.formatter.normal
						},
						{
							field: 'updatetime',
							title: __('Updatetime'),
							operate: 'RANGE',
							addclass: 'datetimerange',
							autocomplete: false,
							formatter: Table.api.formatter.datetime
						},
						{
							field: 'operate',
							title: __('Operate'),
							table: table,
							events: Table.api.events.operate,
							buttons: [{
									name: 'detail',
									text: __('查看'),
									title: __('查看作品'),
									classname: 'btn btn-xs btn-info btn-dialog',
									icon: 'fa fa-paper-plane',
									url: 'flshop/find/detail',
									callback: function(data) {
										$(".btn-refresh").trigger("click");
									}
								},
								{
									name: 'live',
									text: __('播放'),
									title: __('播放'),
									classname: 'btn btn-xs btn-success btn-dialog',
									icon: 'fa fa-video-camera',
									extend: 'data-area=\'["380px", "720px"]\'',
									url: 'flshop/find/play',
									url: function(row) {
										return `flshop/find/play?live_id=${row.live_id}`;
									},
									visible: function(row) {
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
									url: function(row) {
										return `flshop/find/play?video_id=${row.video_id}`;
									},
									visible: function(row) {
										return row.type === 'video';
									}
								},
								{
									name: 'comments',
									text: __('查看评论'),
									title: __('评论'),
									classname: 'btn btn-xs btn-success btn-dialog',
									icon: 'fa fa-comments',
									url: 'flshop/find/comments',
									callback: function(data) {
										$(".btn-refresh").trigger("click"); //刷新数据
									},
									visible: function(row) {
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
									success: function(data, ret) {
										$(".btn-refresh").trigger("click"); //刷新数据
									},
									error: function(data, ret) {
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
			$("#video").click(function() {
				Fast.api.open(`flshop/find/add.html?type=video`, `发布短视频`, {
					area: ["390px", "720px"],
					callback: res =>{
						table.bootstrapTable('refresh', {});
					}
				});
			});
			$("#new").click(function() {
				Fast.api.open(`flshop/find/add.html?type=new`, `发布上新`, {
					area: ["390px", "720px"],
					callback: res =>{
						table.bootstrapTable('refresh', {});
					}
				});
			});
			$("#want").click(function() {
				Fast.api.open(`flshop/find/add.html?type=want`, `发布种草`, {
					area: ["390px", "720px"],
					callback: res =>{
						table.bootstrapTable('refresh', {});
					}
				});
			});
			$("#show").click(function() {
				Fast.api.open(`flshop/find/add.html?type=show`, `发布买家秀`, {
					area: ["390px", "720px"],
					callback: res =>{
						table.bootstrapTable('refresh', {});
					}
				});
			});
			// 为表格绑定事件
			Table.api.bindevent(table);
		},
		recyclebin: function() {
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
					[{
							checkbox: true
						},
						{
							field: 'id',
							title: __('Id')
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
		add: function() {
			Controller.api.bindevent();
			var vm = new Vue({
				el: '#app',
				data() {
					return {
						type: Config.type,
						typeList: {
							new: '上新',
							live: '直播',
							video: '短视频',
							want: '种草',
							activity: '活动',
							show: '买家秀'
						},
						params: {
							type: Config.type,
							content: '',
							goods_ids: [],
							video_id: null,
							comments_id: null,
							images: []
						},
						file: null,
						upload: true,
						progress: '0%',
						goodsList:[],
						commentsData: null,
					}
				},
				methods: {
					// 核心代码未经授权不得抄袭包含相似类似，特点后端封装formData+xhr
					fileChange(e) {
						let file = e.target.files[0];
						this.file = URL.createObjectURL(file)
						Fast.api.ajax({
						    url: "flshop/find/uploadVideo",
							data: {name: file.name}
						}, (data, ret) => {
							this.params.video_id = data.videoId;
							let formData = new FormData();
							formData.append("OSSAccessKeyId", data.formData.OSSAccessKeyId);
							formData.append("policy", data.formData.policy);
							formData.append("key", data.formData.key);
							formData.append("x-oss-security-token", data.formData.osstoken);
							formData.append("success_action_status", data.formData.success_action_status);
							formData.append("Signature", data.formData.Signature);
							formData.append("file", file); 
							$.ajax({
							    url: data.ossUrl,
								method: 'POST',
							    data: formData,
								contentType: false,
								processData: false,
								xhr: () => {                        
									let xhr = new window.XMLHttpRequest();
									let that = this;
									xhr.upload.addEventListener("progress", function(e){
										that.progress = Math.round((e.loaded / e.total) * 100) +'%';
									}, false);
									return xhr;
								},
							    success: res => {
									layer.msg('上传成功');
									this.upload = false;
							    },    
							    error: err => {   
									console.log(err);
							    }    
							}); 
						    return false;
						}, (data, ret) => {
						    return false;
						});
					},
					handleSubmit() {
						let params = this.params;
						if (params.type === 'show') {
							if (!params.comments_id) {
								layer.msg('请选择评论');
								return;
							}
						} else {
							if(params.type === 'new'){
								this.goodsList.forEach((item, index, arr) => {
								    params.images.push(item.image)
								});
							}
							if (params.type === 'video' && this.upload) {
								layer.msg('请上传视频');
								return;
							}
							if (params.type === 'want' && params.images.length ===0) {
								layer.msg('请上传种草图片');
								return;
							}
							if (!params.content) {
								layer.msg('请填写文案');
								return;
							}
							if (params.goods_ids.length === 0) {
								layer.msg('请选择商品');
								return;
							}
						}
						Fast.api.ajax({
						    url: "flshop/find/add",
						    data: params
						}, (data, ret) => {
							Fast.api.close();
						}, (err) => {
							console.log(err);
						});
 					},
					// 操作图片
					delImg(index) {
						Vue.delete(vm.params.images, index); //vue方法
					},
					addImg() {
						parent.Fast.api.open(
							"flshop/attachment/select?element_id=fachoose-image&multiple=true&mime_type=image/*",
							__('选择图片'), {
								callback: (data) => {
									if (data.url) {
										var image = data.url.split(",");
										if (image.length > 9) {
											layer.msg('最多上传9张图片，超出自动删除');
										}
										this.params.images = image.slice(0, 9);
									}
								}
							});
					},
					// 操作商品
					delGoods(index) {
						Vue.delete(vm.params.goods_ids, index); //vue方法
						Vue.delete(vm.goodsList, index); //vue方法
					},
					addGoods() {
						parent.Fast.api.open("flshop/goods/select?multiple=true", __(
							'选择商品'), {
							callback: (data) => {
								this.goodsList = data.data;
								this.params.goods_ids = String(data.url).split(",");
							}
						});
					},
					// 操作评论
					delComments() {
						this.params.comments_id = null;
						this.params.goods_ids = [];
						this.params.content = null;
						this.params.images = [];
					},
					addComments() {
						parent.Fast.api.open("flshop/comment/select?multiple=flase", __(
							'选择评论'), {
							callback: (data) => {
								this.params.comments_id = data.data.id;
								this.params.goods_ids = [data.data.goods_id];
								this.params.content =
									`${data.data.user.replace(/^(.).*(.)$/,'$1***$2')}：${data.data.content}`;
								this.params.images = data.data.images;
							}
						});
					},
					cdnurl(url) {
						if (url) return Fast.api.cdnurl(url);
					}
				}
			});
		},
		play: function() {
			Controller.api.bindevent();
		},
		comments: function() {
			var vm = new Vue({
				el: '#app',
				data() {
					return {
						dataList: Config.list
					}
				},
				methods: {
					handleDel(type, index, keys) {
						let ids = [];
						if (type === 'main') {
							let data = this.dataList[index];
							ids = [data.id];
							for (j = 0, len = data.childlist.length; j < len; j++) {
								ids.push(data.childlist[j].id);
							}
							Vue.delete(this.dataList, index);
						} else if (type === 'child') {
							ids = [this.dataList[index].childlist[keys].id];
							Vue.delete(this.dataList[index].childlist, keys);
						}
						// 加载网络
						Fast.api.ajax({
							url: 'flshop/find/delcomments',
							data: {
								'ids': ids.toString()
							}
						}, (data, ret) => {
							return false;
						});
					}
				}
			});
		},
		detail: function() {
			$(".play").click(function() {
				let id = $(".play").data("id"),
					type = $(".play").data("type");
				parent.Fast.api.open(`flshop/find/play?${type}_id=${id}`,
					`${type === 'live' ? '播放直播':'播放视频'}`, {
						area: ["380px", "720px"]
					});
			});
			Controller.api.bindevent();
		},
		api: {
			formatter: {
				formatHtml: function(value, row, index) {
					var arrEntities = {
						'lt': '<',
						'gt': '>',
						'nbsp': ' ',
						'amp': '&',
						'quot': '"'
					};
					return value.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
						return arrEntities[t];
					}).replace(/<\/?.+?>/g, "").replace(/ /g, "").substring(0, 12) + '...';
				}
			},
			bindevent: function() {
				Form.api.bindevent($("form[role=form]"));
			}
		}
	};
	return Controller;
});
