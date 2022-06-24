<?php
namespace app\index\controller\Flshop;
use app\common\controller\Flshop;
use think\Db;
use think\Exception;
use think\exception\PDOException;
use think\exception\ValidateException;
use fast\Tree;

/**
 * 拼团管理
 *
 * @icon fa fa-circle-o
 * @remark 拼团管理
 */
class Groups extends Flshop
{
    protected $noNeedLogin = '';
    protected $noNeedRight = '*';
	
    public function _initialize()
    {
        parent::_initialize();
		$tree = Tree::instance();
		$tree->init(model('app\index\model\flshop\Category')->where(['type' => 'goods', 'isnav' => 1])->field('id,pid,name')->order('weigh asc,id asc')->select());
		$this->assignconfig('channelList', $tree->getTreeArray(0));
		
		$this->groupsModel = new \app\index\model\flshop\groups\Groups;
		$this->goodsModel = new \app\index\model\flshop\groups\Goods;
		$this->goodsSpuModel = new \app\index\model\flshop\groups\GoodsSpu;
		$this->goodsSkuModel = new \app\index\model\flshop\groups\GoodsSku;
		$this->ladderModel = new \app\index\model\flshop\groups\Ladder;
    }
	
	/**
	 * 商品管理
	 */
	public function goods()
	{
		//当前是否为关联查询
		$this->relationSearch = true;
		//设置过滤方法
		$this->request->filter(['strip_tags', 'trim']);
		if ($this->request->isAjax())
		{
		    //如果发送的来源是Selectpage，则转发到Selectpage
		    if ($this->request->request('keyField'))
		    {
		        return $this->selectpage();
		    }
		    list($where, $sort, $order, $offset, $limit) = $this->buildparams();
		    $total = $this->goodsModel
		            ->where($where)
		            ->order($sort, $order)
		            ->count();
		
		    $list = $this->goodsModel
		            ->where($where)
		            ->order($sort, $order)
		            ->limit($offset, $limit)
		            ->select();
			foreach ($list as $row) {
			    $row->category->visible(['name']);
			    $row->shopsort->visible(['name']);
			}
		    $list = collection($list)->toArray();
		    $result = array("total" => $total, "rows" => $list);
		
		    return json($result);
		}
		$this->view->assign("statusList", $this->goodsModel->getStatusList());
		return $this->view->fetch();
	}
	
	/**
	 * 复制
	 */
	public function goodsCopy()
	{
		$this->view->assign("statusList", $this->goodsModel->getStatusList());
		return $this->view->fetch();
	}
	
