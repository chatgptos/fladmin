<?php

namespace app\admin\controller\flshop;

use app\common\controller\Backend;
use think\Db;
use think\Exception;

use think\exception\PDOException;
use think\exception\ValidateException;


/**
 * 用户主题管理
 *
 * @icon fa fa-circle-o
 */
class Theme extends Backend
{
    
    /**
     * Theme模型对象
     * @var \app\admin\model\flshop\Theme
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\flshop\Theme;
        $this->view->assign("statusList", $this->model->getStatusList());
    }

    public function import()
    {
        parent::import();
    }

   /**
    * 添加
    */
   public function add()
   {
       if ($this->request->isPost()) {
           $params = $this->request->post("row/a");
           if ($params) {
               $params = $this->preExcludeFields($params);
               if ($this->dataLimit && $this->dataLimitFieldAutoFill) {
                   $params[$this->dataLimitField] = $this->auth->id;
               }
			   // 获取图片颜色
			   $imgUrl = cdnurl($params['image'], true);
			   $imageInfo = getimagesize($imgUrl);
			   //图片类型
			   $imgType = strtolower(substr(image_type_to_extension($imageInfo[2]) , 1));
			   //对应函数
			   $imageFun = 'imagecreatefrom' . ($imgType == 'jpg' ? 'jpeg' : $imgType);
			   $i = $imageFun($imgUrl);
			   //循环色值
			   $rColorNum = $gColorNum = $bColorNum = $total = 0;
			   for ($x = 0; $x < imagesx($i); $x++) {
			       for ($y = 0; $y < imagesy($i); $y++) {
			           $rgb = imagecolorat($i, $x, $y);
			           //三通道
			           $r = ($rgb >> 16) & 0xFF;
			           $g = ($rgb >> 8) & 0xFF;
			           $b = $rgb & 0xFF;
			           $rColorNum+= $r;
			           $gColorNum+= $g;
			           $bColorNum+= $b;
			           $total++;
			       }
			   }
			   $r = round($rColorNum / $total);
			   $g = round($gColorNum / $total);
			   $b = round($bColorNum / $total);
			   $r = dechex($r < 0 ? 0 : ($r > 255 ? 255 : $r));
			   $g = dechex($g < 0 ? 0 : ($g > 255 ? 255 : $g));
			   $b = dechex($b < 0 ? 0 : ($b > 255 ? 255 : $b));
			   $color = (strlen($r) < 2 ? '0' : '') . $r;
			   $color.= (strlen($g) < 2 ? '0' : '') . $g;
			   $color.= (strlen($b) < 2 ? '0' : '') . $b;
			   $params['color'] = '#' . $color;
			   
               $result = false;
               Db::startTrans();
               try {
                   //是否采用模型验证
                   if ($this->modelValidate) {
                       $name = str_replace("\\model\\", "\\validate\\", get_class($this->model));
                       $validate = is_bool($this->modelValidate) ? ($this->modelSceneValidate ? $name . '.add' : $name) : $this->modelValidate;
                       $this->model->validateFailException(true)->validate($validate);
                   }
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
       return $this->view->fetch();
   }
    

}
