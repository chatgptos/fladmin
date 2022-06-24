<?php

namespace app\admin\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class Live extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'flshop_live';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';

    // 追加属性
    protected $append = [
        'state_text'
    ];
    

    
    public function getStateList()
    {
        return ['0' => __('State 0'), '1' => __('State 1'), '2' => __('State 2'), '3' => __('State 3')];
    }


    public function getStateTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['state']) ? $data['state'] : '');
        $list = $this->getStateList();
        return isset($list[$value]) ? $list[$value] : '';
    }




    public function flshopfind()
    {
        return $this->belongsTo('app\admin\model\flshop\Find', 'id', 'live_id', [], 'LEFT')->setEagerlyType(0);
    }


    public function flshopshop()
    {
        return $this->belongsTo('app\admin\model\flshop\Shop', 'shop_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
