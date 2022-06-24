<?php
namespace app\api\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class Page extends Model
{
    use SoftDelete;

    // 表名
    protected $name = 'flshop_page';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';

	/**
	 * 将page字段转换数组
	 */
	public function getPageAttr($value)
	{
		$status = json_decode($value, true);
	    return $status;
	}
	
	/**
	 * 将item字段转换数组
	 */
	public function getItemAttr($value)
	{
		$status = json_decode($value, true);
	    return $status;
	}
    
}
