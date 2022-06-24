<?php
namespace app\api\model\flshop;

use think\Model;

class OrderAddress extends Model
{
    // 表名
    protected $name = 'flshop_order_address';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
	
	// 店铺
	public function shop()
	{
	    return $this->belongsTo('app\api\model\flshop\Shop', 'shop_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
}
