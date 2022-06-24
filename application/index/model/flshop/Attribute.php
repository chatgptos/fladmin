<?php

namespace app\index\model\flshop;

use think\Model;

class Attribute extends Model
{
    // 表名
    protected $name = 'flshop_category_attribute';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
	
	/**
	 * 将value字段转换数组
	 */
	public function getValueAttr($value)
	{
		$status = json_decode($value, true);
	    return $status;
	}
}