	/**
	 * 添加
	 */
	public function goodsAdd()
	{
		//设置过滤方法
		$this->request->filter(['']);
	    if ($this->request->isPost()) {
	        $params = $this->request->post("row/a");
	        if ($params) {
				// 判断产品属性是否存在
				empty($params['spuItem']) ? $this->error(__('请完善：销售信息 - 产品属性')):'';
	            $result = false;
	            Db::startTrans();
	            try {
	                $spudata = isset($params['spu']) ? $params['spu'] : throw new Exception("请填写销售信息-产品属性");
	                $spuItem = isset($params['spuItem']) ? $params['spuItem'] : throw new Exception("请填写销售信息-产品属性-产品规格");
					
	                // 获取自增ID
	                $this->goodsModel->shop_id = $this->shop->id;
	                $this->goodsModel->brand_id = $params['brand_id'];
	                $this->goodsModel->category_id = $params['category_id'];
					if(isset($params['attribute'])){
						$this->goodsModel->category_attribute = json_encode($params['attribute'], JSON_UNESCAPED_UNICODE);
					}
					
					$this->goodsModel->is_alone = $params['is_alone'];
					$this->goodsModel->is_ladder = $params['is_ladder'];
					$this->goodsModel->purchase_limit = $params['purchase_limit'];
					$this->goodsModel->group_hour = $params['group_hour'];
					if(intval($params['is_ladder']) === 0){
						$this->goodsModel->people_num = $params['people_num'];
					}
					
	                $this->goodsModel->title = $params['title'];
	                $this->goodsModel->image = $params['image'];
	                $this->goodsModel->images = $params['images'];
	                $this->goodsModel->description = $params['description'];
	                $this->goodsModel->stock = $params['stock'];
	                $this->goodsModel->status = $params['status'];
	                $this->goodsModel->content = $params['content'];
	                $this->goodsModel->shop_category_id = $params['shop_category_id'];
	                $this->goodsModel->price = min($params['price']);
	                $this->goodsModel->freight_id = $params['freight_id'];
	                if($this->goodsModel->save()){
	                	$result = true;
	                }
					// 写入拼团阶梯 1.0.8
					if(isset($params['ladder']) && intval($params['is_ladder']) === 1){
						$ladder = [];
						foreach ($params['ladder'] as $item) {
						    $ladder[] = [
								'shop_id' => $this->shop->id,
								'goods_id' => $this->goodsModel->id,
								'people_num' => $item['people_num'],
								'discount' => $item['discount'],
							];
						}
						if(!$this->ladderModel->saveAll($ladder)){
							$result == false;
						}
					}else{
						if(intval($params['is_ladder']) === 1){
							throw new Exception("请编辑阶梯拼团规格");
						}
					}
					// 写入SPU
					$spu = [];
					foreach (explode(",", $spudata) as $key => $value) {
					    $spu[] = [
					        'goods_id'	=> $this->goodsModel->id,
					        'name'		=> $value,
					        'item'		=> $spuItem[$key]
					    ];
					}
					if(!$this->goodsSpuModel->allowField(true)->saveAll($spu)){
						$result == false;
					}
					// 写入SKU
					$sku = [];
					foreach ($params['sku']  as $key => $value) {
					    $sku[] = [
					        'goods_id' 		=> $this->goodsModel->id,
							'thumbnail' 	=> isset($params['thumbnail']) ? $params['thumbnail'][$key] : false, // 1.0.8升级
					        'difference' 	=> $value,
					        'market_price' 	=> $params['market_price'][$key],
					        'price' 		=> $params['price'][$key],
					        'stock' 		=> $params['stocks'][$key],
					        'weigh' 		=> $params['weigh'][$key]!=''?$params['weigh'][$key] : 0,
					        'sn' 			=> $params['sn'][$key]!=''?$params['sn'][$key] : 'wanl_'.time()
					    ];
					}
					if(!$this->goodsSkuModel->allowField(true)->saveAll($sku)){
						$result == false;
					}
	                Db::commit();
	            } catch (ValidateException $e) {
	                Db::rollback();
	                $this->error($e->getMessage());
	            } catch (PDOException $e) {
	                Db::rollback();
	                $this->error($e->getMessage());
	            } catch (Exception $e) {
	                Db::rollback();
	                $this->error($e->getMessage());
	            }
	            if ($result !== false) {
	                $this->success();
	            } else {
	                $this->error(__('No rows were inserted'));
	            }
	        }
	        $this->error(__('Parameter %s can not be empty', ''));
	    }
	    $shop_id = $this->shop->id;
		// 判断是否存在品牌
		$row['brand'] = model('app\index\model\flshop\Brand')->where(['state' => 1])->count();
		// 判断是否有店铺分类
		$row['shopsort'] = model('app\index\model\flshop\ShopSort')->where('shop_id',$shop_id)->count();
		// 判断是否有运费模板
		$row['freight'] = model('app\index\model\flshop\ShopFreight')->where('shop_id',$shop_id)->count();
		// 判断是否有寄件人信息
		$row['config'] = model('app\index\model\flshop\ShopConfig')->where('shop_id',$shop_id)->find();
		// 打开方式
		$this->assignconfig("isdialog", IS_DIALOG);
		$this->view->assign("row", $row);
		$this->view->assign("stockList", $this->goodsModel->getStockList());
		$this->view->assign("statusList", $this->goodsModel->getStatusList());
		return $this->view->fetch();
	}
	
