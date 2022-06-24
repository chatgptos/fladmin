<?php
namespace app\admin\controller\flshop;

use app\common\controller\Backend;
use think\Db;
use fast\Tree;



/**
 * 关注评论管理
 *
 * @icon fa fa-circle-o
 */
class Comments extends Backend
{
    
    /**
     * Comments模型对象
     * @var \app\admin\model\flshop\Comments
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\flshop\Comments;
        $this->view->assign("statusList", $this->model->getStatusList());
    }

    public function import()
    {
        parent::import();
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
        if ($this->request->isAjax()) {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField')) {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $list = $this->model
                    ->with(['user'])
                    ->where($where)
                    ->order($sort, $order)
                    ->paginate($limit);
            foreach ($list as $row) {
                $row->getRelation('user')->visible(['nickname']);
            }
            $result = array("total" => $list->total(), "rows" => $list->items());
            return json($result);
        }
        return $this->view->fetch();
    }
    
    /**
     * 详情
     */
    public function detail($find_id = "")
    {
        $list = $this->model
            ->where('find_id', 'in', $find_id)
            ->select();
        foreach ($list as $row) {
			$row->user->visible(['avatar','nickname']);
		}
		$tree = Tree::instance()->init($list);
		$this->assignconfig("list", $tree->getTreeArray(0));
        return $this->view->fetch();
    }
    
    /**
     * 删除
     */
    public function del($ids = "")
    {
        if (!$this->request->isPost()) {
            $this->error(__("Invalid parameters"));
        }
        $ids = $ids ? $ids : $this->request->post("ids");
        if ($ids) {
            $pk = $this->model->getPk();
            $adminIds = $this->getDataLimitAdminIds();
            if (is_array($adminIds)) {
                $this->model->where($this->dataLimitField, 'in', $adminIds);
            }
            $list = $this->model->where($pk, 'in', $ids)->select();

            $count = 0;
            Db::startTrans();
            try {
                $find = [];
                foreach ($list as $k => $v) {
                    $find[] = $v['find_id'];
                    $count += $v->delete();
                }
                // 使用setDec特殊清空下会有异常，校准一次评论总数
                foreach ($find as $id) {
                    model('app\admin\model\flshop\Find')
                        ->where('id', $id)
                        ->update([
                            'comments' => $this->model->where('find_id', $id)->count()
                        ]);
                }
                Db::commit();
            } catch (PDOException $e) {
                Db::rollback();
                $this->error($e->getMessage());
            } catch (Exception $e) {
                Db::rollback();
                $this->error($e->getMessage());
            }
            if ($count) {
                $this->success();
            } else {
                $this->error(__('No rows were deleted'));
            }
        }
        $this->error(__('Parameter %s can not be empty', 'ids'));
    }
    
    /**
     * 还原
     */
    public function restore($ids = "")
    {
        if (!$this->request->isPost()) {
            $this->error(__("Invalid parameters"));
        }
        $ids = $ids ? $ids : $this->request->post("ids");
        $pk = $this->model->getPk();
        $adminIds = $this->getDataLimitAdminIds();
        if (is_array($adminIds)) {
            $this->model->where($this->dataLimitField, 'in', $adminIds);
        }
        if ($ids) {
            $this->model->where($pk, 'in', $ids);
        }
        $count = 0;
        Db::startTrans();
        try {
            $find = [];
            $list = $this->model->onlyTrashed()->select();
            foreach ($list as $index => $item) {
                $find[] = $item['find_id'];
                $count += $item->restore();
            }
            // 使用setDec特殊清空下会有异常，校准一次评论总数
            foreach ($find as $id) {
                model('app\admin\model\flshop\Find')
                    ->where('id', $id)
                    ->update([
                        'comments' => $this->model->where('find_id', $id)->count()
                    ]);
            }
            Db::commit();
        } catch (PDOException $e) {
            Db::rollback();
            $this->error($e->getMessage());
        } catch (Exception $e) {
            Db::rollback();
            $this->error($e->getMessage());
        }
        if ($count) {
            $this->success();
        }
        $this->error(__('No rows were updated'));
    }
    

}