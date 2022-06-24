<?php

namespace app\admin\model\flshop;

use think\Model;


class Money extends Model
{

    

    

    // 表名
    protected $name = 'user_money_log';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = false;
    protected $deleted = false;

    // 追加属性
    protected $append = [
        'type_text'
    ];
    

    
    public function getTypeList()
    {
        return ['pay' => __('Type pay'), 'groups' => __('Type groups'), 'recharge' => __('Type recharge'), 'withdraw' => __('Type withdraw'), 'refund' => __('Type refund'), 'sys' => __('Type sys')];
    }


    public function getTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['type']) ? $data['type'] : '');
        $list = $this->getTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }




    public function user()
    {
        return $this->belongsTo('app\admin\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}