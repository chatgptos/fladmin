<?php

namespace app\admin\controller\flshop;

use addons\flshop\library\WanlSdk\QRcode;
use app\common\controller\Backend;
use think\Db;
use think\Exception;
use think\exception\PDOException;
use think\exception\ValidateException;
use fast\Tree; 
use fast\Random;
/**
 * 自定义页面
 *
 * @icon fa fa-circle-o
 */
class Page extends Backend
{
	/**
	 * Page模型对象
	 * @var \app\admin\model\bak\Page
	 */
	protected $model = null;
	
	public function _initialize()
	{
	    parent::_initialize();
	    $this->model = new \app\admin\model\flshop\Page;
		$this->view->assign("typeList", $this->model->getTypeList());
		$this->view->assign("statusList", $this->model->getStatusList());
		$tree = Tree::instance();
		$category = new \app\admin\model\flshop\Category;// 类目
		$tree->init(collection($category->where(['type' => 'goods'])->order('weigh desc,id desc')->field('id,pid,type,name,name_spacer')->select())->toArray(), 'pid');
		$this->assignconfig('pageCategory', $tree->getTreeList($tree->getTreeArray(0), 'name_spacer'));
	}
	
	/**
	 * 页面管理
	 */
	public function index()
	{
		//设置过滤方法
		$this->request->filter(['strip_tags', 'trim']);
		if ($this->request->isAjax()) {
		    //如果发送的来源是Selectpage，则转发到Selectpage
		    if ($this->request->request('keyField')) {
		        return $this->selectpage();
		    }
		    list($where, $sort, $order, $offset, $limit) = $this->buildparams();
		
		    $list = $this->model
		        ->where($where)
				->where('type', 'in', ['page','shop','index'])
		        ->order($sort, $order)
		        ->paginate($limit);
		
		    $result = array("total" => $list->total(), "rows" => $list->items());
		
		    return json($result);
		}
		return $this->view->fetch();
	}
	
	/**
	 * 模板管理
	 */
	public function template()
	{
		//设置过滤方法
		$this->request->filter(['strip_tags', 'trim']);
		if ($this->request->isAjax()) {
		    //如果发送的来源是Selectpage，则转发到Selectpage
		    if ($this->request->request('keyField')) {
		        return $this->selectpage();
		    }
		    list($where, $sort, $order, $offset, $limit) = $this->buildparams();
		
		    $list = $this->model
		        ->where($where)
				->where('type', 'in', ['systpl','shoptpl'])
		        ->order($sort, $order)
		        ->paginate($limit);
			
			$config = get_addon_config('flshop');
			foreach($list as $row){
				$row['url'] = urlencode($config['h5']['domain'].($config['h5']['router_mode'] == 'hash' ? '/#':''). '/pages/page/index?id=' .$row['id']);
			}
		    $result = array("total" => $list->total(), "rows" => $list->items());
		    return json($result);
		}
		$this->view->assign("typeList", $this->model->getTplTypeList());
		return $this->view->fetch();
	}
	
	/**
	 * 二维码生成
	 */
	public function qrcode($url){
		return QRcode::png(urldecode($url), false, 'L', 6, 1);
	}
	
	/**
	 * 将模板发布首页，或将页面发布为模板
	 */
	public function operate($type = null, $ids = null)
	{
		if ($this->request->isPost()) {
			if($type === 'index'){
				$params = $this->model->get($ids);
				if(!$params){
					$this->error('模板异常，无法发布到首页');
				}
				$oldIndex =  $this->model->get(['type' => 'index']);
			}
			if($type === 'systpl'){
				$params = $this->request->post();
				if($params){
					if(!array_key_exists("item", $params)){
						$this->error('页面还没有任何组件哦');
					}
				}else{
					$this->error(__('Parameter %s can not be empty', ''));
				}
			}
			$this->model->name = $type === 'systpl' ? $params['name'].'页_生成模板' : $params['name'];
			$this->model->page_token = $type === 'systpl' ? Random::alnum(16) : $oldIndex['page_token'];
			$this->model->type = $type;
			$this->model->page = json_encode($params['page']);
			$this->model->item = json_encode($params['item']);
			$this->model->save();
			// 如果是首页需要删除其他页面
			if($type === 'index'){
				foreach ($this->model
					->where('page_token', 'eq', $oldIndex['page_token'])
					->where('id', 'neq', $this->model->id)
					->select() as $k => $v) {
				    $v->delete();
				}
				$this->success("更换首页成功", 0, $this->model->id);
			}
			if($type === 'systpl'){
				$this->success("保存模板成功", 0);
			}
		}
	}
	
