<?php
namespace app\admin\model\flshop;

use think\Model;
use traits\model\SoftDelete;
use fast\Random;

class Shop extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'flshop_shop';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';

    // 追加属性
    protected $append = [
		'isself', //追加是否为自营店
        'state_text',
		'user_no',
        'status_text'
    ];
    
    // 获取店铺 发现号
    public function getUserNoAttr($value, $data)
    {
    	$findModel = new FindUser;
    	$row = $findModel
    		->where(['user_id' => $data['user_id']])
    		->find();
    	if(!$row){
    		$findModel->user_id = $data['user_id'];
    		$findModel->user_no = Random::nozero(9);
    		$findModel->save();
    		$user_no = $findModel->user_no;
    	}else{
    		$user_no = $row->user_no;
    	}
    	return $user_no;
    }
	
	public function getIsselfAttr($value, $data)
	{
	    return $data['isself'];
	}
	
	
    protected static function init()
    {
        self::afterInsert(function ($row) {
            $pk = $row->getPk();
            $row->getQuery()->where($pk, $row[$pk])->update(['weigh' => $row[$pk]]);
        });
    }

    
    public function getStateList()
    {
        return ['0' => __('State 0'), '1' => __('State 1'), '2' => __('State 2')];
    }

    public function getStatusList()
    {
        return ['normal' => __('Normal'), 'hidden' => __('Hidden')];
    }


    public function getStateTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['state']) ? $data['state'] : '');
        $list = $this->getStateList();
        return isset($list[$value]) ? $list[$value] : '';
    }
	
	public function getStatusTextAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
	    $list = $this->getStatusList();
	    return isset($list[$value]) ? $list[$value] : '';
	}
	
	public function user()
	{
	    return $this->belongsTo('app\common\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}

}
