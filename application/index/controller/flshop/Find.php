<?php

namespace app\index\controller\flshop;

use app\common\controller\flshop;
use addons\flshop\library\AliyunSdk\Video;
use addons\flshop\library\WeixinSdk\Security;
use think\Db;
use think\Exception;
use think\exception\PDOException;
use think\exception\ValidateException;
use fast\Tree;

/**
 * 发现动态管理
 *
 * @icon fa fa-circle-o
 */
class Find extends flshop
{
    protected $noNeedLogin = '';
    protected $noNeedRight = '*';
    /**
     * Find模型对象
     * @var \app\index\model\flshop\Find
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\index\model\flshop\Find;
        $this->view->assign("typeList", $this->model->getTypeList());
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
                    ->where($where)
                    ->order($sort, $order)
                    ->count();

            $list = $this->model
                    ->where($where)
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();
            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        return $this->view->fetch();
    }
	
	/**
     * 作品详情
     */
    public function detail($ids = "")
    {
        $row = $this->model->get($ids);
        if (!$row) {
            $this->error(__('No Results were found'));
        }
		$row['image'] = explode(",", $row['images']);
        $this->view->assign("row", $row);
        return $this->view->fetch();
    }
	
	/**
	 * 作品详情
	 */
	public function play($live_id = "", $video_id = "")
	{
		if($live_id){
			$type = 'live';
			$row = model('app\index\model\flshop\Live')
				->where('id', $live_id)
				->find();
		}else if($video_id){
			$type = 'video';
			$row = model('app\index\model\flshop\Video')
				->where('video_id', $video_id)
				->find();
		}
	    if (!$row) {
	        $this->error(__('No Results were found'));
	    }
		$this->view->assign("row", $row);
		$this->view->assign("type", $type);
	    return $this->view->fetch();
	}
	
