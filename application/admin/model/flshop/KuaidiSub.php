<?php

namespace app\admin\model\flshop;

use think\Model;

class KuaidiSub extends Model
{
    // 表名
    protected $name = 'flshop_kuaidi_sub';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
}
