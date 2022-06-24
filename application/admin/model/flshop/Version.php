<?php

namespace app\admin\model\flshop;

use think\Model;


class Version extends Model
{
    // 表名
    protected $name = 'flshop_version';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = false;

    // 追加属性
    protected $append = [
        'type_text'
    ];
    
    public function getTypeList()
    {
        return ['base' => __('Type base'), 'alpha' => __('Type alpha'), 'beta' => __('Type beta'), 'rc' => __('Type rc'), 'release' => __('Type release')];
    }


    public function getTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['type']) ? $data['type'] : '');
        $list = $this->getTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }




}
