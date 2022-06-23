<?php

namespace app\api\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class ShopService extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'flshop_shop_service';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

}