<?php

namespace app\api\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class PayOutTrade extends Model
{

    use SoftDelete;

    // 表名
    protected $name = 'flshop_pay_out_trade';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';
	
	protected function setPayIdAttr($value)
	{
	    return is_array($value) ? implode(',', $value) : $value;
	}
	
	protected function setOrderIdAttr($value)
	{
	    return is_array($value) ? implode(',', $value) : $value;
	}
}
