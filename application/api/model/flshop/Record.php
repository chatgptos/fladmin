<?php

namespace app\api\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class Record extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'flshop_record';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';
	
	// 商品
	public function goods()
	{
	    return $this->belongsTo('app\api\model\flshop\Goods', 'goods_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
	
	// 拼团商品
	public function groups()
	{
	    return $this->belongsTo('app\api\model\flshop\groups\Goods', 'goods_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
}
