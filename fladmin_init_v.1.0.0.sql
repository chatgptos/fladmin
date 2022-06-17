/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50726
Source Host           : localhost:3306
Source Database       : fl_live_supper_base

Target Server Type    : MYSQL
Target Server Version : 50726
File Encoding         : 65001

Date: 2022-06-17 14:41:54
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `fladmin`
-- ----------------------------
DROP TABLE IF EXISTS `fladmin`;
CREATE TABLE `fladmin` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID' ,
`username`  varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '用户名' ,
`nickname`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '昵称' ,
`password`  varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '密码' ,
`salt`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '密码盐' ,
`avatar`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '头像' ,
`email`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '电子邮箱' ,
`mobile`  varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '手机号码' ,
`loginfailure`  tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '失败次数' ,
`logintime`  bigint(16) NULL DEFAULT NULL COMMENT '登录时间' ,
`loginip`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '登录IP' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '创建时间' ,
`updatetime`  bigint(16) NULL DEFAULT NULL COMMENT '更新时间' ,
`token`  varchar(59) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT 'Session标识' ,
`status`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal' COMMENT '状态' ,
PRIMARY KEY (`id`),
UNIQUE INDEX `username` (`username`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='管理员表'
AUTO_INCREMENT=2

;

-- ----------------------------
-- Records of fladmin
-- ----------------------------
BEGIN;
INSERT INTO `fladmin` VALUES ('1', 'admin', 'Admin', 'c4210159c5713141826343ffa7ab4d25', 'fa90a2', 'http://fenglei.com/assets/img/avatar.png', 'admin@admin.com', '', '0', '1655370427', '127.0.0.1', '1491635035', '1655370427', 'de18ade9-83f5-4dde-8404-f6d968baf9c2', 'normal');
COMMIT;

-- ----------------------------
-- Table structure for `fladmin_log`
-- ----------------------------
DROP TABLE IF EXISTS `fladmin_log`;
CREATE TABLE `fladmin_log` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID' ,
`admin_id`  int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '管理员ID' ,
`username`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '管理员名字' ,
`url`  varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '操作页面' ,
`title`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '日志标题' ,
`content`  longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '内容' ,
`ip`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT 'IP' ,
`useragent`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT 'User-Agent' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '操作时间' ,
PRIMARY KEY (`id`),
INDEX `name` (`username`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='管理员日志表'
AUTO_INCREMENT=8

;

-- ----------------------------
-- Records of fladmin_log
-- ----------------------------
BEGIN;
INSERT INTO `fladmin_log` VALUES ('1', '1', 'admin', '/aeILJiYECR.php/index/login', '登录', '{\"__token__\":\"***\",\"username\":\"admin\",\"password\":\"***\",\"captcha\":\"fnet\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', '1655369717'), ('2', '0', 'Unknown', '/aeILJiYECR.php/index/logout', '', '{\"__token__\":\"***\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', '1655370371'), ('3', '0', 'Unknown', '/aeILJiYECR.php/index/login', '', '{\"__token__\":\"***\",\"username\":\"admin\",\"password\":\"***\",\"captcha\":\"gdbl\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', '1655370422'), ('4', '1', 'admin', '/aeILJiYECR.php/index/login', '登录', '{\"__token__\":\"***\",\"username\":\"admin\",\"password\":\"***\",\"captcha\":\"a6ey\",\"keeplogin\":\"1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', '1655370427'), ('5', '1', 'admin', '/aeILJiYECR.php/general.config/edit', '常规管理 / 系统配置 / 编辑', '{\"__token__\":\"***\",\"row\":{\"name\":\"蜂雷直播平台\",\"beian\":\"网络备案：沪ICP备15022866号-2\",\"version\":\"1.0.2\",\"timezone\":\"Asia\\/Shanghai\",\"forbiddenip\":\"\",\"languages\":\"{&quot;backend&quot;:&quot;zh-cn&quot;,&quot;frontend&quot;:&quot;zh-cn&quot;}\",\"fixedpage\":\"dashboard\"}}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', '1655370481'), ('6', '1', 'admin', '/aeILJiYECR.php/general.config/edit', '常规管理 / 系统配置 / 编辑', '{\"__token__\":\"***\",\"row\":{\"name\":\"蜂雷直播平台\",\"beian\":\"沪ICP备15022866号-2\",\"version\":\"1.0.2\",\"timezone\":\"Asia\\/Shanghai\",\"forbiddenip\":\"\",\"languages\":\"{&quot;backend&quot;:&quot;zh-cn&quot;,&quot;frontend&quot;:&quot;zh-cn&quot;}\",\"fixedpage\":\"dashboard\"}}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', '1655371124'), ('7', '1', 'admin', '/aeILJiYECR.php/general.config/edit', '常规管理 / 系统配置 / 编辑', '{\"__token__\":\"***\",\"row\":{\"name\":\"蜂雷直播平台\",\"beian\":\"沪ICP备15022866号-2\",\"version\":\"1.0.2\",\"timezone\":\"Asia\\/Shanghai\",\"forbiddenip\":\"\",\"languages\":\"{&quot;backend&quot;:&quot;zh-cn&quot;,&quot;frontend&quot;:&quot;zh-cn&quot;}\",\"fixedpage\":\"dashboard\"}}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', '1655371146');
COMMIT;

-- ----------------------------
-- Table structure for `flarea`
-- ----------------------------
DROP TABLE IF EXISTS `flarea`;
CREATE TABLE `flarea` (
`id`  int(10) NOT NULL AUTO_INCREMENT COMMENT 'ID' ,
`pid`  int(10) NULL DEFAULT NULL COMMENT '父id' ,
`shortname`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '简称' ,
`name`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '名称' ,
`mergename`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '全称' ,
`level`  tinyint(4) NULL DEFAULT NULL COMMENT '层级:1=省,2=市,3=区/县' ,
`pinyin`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '拼音' ,
`code`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '长途区号' ,
`zip`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '邮编' ,
`first`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '首字母' ,
`lng`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '经度' ,
`lat`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '纬度' ,
PRIMARY KEY (`id`),
INDEX `pid` (`pid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='地区表'
AUTO_INCREMENT=1

;

-- ----------------------------
-- Records of flarea
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for `flattachment`
-- ----------------------------
DROP TABLE IF EXISTS `flattachment`;
CREATE TABLE `flattachment` (
`id`  int(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID' ,
`category`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '类别' ,
`admin_id`  int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '管理员ID' ,
`user_id`  int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '会员ID' ,
`url`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '物理路径' ,
`imagewidth`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '宽度' ,
`imageheight`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '高度' ,
`imagetype`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '图片类型' ,
`imageframes`  int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '图片帧数' ,
`filename`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '文件名称' ,
`filesize`  int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '文件大小' ,
`mimetype`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT 'mime类型' ,
`extparam`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '透传数据' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '创建日期' ,
`updatetime`  bigint(16) NULL DEFAULT NULL COMMENT '更新时间' ,
`uploadtime`  bigint(16) NULL DEFAULT NULL COMMENT '上传时间' ,
`storage`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'local' COMMENT '存储位置' ,
`sha1`  varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '文件 sha1编码' ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='附件表'
AUTO_INCREMENT=2

;

-- ----------------------------
-- Records of flattachment
-- ----------------------------
BEGIN;
INSERT INTO `flattachment` VALUES ('1', '', '1', '0', '/assets/img/qrcode.png', '150', '150', 'png', '0', 'qrcode.png', '21859', 'image/png', '', '1491635035', '1491635035', '1491635035', 'local', '17163603d0263e4838b9387ff2cd4877e8b018f6');
COMMIT;

-- ----------------------------
-- Table structure for `flauth_group`
-- ----------------------------
DROP TABLE IF EXISTS `flauth_group`;
CREATE TABLE `flauth_group` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
`pid`  int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '父组别' ,
`name`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '组名' ,
`rules`  text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '规则ID' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '创建时间' ,
`updatetime`  bigint(16) NULL DEFAULT NULL COMMENT '更新时间' ,
`status`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '状态' ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='分组表'
AUTO_INCREMENT=6

;

-- ----------------------------
-- Records of flauth_group
-- ----------------------------
BEGIN;
INSERT INTO `flauth_group` VALUES ('1', '0', 'Admin group', '*', '1491635035', '1491635035', 'normal'), ('2', '1', 'Second group', '13,14,16,15,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,40,41,42,43,44,45,46,47,48,49,50,55,56,57,58,59,60,61,62,63,64,65,1,9,10,11,7,6,8,2,4,5', '1491635035', '1491635035', 'normal'), ('3', '2', 'Third group', '1,4,9,10,11,13,14,15,16,17,40,41,42,43,44,45,46,47,48,49,50,55,56,57,58,59,60,61,62,63,64,65,5', '1491635035', '1491635035', 'normal'), ('4', '1', 'Second group 2', '1,4,13,14,15,16,17,55,56,57,58,59,60,61,62,63,64,65', '1491635035', '1491635035', 'normal'), ('5', '2', 'Third group 2', '1,2,6,7,8,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34', '1491635035', '1491635035', 'normal');
COMMIT;

-- ----------------------------
-- Table structure for `flauth_group_access`
-- ----------------------------
DROP TABLE IF EXISTS `flauth_group_access`;
CREATE TABLE `flauth_group_access` (
`uid`  int(10) UNSIGNED NOT NULL COMMENT '会员ID' ,
`group_id`  int(10) UNSIGNED NOT NULL COMMENT '级别ID' ,
UNIQUE INDEX `uid_group_id` (`uid`, `group_id`) USING BTREE ,
INDEX `uid` (`uid`) USING BTREE ,
INDEX `group_id` (`group_id`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='权限分组表'

;

-- ----------------------------
-- Records of flauth_group_access
-- ----------------------------
BEGIN;
INSERT INTO `flauth_group_access` VALUES ('1', '1');
COMMIT;

-- ----------------------------
-- Table structure for `flauth_rule`
-- ----------------------------
DROP TABLE IF EXISTS `flauth_rule`;
CREATE TABLE `flauth_rule` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
`type`  enum('menu','file') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'file' COMMENT 'menu为菜单,file为权限节点' ,
`pid`  int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '父ID' ,
`name`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '规则名称' ,
`title`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '规则名称' ,
`icon`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '图标' ,
`url`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '规则URL' ,
`condition`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '条件' ,
`remark`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '备注' ,
`ismenu`  tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否为菜单' ,
`menutype`  enum('addtabs','blank','dialog','ajax') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '菜单类型' ,
`extend`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '扩展属性' ,
`py`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '拼音首字母' ,
`pinyin`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '拼音' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '创建时间' ,
`updatetime`  bigint(16) NULL DEFAULT NULL COMMENT '更新时间' ,
`weigh`  int(10) NOT NULL DEFAULT 0 COMMENT '权重' ,
`status`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '状态' ,
PRIMARY KEY (`id`),
UNIQUE INDEX `name` (`name`) USING BTREE ,
INDEX `pid` (`pid`) USING BTREE ,
INDEX `weigh` (`weigh`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='节点表'
AUTO_INCREMENT=85

;

-- ----------------------------
-- Records of flauth_rule
-- ----------------------------
BEGIN;
INSERT INTO `flauth_rule` VALUES ('1', 'file', '0', 'dashboard', 'Dashboard', 'fa fa-dashboard', '', '', 'Dashboard tips', '1', null, '', 'kzt', 'kongzhitai', '1491635035', '1491635035', '143', 'normal'), ('2', 'file', '0', 'general', 'General', 'fa fa-cogs', '', '', '', '1', null, '', 'cggl', 'changguiguanli', '1491635035', '1491635035', '137', 'normal'), ('3', 'file', '0', 'category', 'Category', 'fa fa-leaf', '', '', 'Category tips', '0', null, '', 'flgl', 'fenleiguanli', '1491635035', '1491635035', '119', 'normal'), ('4', 'file', '0', 'addon', 'Addon', 'fa fa-rocket', '', '', 'Addon tips', '1', null, '', 'cjgl', 'chajianguanli', '1491635035', '1491635035', '0', 'normal'), ('5', 'file', '0', 'auth', 'Auth', 'fa fa-group', '', '', '', '1', null, '', 'qxgl', 'quanxianguanli', '1491635035', '1491635035', '99', 'normal'), ('6', 'file', '2', 'general/config', 'Config', 'fa fa-cog', '', '', 'Config tips', '1', null, '', 'xtpz', 'xitongpeizhi', '1491635035', '1491635035', '60', 'normal'), ('7', 'file', '2', 'general/attachment', 'Attachment', 'fa fa-file-image-o', '', '', 'Attachment tips', '1', null, '', 'fjgl', 'fujianguanli', '1491635035', '1491635035', '53', 'normal'), ('8', 'file', '2', 'general/profile', 'Profile', 'fa fa-user', '', '', '', '1', null, '', 'grzl', 'gerenziliao', '1491635035', '1491635035', '34', 'normal'), ('9', 'file', '5', 'auth/admin', 'Admin', 'fa fa-user', '', '', 'Admin tips', '1', null, '', 'glygl', 'guanliyuanguanli', '1491635035', '1491635035', '118', 'normal'), ('10', 'file', '5', 'auth/adminlog', 'Admin log', 'fa fa-list-alt', '', '', 'Admin log tips', '1', null, '', 'glyrz', 'guanliyuanrizhi', '1491635035', '1491635035', '113', 'normal'), ('11', 'file', '5', 'auth/group', 'Group', 'fa fa-group', '', '', 'Group tips', '1', null, '', 'jsz', 'juesezu', '1491635035', '1491635035', '109', 'normal'), ('12', 'file', '5', 'auth/rule', 'Rule', 'fa fa-bars', '', '', 'Rule tips', '1', null, '', 'cdgz', 'caidanguize', '1491635035', '1491635035', '104', 'normal'), ('13', 'file', '1', 'dashboard/index', 'View', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '136', 'normal'), ('14', 'file', '1', 'dashboard/add', 'Add', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '135', 'normal'), ('15', 'file', '1', 'dashboard/del', 'Delete', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '133', 'normal'), ('16', 'file', '1', 'dashboard/edit', 'Edit', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '134', 'normal'), ('17', 'file', '1', 'dashboard/multi', 'Multi', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '132', 'normal'), ('18', 'file', '6', 'general/config/index', 'View', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '52', 'normal'), ('19', 'file', '6', 'general/config/add', 'Add', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '51', 'normal'), ('20', 'file', '6', 'general/config/edit', 'Edit', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '50', 'normal'), ('21', 'file', '6', 'general/config/del', 'Delete', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '49', 'normal'), ('22', 'file', '6', 'general/config/multi', 'Multi', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '48', 'normal'), ('23', 'file', '7', 'general/attachment/index', 'View', 'fa fa-circle-o', '', '', 'Attachment tips', '0', null, '', '', '', '1491635035', '1491635035', '59', 'normal'), ('24', 'file', '7', 'general/attachment/select', 'Select attachment', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '58', 'normal'), ('25', 'file', '7', 'general/attachment/add', 'Add', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '57', 'normal'), ('26', 'file', '7', 'general/attachment/edit', 'Edit', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '56', 'normal'), ('27', 'file', '7', 'general/attachment/del', 'Delete', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '55', 'normal'), ('28', 'file', '7', 'general/attachment/multi', 'Multi', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '54', 'normal'), ('29', 'file', '8', 'general/profile/index', 'View', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '33', 'normal'), ('30', 'file', '8', 'general/profile/update', 'Update profile', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '32', 'normal'), ('31', 'file', '8', 'general/profile/add', 'Add', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '31', 'normal'), ('32', 'file', '8', 'general/profile/edit', 'Edit', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '30', 'normal'), ('33', 'file', '8', 'general/profile/del', 'Delete', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '29', 'normal'), ('34', 'file', '8', 'general/profile/multi', 'Multi', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '28', 'normal'), ('35', 'file', '3', 'category/index', 'View', 'fa fa-circle-o', '', '', 'Category tips', '0', null, '', '', '', '1491635035', '1491635035', '142', 'normal'), ('36', 'file', '3', 'category/add', 'Add', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '141', 'normal'), ('37', 'file', '3', 'category/edit', 'Edit', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '140', 'normal'), ('38', 'file', '3', 'category/del', 'Delete', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '139', 'normal'), ('39', 'file', '3', 'category/multi', 'Multi', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '138', 'normal'), ('40', 'file', '9', 'auth/admin/index', 'View', 'fa fa-circle-o', '', '', 'Admin tips', '0', null, '', '', '', '1491635035', '1491635035', '117', 'normal'), ('41', 'file', '9', 'auth/admin/add', 'Add', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '116', 'normal'), ('42', 'file', '9', 'auth/admin/edit', 'Edit', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '115', 'normal'), ('43', 'file', '9', 'auth/admin/del', 'Delete', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '114', 'normal'), ('44', 'file', '10', 'auth/adminlog/index', 'View', 'fa fa-circle-o', '', '', 'Admin log tips', '0', null, '', '', '', '1491635035', '1491635035', '112', 'normal'), ('45', 'file', '10', 'auth/adminlog/detail', 'Detail', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '111', 'normal'), ('46', 'file', '10', 'auth/adminlog/del', 'Delete', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '110', 'normal'), ('47', 'file', '11', 'auth/group/index', 'View', 'fa fa-circle-o', '', '', 'Group tips', '0', null, '', '', '', '1491635035', '1491635035', '108', 'normal'), ('48', 'file', '11', 'auth/group/add', 'Add', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '107', 'normal'), ('49', 'file', '11', 'auth/group/edit', 'Edit', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '106', 'normal'), ('50', 'file', '11', 'auth/group/del', 'Delete', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '105', 'normal'), ('51', 'file', '12', 'auth/rule/index', 'View', 'fa fa-circle-o', '', '', 'Rule tips', '0', null, '', '', '', '1491635035', '1491635035', '103', 'normal'), ('52', 'file', '12', 'auth/rule/add', 'Add', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '102', 'normal'), ('53', 'file', '12', 'auth/rule/edit', 'Edit', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '101', 'normal'), ('54', 'file', '12', 'auth/rule/del', 'Delete', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '100', 'normal'), ('55', 'file', '4', 'addon/index', 'View', 'fa fa-circle-o', '', '', 'Addon tips', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('56', 'file', '4', 'addon/add', 'Add', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('57', 'file', '4', 'addon/edit', 'Edit', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('58', 'file', '4', 'addon/del', 'Delete', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('59', 'file', '4', 'addon/downloaded', 'Local addon', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('60', 'file', '4', 'addon/state', 'Update state', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('63', 'file', '4', 'addon/config', 'Setting', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('64', 'file', '4', 'addon/refresh', 'Refresh', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('65', 'file', '4', 'addon/multi', 'Multi', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('66', 'file', '0', 'user', 'User', 'fa fa-user-circle', '', '', '', '1', null, '', 'hygl', 'huiyuanguanli', '1491635035', '1491635035', '0', 'normal'), ('67', 'file', '66', 'user/user', 'User', 'fa fa-user', '', '', '', '1', null, '', 'hygl', 'huiyuanguanli', '1491635035', '1491635035', '0', 'normal'), ('68', 'file', '67', 'user/user/index', 'View', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('69', 'file', '67', 'user/user/edit', 'Edit', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('70', 'file', '67', 'user/user/add', 'Add', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('71', 'file', '67', 'user/user/del', 'Del', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('72', 'file', '67', 'user/user/multi', 'Multi', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('73', 'file', '66', 'user/group', 'User group', 'fa fa-users', '', '', '', '1', null, '', 'hyfz', 'huiyuanfenzu', '1491635035', '1491635035', '0', 'normal'), ('74', 'file', '73', 'user/group/add', 'Add', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('75', 'file', '73', 'user/group/edit', 'Edit', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('76', 'file', '73', 'user/group/index', 'View', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('77', 'file', '73', 'user/group/del', 'Del', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('78', 'file', '73', 'user/group/multi', 'Multi', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('79', 'file', '66', 'user/rule', 'User rule', 'fa fa-circle-o', '', '', '', '1', null, '', 'hygz', 'huiyuanguize', '1491635035', '1491635035', '0', 'normal'), ('80', 'file', '79', 'user/rule/index', 'View', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('81', 'file', '79', 'user/rule/del', 'Del', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('82', 'file', '79', 'user/rule/add', 'Add', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('83', 'file', '79', 'user/rule/edit', 'Edit', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal'), ('84', 'file', '79', 'user/rule/multi', 'Multi', 'fa fa-circle-o', '', '', '', '0', null, '', '', '', '1491635035', '1491635035', '0', 'normal');
COMMIT;

-- ----------------------------
-- Table structure for `flcategory`
-- ----------------------------
DROP TABLE IF EXISTS `flcategory`;
CREATE TABLE `flcategory` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
`pid`  int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '父ID' ,
`type`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '栏目类型' ,
`name`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' ,
`nickname`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' ,
`flag`  set('hot','index','recommend') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' ,
`image`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '图片' ,
`keywords`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '关键字' ,
`description`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '描述' ,
`diyname`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '自定义名称' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '创建时间' ,
`updatetime`  bigint(16) NULL DEFAULT NULL COMMENT '更新时间' ,
`weigh`  int(10) NOT NULL DEFAULT 0 COMMENT '权重' ,
`status`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '状态' ,
PRIMARY KEY (`id`),
INDEX `weigh` (`weigh`, `id`) USING BTREE ,
INDEX `pid` (`pid`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='分类表'
AUTO_INCREMENT=14

;

-- ----------------------------
-- Records of flcategory
-- ----------------------------
BEGIN;
INSERT INTO `flcategory` VALUES ('1', '0', 'page', '官方新闻', 'news', 'recommend', '/assets/img/qrcode.png', '', '', 'news', '1491635035', '1491635035', '1', 'normal'), ('2', '0', 'page', '移动应用', 'mobileapp', 'hot', '/assets/img/qrcode.png', '', '', 'mobileapp', '1491635035', '1491635035', '2', 'normal'), ('3', '2', 'page', '微信公众号', 'wechatpublic', 'index', '/assets/img/qrcode.png', '', '', 'wechatpublic', '1491635035', '1491635035', '3', 'normal'), ('4', '2', 'page', 'Android开发', 'android', 'recommend', '/assets/img/qrcode.png', '', '', 'android', '1491635035', '1491635035', '4', 'normal'), ('5', '0', 'page', '软件产品', 'software', 'recommend', '/assets/img/qrcode.png', '', '', 'software', '1491635035', '1491635035', '5', 'normal'), ('6', '5', 'page', '网站建站', 'website', 'recommend', '/assets/img/qrcode.png', '', '', 'website', '1491635035', '1491635035', '6', 'normal'), ('7', '5', 'page', '企业管理软件', 'company', 'index', '/assets/img/qrcode.png', '', '', 'company', '1491635035', '1491635035', '7', 'normal'), ('8', '6', 'page', 'PC端', 'website-pc', 'recommend', '/assets/img/qrcode.png', '', '', 'website-pc', '1491635035', '1491635035', '8', 'normal'), ('9', '6', 'page', '移动端', 'website-mobile', 'recommend', '/assets/img/qrcode.png', '', '', 'website-mobile', '1491635035', '1491635035', '9', 'normal'), ('10', '7', 'page', 'CRM系统 ', 'company-crm', 'recommend', '/assets/img/qrcode.png', '', '', 'company-crm', '1491635035', '1491635035', '10', 'normal'), ('11', '7', 'page', 'SASS平台软件', 'company-sass', 'recommend', '/assets/img/qrcode.png', '', '', 'company-sass', '1491635035', '1491635035', '11', 'normal'), ('12', '0', 'test', '测试1', 'test1', 'recommend', '/assets/img/qrcode.png', '', '', 'test1', '1491635035', '1491635035', '12', 'normal'), ('13', '0', 'test', '测试2', 'test2', 'recommend', '/assets/img/qrcode.png', '', '', 'test2', '1491635035', '1491635035', '13', 'normal');
COMMIT;

-- ----------------------------
-- Table structure for `flconfig`
-- ----------------------------
DROP TABLE IF EXISTS `flconfig`;
CREATE TABLE `flconfig` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
`name`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '变量名' ,
`group`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '分组' ,
`title`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '变量标题' ,
`tip`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '变量描述' ,
`type`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '类型:string,text,int,bool,array,datetime,date,file' ,
`visible`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '可见条件' ,
`value`  text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '变量值' ,
`content`  text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '变量字典数据' ,
`rule`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '验证规则' ,
`extend`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '扩展属性' ,
`setting`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '配置' ,
PRIMARY KEY (`id`),
UNIQUE INDEX `name` (`name`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='系统配置'
AUTO_INCREMENT=19

;

-- ----------------------------
-- Records of flconfig
-- ----------------------------
BEGIN;
INSERT INTO `flconfig` VALUES ('1', 'name', 'basic', 'Site name', '请填写站点名称', 'string', '', '蜂雷直播平台', '', 'required', '', null), ('2', 'beian', 'basic', 'Beian', '粤ICP备15000000号-1', 'string', '', '沪ICP备15022866号-2', '', '', '', null), ('3', 'cdnurl', 'basic', 'Cdn url', '如果全站静态资源使用第三方云储存请配置该值', 'string', '', '', '', '', '', ''), ('4', 'version', 'basic', 'Version', '如果静态资源有变动请重新配置该值', 'string', '', '1.0.5', '', 'required', '', null), ('5', 'timezone', 'basic', 'Timezone', '', 'string', '', 'Asia/Shanghai', '', 'required', '', null), ('6', 'forbiddenip', 'basic', 'Forbidden ip', '一行一条记录', 'text', '', '', '', '', '', null), ('7', 'languages', 'basic', 'Languages', '', 'array', '', '{\"backend\":\"zh-cn\",\"frontend\":\"zh-cn\"}', '', 'required', '', null), ('8', 'fixedpage', 'basic', 'Fixed page', '请尽量输入左侧菜单栏存在的链接', 'string', '', 'dashboard', '', 'required', '', null), ('9', 'categorytype', 'dictionary', 'Category type', '', 'array', '', '{\"default\":\"Default\",\"page\":\"Page\",\"article\":\"Article\",\"test\":\"Test\"}', '', '', '', ''), ('10', 'configgroup', 'dictionary', 'Config group', '', 'array', '', '{\"basic\":\"Basic\",\"email\":\"Email\",\"dictionary\":\"Dictionary\",\"user\":\"User\",\"example\":\"Example\"}', '', '', '', ''), ('11', 'mail_type', 'email', 'Mail type', '选择邮件发送方式', 'select', '', '1', '[\"请选择\",\"SMTP\"]', '', '', ''), ('12', 'mail_smtp_host', 'email', 'Mail smtp host', '错误的配置发送邮件会导致服务器超时', 'string', '', 'smtp.qq.com', '', '', '', ''), ('13', 'mail_smtp_port', 'email', 'Mail smtp port', '(不加密默认25,SSL默认465,TLS默认587)', 'string', '', '465', '', '', '', ''), ('14', 'mail_smtp_user', 'email', 'Mail smtp user', '（填写完整用户名）', 'string', '', '10000', '', '', '', ''), ('15', 'mail_smtp_pass', 'email', 'Mail smtp password', '（填写您的密码或授权码）', 'string', '', 'password', '', '', '', ''), ('16', 'mail_verify_type', 'email', 'Mail vertify type', '（SMTP验证方式[推荐SSL]）', 'select', '', '2', '[\"无\",\"TLS\",\"SSL\"]', '', '', ''), ('17', 'mail_from', 'email', 'Mail from', '', 'string', '', '10000@qq.com', '', '', '', ''), ('18', 'attachmentcategory', 'dictionary', 'Attachment category', '', 'array', '', '{\"category1\":\"Category1\",\"category2\":\"Category2\",\"custom\":\"Custom\"}', '', '', '', '');
COMMIT;

-- ----------------------------
-- Table structure for `flems`
-- ----------------------------
DROP TABLE IF EXISTS `flems`;
CREATE TABLE `flems` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID' ,
`event`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '事件' ,
`email`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '邮箱' ,
`code`  varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '验证码' ,
`times`  int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '验证次数' ,
`ip`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT 'IP' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '创建时间' ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='邮箱验证码表'
AUTO_INCREMENT=1

;

-- ----------------------------
-- Records of flems
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for `flsms`
-- ----------------------------
DROP TABLE IF EXISTS `flsms`;
CREATE TABLE `flsms` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID' ,
`event`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '事件' ,
`mobile`  varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '手机号' ,
`code`  varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '验证码' ,
`times`  int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '验证次数' ,
`ip`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT 'IP' ,
`createtime`  bigint(16) UNSIGNED NULL DEFAULT 0 COMMENT '创建时间' ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='短信验证码表'
AUTO_INCREMENT=1

;

-- ----------------------------
-- Records of flsms
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for `fltest`
-- ----------------------------
DROP TABLE IF EXISTS `fltest`;
CREATE TABLE `fltest` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID' ,
`user_id`  int(10) NULL DEFAULT 0 COMMENT '会员ID' ,
`admin_id`  int(10) NULL DEFAULT 0 COMMENT '管理员ID' ,
`category_id`  int(10) UNSIGNED NULL DEFAULT 0 COMMENT '分类ID(单选)' ,
`category_ids`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '分类ID(多选)' ,
`tags`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '标签' ,
`week`  enum('monday','tuesday','wednesday') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '星期(单选):monday=星期一,tuesday=星期二,wednesday=星期三' ,
`flag`  set('hot','index','recommend') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '标志(多选):hot=热门,index=首页,recommend=推荐' ,
`genderdata`  enum('male','female') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'male' COMMENT '性别(单选):male=男,female=女' ,
`hobbydata`  set('music','reading','swimming') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '爱好(多选):music=音乐,reading=读书,swimming=游泳' ,
`title`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '标题' ,
`content`  text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '内容' ,
`image`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '图片' ,
`images`  varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '图片组' ,
`attachfile`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '附件' ,
`keywords`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '关键字' ,
`description`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '描述' ,
`city`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '省市' ,
`json`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '配置:key=名称,value=值' ,
`multiplejson`  varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '二维数组:title=标题,intro=介绍,author=作者,age=年龄' ,
`price`  decimal(10,2) UNSIGNED NULL DEFAULT 0.00 COMMENT '价格' ,
`views`  int(10) UNSIGNED NULL DEFAULT 0 COMMENT '点击' ,
`workrange`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '时间区间' ,
`startdate`  date NULL DEFAULT NULL COMMENT '开始日期' ,
`activitytime`  datetime NULL DEFAULT NULL COMMENT '活动时间(datetime)' ,
`year`  year NULL DEFAULT NULL COMMENT '年' ,
`times`  time NULL DEFAULT NULL COMMENT '时间' ,
`refreshtime`  bigint(16) NULL DEFAULT NULL COMMENT '刷新时间' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '创建时间' ,
`updatetime`  bigint(16) NULL DEFAULT NULL COMMENT '更新时间' ,
`deletetime`  bigint(16) NULL DEFAULT NULL COMMENT '删除时间' ,
`weigh`  int(10) NULL DEFAULT 0 COMMENT '权重' ,
`switch`  tinyint(1) NULL DEFAULT 0 COMMENT '开关' ,
`status`  enum('normal','hidden') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'normal' COMMENT '状态' ,
`state`  enum('0','1','2') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '1' COMMENT '状态值:0=禁用,1=正常,2=推荐' ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='测试表'
AUTO_INCREMENT=2

;

-- ----------------------------
-- Records of fltest
-- ----------------------------
BEGIN;
INSERT INTO `fltest` VALUES ('1', '1', '1', '12', '12,13', '互联网,计算机', 'monday', 'hot,index', 'male', 'music,reading', '我是一篇测试文章', '<p>我是测试内容</p>', '/assets/img/avatar.png', '/assets/img/avatar.png,/assets/img/qrcode.png', '/assets/img/avatar.png', '关键字', '描述', '广西壮族自治区/百色市/平果县', '{\"a\":\"1\",\"b\":\"2\"}', '[{\"title\":\"标题一\",\"intro\":\"介绍一\",\"author\":\"小明\",\"age\":\"21\"}]', '0.00', '0', '2020-10-01 00:00:00 - 2021-10-31 23:59:59', '2017-07-10', '2017-07-10 18:24:45', '2017', '18:24:45', '1491635035', '1491635035', '1491635035', null, '0', '1', 'normal', '1');
COMMIT;

-- ----------------------------
-- Table structure for `fluser`
-- ----------------------------
DROP TABLE IF EXISTS `fluser`;
CREATE TABLE `fluser` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID' ,
`group_id`  int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '组别ID' ,
`username`  varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '用户名' ,
`nickname`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '昵称' ,
`password`  varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '密码' ,
`salt`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '密码盐' ,
`email`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '电子邮箱' ,
`mobile`  varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '手机号' ,
`avatar`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '头像' ,
`level`  tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '等级' ,
`gender`  tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '性别' ,
`birthday`  date NULL DEFAULT NULL COMMENT '生日' ,
`bio`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '格言' ,
`money`  decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '余额' ,
`score`  int(10) NOT NULL DEFAULT 0 COMMENT '积分' ,
`successions`  int(10) UNSIGNED NOT NULL DEFAULT 1 COMMENT '连续登录天数' ,
`maxsuccessions`  int(10) UNSIGNED NOT NULL DEFAULT 1 COMMENT '最大连续登录天数' ,
`prevtime`  bigint(16) NULL DEFAULT NULL COMMENT '上次登录时间' ,
`logintime`  bigint(16) NULL DEFAULT NULL COMMENT '登录时间' ,
`loginip`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '登录IP' ,
`loginfailure`  tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '失败次数' ,
`joinip`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '加入IP' ,
`jointime`  bigint(16) NULL DEFAULT NULL COMMENT '加入时间' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '创建时间' ,
`updatetime`  bigint(16) NULL DEFAULT NULL COMMENT '更新时间' ,
`token`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT 'Token' ,
`status`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '状态' ,
`verification`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '验证' ,
PRIMARY KEY (`id`),
INDEX `username` (`username`) USING BTREE ,
INDEX `email` (`email`) USING BTREE ,
INDEX `mobile` (`mobile`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='会员表'
AUTO_INCREMENT=3

;

-- ----------------------------
-- Records of fluser
-- ----------------------------
BEGIN;
INSERT INTO `fluser` VALUES ('1', '1', 'admin', 'admin', '2f6126141fc4dd794a26fae629fd444c', 'd17ef8', 'admin@163.com', '13888888888', 'http://fenglei.com/assets/img/avatar.png', '0', '0', '2017-04-08', '', '0.00', '0', '1', '1', '1491635035', '1491635035', '127.0.0.1', '0', '127.0.0.1', '1491635035', '0', '1491635035', '', 'normal', ''), ('2', '0', 'fenglei', 'fenglei', '1146943a422a498ae2b233358425889f', 'i0Kg3n', '1276789849@qq.com', '13236390680', '', '1', '0', null, '', '0.00', '0', '1', '1', '1655370404', '1655370404', '127.0.0.1', '0', '127.0.0.1', '1655370404', '1655370404', '1655370404', '', 'normal', '');
COMMIT;

-- ----------------------------
-- Table structure for `fluser_group`
-- ----------------------------
DROP TABLE IF EXISTS `fluser_group`;
CREATE TABLE `fluser_group` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
`name`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '组名' ,
`rules`  text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '权限节点' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '添加时间' ,
`updatetime`  bigint(16) NULL DEFAULT NULL COMMENT '更新时间' ,
`status`  enum('normal','hidden') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '状态' ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='会员组表'
AUTO_INCREMENT=2

;

-- ----------------------------
-- Records of fluser_group
-- ----------------------------
BEGIN;
INSERT INTO `fluser_group` VALUES ('1', '默认组', '1,2,3,4,5,6,7,8,9,10,11,12', '1491635035', '1491635035', 'normal');
COMMIT;

-- ----------------------------
-- Table structure for `fluser_money_log`
-- ----------------------------
DROP TABLE IF EXISTS `fluser_money_log`;
CREATE TABLE `fluser_money_log` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
`user_id`  int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '会员ID' ,
`money`  decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '变更余额' ,
`before`  decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '变更前余额' ,
`after`  decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '变更后余额' ,
`memo`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '备注' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '创建时间' ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='会员余额变动表'
AUTO_INCREMENT=1

;

-- ----------------------------
-- Records of fluser_money_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for `fluser_rule`
-- ----------------------------
DROP TABLE IF EXISTS `fluser_rule`;
CREATE TABLE `fluser_rule` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
`pid`  int(10) NULL DEFAULT NULL COMMENT '父ID' ,
`name`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '名称' ,
`title`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '标题' ,
`remark`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注' ,
`ismenu`  tinyint(1) NULL DEFAULT NULL COMMENT '是否菜单' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '创建时间' ,
`updatetime`  bigint(16) NULL DEFAULT NULL COMMENT '更新时间' ,
`weigh`  int(10) NULL DEFAULT 0 COMMENT '权重' ,
`status`  enum('normal','hidden') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '状态' ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='会员规则表'
AUTO_INCREMENT=13

;

-- ----------------------------
-- Records of fluser_rule
-- ----------------------------
BEGIN;
INSERT INTO `fluser_rule` VALUES ('1', '0', 'index', 'Frontend', '', '1', '1491635035', '1491635035', '1', 'normal'), ('2', '0', 'api', 'API Interface', '', '1', '1491635035', '1491635035', '2', 'normal'), ('3', '1', 'user', 'User Module', '', '1', '1491635035', '1491635035', '12', 'normal'), ('4', '2', 'user', 'User Module', '', '1', '1491635035', '1491635035', '11', 'normal'), ('5', '3', 'index/user/login', 'Login', '', '0', '1491635035', '1491635035', '5', 'normal'), ('6', '3', 'index/user/register', 'Register', '', '0', '1491635035', '1491635035', '7', 'normal'), ('7', '3', 'index/user/index', 'User Center', '', '0', '1491635035', '1491635035', '9', 'normal'), ('8', '3', 'index/user/profile', 'Profile', '', '0', '1491635035', '1491635035', '4', 'normal'), ('9', '4', 'api/user/login', 'Login', '', '0', '1491635035', '1491635035', '6', 'normal'), ('10', '4', 'api/user/register', 'Register', '', '0', '1491635035', '1491635035', '8', 'normal'), ('11', '4', 'api/user/index', 'User Center', '', '0', '1491635035', '1491635035', '10', 'normal'), ('12', '4', 'api/user/profile', 'Profile', '', '0', '1491635035', '1491635035', '3', 'normal');
COMMIT;

-- ----------------------------
-- Table structure for `fluser_score_log`
-- ----------------------------
DROP TABLE IF EXISTS `fluser_score_log`;
CREATE TABLE `fluser_score_log` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
`user_id`  int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '会员ID' ,
`score`  int(10) NOT NULL DEFAULT 0 COMMENT '变更积分' ,
`before`  int(10) NOT NULL DEFAULT 0 COMMENT '变更前积分' ,
`after`  int(10) NOT NULL DEFAULT 0 COMMENT '变更后积分' ,
`memo`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '备注' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '创建时间' ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='会员积分变动表'
AUTO_INCREMENT=1

;

-- ----------------------------
-- Records of fluser_score_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for `fluser_token`
-- ----------------------------
DROP TABLE IF EXISTS `fluser_token`;
CREATE TABLE `fluser_token` (
`token`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Token' ,
`user_id`  int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '会员ID' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '创建时间' ,
`expiretime`  bigint(16) NULL DEFAULT NULL COMMENT '过期时间' ,
PRIMARY KEY (`token`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='会员Token表'

;

-- ----------------------------
-- Records of fluser_token
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for `flversion`
-- ----------------------------
DROP TABLE IF EXISTS `flversion`;
CREATE TABLE `flversion` (
`id`  int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID' ,
`oldversion`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '旧版本号' ,
`newversion`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '新版本号' ,
`packagesize`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '包大小' ,
`content`  varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '升级内容' ,
`downloadurl`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '下载地址' ,
`enforce`  tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '强制更新' ,
`createtime`  bigint(16) NULL DEFAULT NULL COMMENT '创建时间' ,
`updatetime`  bigint(16) NULL DEFAULT NULL COMMENT '更新时间' ,
`weigh`  int(10) NOT NULL DEFAULT 0 COMMENT '权重' ,
`status`  varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '状态' ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='版本表'
AUTO_INCREMENT=1

;

-- ----------------------------
-- Records of flversion
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Auto increment value for `fladmin`
-- ----------------------------
ALTER TABLE `fladmin` AUTO_INCREMENT=2;

-- ----------------------------
-- Auto increment value for `fladmin_log`
-- ----------------------------
ALTER TABLE `fladmin_log` AUTO_INCREMENT=8;

-- ----------------------------
-- Auto increment value for `flarea`
-- ----------------------------
ALTER TABLE `flarea` AUTO_INCREMENT=1;

-- ----------------------------
-- Auto increment value for `flattachment`
-- ----------------------------
ALTER TABLE `flattachment` AUTO_INCREMENT=2;

-- ----------------------------
-- Auto increment value for `flauth_group`
-- ----------------------------
ALTER TABLE `flauth_group` AUTO_INCREMENT=6;

-- ----------------------------
-- Auto increment value for `flauth_rule`
-- ----------------------------
ALTER TABLE `flauth_rule` AUTO_INCREMENT=85;

-- ----------------------------
-- Auto increment value for `flcategory`
-- ----------------------------
ALTER TABLE `flcategory` AUTO_INCREMENT=14;

-- ----------------------------
-- Auto increment value for `flconfig`
-- ----------------------------
ALTER TABLE `flconfig` AUTO_INCREMENT=19;

-- ----------------------------
-- Auto increment value for `flems`
-- ----------------------------
ALTER TABLE `flems` AUTO_INCREMENT=1;

-- ----------------------------
-- Auto increment value for `flsms`
-- ----------------------------
ALTER TABLE `flsms` AUTO_INCREMENT=1;

-- ----------------------------
-- Auto increment value for `fltest`
-- ----------------------------
ALTER TABLE `fltest` AUTO_INCREMENT=2;

-- ----------------------------
-- Auto increment value for `fluser`
-- ----------------------------
ALTER TABLE `fluser` AUTO_INCREMENT=3;

-- ----------------------------
-- Auto increment value for `fluser_group`
-- ----------------------------
ALTER TABLE `fluser_group` AUTO_INCREMENT=2;

-- ----------------------------
-- Auto increment value for `fluser_money_log`
-- ----------------------------
ALTER TABLE `fluser_money_log` AUTO_INCREMENT=1;

-- ----------------------------
-- Auto increment value for `fluser_rule`
-- ----------------------------
ALTER TABLE `fluser_rule` AUTO_INCREMENT=13;

-- ----------------------------
-- Auto increment value for `fluser_score_log`
-- ----------------------------
ALTER TABLE `fluser_score_log` AUTO_INCREMENT=1;

-- ----------------------------
-- Auto increment value for `flversion`
-- ----------------------------
ALTER TABLE `flversion` AUTO_INCREMENT=1;
