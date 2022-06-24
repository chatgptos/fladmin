<?php
namespace app\api\controller\flshop;

use app\common\controller\Api;

use EasyWeChat\Factory;
use addons\flshop\library\WeixinSdk\Mp;

/**
 * flshop 微信接口 1.0.8已经为开发者引入，直接使用以下方法二次开发，后续完善
 */
class Wechat extends Api
{
	protected $noNeedLogin = ['*'];
	protected $noNeedRight = ['*'];
	
	public function _initialize()
	{
	    parent::_initialize();
	    $this->wechat = Factory::officialAccount(Mp::config());
	}
	
	public function index()
	{
	    $this->wechat->server->push(function ($message) {
	        switch ($message['MsgType']) {
	            case 'event':
	                return '收到事件消息';
	                break;
	            case 'text':
	                return '收到文字消息';
	                break;
	            case 'image':
	                return '收到图片消息';
	                break;
	            case 'voice':
	                return '收到语音消息';
	                break;
	            case 'video':
	                return '收到视频消息';
	                break;
	            case 'location':
	                return '收到坐标消息';
	                break;
	            case 'link':
	                return '收到链接消息';
	                break;
	            case 'file':
	                return '收到文件消息';
	            // ... 其它消息
	            default:
	                return '收到其它消息';
	                break;
	        }
	    });
		$response = $this->wechat->server->serve();
		// 将响应输出
		$response->send();
		return;
	}
	
	
	/**
	 * 获取JSSDK配置
	 * buildConfig (array $APIs, $debug = false, $beta = false, $json = true)
	 */
	public function config($url)
	{
	    try {
            $this->wechat->jssdk->setUrl(urldecode($url));
    		$row = $this->wechat->jssdk->buildConfig(['updateAppMessageShareData','updateTimelineShareData','editAddress','chooseImage','onMenuShareAppMessage','onMenuShareTimeline','chooseImage','previewImage','uploadImage','downloadImage','chooseWXPay'], false, false, false);
        } catch (\Exception $e) {
            if($e->formattedResponse['errcode'] === 40164){
                $this->error('未在公众平台[设置与开发]添加IP白名单');
            }else{
                $this->error($e->formattedResponse['errmsg']);
            }
        }
		$this->success('返回成功', $row);
	}
	
}