	/**
	 * 编辑
	 */
	public function edit($ids = null)
	{
	    if ($this->request->isPost()) {
	        $params = $this->request->post();
	        if ($params) {
				if(!array_key_exists("item",$params)){
					$this->error('页面还没有任何组件哦');
				}
				$this->model->shop_id = $params['shop_id'];
				$this->model->name = $params['name'];
				$this->model->cover = $params['cover'];
				$this->model->page_token = $params['page_token'];
				$this->model->type = $params['type'];
				$this->model->page = json_encode($params['page']);
				$this->model->item = json_encode($params['item']);
				$this->model->save();
				// 1.0.8升级 把除此之外的数据全部扔进回收站
				foreach ($this->model
					->where('page_token', 'eq', $this->model->page_token)
					->where('id', 'neq', $this->model->id)
					->select() as $k => $v) {
				    $v->delete();
				}
				// 查询最新历史状态
				// 1.0.8升级
				// $recover = $this->model->onlyTrashed()->where(['page_token'=> $this->model->page_token])->select();
				$this->success("发布并保存成功");
	        }
	        $this->error(__('Parameter %s can not be empty', ''));
	    }
		$row = $this->model->get($ids);
		if (!$row) {
		    $this->error(__('No Results were found'));
		}
		$adminIds = $this->getDataLimitAdminIds();
		if (is_array($adminIds)) {
		    if (!in_array($row[$this->dataLimitField], $adminIds)) {
		        $this->error(__('You have no permission'));
		    }
		}
		$this->assignconfig('page', $row);
		// 1.0.8升级
		// $recover = $this->model->onlyTrashed()->where(['page_token' => $row['page_token']])->select();
		// $this->assignconfig('pageRecover', $recover);
	    return $this->view->fetch();
	}
	
	/**
	 * 云端历史
	 */
	public function history($token = null, $search = null)
	{	
		//设置过滤方法
        $this->request->filter(['strip_tags', 'trim']);
		if ($this->request->isAjax()) {
			$list = $this->model
				->onlyTrashed()
				->where(['page_token' => $token])
				->where('name', 'like', '%'.$search.'%')
				->select();
			$result = array("total" => count($list), "rows" => $list);
			return json($result);
		}
		return $this->view->fetch();
	}
	
	/**
	 * 添加
	 */
	public function add($type = null)
	{
	    if ($this->request->isPost()) {
	        $params = $this->request->post("row/a");
	        if ($params) {
	            $params = $this->preExcludeFields($params);
	
	            if ($this->dataLimit && $this->dataLimitFieldAutoFill) {
	                $params[$this->dataLimitField] = $this->auth->id;
	            }
	            $result = false;
	            Db::startTrans();
	            try {
	                //是否采用模型验证
	                if ($this->modelValidate) {
	                    $name = str_replace("\\model\\", "\\validate\\", get_class($this->model));
	                    $validate = is_bool($this->modelValidate) ? ($this->modelSceneValidate ? $name . '.add' : $name) : $this->modelValidate;
	                    $this->model->validateFailException(true)->validate($validate);
	                }
					if($params['type'] == 'index'){
						if($this->model->where(['type' => 'index'])->count() > 0){
							throw new Exception("APP首页已经存在");
						}
					}
					$params['page_token'] = Random::alnum(16);
					$params['page'] = '{"params":{"navigationBarTitleText":"\u6807\u9898","share_title":"\u5206\u4eab\u6807\u9898"},"style":{"navigationBarTextStyle":"#000000","navigationBarBackgroundColor":"#f5f5f5","navigationBarBackgroundImage":"","pageBackgroundColor":"#ffffff","pageBackgroundImage":""}}';
					$params['item'] = '[]';
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
		$this->view->assign("type", $type);
	    return $this->view->fetch();
	}
	
	/**
	 * 恢复历史
	 */
	public function recover($id = null){
		if ($this->request->isPost()) {
			$row = $this->model
				->onlyTrashed()
				->where('id',$id)
				->find();
			if (!$row) {
			    $this->error(__('No Results were found'));
			}
			$this->success("拉取历史数据成功", "url", $row);
		}
	}
	
	/**
	 * 分类样式
	 */
	public function style(){
		$config = get_addon_config('flshop');
		$this->view->assign("row", $config['style']);
		$this->assignconfig('category_style', $config['style']['category_style']);
		return $this->view->fetch();
	}
	
}