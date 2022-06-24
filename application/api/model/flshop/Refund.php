<?php

namespace app\api\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class Refund extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'flshop_refund';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';
	
	// 追加属性
	protected $append = [
		'created_text',
		'agreetime_text',
		'returntime_text',
		'completetime_text',
	    'closingtime_text',
		'rejecttime_text',
		'expressType_text',
	    'type_text',
	    'reason_text'
	];
	
	public function getcreatedTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['created']) ? $data['created'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}
	
	public function getAgreetimeTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['agreetime']) ? $data['agreetime'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}
	
	public function getReturntimeTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['returntime']) ? $data['returntime'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}
	
	
	public function getRejecttimeTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['rejecttime']) ? $data['rejecttime'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}
	
	public function getClosingtimeTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['closingtime']) ? $data['closingtime'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}
	
	public function getCompletetimeTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['completetime']) ? $data['completetime'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}
	
	
	
	public function getExpresstypeList()
	{
	    return ['0' => __('Expresstype 0'), '1' => __('Expresstype 1')];
	}
	
	public function getTypeList()
	{
	    return ['0' => __('Type 0'), '1' => __('Type 1')];
	}
	
	public function getReasonList()
	{
	    return ['0' => __('Reason 0'), '1' => __('Reason 1'), '2' => __('Reason 2'), '3' => __('Reason 3'), '4' => __('Reason 4'), '5' => __('Reason 5'), '6' => __('Reason 6')];
	}
	
	
	
	
	public function getExpresstypeTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['expressType']) ? $data['expressType'] : '');
	    $list = $this->getExpresstypeList();
	    return isset($list[$value]) ? $list[$value] : '';
	}
	
	
	public function getTypeTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['type']) ? $data['type'] : '');
	    $list = $this->getTypeList();
	    return isset($list[$value]) ? $list[$value] : '';
	}
	
	
	public function getReasonTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['reason']) ? $data['reason'] : '');
	    $list = $this->getReasonList();
	    return isset($list[$value]) ? $list[$value] : '';
	}
	
	
	public function getImagesAttr($value)
	{	
		return $value ? explode(',', $value) : [];
	}
	
	protected function setImagesAttr($value)
	{
	    return is_array($value) ? implode(',', $value) : $value;
	}

	public function user()
	{
	    return $this->belongsTo('app\common\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}

    public function order()
    {
        return $this->belongsTo('app\admin\model\flshop\Order', 'order_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function pay()
    {
        return $this->belongsTo('app\admin\model\flshop\Pay', 'order_pay_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function shop()
    {
        return $this->belongsTo('app\admin\model\flshop\Shop', 'shop_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
	
	
	public function goods()
	{
	    return $this->belongsTo('app\admin\model\flshop\OrderGoods', 'goods_ids', 'id', [], 'LEFT')->setEagerlyType(0);
	}
	
	public function groups()
	{
	    return $this->belongsTo('app\api\model\flshop\groups\OrderGoods', 'goods_ids', 'id', [], 'LEFT')->setEagerlyType(0);
	}
}
