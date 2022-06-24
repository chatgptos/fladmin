<?php

namespace app\api\model\flshop\find;

use think\Model;
use traits\model\SoftDelete;

class CommentsLike extends Model
{

    use SoftDelete;

    // 表名
    protected $name = 'flshop_find_comments_like';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';
	
	public function user()
	{
	    return $this->belongsTo('app\common\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
}