	/**
	 * 编辑
	 */
	public function goodsEdit($ids = null, $type = null)
	{
		//设置过滤方法
		$this->request->filter(['']);
		// 判断业务类型
		if($type === 'copy'){
			$goodsModel = model('app\index\model\flshop\Goods');
			$goodsSkuModel = model('app\index\model\flshop\GoodsSku');
			$goodsSpuModel = model('app\index\model\flshop\GoodsSpu');
		}else{
			$goodsModel = $this->goodsModel;
			$goodsSkuModel = $this->goodsSkuModel;
			$goodsSpuModel = $this->goodsSpuModel;
		}
	    $row = $goodsModel->get($ids);
	    if (!$row) {
	        $this->error(__('No Results were found'));
	    }
	    if ($row['shop_id'] != $this->shop->id) {
	        $this->error(__('You have no permission'));
	    }
		// 查询SKU
		$skuItem = $goodsSkuModel
			->where(['goods_id' => $ids, 'state' => 0])
			->field('id,thumbnail,difference,price,market_price,stock,weigh,sn,sales,state')
			->select();
	    if ($this->request->isPost()) {
	        $params = $this->request->post("row/a");
	        if ($params) {
				// 判断产品属性是否存在
				empty($params['spuItem'])?$this->error(__('请完善：销售信息 - 产品属性')):'';
	            $result = false;
	            Db::startTrans();
	            try {
					$spudata = isset($params['spu'])?$params['spu']:throw new Exception("请填写销售信息-产品属性");
					$spuItem = isset($params['spuItem'])?$params['spuItem']: throw new Exception("请填写销售信息-产品属性-产品规格");
					
					if($type === 'copy'){
						// 获取自增ID
						$this->goodsModel->shop_id = $this->shop->id;
						$this->goodsModel->brand_id = $params['brand_id'];
						$this->goodsModel->category_id = $params['category_id'];
						if(isset($params['attribute'])){
							$this->goodsModel->category_attribute = json_encode($params['attribute'], JSON_UNESCAPED_UNICODE);
						}
						$this->goodsModel->is_alone = $params['is_alone'];
						$this->goodsModel->is_ladder = $params['is_ladder'];
						$this->goodsModel->purchase_limit = $params['purchase_limit'];
						$this->goodsModel->group_hour = $params['group_hour'];
						if(intval($params['is_ladder']) === 0){
							$this->goodsModel->people_num = $params['people_num'];
						}
						$this->goodsModel->title = $params['title'];
						$this->goodsModel->image = $params['image'];
						$this->goodsModel->images = $params['images'];
						$this->goodsModel->description = $params['description'];
						$this->goodsModel->stock = $params['stock'];
						$this->goodsModel->status = $params['status'];
						$this->goodsModel->content = $params['content'];
						$this->goodsModel->shop_category_id = $params['shop_category_id'];
						$this->goodsModel->price = min($params['price']);
						$this->goodsModel->freight_id = $params['freight_id'];
						if($this->goodsModel->save()){
							$result = true;
						}
						// 写入拼团阶梯 1.0.8
						if(isset($params['ladder']) && intval($params['is_ladder']) === 1){
							$ladder = [];
							foreach ($params['ladder'] as $item) {
							    $ladder[] = [
									'shop_id' => $this->shop->id,
									'goods_id' => $this->goodsModel->id,
									'people_num' => $item['people_num'],
									'discount' => $item['discount'],
								];
							}
							if(!$this->ladderModel->saveAll($ladder)){
								$result == false;
							}
						}else{
							if(intval($params['is_ladder']) === 1){
								throw new Exception("请编辑阶梯拼团规格");
							}
						}
						// 写入SPU
						$spu = [];
						foreach (explode(",", $spudata) as $key => $value) {
						    $spu[] = [
						        'goods_id'	=> $this->goodsModel->id,
						        'name'		=> $value,
						        'item'		=> $spuItem[$key]
						    ];
						}
						if(!$this->goodsSpuModel->allowField(true)->saveAll($spu)){
							$result == false;
						}
						// 写入SKU
						$sku = [];
						foreach ($params['sku']  as $key => $value) {
						    $sku[] = [
						        'goods_id' 		=> $this->goodsModel->id,
								'thumbnail' 	=> isset($params['thumbnail']) ? $params['thumbnail'][$key] : false, // 1.0.8升级
						        'difference' 	=> $value,
						        'market_price' 	=> $params['market_price'][$key],
						        'price' 		=> $params['price'][$key],
						        'stock' 		=> $params['stocks'][$key],
						        'weigh' 		=> $params['weigh'][$key]!=''?$params['weigh'][$key] : 0,
						        'sn' 			=> $params['sn'][$key]!=''?$params['sn'][$key] : 'wanl_'.time()
						    ];
						}
						if(!$this->goodsSkuModel->allowField(true)->saveAll($sku)){
							$result == false;
						}
					}else{
						// 写入表单
						$data = $params;
						if(isset($data['attribute'])){
							$data['category_attribute'] = json_encode($data['attribute'], JSON_UNESCAPED_UNICODE);
						}
						$data['price'] = min($data['price']);
						$result = $row->allowField(true)->save($data);
						// 写入拼团阶梯 1.0.8
						if(isset($params['ladder']) && intval($params['is_ladder']) === 1){
							// 删除原来数据
							$this->ladderModel
								->where('goods_id', 'in', $ids)
								->delete();
							$ladder = [];
							foreach ($params['ladder'] as $item) {
							    $ladder[] = [
									'shop_id' => $this->shop->id,
									'goods_id' => $ids,
									'people_num' => $item['people_num'],
									'discount' => $item['discount'],
								];
							}
							if(!$this->ladderModel->saveAll($ladder)){
								$result == false;
							}
						}else{
							if(intval($params['is_ladder']) === 1){
								throw new Exception("请编辑阶梯拼团规格");
							}
						}
						
						// 删除原来数据,重新写入SPU
						$goodsSpuModel
							->where('goods_id','in',$ids)
							->delete();
						$spu = [];
						foreach (explode(",", $spudata) as $key => $value) {
						    $spu[] = [
						        'goods_id' => $ids,
						        'name' => $value,
						        'item' => $spuItem[$key]
						    ];
						}
						if(!$goodsSpuModel->allowField(true)->saveAll($spu)){
							$result == false;
						}
						
						//标记旧版SKU数据
						$oldsku = [];
						foreach ($skuItem as $value) {
							$oldsku[] = [
								'id' => $value['id'],
								'state' => 1
							];
						}
						if(!$goodsSkuModel->allowField(true)->saveAll($oldsku)){
							$result == false;
						}
						// 写入SKU
						$sku = [];
						foreach ($params['sku'] as $key => $value) {
						    $sku[] = [
						        'goods_id' => $ids,
								'thumbnail' => isset($params['thumbnail']) ? $params['thumbnail'][$key] : false, // 1.0.8升级
						        'difference' => $value,
						        'market_price' => $params['market_price'][$key],
						        'price' => $params['price'][$key],
						        'stock' => $params['stocks'][$key],
						        'weigh' => $params['weigh'][$key]!=''?$params['weigh'][$key] : 0,
						        'sn' => $params['sn'][$key]!=''?$params['sn'][$key] : 'wanl_'.time()
						    ];
						}
						if(!$goodsSkuModel->allowField(true)->saveAll($sku)){
							$result == false;
						}
					}
	                Db::commit();
	            } catch (ValidateException $e) {
	                Db::rollback();
	                $this->error($e->getMessage());
	            } catch (PDOException $e) {
	                Db::rollback();
	                $this->error($e->getMessage());
	            } catch (Exception $e) {
	                Db::rollback();
	                $this->error($e->getMessage());
	            }
	            if ($result !== false) {
	                $this->success();
	            } else {
	                $this->error(__('No rows were updated'));
	            }
	        }
	        $this->error(__('Parameter %s can not be empty', ''));
	    }
		$spuData = $goodsSpuModel->all(['goods_id' => $ids]);
		$ladderList = $this->ladderModel->all(['goods_id' => $ids]);
		$suk = [];
		foreach ($skuItem as $vo) {
		    $suk[] = explode(",", $vo['difference']);
		}
		$spu = [];
		foreach ($spuData as $vo) {
		    $spu[] = $vo['name'];
		}
		$spuItem = [];
		foreach ($spuData as $vo) {
		    $spuItem[] = explode(",", $vo['item']);
		}
		$skulist = [];
		foreach ($skuItem as $vo) {
		    $skulist[$vo['difference']] = $vo;
		}
	    $this->assignconfig('spu', $spu);
	    $this->assignconfig('spuItem', $spuItem);
	    $this->assignconfig('sku', $suk);
	    $this->assignconfig('skuItem', $skulist);
		$this->assignconfig('is_ladder', $type === 'copy' ? 0 : $row['is_ladder']);
		$this->assignconfig('ladderList', $ladderList);
	    $this->assignconfig('categoryId', $row['category_id']);
	    $this->assignconfig('attribute', json_decode($row['category_attribute']));
		$this->view->assign("stockList", $goodsModel->getStockList());
		$this->view->assign("statusList", $goodsModel->getStatusList());
		$this->view->assign("flagList", $goodsModel->getFlagList());
		$this->view->assign("distributionList", $goodsModel->getDistributionList());
		$this->view->assign("row", $row);
	    return $this->view->fetch();
	}
	
