<?php

namespace app\api\controller;

use app\common\controller\Api;

/**
 * 展厅接口
 */
class BoothHall extends Api
{

    //如果$noNeedLogin为空表示所有接口都需要登录才能请求
    //如果$noNeedRight为空表示所有接口都需要验证权限才能请求
    //如果接口已经设置无需登录,那也就无需鉴权了
    //
    // 无需登录的接口,*表示全部
    protected $noNeedLogin = ['getHallById'];
    // 无需鉴权的接口,*表示全部
    protected $noNeedRight = ['test2'];


    /**
     * 展厅
     *
     * @ApiTitle    (展厅/展区)
     * @ApiSummary  (展厅/展区)
     * @ApiMethod   (POST)
     * @ApiParams   (name="id", type="integer", required=true, description="展厅/展区id")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     * @ApiReturnParams   (name="msg", type="string", required=true, sample="返回成功")
     * @ApiReturnParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据返回")
     * @ApiReturn   ({"code":1,"msg":"","time":"1655878085","data":{"id":1,"exhibition_id":5,"hall_name":"2012中国国际渔业博览会海外展区","booths_num":0,"hall_map":".\/home\/img\/16558173804170.jpg","hall_addr":"2012中国国际渔业博览会海外展区","map_height":578,"map_width":845,"hall_namein":"A"}})

     */
    public function getHallById()
    {
        $booth_id = $this->request->post("id");

        $booth_info = \app\admin\model\booth\Hall::where('id', $booth_id)->find();

        $this->success('', $booth_info);
    }



}
