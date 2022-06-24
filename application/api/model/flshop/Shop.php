<?php
namespace app\api\model\flshop;

use think\Model;
use fast\Random;

class Shop extends Model
{

    // 表名
    protected $name = 'flshop_shop';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
	
	// 追加属性
	protected $append = [
		'isself', //追加是否为自营店
		'find_user'
	];
	
	public function getIsselfAttr($value, $data)
	{
	    return $data['isself'];
	}
	
	// 获取店铺 发现号
	public function getFindUserAttr($value, $data)
	{
		$find = [];
		$findModel = new find\User;
		$row = $findModel
			->where(['user_id' => $data['user_id']])
			->find();
		if(!$row){
			$findModel->user_id = $data['user_id'];
			$findModel->user_no = Random::nozero(9);
			$findModel->save();
			$find = [
				'user_no' => $findModel->user_no,
				'fans' => 0
			];
		}else{
			$find = [
				'user_no' => $row->user_no,
				'fans' => $row->fans
			];
		}
		return $find;
	}
	
	public function getServiceIdsAttr($value, $data)
	{
	    $value = $value ? $value : (isset($data['service_ids']) ? $data['service_ids'] : '');
	    $valueArr = explode(',', $value);
		$service = [];
		foreach(ShopService::all($valueArr) as $vo){
		   $service[] =  [
			   'id' => $vo['id'],
			   'name' => $vo['name'],
			   'description' => $vo['description']
		   ];
		}
		return $service;
	}
}