	/**
	 * 回收站
	 */
	public function goodsRecyclebin()
	{
	    //设置过滤方法
	    $this->request->filter(['strip_tags']);
	    if ($this->request->isAjax()) {
	        list($where, $sort, $order, $offset, $limit) = $this->buildparams();
	        $total = $this->goodsModel
	            ->onlyTrashed()
	            ->where($where)
	            ->order($sort, $order)
	            ->count();
	
	        $list = $this->goodsModel
	            ->onlyTrashed()
	            ->where($where)
	            ->order($sort, $order)
	            ->limit($offset, $limit)
	            ->select();
	
	        $result = array("total" => $total, "rows" => $list);
	
	        return json($result);
	    }
	    return $this->view->fetch();
	}
	
	/**
	 * 删除
	 */
	public function goodsDel($ids = "")
	{
	    if ($ids) {
	        $pk = $this->goodsModel->getPk();
	        $this->goodsModel->where('shop_id', '=', $this->shop->id);
	        $list = $this->goodsModel->where($pk, 'in', $ids)->select();
	
	        $count = 0;
	        Db::startTrans();
	        try {
	            foreach ($list as $k => $v) {
	                $count += $v->delete();
	            }
	            Db::commit();
	        } catch (PDOException $e) {
	            Db::rollback();
	            $this->error($e->getMessage());
	        } catch (Exception $e) {
	            Db::rollback();
	            $this->error($e->getMessage());
	        }
	        if ($count) {
	            $this->success();
	        } else {
	            $this->error(__('No rows were deleted'));
	        }
	    }
	    $this->error(__('Parameter %s can not be empty', 'ids'));
	}
	
