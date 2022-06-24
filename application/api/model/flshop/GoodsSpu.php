<?php

namespace app\api\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class GoodsSpu extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'flshop_goods_spu';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';
	
	// getItemAttr
	public function getItemAttr($value)
	{	
		$return = [];
		if($value){
			foreach(explode(',', $value) as $vo){
			  $return[] = ['name' => $vo];
			}
		}
		return $return;
	}
}
