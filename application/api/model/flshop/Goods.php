<?php

namespace app\api\model\flshop;

use think\Model;
use traits\model\SoftDelete;

class Goods extends Model
{
    use SoftDelete;
	
    // 表名
    protected $name = 'flshop_goods';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $created = 'created';
    protected $updateTime = 'updatetime';
    protected $deleted = 'deleted';
	
	
	// getImagesAttr
	public function getImagesAttr($value)
	{	
		return $value ? explode(',', $value) : [];
	} 
	
	// SKU
	public function getSkuAttr($value, $data)
	{	
		$list = GoodsSku::where(['goods_id'=>$data['id'], 'stock'=>['>',0], 'state'=> ['=',0]])->field('id,thumbnail,difference,price,market_price,stock,state,weigh,sn,sales')->select();
		return $list;
	}
	
	// SPU
	public function getSpuAttr($value, $data)
	{
	    $list = GoodsSpu::where('goods_id',$data['id'])->field('id,name,item')->select();
		return $list;
	}
	
	// 获取评论
	public function getCommentListAttr($value, $data)
	{	
		$comment = new GoodsComment;
		$where = [
			'goods_id' => $data['id'],
			'order_type' => 'goods'
		];
		$list = $comment
			->where($where)
			->order('created desc')
			->field('id,user_id,content,suk,images,score')
			->limit(1) // 默认展示几条评论
			->select();
		foreach ($list as $row) {
		    $row->user->visible(['id','nickname','avatar']);
		}
		return [
			'figure' => $comment->where($where)->where('images','neq', '')->count(), //有图
			// 'tag' => array_count_values($comment->where($where)->limit(100)->column('tag')), //评论标签
			'data' => $list 
		];
	}
	
	
	// 类目属性 格式化
	public function getCategoryAttributeAttr($value)
	{	
		return json_decode($value,true);
	}
	
	// 品牌
	public function brand()
	{
	    return $this->belongsTo('app\api\model\flshop\Brand', 'brand_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
	
	// 运费模板
	public function freight()
	{
	    return $this->belongsTo('app\api\model\flshop\ShopFreight', 'freight_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
	
	// 运费模板
	public function freightdata()
	{
	    return $this->belongsTo('app\api\model\flshop\ShopFreightData', 'freight_id', 'freight_id', [], 'LEFT')->setEagerlyType(0);
	}
	
	// 店铺
	public function shop()
	{
	    return $this->belongsTo('app\api\model\flshop\Shop', 'shop_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
	
	// 类目
	public function category()
	{
	    return $this->belongsTo('app\api\model\flshop\Category', 'category_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
	
	// 店铺类目
	public function shopsort()
	{
	    return $this->belongsTo('app\api\model\flshop\ShopSort', 'shop_category_id', 'id', [], 'LEFT')->setEagerlyType(0);
	}
	
	
	
}
