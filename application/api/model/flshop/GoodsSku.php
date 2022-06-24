<?php

namespace app\api\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class GoodsSku extends Model
{

    use SoftDelete;

    // 表名
    protected $name = 'flshop_goods_sku';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';
	
	
	// getDifferenceAttr
	public function getDifferenceAttr($value)
	{	
		return $value ? explode(',', $value) : [];
	}
}
