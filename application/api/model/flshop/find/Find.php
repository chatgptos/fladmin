<?php

namespace app\api\model\flshop\find;

use think\Model;
use traits\model\SoftDelete;

class Find extends Model
{

    use SoftDelete;

    // 表名
    protected $name = 'flshop_find';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';

    // 追加属性
    protected $append = [
        'type_text',
		'created_text',
		'created_date'
    ];
	
	public function getcreatedTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['created']) ? $data['created'] : '');
	    return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
	}
	
	public function getcreatedDateAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['created']) ? $data['created'] : '');
	    return is_numeric($value) ? date("d", $value) : $value;
	}
	
	// 将图片数组转字符串输入
	public function getImagesAttr($value)
	{
		return $value ? explode(',', $value) : [];
	}
	
    public function getTypeList()
    {
        return ['new' => __('Type new'), 'live' => __('Type live'), 'want' => __('Type want'), 'activity' => __('Type activity'), 'show' => __('Type show'), 'video' => __('Type video')];
    }

    public function getTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['type']) ? $data['type'] : '');
        $list = $this->getTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }
	
	protected function setImagesAttr($value)
	{
	    return is_array($value) ? implode(',', $value) : $value;
	}
	
	protected function setGoodsIdsAttr($value)
	{
	    return is_array($value) ? implode(',', $value) : $value;
	}
	
	// 直播
	public function live()
	{
	    return $this->belongsTo('app\api\model\flshop\Live', 'live_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
	
	// 视频
	public function video()
	{
	    return $this->belongsTo('app\api\model\flshop\Video', 'video_id', 'video_id', [], 'LEFT')->setEagerlyType(0);
	}
	
	public function user()
	{
	    return $this->belongsTo('app\common\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
    
}
