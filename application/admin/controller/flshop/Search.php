<?php

namespace app\admin\controller\flshop;

use app\common\controller\Backend;

/**
 * 搜索管理
 *
 * @icon fa fa-circle-o
 */
class Search extends Backend
{
    
    /**
     * Search模型对象
     * @var \app\admin\model\flshop\Search
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\flshop\Search;
        $this->view->assign("flagList", $this->model->getFlagList());
        $this->view->assign("statusList", $this->model->getStatusList());
    }
}
