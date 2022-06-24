<?php
namespace app\index\model\flshop\groups;

use think\Model;
use traits\model\SoftDelete;

class Groups extends Model
{

    use SoftDelete;
	
	// 表名
    protected $name = 'flshop_groups';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';

    // 追加属性
    protected $append = [
        'group_type_text',
        'state_text',
        'grouptime_text',
        'validitytime_text',
        'status_text'
    ];
    
    public function getGroupTypeList()
    {
        return ['alone' => __('Group_type alone'), 'group' => __('Group_type group'), 'ladder' => __('Group_type ladder')];
    }

    public function getStateList()
    {
        return ['ready' => __('State ready'), 'start' => __('State start'), 'success' => __('State success'), 'fail' => __('State fail'), 'auto' => __('State auto')];
    }

    public function getStatusList()
    {
        return ['normal' => __('Normal'), 'hidden' => __('Hidden')];
    }


    public function getGroupTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['group_type']) ? $data['group_type'] : '');
        $list = $this->getGroupTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getStateTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['state']) ? $data['state'] : '');
        $list = $this->getStateList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getGrouptimeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['grouptime']) ? $data['grouptime'] : '');
        return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
    }


    public function getValiditytimeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['validitytime']) ? $data['validitytime'] : '');
        return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
    }


    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }

    protected function setGrouptimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }

    protected function setValiditytimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }

    public function goods()
    {
        return $this->belongsTo('app\index\model\flshop\groups\Goods', 'goods_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
	

    public function user()
    {
        return $this->belongsTo('app\common\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
	
}
