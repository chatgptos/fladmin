<?php

namespace app\admin\model;

use think\Model;


class Signin extends Model
{


    //数据库
    protected $connection = 'database';
    // 表名
    protected $name = 'signin';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = false;
    protected $deleted = false;

    // 追加属性
    protected $append = [

    ];

    public function user()
    {
        return $this->belongsTo('User', 'user_id', 'id')->setEagerlyType(0);
    }

}
