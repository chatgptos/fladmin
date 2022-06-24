<?php

namespace app\admin\model\booth;

use think\Model;


class ShopConfig extends Model
{

    

    

    // 表名
    protected $name = 'booth_shop_config';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'integer';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = false;
    protected $deleted = false;

    // 追加属性
    protected $append = [
        'freight_text',
        'iscloud_text',
        'isauto_text'
    ];
    

    
    public function getFreightList()
    {
        return ['0' => __('Freight 0'), '1' => __('Freight 1'), '2' => __('Freight 2')];
    }

    public function getIscloudList()
    {
        return ['0' => __('Iscloud 0'), '1' => __('Iscloud 1')];
    }

    public function getIsautoList()
    {
        return ['0' => __('Isauto 0'), '1' => __('Isauto 1')];
    }


    public function getFreightTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['freight']) ? $data['freight'] : '');
        $list = $this->getFreightList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getIscloudTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['iscloud']) ? $data['iscloud'] : '');
        $list = $this->getIscloudList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getIsautoTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['isauto']) ? $data['isauto'] : '');
        $list = $this->getIsautoList();
        return isset($list[$value]) ? $list[$value] : '';
    }




}
