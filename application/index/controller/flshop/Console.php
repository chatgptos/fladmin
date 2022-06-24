<?php

namespace app\index\controller\Flshop;

use app\common\controller\Flshop;

/**
 * 主页
 * @internal
 */
class Console extends Flshop
{
    protected $noNeedLogin = '';
    protected $noNeedRight = '*';
    
    public function _initialize()
    {
        parent::_initialize();
    }
    
    public function index()
    {
		$shop_id = $this->shop->id;
		$seventtime = \fast\Date::unixtime('day', -6);
		$paylist = $createlist = [];
		for ($i = 0; $i < 7; $i++)
		{
			$time = $seventtime + ($i * 86400);
		    $day = date("Y-m-d", $time);
			$start = $time;
			$end = $time + 86400;
			// 订单数
		    $createlist[$day] = model('app\index\model\flshop\Order')
				->where('created','between', [$start,$end])
				->where(['shop_id' => $shop_id])
				->count();
			// 成交数
		    $paylist[$day] = model('app\index\model\flshop\Order')
				->where('created','between', [$start,$end])
				->where('created','in', '4,6')
				->where(['shop_id' => $shop_id])
				->count();
		}
		
		//七日增长
		$week = model('app\index\model\flshop\Order')->whereTime('created', 'week')->where('shop_id', $shop_id)->count();
		$lastweek = model('app\index\model\flshop\Order')->whereTime('created', 'last week')->where('shop_id', $shop_id)->count();
		if($week != 0 && $lastweek != 0 ){
			$sevendnu = bcdiv(bcmul(100, bcsub($week, $lastweek, 2), 2), $lastweek, 2);
		}else{
			$sevendnu = 0;
		}
        $this->view->assign([
            'totaluser'        => model('app\index\model\flshop\Goods')->where('shop_id', $shop_id)->count(), //商品总数
            'totalviews'       => model('app\index\model\flshop\Goods')->where('shop_id', $shop_id)->sum('views'), //总访问数
            'totalorder'       => model('app\index\model\flshop\Order')->where('shop_id', $shop_id)->count(), // 总订单数
            'totalorderamount' => model('app\index\model\flshop\Pay')->where('shop_id', $shop_id)->sum('price'), //总金额
            'todayuserlogin'   => model('app\api\model\flshop\Cart')->where('shop_id', $shop_id)->count(), // 加购物车
			'todayusersignup'  => model('app\api\model\flshop\find\Follow')->where('user_no', $this->shop->user_no)->count(), //关注店铺表
            'todayorder'       => model('app\index\model\flshop\Order')->whereTime('created', 'today')->where('shop_id', $shop_id)->count(), // 今日订单数量
            'unsettleorder'    => model('app\index\model\flshop\Order')->whereTime('created', 'today')->where(['shop_id' => $shop_id, 'state' => 2])->count(), // 未处理数量
            'sevendnu'         => $sevendnu.'%',
            'sevendau'         => model('app\index\model\flshop\Pay')->whereTime('created', 'today')->where('shop_id', $shop_id)->sum('price'), //今日销售额
            'paylist'          => $paylist,
            'createlist'       => $createlist
        ]); 
        return $this->view->fetch();
    }
}