	/**
	 * 作品详情
	 */
	public function comments($ids = "")
	{
	    $list = model('app\index\model\flshop\FindComments')
			->where('find_id', 'in', $ids)
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
	public function delcomments($ids = "")
	{
	    if ($ids) {
	        $list = model('app\index\model\flshop\FindComments')
				->where('id', 'in', $ids)
				->where('shop_id', 'eq', $this->shop->id)
				->select();
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
                    model('app\index\model\flshop\Find')
                        ->where('id', $id)
                        ->update([
                            'comments' => model('app\index\model\flshop\FindComments')->where('find_id', $id)->count()
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
	 * 获取视频上传地址和凭证
	 *
	 */
	public function uploadVideo($name)
	{
		$config = get_addon_config('flshop');
	    $vod = new Video($config['video']['regionId'], $config['video']['accessKeyId'], $config['video']['accessKeySecret']);
	    $sts = $vod->createUploadVideo($name, $name, $config['video']['workflowId']);
		if(!$sts){
			$this->error(__('获取上传凭证失败！'));
		}
		$uploadAuth = json_decode(base64_decode($sts->UploadAuth));
		$uploadAddress = json_decode(base64_decode($sts->UploadAddress));
		$ossUrl = parse_url($uploadAddress->Endpoint)['scheme'] . '://' . $uploadAddress->Bucket .'.'.parse_url($uploadAddress->Endpoint)['host'];
		$policy = base64_encode('{"expiration":"'.$uploadAuth->ExpireUTCTime.'","conditions":[["content-length-range",0,1048576000]]}');
		$signature = base64_encode(hash_hmac('sha1', $policy, $uploadAuth->AccessKeySecret, true));
		$this->success('ok', null, [
			'ossUrl' => $ossUrl,
			'videoId' => $sts->VideoId,
			'formData' => [
				'OSSAccessKeyId' => $uploadAuth->AccessKeyId,
				'policy' => $policy,
				'key' => $uploadAddress->FileName,
				'osstoken' => $uploadAuth->SecurityToken,
				'success_action_status' => '200',
				'Signature' => $signature
			]
		]);
	}
	
	/**
	 * 添加
	 */
	public function add($type = null)
	{
		//设置过滤方法
		$this->request->filter(['']);
	    if ($this->request->isPost()) {
	        $params = $this->request->post();
	        if ($params) {
				$config = get_addon_config('flshop');
	            $params['user_no'] = $this->shop->user_no;
				$params['shop_id'] = $this->shop->id;
				$params['user_id'] = $this->auth->id;
				if($config['find']['allExamine_switch'] === 'Y'){
					if($params['type'] === 'video'){
						$video = model('app\index\model\flshop\Video')->get(['video_id' => $params['video_id']]);
						$params['images'] = $video ? $video['snapshots'] : '';
					}
					$params['state'] = 'examine';
				}else{
					if($params['type'] === 'video'){
						$video = model('app\index\model\flshop\Video')->get(['video_id' => $params['video_id']]);
						$params['images'] = $video ? $video['snapshots'] : '';
						$params['state'] = $video ? $video['state'] : 'publish';
					}else{
						$params['state'] = 'normal';
					}
				}
				// 内容审核
				$security = new Security($config['mp_weixin']['appid'], $config['mp_weixin']['appsecret']);
				$checkText = $security->check('msg_sec_check', [
					'content' => $params['content']
				]);
				if($checkText['code'] !== 0)
				{
					if($checkText['code'] === 87014){
						$this->error(__('风控审核：内容包含敏感词请修改后提交'));
					}else{
						$this->error(__($checkText['msg']));
					}
				}
	            $result = false;
	            Db::startTrans();
	            try {
	                $result = $this->model->allowField(true)->save($params);
	                Db::commit();
	            } catch (ValidateException $e) {
	                Db::rollback();
	                $this->error($e->getMessage());
	            } catch (PDOException $e) {
	                Db::rollback();
	                $this->error($e->getMessage());
	            } catch (Exception $e) {
	                Db::rollback();
	                $this->error($e->getMessage());
	            }
	            if ($result !== false) {
	                $this->success();
	            } else {
	                $this->error(__('No rows were inserted'));
	            }
	        }
	        $this->error(__('Parameter %s can not be empty', ''));
	    }
	    
		$this->assignconfig("type", $type ? $type : 'new');
		return $this->view->fetch();
	}
	
	/**
	 * 回收站
	 */
	public function recyclebin()
	{
	    //设置过滤方法
	    $this->request->filter(['strip_tags']);
	    if ($this->request->isAjax()) {
	        list($where, $sort, $order, $offset, $limit) = $this->buildparams();
	        $total = $this->model
	            ->onlyTrashed()
	            ->where($where)
	            ->order($sort, $order)
	            ->count();
	
	        $list = $this->model
	            ->onlyTrashed()
	            ->where($where)
	            ->order($sort, $order)
	            ->limit($offset, $limit)
	            ->select();
	
	        $result = array("total" => $total, "rows" => $list);
	
	        return json($result);
	    }
	    return $this->view->fetch();
	}
	
	/**
	 * 删除
	 */
	public function del($ids = "")
	{
	    if ($ids) {
	        $pk = $this->model->getPk();
	        $this->model->where('shop_id', '=', $this->shop->id);
	        $list = $this->model->where($pk, 'in', $ids)->select();
	
	        $count = 0;
	        Db::startTrans();
	        try {
	            $live = [];
                $video = [];
                foreach ($list as $k => $row) {
                    if($row['type'] === 'live'){
                        $live[] = $row['live_id'];
                    }else if($row['type'] === 'video'){
                        $video[] = $row['video_id'];
                    }
                    $count += $row->delete();
                }
                foreach (model('app\index\model\flshop\Live')->where('id', 'in', $live)->select() as $k => $v) {
                    $v->delete();
                }
                foreach (model('app\index\model\flshop\Video')->where('video_id', 'in', $video)->select() as $k => $v) {
                    $v->delete();
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
	    $pk = $this->model->getPk();
	    $this->model->where('shop_id', '=', $this->shop->id);
	    if ($ids) {
	        $this->model->where($pk, 'in', $ids);
	    }
	    $count = 0;
	    Db::startTrans();
	    try {
	        $live = [];
            $video = [];
            $list = $this->model->onlyTrashed()->select();
            foreach ($list as $index => $row) {
                if($row['type'] === 'live'){
                    $live[] = $row['live_id'];
                }else if($row['type'] === 'video'){
                    $video[] = $row['video_id'];
                }
                $count += $row->restore();
            }
            foreach (model('app\index\model\flshop\Live')->onlyTrashed()->where('id', 'in', $live)->select() as $k => $v) {
                $v->restore();
            }
            foreach (model('app\index\model\flshop\Video')->onlyTrashed()->where('video_id', 'in', $video)->select() as $k => $v) {
                $v->restore();
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
