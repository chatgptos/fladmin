<?php

namespace app\admin\controller\flshop;

use app\common\controller\Backend;
use think\Db;
use think\Exception;

use think\exception\PDOException;
use addons\flshop\library\AliyunSdk\Alilive;

/**
 * 直播管理
 *
 * @icon fa fa-circle-o
 */
class Live extends Backend
{
    
    /**
     * Live模型对象
     * @var \app\admin\model\flshop\Live
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\flshop\Live;
        $this->view->assign("stateList", $this->model->getStateList());
    }

    public function import()
    {
        parent::import();
    }
	
	/**
	 * 直播测试地址
	 */
	public function demo()
	{
		$alilive = new Alilive();
		$alilive = $alilive->auth();
		dump($alilive);exit;
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
                    ->with(['flshopfind','flshopshop'])
                    ->where($where)
                    ->order($sort, $order)
                    ->paginate($limit);

            foreach ($list as $row) {
                $row->visible(['id','shop_id','image','content','liveid','liveurl','pushurl','recordurl','views','like ','state','updatetime']);
                $row->visible(['flshopfind']);
				$row->getRelation('flshopfind')->visible(['id','content']);
				$row->visible(['flshopshop']);
				$row->getRelation('flshopshop')->visible(['shopname']);
            }

            $result = array("total" => $list->total(), "rows" => $list->items());

            return json($result);
        }
        return $this->view->fetch();
    }
    
    /**
     * 查看
     */
    public function detail($live_id = "")
    {
        $row = $this->model->get($live_id);
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        $this->view->assign("row", $row);
        return $this->view->fetch();
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
            $live = [];
            $list = $this->model->onlyTrashed()->select();
            foreach ($list as $index => $row) {
                $live[] = $row['id'];
                $count += $row->restore();
            }
            if(isset($live)){
                foreach (model('app\admin\model\flshop\Find')->onlyTrashed()->where('live_id', 'in', $live)->select() as $k => $v) {
                    $v->restore();
                }
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
                $live = [];
                foreach ($list as $k => $row) {
                    $live[] = $row['id'];
                    $count += $row->delete();
                }
                if(isset($live)){
                    foreach (model('app\admin\model\flshop\Find')->where('live_id', 'in', $live)->select() as $k => $v) {
                        $v->delete();
                    }
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
	
}