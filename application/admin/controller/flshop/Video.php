<?php

namespace app\admin\controller\flshop;

use app\common\controller\Backend;
use think\Db;
use think\Exception;

use think\exception\PDOException;

/**
 * 短视频
 *
 * @icon fa fa-circle-o
 */
class Video extends Backend
{
    
    /**
     * Video模型对象
     * @var \app\admin\model\flshop\Video
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\flshop\Video;
        $this->view->assign("suggestionList", $this->model->getSuggestionList());
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
                    ->with(['flshopfind'])
                    ->where($where)
                    ->order($sort, $order)
                    ->paginate($limit);

            foreach ($list as $row) {
                $row->visible(['id','video_id','cover_url','snapshots','suggestion','bitrate','definition','duration','url','format','fps','height','width','size','created']);
                $row->visible(['flshopfind']);
				$row->getRelation('flshopfind')->visible(['id','content']);
            }

            $result = array("total" => $list->total(), "rows" => $list->items());

            return json($result);
        }
        return $this->view->fetch();
    }
    
    /**
     * 播放
     */
    public function detail($ids = "", $video_id = "")
    {
        $where = [];
        if($ids){
            $where['id'] = ['in', $ids];
        }else{
            $where['video_id'] = ['eq', $video_id];
        }
        $row = $this->model
            ->where($where)
            ->find();
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
            $video = [];
            $list = $this->model->onlyTrashed()->select();
            foreach ($list as $index => $row) {
                $video[] = $row['video_id'];
                $count += $row->restore();
            }
            if(isset($video)){
                foreach (model('app\admin\model\flshop\Find')->onlyTrashed()->where('video_id', 'in', $find)->select() as $k => $v) {
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
                $video = [];
                foreach ($list as $k => $row) {
                    $video[] = $row['video_id'];
                    $count += $row->delete();
                }
                if(isset($video)){
                    foreach (model('app\admin\model\flshop\Find')->where('video_id', 'in', $video)->select() as $k => $v) {
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