<?php

namespace app\api\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class Order extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'flshop_order';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';
	
	// 追加属性
	protected $append = [
		'created_text',
	    'paymenttime_text',
	    'delivertime_text',
		'taketime_text',
	    'dealtime_text'
	];
	
	protected function setOrderNoAttr($value)
	{
	    return substr(time(),-8).substr(substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8).$value,-8);
	}
	
	protected function getStateAttr($value){
		return intval($value);
	}
	
	
	public function getcreatedTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['created']) ? $data['created'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}
	
	public function getPaymenttimeTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['paymenttime']) ? $data['paymenttime'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}
	
	
	public function getDelivertimeTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['delivertime']) ? $data['delivertime'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}
	
	public function getTaketimeTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['taketime']) ? $data['taketime'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}
	
	
	public function getDealtimeTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['dealtime']) ? $data['dealtime'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}

	
	
	
    protected function setPaymenttimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }

    protected function setDelivertimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }

    protected function setDealtimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }
	
	

    public function user()
    {
        return $this->belongsTo('app\common\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
	
	// 店铺
	public function shop()
	{
	    return $this->belongsTo('app\api\model\flshop\Shop', 'shop_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
	
	// 快递列表
	public function kuaidi()
	{
	    return $this->belongsTo('app\api\model\flshop\Kuaidi', 'express_name', 'code', [], 'LEFT')->setEagerlyType(0);
	}
	
	

	
	
	
	
}
