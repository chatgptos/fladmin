<?php

namespace app\admin\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class Video extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'flshop_video';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';

    // 追加属性
    protected $append = [
        'suggestion_text'
    ];
    

    
    public function getSuggestionList()
    {
        return ['block' => __('Suggestion block'), 'review' => __('Suggestion review'), 'pass' => __('Suggestion pass')];
    }


    public function getSuggestionTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['suggestion']) ? $data['suggestion'] : '');
        $list = $this->getSuggestionList();
        return isset($list[$value]) ? $list[$value] : '';
    }




    public function flshopfind()
    {
        return $this->belongsTo('app\admin\model\flshop\Find', 'video_id', 'video_id', [], 'LEFT')->setEagerlyType(0);
    }
}
