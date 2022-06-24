<?php

namespace app\api\model\flshop;
use think\Model;

class Video extends Model
{


    // 表名
    protected $name = 'flshop_video';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
	
	protected function setSnapshotsAttr($value)
	{
	    return is_array($value) ? implode(',', $value) : $value;
	}
}
