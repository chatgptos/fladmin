<?php

namespace app\admin\model\booth;

use think\Model;


class Viewer extends Model
{

    

    

    // 表名
    protected $name = 'booth_viewer';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = false;

    // 定义时间戳字段名
    protected $created = false;
    protected $updateTime = false;
    protected $deleted = false;

    // 追加属性
    protected $append = [
        'edit_time_text'
    ];
    

    



    public function getEditTimeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['edit_time']) ? $data['edit_time'] : '');
        return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
    }

    protected function setEditTimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }


}
