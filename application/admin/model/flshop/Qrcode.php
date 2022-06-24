<?php

namespace app\admin\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class Qrcode extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'flshop_qrcode';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';

    // 追加属性
    protected $append = [
        'template_text',
        'status_text'
    ];
    

    protected static function init()
    {
        self::afterInsert(function ($row) {
            $pk = $row->getPk();
            $row->getQuery()->where($pk, $row[$pk])->update(['weigh' => $row[$pk]]);
        });
    }

    
    public function getTemplateList()
    {
        return ['flshopqrlist001' => __('Template flshopqrlist001'), 'flshopqr' => __('Template flshopqr')];
    }

    public function getStatusList()
    {
        return ['normal' => __('Normal'), 'hidden' => __('Hidden')];
    }


    public function getTemplateTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['template']) ? $data['template'] : '');
        $list = $this->getTemplateList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }




}
