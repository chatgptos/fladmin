<?php

namespace app\api\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class Article extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'flshop_article';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';
	
	// 追加属性
	protected $append = [
		'flag_text',
		'created_text'
	];
	
	public function getcreatedTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['created']) ? $data['created'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}
	
	public function getFlagList()
	{
	    return ['hot' => __('Flag hot'), 'index' => __('Flag index'), 'recommend' => __('Flag recommend')];
	}
	public function getFlagTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['flag']) ? $data['flag'] : '');
	    $valueArr = explode(',', $value);
	    $list = $this->getFlagList();
	    return implode(',', array_intersect_key($list, array_flip($valueArr)));
	}
	
    protected function setFlagAttr($value)
    {
        return is_array($value) ? implode(',', $value) : $value;
    }
	
	public function getImagesAttr($value)
	{	
		return $value ? explode(',', $value) : [];
	}
	

	public function category()
	{
	    return $this->belongsTo('app\api\model\flshop\Category', 'category_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
}
