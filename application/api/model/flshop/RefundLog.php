<?php

namespace app\api\model\flshop;

use think\Model;

class RefundLog extends Model
{

    // 表名
    protected $name = 'flshop_refund_log';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
	
	// 追加属性
	protected $append = [
		'created_text',
	];
	
	public function getcreatedTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['created']) ? $data['created'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}

	public function user()
	{
	    return $this->belongsTo('app\common\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
	
	public function shop()
	{
	    return $this->belongsTo('app\api\model\flshop\Shop', 'shop_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
}
