<?php

namespace app\admin\model;

use think\Model;

class Third extends Model
{


    // 表名
    protected $name = 'third';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = false;

    // 追加属性
    protected $append = [
        'login_time_text',
        'expiretime_text'
    ];


    public function getlogin_timeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['login_time']) ? $data['login_time'] : '');
        return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
    }


    public function getExpiretimeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['expiretime']) ? $data['expiretime'] : '');
        return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
    }

    protected function setlogin_timeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }

    protected function setExpiretimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }

    public function user()
    {
        return $this->belongsTo("User", 'user_id', 'id')->setEagerlyType(0);
    }
}
