<?php
namespace app\index\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class ShopFreightData extends Model
{

    use SoftDelete;

    // 表名
    protected $name = 'flshop_shop_freight_data';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';
    
	public function getProvinceAttr($value, $data)
	{
	    return explode(',', $value);
	}

	public function getCityAttr($value, $data)
	{
	    return explode(',', $value);
	}
}
