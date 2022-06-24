<?php
namespace app\index\controller\Flshop;

use app\common\controller\Flshop;
use addons\flshop\library\WanlChat\WanlChat;

use think\Db;
use think\Exception;

use think\exception\PDOException;
use think\exception\ValidateException;

/**
 * 订单退款管理
 *
 * @icon fa fa-circle-o
 */
class Refund extends flshop
{
    protected $noNeedLogin = '';
    protected $noNeedRight = '*';
    /**
     * Refund模型对象
     * @var \app\index\model\flshop\Refund
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\index\model\flshop\Refund;
		$this->wanlchat = new WanlChat();
        $this->view->assign("expresstypeList", $this->model->getExpresstypeList());
        $this->view->assign("typeList", $this->model->getTypeList());
        $this->view->assign("reasonList", $this->model->getReasonList());
        $this->view->assign("stateList", $this->model->getStateList());
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
        $this->request->filter(['strip_tags', 'trim']);
        if ($this->request->isAjax())
        {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
                    ->with(['order','pay'])
                    ->where($where)
                    ->order($sort, $order)
                    ->count();
    
            $list = $this->model
                    ->with(['order','pay'])
                    ->where($where)
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();
    
            foreach ($list as $row) {
				if($row['order_type'] === 'groups'){
					$row->groupsgoods->visible(['title','image']);
				}else{
					$row->goods->visible(['title','image']);
				}
                $row->getRelation('order')->visible(['id']);
    			$row->getRelation('pay')->visible(['pay_no']);
            }
            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);
    
            return json($result);
        }
        return $this->view->fetch();
    }
	
	/**
	 * 退款详情 1.1.3升级
	 */
	public function detail($ids = null, $order_id = null, $order_no = null)
	{
		$where = [];
		if($ids){
			$where['id'] = $ids;
			$where['shop_id'] = $this->shop->id;
		}
		if($order_id){
			$where['order_id'] = $order_id;
			$where['shop_id'] = $this->shop->id;
		}
		if($order_no){
			$order = model('app\api\model\flshop\Order')
				->where(['order_no' => $order_no, 'user_id' => $this->auth->id])
				->find();
			$where['order_id'] = $order['id'];
		}
		$row = $this->model
			->where($where)
			->find();
		if (!$row) {
		    $this->error(__('No Results were found'));
		}
		$row['images'] = explode(',', $row['images']);
		if($row['order_type'] === 'groups'){
			$row['ordergoods'] = model('app\index\model\flshop\groups\OrderGoods')
				->where('id', 'in', $row['goods_ids'])
				->where('shop_id', $row['shop_id'])
				->select();
		}else{
			$row['ordergoods'] = model('app\index\model\flshop\OrderGoods')
				->where('id', 'in', $row['goods_ids'])
				->where('shop_id', $row['shop_id'])
				->select();
		}
		$row['log'] = model('app\index\model\flshop\RefundLog')
			->where(['refund_id' => $row['id']])
			->order('created desc')
			->select();
	    $this->view->assign("row", $row);
		return $this->view->fetch();
	}
	
