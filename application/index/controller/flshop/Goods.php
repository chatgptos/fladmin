<?php
// 2020年2月17日22:04:21
namespace app\index\controller\Flshop;

use app\common\controller\Flshop;
use think\Db;
use think\Exception;
use think\exception\PDOException;
use think\exception\ValidateException;
use fast\Tree;

/**
 * 产品管理
 * @internal
 */
class Goods extends Flshop
{
    protected $noNeedLogin = '';
    protected $noNeedRight = '*';
    protected $searchFields = 'title';
    
    protected $model = null;
    
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\index\model\flshop\Goods;
        // 类目
        $tree = Tree::instance();
		// 1.0.2升级 过滤隐藏
        $tree->init(model('app\index\model\flshop\Category')->where(['type' => 'goods', 'isnav' => 1])->field('id,pid,name')->order('weigh asc,id asc')->select());
        $this->assignconfig('channelList', $tree->getTreeArray(0));
        $this->view->assign("flagList", $this->model->getFlagList());
        $this->view->assign("stockList", $this->model->getStockList());
        $this->view->assign("specsList", $this->model->getSpecsList());
        $this->view->assign("distributionList", $this->model->getDistributionList());
        $this->view->assign("activityList", $this->model->getActivityList());
        $this->view->assign("statusList", $this->model->getStatusList());
    }
    
    /**
     * 查看
     */
    public function index()
    {
        //当前是否为关联查询
        $this->relationSearch = true;
        //设置过滤方法
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax()) {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField')) {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
                ->with(['category','shopsort'])
                ->where($where)
                ->order($sort, $order)
                ->count();
    
            $list = $this->model
                ->with(['category','shopsort'])
                ->where($where)
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            foreach ($list as $row) {
                $row->getRelation('category')->visible(['name']);
                $row->getRelation('shopsort')->visible(['name']);
            }
            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);
    
            return json($result);
        }
        return $this->view->fetch();
    }
    
    /**
     * 选择链接
     */
    public function select()
    {
        if ($this->request->isAjax()) {
            return $this->index();
        }
        return $this->view->fetch();
    }
    
    /**
     * 仓库中的宝贝
     */
    public function stock()
    {
        return $this->view->fetch('flshop/goods/index');
    }
    
    /**
     * 添加
     */
	public function add()
	{
		//设置过滤方法
		$this->request->filter(['']);
	    if ($this->request->isPost()) {
	        $params = $this->request->post("row/a");
	        if ($params) {
				// 判断产品属性是否存在
				empty($params['spuItem'])?$this->error(__('请完善：销售信息 - 产品属性')):'';
	            $result = false;
	            Db::startTrans();
	            try {
	                $spudata = isset($params['spu'])?$params['spu']:$this->error(__('请填写销售信息-产品属性'));
	                $spuItem = isset($params['spuItem'])?$params['spuItem']:$this->error(__('请填写销售信息-产品属性-产品规格'));
	                // 获取自增ID
	                $this->model->shop_id = $this->shop->id;
	                $this->model->brand_id = $params['brand_id'];
	                $this->model->category_id = $params['category_id'];
					if(isset($params['attribute'])){
						$this->model->category_attribute = json_encode($params['attribute'], JSON_UNESCAPED_UNICODE);
					}
	                $this->model->title = $params['title'];
	                $this->model->image = $params['image'];
	                $this->model->images = $params['images'];
	                $this->model->description = $params['description'];
	                $this->model->stock = $params['stock'];
	                $this->model->status = $params['status'];
	                $this->model->content = $params['content'];
	                $this->model->shop_category_id = $params['shop_category_id'];
	                $this->model->price = min($params['price']);
	                $this->model->freight_id = $params['freight_id'];
	                if($this->model->save()){
	                	$result = true;
	                }
					// 写入SPU
					$spu = [];
					foreach (explode(",", $spudata) as $key => $value) {
					    $spu[] = [
					        'goods_id'	=> $this->model->id,
					        'name'		=> $value,
					        'item'		=> $spuItem[$key]
					    ];
					}
					if(!model('app\index\model\flshop\GoodsSpu')->allowField(true)->saveAll($spu)){
						$result == false;
					}
					// 写入SKU
					$sku = [];
					foreach ($params['sku']  as $key => $value) {
					    $sku[] = [
					        'goods_id' 		=> $this->model->id,
							'thumbnail' 	=> isset($params['thumbnail']) ? $params['thumbnail'][$key] : false, // 1.0.8升级
					        'difference' 	=> $value,
					        'market_price' 	=> $params['market_price'][$key],
					        'price' 		=> $params['price'][$key],
					        'stock' 		=> $params['stocks'][$key],
					        'weigh' 		=> $params['weigh'][$key]!=''?$params['weigh'][$key] : 0,
					        'sn' 			=> $params['sn'][$key]!=''?$params['sn'][$key] : 'wanl_'.time()
					    ];
					}
					if(!model('app\index\model\flshop\GoodsSku')->allowField(true)->saveAll($sku)){
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
		return $this->view->fetch();
	}
    
    /**
     * 编辑
     */
    public function edit($ids = null)
    {
		//设置过滤方法
		$this->request->filter(['']);
        $row = $this->model->get($ids);
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        if ($row['shop_id'] != $this->shop->id) {
            $this->error(__('You have no permission'));
        }
		// 查询SKU
		$skuItem = model('app\index\model\flshop\GoodsSku')
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
					$spudata = isset($params['spu'])?$params['spu']:$this->error(__('请填写销售信息-产品属性'));
					$spuItem = isset($params['spuItem'])?$params['spuItem']:$this->error(__('请填写销售信息-产品属性-产品规格'));
					// 写入表单
					$data = $params;
					if(isset($data['attribute'])){
						$data['category_attribute'] = json_encode($data['attribute'], JSON_UNESCAPED_UNICODE);
					}
					$data['price'] = min($data['price']);
                    $result = $row->allowField(true)->save($data);
					// 删除原来数据,重新写入SPU
					model('app\index\model\flshop\GoodsSpu')
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
					if(!model('app\index\model\flshop\GoodsSpu')->allowField(true)->saveAll($spu)){
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
					if(!model('app\index\model\flshop\GoodsSku')->allowField(true)->saveAll($oldsku)){
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
					if(!model('app\index\model\flshop\GoodsSku')->allowField(true)->saveAll($sku)){
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
                    $this->error(__('No rows were updated'));
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }
		$spuData = model('app\index\model\flshop\GoodsSpu')->all(['goods_id' => $ids]);
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
        $this->assignconfig('categoryId', $row['category_id']);
        $this->assignconfig('attribute', json_decode($row['category_attribute']));
        $this->view->assign("row", $row);
        return $this->view->fetch();
    }
    
    /**
     * 添加类目属性
     */
	public function attribute()
	{
	    if ($this->request->isAjax()) {
	        $id = $this->request->request("id");
			// 1.0.8升级  获取父级类目属性
			$tree = Tree::instance();
			$tree->init(collection(model('app\index\model\flshop\Category')->select())->toArray(), 'pid');
	        $list  = model('app\index\model\flshop\Attribute')
	            ->where('category_id', 'in', $tree->getParentsIds($id, true))
				->where('status','normal')
	            ->select();
	        $this->success('查询成功', '', $list);
	    }
	    $this->error(__('Parameter %s can not be empty', ''));
	}
    
    /**
     * 回收站
     */
    public function recyclebin()
    {
        //设置过滤方法
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax()) {
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
                ->onlyTrashed()
                ->where($where)
                ->order($sort, $order)
                ->count();
    
            $list = $this->model
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
    public function del($ids = "")
    {
        if ($ids) {
            $pk = $this->model->getPk();
            $this->model->where('shop_id', '=', $this->shop->id);
            $list = $this->model->where($pk, 'in', $ids)->select();
    
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
    public function destroy($ids = "")
    {
        $pk = $this->model->getPk();
        $this->model->where('shop_id', '=', $this->shop->id);
        if ($ids) {
            $this->model->where($pk, 'in', $ids);
        }
        $count = 0;
        Db::startTrans();
        try {
            $list = $this->model->onlyTrashed()->select();
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
    public function restore($ids = "")
    {
        $pk = $this->model->getPk();
        $this->model->where('shop_id', '=', $this->shop->id);
        if ($ids) {
            $this->model->where($pk, 'in', $ids);
        }
        $count = 0;
        Db::startTrans();
        try {
            $list = $this->model->onlyTrashed()->select();
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
     * 批量更新
     */
    public function multi($ids = "")
    {
        $ids = $ids ? $ids : $this->request->param("ids");
        if ($ids) {
            if ($this->request->has('params')) {
                parse_str($this->request->post("params"), $values);
                // $values = $this->auth->isSuperAdmin() ? $values : array_intersect_key($values, array_flip(is_array($this->multiFields) ? $this->multiFields : explode(',', $this->multiFields)));
                if ($values) {
                    $this->model->where('shop_id', '=', $this->shop->id);
                    $count = 0;
                    Db::startTrans();
                    try {
                        $list = $this->model->where($this->model->getPk(), 'in', $ids)->select();
                        foreach ($list as $index => $item) {
                            $count += $item->allowField(true)->isUpdate(true)->save($values);
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
                        $this->error(__('No rows were updated'));
                    }
                } else {
                    $this->error(__('You have no permission'));
                }
            }
        }
        $this->error(__('Parameter %s can not be empty', 'ids'));
    }
}