	/**
	 * 真实删除
	 */
	public function goodsDestroy($ids = "")
	{
	    $pk = $this->goodsModel->getPk();
	    $this->goodsModel->where('shop_id', '=', $this->shop->id);
	    if ($ids) {
	        $this->goodsModel->where($pk, 'in', $ids);
	    }
	    $count = 0;
	    Db::startTrans();
	    try {
	        $list = $this->goodsModel->onlyTrashed()->select();
	        foreach ($list as $k => $v) {
	            $count += $v->delete(true);
	        }
	        Db::commit();
	    } catch (PDOException $e) {
	        Db::rollback();
	        $this->error($e->getMessage());
	    } catch (Exception $e) {
	        Db::rollback();
	        $this->error($e->getMessage());
	    }
	    if ($count) {
	        $this->success();
	    } else {
	        $this->error(__('No rows were deleted'));
	    }
	    $this->error(__('Parameter %s can not be empty', 'ids'));
	}
	
	/**
	 * 还原
	 */
	public function goodsRestore($ids = "")
	{
	    $pk = $this->goodsModel->getPk();
	    $this->goodsModel->where('shop_id', '=', $this->shop->id);
	    if ($ids) {
	        $this->goodsModel->where($pk, 'in', $ids);
	    }
	    $count = 0;
	    Db::startTrans();
	    try {
	        $list = $this->goodsModel->onlyTrashed()->select();
	        foreach ($list as $index => $item) {
	            $count += $item->restore();
	        }
	        Db::commit();
	    } catch (PDOException $e) {
	        Db::rollback();
	        $this->error($e->getMessage());
	    } catch (Exception $e) {
	        Db::rollback();
	        $this->error($e->getMessage());
	    }
	    if ($count) {
	        $this->success();
	    }
	    $this->error(__('No rows were updated'));
	}
	
	/**
	 * 拼团管理
	 */
	public function groups()
	{
		//当前是否为关联查询
		$this->relationSearch = true;
		//设置过滤方法
		$this->request->filter(['strip_tags', 'trim']);
		if ($this->request->isAjax()) {
		    //如果发送的来源是Selectpage，则转发到Selectpage
		    if ($this->request->request('keyField')) {
		        return $this->selectpage();
		    }
		    list($where, $sort, $order, $offset, $limit) = $this->buildparams();
	
		    $list = $this->groupsModel
		            ->where($where)
		            ->order($sort, $order)
		            ->paginate($limit);
		    foreach ($list as $row) {
				$row->goods ? $row->goods->visible(['title','image']) : [];
				$row->user->visible(['username','nickname','avatar']);
		    }
	
		    $result = array("total" => $list->total(), "rows" => $list->items());
	
		    return json($result);
		}
		$this->view->assign("groupTypeList", $this->groupsModel->getGroupTypeList());
        $this->view->assign("stateList", $this->groupsModel->getStateList());
        $this->view->assign("statusList", $this->groupsModel->getStatusList());
		return $this->view->fetch();
	}
	
	/**
     * 查看拼团
     */
    public function groupsDetail($ids = null, $group_no = null)
    {
		if($ids){
			$where['id'] = $ids;
		}else{
			$where['group_no'] = $group_no;
		}
		$row = $this->groupsModel->where($where)->find();	
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        $row->team = model('app\index\model\flshop\groups\Team')
            ->where('group_no', $row->group_no)
            ->select();
		$row->ordergoods = model('app\index\model\flshop\groups\OrderGoods')
		    ->where('group_no', $row->group_no)
		    ->select();
        $this->view->assign("row", $row);
        return $this->view->fetch();
    }
	
    /**
     * 选择附件
     */
    public function select()
    {
        if ($this->request->isAjax()) {
            return $this->index();
        }
        return $this->view->fetch();
    }
}