	/**
	 * 同意退款
	 */
	public function agree($ids = null)
	{
		$row = $this->model->get($ids);
		if (!$row) {
		    $this->error(__('No Results were found'));
		}
		if ($row['shop_id'] !=$this->shop->id) {
		    $this->error(__('You have no permission'));
		}
		if ($row['state'] == 2 || $row['state'] == 3 || $row['state'] == 4 || $row['state'] == 5) {
			$this->error(__('当前状态，不可操作'));
		}
		// 判断金额
		// if(number_format($row['price'], 2) > number_format($row->pay->price, 2)){
		// 	$this->error(__('非法退款金额，金额超过订单金额！！请拒绝退款！！'));
		// }
		$result = false;
		$error = '';
		Db::startTrans();
		try {
			// 判断退款类型 我要退款(无需退货)
			if($row['type'] == 0){
				$refund_status = 3;
				$data['state'] = 4; // 退款完成
				$data['completetime'] = time(); // 完成退款 时间
				
				$content = '卖家同意退款，'.$row['price'].'元退款到买家账号余额';
				// 推送标题
				$push_title = '退款已完成';
				// 订单支付
				$orderPay = false;
				// 判断业务类型
				if($row['order_type'] === 'groups'){
					// 查询订单是已确定收货
					$order = model('app\index\model\flshop\groups\Order')->get($row['order_id']);
					// 订单状态:1=待支付,2=待成团,3=待发货,4=待收货,5=待评论,6=已完成,7=已取消
					$orderPay = $order['state'] == 5 ? true : false;
				}else{
					$order = model('app\index\model\flshop\Order')->get($row['order_id']);
					// 订单状态:1=待支付,2=待发货,3=待收货,4=待评论,5=已弃用,6=已完成,7=已取消
					$orderPay = $order['state'] == 4 ? true : false;
				}
				// 更新钱包 1.此订单如果已确认收货扣商家 2.此订单没有确认收货，平台退款
				if($orderPay){
					// 扣商家
					controller('addons\flshop\library\WanlPay\WanlPay')->money(-$row['price'], $order['shop']['user_id'], '确认收货，同意退款', 'refund', $order['order_no']);
				}
				// 退款给用户
				controller('addons\flshop\library\WanlPay\WanlPay')->money(+$row['price'], $row['user_id'], '卖家同意退款', 'refund', $order['order_no']);
				
				// 1.1.3升级
				$config = get_addon_config('flshop');
				if($config['config']['refund_switch'] == 'Y'){
					// 检查是否原路返还（不写到money防止自动任务时原路返回） 1.1.2升级 1.1.3升级
					controller('addons\flshop\library\WanlPay\WanlPay')->refund($row['id'], $row['price'], $row['order_pay_id']);
				}
				//后续版本推送订购单
				// ...
			}else if($row['type'] == 1){
				$refund_status = 2;
				$data['state'] = 1; // 先同意退款，还需要买家继续退货
				$data['agreetime'] = time(); // 卖家同意 时间
				// 退货地址
				$shopConfig = model('app\index\model\flshop\ShopConfig')
					->where(['shop_id' => $this->shop->id])
					->field('returnAddr,returnName,returnPhoneNum')
					->find();
				// 添加添加判断
				if(!$shopConfig['returnAddr']){
					$error = '请在店铺配置，先填写退货信息！';
				}
				$content = '卖家同意退货申请，退货地址：'.$shopConfig['returnName'].'，'.$shopConfig['returnPhoneNum'].'，'.$shopConfig['returnAddr'];
				// 推送标题
				$push_title = '卖家同意退货';
				
			}else{
				$error = '非法退款类型，请拒绝退款！';
			}
			if(!$error){
				// 写入日志
				$this->refundLog($row['user_id'], $ids, $content);
				// 1.0.5 更新商品状态
				$this->setOrderGoodsState($refund_status, $row['goods_ids'], $row['order_type']);
				// 更新订单状态
				$this->setRefundState($row['order_id'], $row['order_type']);
				// 推送开始
				$this->pushRefund($row['id'], $row['order_id'], $row['goods_ids'], $push_title, $row['order_type']);
				// 更新退款
				$row->allowField(true)->save($data);
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
		if (!$error) {
		    $this->success();
		} else {
		    $this->error($error);
		}
	}
	
	/**
	 * 确认收货
	 */
	public function receiving($ids = null)
	{
		$row = $this->model->get($ids);
		if (!$row) {
		    $this->error(__('No Results were found'));
		}
		if ($row['shop_id'] != $this->shop->id) {
		    $this->error(__('You have no permission'));
		}
		if ($row['state'] == 2 || $row['state'] == 3 || $row['state'] == 4 || $row['state'] == 5) {
			$this->error(__('当前状态，不可操作'));
		}
		$result = false;
		Db::startTrans();
		try {
			// 判断退款类型
			if($row['type'] == 1){
				// 判断金额
				if($row['price'] > $row->pay->price){
					throw new Exception("非法退款金额，金额超过订单金额！！请拒绝退款！！");
				}
			}else{
				throw new Exception("非法退款类型，请拒绝退款！");
			}
			// 判断业务类型
			if($row['order_type'] === 'groups'){
				$orderModel = model('app\index\model\flshop\groups\Order');
			}else{
				$orderModel = model('app\index\model\flshop\Order');
			}
			// 查询订单是已确定收货
			$order = $orderModel->get($row['order_id']);
			// 更新钱包
			// 1.此订单如果已确认收货扣商家
			// 2.此订单没有确认收货，平台退款	
			if($order['state'] == 4){
				// 扣商家
				controller('addons\flshop\library\WanlPay\WanlPay')->money(-$row['price'], $order['shop']['user_id'], '确认收货，同意退款', 'refund', $order['order_no']);
			}
			//退款给用户
			controller('addons\flshop\library\WanlPay\WanlPay')->money(+$row['price'], $row['user_id'], '卖家同意退款', 'refund', $order['order_no']);
			
			// 1.1.3升级
			$config = get_addon_config('flshop');
			if($config['config']['refund_switch'] == 'Y'){
				// 检查是否原路返还（不写到money防止自动任务时原路返回） 1.1.2升级
				controller('addons\flshop\library\WanlPay\WanlPay')->refund($row['id'], $row['price'], $row['order_pay_id']);
			}
			
			//后续版本推送订购单
			// ...
			// 写入日志
			$this->refundLog($row['user_id'], $ids, '卖家确认收到退货，并将'.$row['price'].'元退款到买家账号余额');
			// 更新商品状态
			$this->setOrderGoodsState(3, $row['goods_ids'], $row['order_type']);
			// 更新订单状态
			$this->setRefundState($row['order_id'], $row['order_type']);
			// 推送开始
			$this->pushRefund($row['id'], $row['order_id'], $row['goods_ids'], '退款已完成', $row['order_type']);
			// 更新退款
			$result = $row->allowField(true)->save(['state' => 4,'completetime' => time()]);
			
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
	
	/**
	 * 拒绝退款
	 */
	public function refuse($ids = null)
	{
		$row = $this->model->get($ids);
		if (!$row) {
		    $this->error(__('No Results were found'));
		}
		if ($row['shop_id'] != $this->shop->id) {
		    $this->error(__('You have no permission'));
		}
		if ($row['state'] != 0) {
			$this->error(__('当前状态，不可操作'));
		}
		if ($this->request->isPost()) {
		    $params = $this->request->post("row/a");
		    if ($params) {
		        $result = false;
		        Db::startTrans();
		        try {
					$params['state'] = 2;
					// 写入日志
					$this->refundLog($row['user_id'], $row['id'], '卖家拒绝了您的退款申请，拒绝理由：'.$params['refuse_content']);
					// 更新商品状态
					$this->setOrderGoodsState(5, $row['goods_ids'], $row['order_type']);
					// 更新订单状态
					$this->setRefundState($row['order_id'], $row['order_type']);
					// 推送开始
					$this->pushRefund($row['id'], $row['order_id'], $row['goods_ids'], '退款申请被拒绝', $row['order_type']);
					// 更新退款
					$result = $row->allowField(true)->save($params);
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
		$this->view->assign("row", $row);
		return $this->view->fetch();
	}
	
	/**
	 * 推送退款消息（方法内使用）
	 *
	 * @param string refund_id 订单ID
	 * @param string order_id 订单ID
	 * @param string goods_id 订单ID
	 * @param string title 标题
	 */
	private function pushRefund($refund_id = 0, $order_id = 0, $goods_id = 0, $title = '', $order_type = 'goods')
	{
		if($order_type === 'groups'){
			$orderModel = model('app\index\model\flshop\groups\Order');
			$orderGoodsModel = model('app\index\model\flshop\groups\OrderGoods');
		}else{
			$orderModel = model('app\index\model\flshop\Order');
			$orderGoodsModel = model('app\index\model\flshop\OrderGoods');
		}
		$order = $orderModel->get($order_id);
		$goods = $orderGoodsModel->get($goods_id);
		$msg = [
			'user_id' => $order['user_id'], // 推送目标用户
			'shop_id' => $this->shop->id, 
			'title' => $title,  // 推送标题
			'image' => $goods['image'], // 推送图片
			'content' => '您申请退款的商品 '.(mb_strlen($goods['title'],'utf8') >= 25 ? mb_substr($goods['title'],0,25,'utf-8').'...' : $goods['title']).' '.$title, 
			'type' => 'order',  // 推送类型
			'modules' => $order_type === 'groups' ? 'groupsrefund' : 'refund',  // 模块类型
			'modules_id' => $refund_id,  // 模块ID
			'come' => '订单'.$order['order_no'] // 来自
		];
		$this->wanlchat->send($order['user_id'], $msg);
		$notice = model('app\index\model\flshop\Notice');
		$notice->data($msg);
		$notice->allowField(true)->save();
	}
	
	/**
	 * 更新订单商品状态（方法内使用）
	 *
	 * @ApiSummary  (flshop 更新订单商品状态)
	 * @ApiMethod   (POST)
	 * 
	 * @param string $status 状态
	 * @param string $goods_id 商品ID
	 */
	private function setOrderGoodsState($status = 0, $goods_id = 0, $order_type = 'goods')
	{
		if($order_type === 'groups'){
			$orderGoodsModel = model('app\index\model\flshop\groups\OrderGoods');
		}else{
			$orderGoodsModel = model('app\index\model\flshop\OrderGoods');
		}
		return $orderGoodsModel->save(['refund_status' => $status],['id' => $goods_id]);
	}
	
	
	/**
	 * 修改订单状态（方法内使用） 1.0.5升级
	 *
	 * @ApiSummary  (flshop 修改订单状态)
	 * @ApiMethod   (POST)
	 * 
	 * @param string $id 订单ID
	 */
	private function setRefundState($order_id = 0, $order_type = 'goods')
	{
		if($order_type === 'groups'){
			$orderModel = model('app\index\model\flshop\groups\Order');
			$orderGoodsModel = model('app\index\model\flshop\groups\OrderGoods');
		}else{
			$orderModel = model('app\index\model\flshop\Order');
			$orderGoodsModel = model('app\index\model\flshop\OrderGoods');
		}
		$list = $orderGoodsModel
			->where(['order_id' => $order_id])
			->select();
		$refundStatusCount = 0;
		foreach($list as $row){
			if($row['refund_status'] == 3) $refundStatusCount += 1;
		}
		// 如果订单下所有商品全部退款完毕则关闭订单
		if(count($list) == $refundStatusCount){
			$orderModel->save(['state'  => 7],['id' => $order_id]);
			return true;
		}
		return false;
	}
	
	/**
	 * 退款日志（方法内使用）
	 *
	 * @ApiSummary  (flshop 退款日志)
	 * @ApiMethod   (POST)
	 * 
	 * @param string $user_id 用户ID
	 * @param string $refund_id 退款ID
	 * @param string $content 日志内容
	 */
	private function refundLog($user_id = 0, $refund_id = 0, $content = '')
	{
		return model('app\index\model\flshop\RefundLog')->allowField(true)->save([
			'shop_id' => $this->shop->id,
			'user_id' => $user_id,
			'refund_id' => $refund_id,
			'type' => 1,
			'content' => $content
		]);
	}
	
}
