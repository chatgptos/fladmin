<?php

namespace app\admin\controller\flshop;

use app\common\controller\Backend;

/**
 * 商品评论
 *
 * @icon fa fa-circle-o
 */
class Comment extends Backend
{
    
    /**
     * Comment模型对象
     * @var \app\admin\model\flshop\Comment
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\flshop\Comment;
        $this->view->assign("stateList", $this->model->getStateList());
        $this->view->assign("statusList", $this->model->getStatusList());
    }
    
    /**
     * 查看
     */
    public function index()
    {
        //当前是否为关联查询
        $this->relationSearch = true;
        //设置过滤方法
        $this->request->filter(['strip_tags', 'trim']);
        if ($this->request->isAjax())
        {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
                    ->with(['user','shop'])
                    ->where($where)
                    ->order($sort, $order)
                    ->count();

            $list = $this->model
                    ->with(['user','shop'])
                    ->where($where)
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();

            foreach ($list as $row) {
                $row->getRelation('user')->visible(['username','nickname']);
				$row->getRelation('shop')->visible(['shopname']);
				// 1.0.8升级
				if($row['order_type'] === 'goods'){
					$row['goods'] =  $row->ordergoods->visible(['title']);
				}else{
					$row['goods'] = $row->ordergroups->visible(['title']);
				}
            }
            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        return $this->view->fetch();
    }
	
	/**
	 * 评论详情
	 */
	public function detail($ids = null, $order_id = null)
	{
		$row = $this->model
			->where($order_id ? ['order_id' => $order_id] : ['id' => $ids])
			->find();
	    if (!$row) {
	        $this->error(__('No Results were found'));
	    }
		$row['images'] = explode(',', $row['images']);
		$this->view->assign("row", $row);
	    return $this->view->fetch();
	}
	
}