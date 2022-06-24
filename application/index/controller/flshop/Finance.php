<?php
namespace app\index\controller\Flshop;

use app\common\controller\Flshop;
use addons\flshop\library\WanlPay\WanlPay;
use think\Db;
use think\Exception;
use think\exception\PDOException;
use think\exception\ValidateException;

/**
 * 图标管理
 *
 * @icon fa fa-circle-o
 */
class Finance extends Flshop
{
    protected $noNeedLogin = '*';
    protected $noNeedRight = '*';

    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
    }
    
    /**
     * 账单列表
     */
    public function bill()
    {
        //当前是否为关联查询
        $this->relationSearch = true;
        //设置过滤方法
        $this->request->filter(['strip_tags']);
		// 设置模块
		$this->model = model('app\index\model\flshop\Money');
        if ($this->request->isAjax()) {
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
                ->where($where)
                ->order($sort, $order)
                ->count();
    
            $list = $this->model
                ->where($where)
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
                
            $list = collection($list)->toArray();
            
            $result = array("total" => $total, "rows" => $list);
            return json($result);
        }
		$this->view->assign("typeList", $this->model->getTypeList());
        return $this->view->fetch();
    }
    
    /**
     * 提现列表
     */
    public function withdraw()
    {
        //当前是否为关联查询
        $this->relationSearch = true;
        //设置过滤方法
        $this->request->filter(['strip_tags']);
		// 设置模块
		$this->model = model('app\index\model\flshop\Withdraw');
        if ($this->request->isAjax()) {
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
                ->where($where)
                ->order($sort, $order)
                ->count();
    
            $list = $this->model
                ->where($where)
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
                
            $list = collection($list)->toArray();
            
            $result = array("total" => $total, "rows" => $list);
            return json($result);
        }
		$this->view->assign("statusList", $this->model->getStatusList());
        return $this->view->fetch();
    }
	
	/**
	 * 发起提现
	 */
	public function payment()
	{
		$config = get_addon_config('flshop');
		if ($config['withdraw']['state'] == 'N'){
		    $this->error("系统该关闭提现功能，请联系平台客服");
		}
		if ($this->request->isPost()) {
			// 金额
			$money = $this->request->post('money');
			// 账户
			$account_id = $this->request->post('account_id');
			if ($money <= 0 || !$money) {
			    $this->error('提现金额不正确');
			}
			if ($money > $this->auth->money) {
			    $this->error('提现金额超出可提现额度');
			}
			if (!$account_id) {
			    $this->error("提现账户不能为空");
			}
			// 查询提现账户
			$account = model('app\index\model\flshop\PayAccount')
				->where(['id' => $account_id, 'user_id' => $this->auth->id])
				->find();
			if (!$account) {
			    $this->error("提现账户不存在");
			}
			if (isset($config['withdraw']['minmoney']) && $money < $config['withdraw']['minmoney']) {
			    $this->error('提现金额不能低于' . $config['withdraw']['minmoney'] . '元');
			}
			if ($config['withdraw']['monthlimit']) {
			    $count = model('app\index\model\flshop\Withdraw')->where('user_id', $this->auth->id)->whereTime('created', 'month')->count();
			    if ($count >= $config['withdraw']['monthlimit']) {
			        $this->error("已达到本月最大可提现次数");
			    }
			}
			// 计算提现手续费
			if($config['withdraw']['servicefee'] && $config['withdraw']['servicefee'] > 0){
				$servicefee = number_format($money * $config['withdraw']['servicefee'] / 1000, 2);
				$handingmoney = $money - number_format($money * $config['withdraw']['servicefee'] / 1000, 2);
			}else{
				$servicefee = 0;
				$handingmoney = $money;
			}
			Db::startTrans();
			try {
			    $data = [
			        'user_id' => $this->auth->id,
			        'money'   => $handingmoney,
					'handingfee' => $servicefee, // 手续费
			        'type'    => $account['bankCode'],
			        'account' => $account['cardCode'],
					'orderid' => date("Ymdhis") . sprintf("%08d", $this->auth->id) . mt_rand(1000, 9999)
			    ];
			    $withdraw = model('app\index\model\flshop\Withdraw')->create($data);
				$pay = new WanlPay;
				$pay->money(-$money, $this->auth->id, '申请提现', 'withdraw', $withdraw['id']);
			    Db::commit();
			} catch (Exception $e) {
			    Db::rollback();
			    $this->error($e->getMessage());
			}
			$this->success('提现申请成功！请等待后台审核', $this->auth->money);
		}else{
			$bank = model('app\index\model\flshop\PayAccount')
			    ->where(['user_id' => $this->auth->id])
			    ->order('created desc')
			    ->find();
			$this->assignconfig('usermoney', $this->auth->money);
			$this->assignconfig('servicefee', $config['withdraw']['servicefee']);
			$this->assignconfig('bankData', $bank);
			return $this->view->fetch();
		}
	}
	
	/**
	 * 提现用户
	 */
	public function user()
	{
		//当前是否为关联查询
		$this->relationSearch = true;
		//设置过滤方法
		$this->request->filter(['strip_tags']);
		// 设置模块
		$this->model = model('app\index\model\flshop\PayAccount');
		if ($this->request->isAjax()) {
		    list($where, $sort, $order, $offset, $limit) = $this->buildparams();
		    $total = $this->model
		        ->where($where)
		        ->order($sort, $order)
		        ->count();
		    
		    $list = $this->model
		        ->where($where)
		        ->order($sort, $order)
		        ->limit($offset, $limit)
		        ->select();
		        
		    $list = collection($list)->toArray();
		    
		    $result = array("total" => $total, "rows" => $list);
		    return json($result);
		}
		return $this->view->fetch();
	}
	
	/**
	 * 添加
	 */
	public function userAdd()
	{
		//设置过滤方法
		$this->request->filter(['strip_tags', 'trim']);
	    if ($this->request->isPost()) {
	        $params = $this->request->post("row/a");
	        if ($params) {
	            $params['user_id'] = $this->auth->id;
	            $result = false;
	            Db::startTrans();
	            try {
					$params['state'] = 0;
	                $result = model('app\index\model\flshop\PayAccount')->allowField(true)->save($params);
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
	    return $this->view->fetch();
	}
	
	/**
	 * 编辑
	 */
	public function userEdit($ids = null)
	{
		// 设置模块
	    $row = model('app\index\model\flshop\PayAccount')->get($ids);
	    if (!$row) {
	        $this->error(__('No Results were found'));
	    }
	    if ($row['user_id'] != $this->auth->id) {
	        $this->error(__('You have no permission'));
	    }
	    if ($this->request->isPost()) {
	        $params = $this->request->post("row/a");
	        if ($params) {
	            $result = false;
	            Db::startTrans();
	            try {
					$params['state'] = 0;
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
	                $this->error(__('No rows were inserted'));
	            }
	        }
	        $this->error(__('Parameter %s can not be empty', ''));
	    }
		$this->assignconfig('bankCode', $row['bankCode']);
		$this->assignconfig('bankName', $row['bankName']);
	    $this->view->assign("row", $row);
	    return $this->view->fetch();
	}
	
	/**
	 * 删除
	 */
	public function userDel($ids = "")
	{
	    if ($ids) {
			$this->model = model('app\index\model\flshop\PayAccount');
	        $pk = $this->model->getPk();
			// 1.1.3升级
	        $this->model->where('user_id', '=',  $this->auth->id);
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
	 * 账单详情
	 */
	public function billDetail($ids = null)
	{
		$this->model = model('app\index\model\flshop\Money');
		$row = $this->model
			->where(['id' => $ids, 'user_id' => $this->auth->id])
			->find();
		if (!$row) {
		    $this->error(__('No Results were found'));
		}
		$this->view->assign("typeList", $this->model->getTypeList());
		$this->view->assign("row", $row);
		return $this->view->fetch();
	}
	/**
	 * 提现详情
	 */
	public function withdrawDetail($ids = null)
	{
		$row = model('app\index\model\flshop\Withdraw')
			->where(['id' => $ids, 'user_id' => $this->auth->id])
			->find();
		if (!$row) {
		    $this->error(__('No Results were found'));
		}
		$this->view->assign("row", $row);
		return $this->view->fetch();
	}
}