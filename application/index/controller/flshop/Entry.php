<?php
// 2020年2月17日21:42:31
namespace app\index\controller\flshop;

use app\common\controller\Frontend;
use fast\Http;
/**
 * 审核
 * @internal
 */
class Entry extends Frontend
{
    protected $noNeedLogin = '';
    protected $noNeedRight = '*';
    protected $layout = 'default';
    
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\index\model\flshop\Auth;
		// 获取用户下的申请
        $this->entry = $this->model->where(['user_id' => $this->auth->id])->find();
        $this->view->assign("entry", $this->entry);
		$this->assignconfig("entry", $this->entry);
		// 获取用户手机号码
        $this->view->assign("mobile", $this->auth->mobile);
    }
    
    // 提交资质
    public function index()
    {
        if ($this->request->isPost()) {
            $data = $this->request->post();
			$data['verify'] = '1';
			$data['user_id'] = $this->auth->id;
			$result = $this->entry ? $this->entry->allowField(true)->save($data) : $this->model->allowField(true)->save($data);
			$this->success();
			// $result ? $this->success() : $this->error(__('提交失败'));
        }
		// 如果已经提交过了
		if($this->entry){
			if ($this->entry->verify == '2' || $this->entry->verify == '3') {
			    header('Location:' .url('/index/flshop/entry/stepfour'));
				exit;
			}
		}
		$this->view->assign('title', '商家入驻 - 步骤2 提交资质');
		return $this->view->fetch();
    }
    
    // 提交店铺信息
    public function stepthree()
    {
        if ($this->request->isPost()) {
            $data = $this->request->post();
            $config = get_addon_config('flshop');
            $verify = $config['config']['store_audit'] == 'N' ? 3:2;
            // 更新提交信息
            $data['user_id'] = $this->auth->id;
            $data['verify'] = $verify;
			$this->entry ? $this->entry->allowField(true)->save($data) : $this->model->allowField(true)->save($data);
			// 自动审核
			if($config['config']['store_audit'] == 'N'){
			    $row = model('app\index\model\flshop\Auth')->where(['user_id' => $this->auth->id])->find();
			    model('app\index\model\flshop\Shop')->insert([
					'user_id' => $this->auth->id,
					'state' => $row['state'],
					'shopname' => $row['shopname'],
					'avatar' => $row['avatar'],
					'bio' => $row['content'],
					'description' => $row['bio'],
					'city' => $row['city'],
					'verify' => $verify
				]);
			}
			$this->success();
			// $result ? $this->success() : $this->error(__('提交失败'));
        }
		$this->view->assign('title', '商家入驻 - 步骤3 提交店铺信息');
		return $this->view->fetch();
    }
    
    // 提交审核
    public function stepfour()
    {
        $this->view->assign('title', '商家审核'); 
        return $this->view->fetch();
    }
}
