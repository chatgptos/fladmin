<?php

namespace app\api\model\flshop;

use think\Model;


class ShopSort extends Model
{

    // 表名
    protected $name = 'flshop_shop_sort';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = false;


}
