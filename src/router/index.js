import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    perms: ['GET /aaa','POST /bbb']     will control the page perms (you can set multiple perms)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {title: '首页', icon: 'dashboard', noCache: true}
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/erp',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'erp',
    meta: {
      title: 'ERP',
      icon: 'list'
    },
    children: [

      {
        path: 'spuList',
        name: 'spuList',
        component: () => import('@/views/erp/spu/index'),
        meta: {title: '物料列表', icon: 'goods'}
      },
      {
        path: 'spu/add',
        name: 'add',
        component: () => import('@/views/erp/spu/add'),
        meta: {title: '添加物料', icon: 'goods'},
        hidden: true
      },
      {
        path: 'spu/update',
        name: 'update',
        component: () => import('@/views/erp/spu/update'),
        meta: {title: '修改物料', icon: 'goods'},
        hidden: true
      },
      {
        path: 'erpSupplier',
        component: () => import('@/views/erp/erpSupplier'),
        name: 'erpSupplier',
        meta: {
          perms: ['GET /admin/erp/supplier/list'],
          title: '供应商管理',
          noCache: true
        }
      },
      {
        path: 'erpDepot',
        component: () => import('@/views/erp/erpDepot'),
        name: 'erpDepot',
        meta: {
          perms: ['GET /admin/erp/supplier/spu'],
          title: '仓库管理',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/po',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'poManage',
    meta: {
      title: '采购管理',
      icon: 'goods'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/po/index'),
        name: 'poIndex',
        meta: {
          perms: ['GET /admin/po/allList'],
          title: '采购列表',
          noCache: true
        }
      },
      {
        path: 'purchase',
        component: () => import('@/views/po/purchase'),
        name: 'poPurchase',
        meta: {
          perms: ['GET /admin/purchaserGoods/listByAdmin'],
          title: '填写采购单',
          noCache: true
        }
      },
      {
        path: 'purchaseJob',
        component: () => import('@/views/po/purchaseJob'),
        name: 'purchaseJob',
        meta: {
          perms: ['GET /admin/purchaseJob/listByAdmin'],
          title: '采购单管理',
          noCache: true
        }
      },
      {
        path: 'supplier',
        component: () => import('@/views/po/supplier'),
        name: 'poSupplier',
        meta: {
          perms: ['GET /admin/supplier/list'],
          title: '供应商管理',
          noCache: true
        }
      },
      {
        path: 'supplierEdit',
        component: () => import('@/views/po/supplierEdit'),
        name: 'poSupplierEdit',
        meta: {
          perms: ['GET /admin/supplier/create'],
          title: '供应商管理',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'purchaser',
        component: () => import('@/views/po/purchaser'),
        name: 'poPurchaser',
        meta: {
          perms: ['GET /admin/purchaser/list'],
          title: '采购员管理',
          noCache: true
        }
      },
      {
        path: 'purchaserEdit',
        component: () => import('@/views/po/purchaserEdit'),
        name: 'poPurchaserEdit',
        meta: {
          perms: ['GET /admin/purchaser/create'],
          title: '采购员管理',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/po/list'),
        name: 'poList',
        meta: {
          perms: ['GET /admin/po/list', 'POST /admin/po/delete'],
          title: '采购列表',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'details',
        component: () => import('@/views/po/details'),
        name: 'poDetails',
        meta: {
          perms: ['POST /admin/goods/details'],
          title: '采购详情',
          noCache: true
        },
        hidden: true
      }
    ]
  },
  {
    path: '/stockJob',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'stockJobManage',
    meta: {
      title: '仓库管理',
      icon: 'mall'
    },
    children: [
      {
        path: 'out',
        component: () => import('@/views/stockJob/out'),
        name: 'out',
        meta: {
          perms: ['GET /admin/stockJob/outList'],
          title: '出库管理',
          noCache: true
        }
      },
      {
        path: 'in',
        component: () => import('@/views/stockJob/in'),
        name: 'in',
        meta: {
          perms: ['GET /admin/stockJob/inList'],
          title: '入库管理',
          noCache: true
        }
      },
      {
        path: 'station',
        component: () => import('@/views/stockJob/station'),
        name: 'station',
        meta: {
          perms: ['GET /admin/stockJob/stationOrder'],
          title: '工位配货',
          noCache: true
        }
      },
    ]
  },
  {
    path: '/community',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'communityManage',
    meta: {
      title: '社区管理',
      icon: 'community'
    },
    children: [
      {
        path: 'community',
        component: () => import('@/views/community/community'),
        name: 'community',
        meta: {
          perms: ['GET /admin/community/list'],
          title: '社区管理',
          noCache: true
        }
      },
      {
        path: 'group',
        component: () => import('@/views/community/group'),
        name: 'group',
        meta: {
          perms: ['GET /admin/group/list'],
          title: '企微群管理',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/miniShop',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'miniShopManage',
    meta: {
      title: '微菜场管理',
      icon: 'community'
    },
    children: [
      {
        path: 'miniShop',
        component: () => import('@/views/miniShop/list'),
        name: 'miniShop',
        meta: {
          perms: ['GET /admin/retail/selectAll'],
          title: '销售管理',
          noCache: true
        }
      },
    ]
  },
  {
    path: '/terminal',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'terminalManage',
    hidden: true,
    meta: {
      title: '设备管理',
      icon: 'terminal'
    },
    children: [
      {
        path: 'terminal',
        component: () => import('@/views/terminal/terminal'),
        name: 'terminal',
        meta: {
          perms: ['GET /admin/terminal/list'],
          title: '设备管理',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'userManage',
    meta: {
      title: '用户管理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/user'),
        name: 'user',
        meta: {
          perms: ['GET /admin/user/list'],
          title: '会员管理',
          noCache: true
        }
      },
      {
        path: 'address',
        component: () => import('@/views/user/address'),
        name: 'address',
        meta: {
          perms: ['GET /admin/address/list'],
          title: '收货地址',
          noCache: true
        }
      },
      {
        path: 'collect',
        component: () => import('@/views/user/collect'),
        name: 'collect',
        meta: {
          perms: ['GET /admin/collect/list'],
          title: '会员收藏',
          noCache: true
        }
      },
      {
        path: 'footprint',
        component: () => import('@/views/user/footprint'),
        name: 'footprint',
        meta: {
          perms: ['GET /admin/footprint/list'],
          title: '会员足迹',
          noCache: true
        }
      },
      {
        path: 'history',
        component: () => import('@/views/user/history'),
        name: 'history',
        meta: {
          perms: ['GET /admin/history/list'],
          title: '搜索历史',
          noCache: true
        }
      },
      {
        path: 'feedback',
        component: () => import('@/views/user/feedback'),
        name: 'feedback',
        meta: {
          perms: ['GET /admin/feedback/list'],
          title: '意见反馈',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/mall',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'mallManage',
    meta: {
      title: '商场管理',
      icon: 'mall'
    },
    children: [
      {
        path: 'region',
        component: () => import('@/views/mall/region'),
        name: 'region',
        meta: {
          title: '行政区域',
          noCache: true
        }
      },
      {
        path: 'brand',
        component: () => import('@/views/mall/brand'),
        name: 'brand',
        meta: {
          perms: ['GET /admin/brand/list', 'POST /admin/brand/create', 'GET /admin/brand/read', 'POST /admin/brand/update', 'POST /admin/brand/delete'],
          title: '供应商',
          noCache: true
        }
      },
      {
        path: 'category',
        component: () => import('@/views/mall/category'),
        name: 'category',
        meta: {
          perms: ['GET /admin/category/list', 'POST /admin/category/create', 'GET /admin/category/read', 'POST /admin/category/update', 'POST /admin/category/delete'],
          title: '商品类目',
          noCache: true
        }
      },
      {
        path: 'order',
        component: () => import('@/views/mall/order'),
        name: 'order',
        meta: {
          perms: ['GET /admin/order/list', 'GET /admin/order/detail', 'POST /admin/order/ordership', 'POST /admin/order/orderrefund', 'POST /admin/order/orderreply'],
          title: '订单管理',
          noCache: true
        }
      },
      {
        path: 'express',
        component: () => import('@/views/mall/express'),
        name: 'express',
        meta: {
          perms: ['GET /admin/order/expresslist'],
          title: '运单管理',
          noCache: true
        }
      },
      {
        path: 'mainOrder',
        component: () => import('@/views/mall/mainOrder'),
        name: 'mainOrder',
        meta: {
          perms: ['GET /admin/order/listMainOrder'],
          title: '干线订单',
          noCache: true
        }
      },
      {
        path: 'wxOrder',
        component: () => import('@/views/mall/wxOrder'),
        name: 'wxOrder',
        hidden: false,
        meta: {
          perms: ['GET /admin/order/importWxShopOrder'],
          title: '微信订单',
          noCache: true
        }
      },
      {
        path: 'sxOrder',
        component: () => import('@/views/mall/sxOrder'),
        name: 'sxOrder',
        hidden: false,
        meta: {
          perms: ['GET /admin/order/importSxShopOrder'],
          title: '善行订单',
          noCache: true
        }
      },
      {
        path: 'expressLabel',
        component: () => import('@/views/mall/expressLabel'),
        name: 'expressLabel',
        hidden: false,
        meta: {
          perms: ['GET /admin/expressLabel/list'],
          title: '多包打印记录',
          noCache: true
        }
      },
      {
        path: 'issue',
        component: () => import('@/views/mall/issue'),
        name: 'issue',
        meta: {
          perms: ['GET /admin/issue/list', 'POST /admin/issue/create', 'GET /admin/issue/read', 'POST /admin/issue/update', 'POST /admin/issue/delete'],
          title: '通用问题',
          noCache: true
        }
      },
      {
        path: 'keyword',
        component: () => import('@/views/mall/keyword'),
        name: 'keyword',
        meta: {
          perms: ['GET /admin/keyword/list', 'POST /admin/keyword/create', 'GET /admin/keyword/read', 'POST /admin/keyword/update', 'POST /admin/keyword/delete'],
          title: '关键词',
          noCache: true
        }
      }
    ]
  },

  {
    path: '/goods',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'goodsManage',
    meta: {
      title: '商品管理',
      icon: 'goods'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/goods/list'),
        name: 'goodsList',
        meta: {
          perms: ['GET /admin/goods/list', 'POST /admin/goods/delete'],
          title: '商品列表',
          noCache: true
        }
      },
      {
        path: 'create',
        component: () => import('@/views/goods/create'),
        name: 'goodsCreate',
        meta: {
          perms: ['POST /admin/goods/create'],
          title: '商品上架',
          noCache: true
        }
      },
      {
        path: 'edit',
        component: () => import('@/views/goods/edit'),
        name: 'goodsEdit',
        meta: {
          perms: ['GET /admin/goods/detail', 'POST /admin/goods/update', 'POST /admin/goods/catAndBrand'],
          title: '商品编辑',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'comment',
        component: () => import('@/views/goods/comment'),
        name: 'goodsComment',
        meta: {
          perms: ['GET /admin/comment/list', 'POST /admin/comment/delete'],
          title: '商品评论',
          noCache: true
        }
      },
      {
        path: 'presell',
        component: () => import('@/views/goods/presell'),
        name: 'goodsPresell',
        meta: {
          perms: ['GET /admin/presell/list', 'POST /admin/presell/delete'],
          title: '限时销售',
          noCache: true
        }
      },
      {
        path: 'presellItems',
        component: () => import('@/views/goods/presellItems'),
        name: 'presellItems',
        meta: {
          perms: ['POST /admin/presell/list'],
          title: '限时物品',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'autoStock',
        component: () => import('@/views/goods/autoStock'),
        name: 'autoStock',
        meta: {
          perms: ['GET /admin/autoStock/list','POST /admin/autoStock/update','POST /admin/autoStock/add','DELETE /admin/autoStock/delete'],
          title: '定时库存',
          noCache: true
        },
        hidden: false
      },
      {
        path: 'discountRule',
        component: () => import('@/views/goods/discountRule'),
        name: 'discountRule',
        meta: {
          perms: ['GET /admin/presell/list'],
          title: '赠品规则管理',
          noCache: true
        }
      },
      {
        path: 'discountRuleDetail',
        component: () => import('@/views/goods/discountRuleDetail'),
        name: 'discountRuleDetail',
        meta: {
          perms: ['POST /admin/promotion/detail'],
          title: '赠品规则详情',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'goodsInfo',
        component: () => import('@/views/goods/goodsInfo'),
        name: 'goodsInfo',
        meta: {
          perms: ['GET /admin/goods/goodsInfo'],
          title: '商品定价',
          noCache: true
        },
      }
    ]
  },
  {
    path: '/afterSale',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'afterSaleManage',
    meta: {
      title: '售后管理',
      icon: 'mall'
    },
    children: [
      {
        path: 'orderList',
        component: () => import('@/views/afterSale/orderList'),
        name: 'orderList',
        meta: {
          perms: ['GET /admin/order/list', 'GET /admin/order/detail', 'POST /admin/order/ordership', 'POST /admin/order/orderrefund', 'POST /admin/order/orderreply'],
          title: '订单管理',
          noCache: true
        }
      },
      {
        path: 'orderDetail',
        component: () => import('@/views/afterSale/orderDetail'),
        name: 'orderDetail',
        meta: {
          perms: ['GET /admin/goods/detail', 'POST /admin/goods/update', 'POST /admin/goods/catAndBrand'],
          title: '订单详情',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'afterSaleList',
        component: () => import('@/views/afterSale/afterSaleList'),
        name: 'afterSaleList',
        meta: {
          perms: ['GET /admin/afterSale/list', 'POST /admin/afterSale/delete'],
          title: '售后申请',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/line',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'lineManage',
    meta: {
      title: '线路管理',
      icon: 'goods'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/line/line'),
        name: 'lineList',
        meta: {
          perms: ['POST /admin/line/delete', 'GET /admin/line/list', 'POST /admin/line/update', 'POST /admin/line/create'],
          title: '线路列表',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/storedvalue',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'storedvalueManage',
    meta: {
      title: '储值管理',
      icon: 'promotion'
    },
    children: [
      {
        path: 'recharge',
        component: () => import('@/views/storedvalue/recharge'),
        name: 'recharge',
        meta: {
          perms: ['GET /admin/recharge/list'],
          title: '充值卡管理',
          noCache: true
        }
      },
      {
        path: 'rechargeOrder',
        component: () => import('@/views/storedvalue/rechargeOrder'),
        name: 'rechargeOrder',
        meta: {
          perms: ['GET /admin/rechargeOrder/list'],
          title: '充值订单管理',
          noCache: true
        }
      },
      {
        path: 'userRecharge',
        component: () => import('@/views/storedvalue/userRecharge'),
        name: 'userRecharge',
        meta: {
          perms: ['GET /admin/userRecharge/list'],
          title: '充值用户管理',
          noCache: true
        }
      },
    ]
  },
  {
    path: '/agent',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'agentManage',
    meta: {
      title: '总代管理',
      icon: 'promotion'
    },
    children: [
      {
        path: 'agent',
        component: () => import('@/views/agent/agent'),
        name: 'agent',
        meta: {
          perms: ['GET /admin/agent/list'],
          title: '总代管理',
          noCache: true
        }
      },
      {
        path: 'agentWithdraw',
        component: () => import('@/views/agent/agentWithdraw'),
        name: 'agentWithdraw',
        meta: {
          perms: ['GET /admin/agent/withdraw/list'],
          title: '总代提现管理',
          noCache: true
        }
      },
    ]
  },
  {
    path: '/promotion',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'promotionManage',
    meta: {
      title: '推广管理',
      icon: 'promotion'
    },
    children: [
      {
        path: 'ad',
        component: () => import('@/views/promotion/ad'),
        name: 'ad',
        meta: {
          perms: ['GET /admin/ad/list', 'POST /admin/ad/create', 'GET /admin/ad/read', 'POST /admin/ad/update', 'POST /admin/ad/delete'],
          title: '广告管理',
          noCache: true
        }
      },
      {
        path: 'strategy',
        component: () => import('@/views/promotion/strategy'),
        name: 'strategy',
        meta: {
          perms: ['GET /admin/strategy/list'],
          title: '策略组管理',
          noCache: true
        }
      },
      {
        path: 'coupon',
        component: () => import('@/views/promotion/coupon'),
        name: 'coupon',
        meta: {
          perms: ['GET /admin/coupon/list', 'POST /admin/coupon/create', 'POST /admin/coupon/update', 'POST /admin/coupon/delete'],
          title: '优惠券管理',
          noCache: true
        }
      },
      {
        path: 'couponDetail',
        component: () => import('@/views/promotion/couponDetail'),
        name: 'couponDetail',
        meta: {
          perms: ['GET /admin/coupon/list', 'GET /admin/coupon/listuser'],
          title: '优惠券详情',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'topic',
        component: () => import('@/views/promotion/topic'),
        name: 'topic',
        meta: {
          perms: ['GET /admin/topic/list', 'POST /admin/topic/create', 'GET /admin/topic/read', 'POST /admin/topic/update', 'POST /admin/topic/delete'],
          title: '专题管理',
          noCache: true
        }
      },
      {
        path: 'groupon-rule',
        component: () => import('@/views/promotion/grouponRule'),
        name: 'grouponRule',
        meta: {
          perms: ['GET /admin/groupon/list', 'POST /admin/groupon/create', 'POST /admin/groupon/update', 'POST /admin/groupon/delete'],
          title: '团购规则',
          noCache: true
        }
      },
      {
        path: 'groupon-activity',
        component: () => import('@/views/promotion/grouponActivity'),
        name: 'grouponActivity',
        meta: {
          perms: ['GET /admin/groupon/listRecord'],
          title: '团购活动',
          noCache: true
        }
      },
      {
        path: 'income',
        component: () => import('@/views/promotion/income'),
        name: 'income',
        meta: {
          perms: ['GET /admin/income/list'],
          title: '收益明细',
          noCache: true
        }
      },
      {
        path: 'orderCommission',
        component: () => import('@/views/promotion/orderCommission'),
        name: 'orderCommission',
        meta: {
          perms: ['GET /admin/orderCommission/list'],
          title: '推广明细',
          noCache: true
        }
      },
      {
        path: 'orderCommissionCount',
        component: () => import('@/views/promotion/orderCommissionCount'),
        name: 'orderCommissionCount',
        meta: {
          perms: ['GET /admin/orderCommission/count/list'],
          title: '推广统计',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '系统管理',
      icon: 'set'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/sys/admin'),
        name: 'admin',
        meta: {
          perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
          title: '系统用户',
          noCache: true
        }
      },
      {
        path: 'log',
        component: () => import('@/views/sys/log'),
        name: 'log',
        meta: {
          perms: ['GET /admin/log/list'],
          title: '操作日志',
          noCache: true
        }
      },
      {
        path: 'role',
        component: () => import('@/views/sys/role'),
        name: 'role',
        meta: {
          perms: ['GET /admin/role/list', 'POST /admin/role/create', 'POST /admin/role/update', 'POST /admin/role/delete', 'GET /admin/role/permissions', 'POST /admin/role/permissions'],
          title: '角色管理',
          noCache: true
        }
      },
      {
        path: 'os',
        component: () => import('@/views/sys/os'),
        name: 'os',
        meta: {
          perms: ['GET /admin/storage/list', 'POST /admin/storage/create', 'POST /admin/storage/update', 'POST /admin/storage/delete'],
          title: '对象存储',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'configManage',
    meta: {
      title: '配置管理',
      icon: 'config'
    },
    children: [
      {
        path: 'mall',
        component: () => import('@/views/config/mall'),
        name: 'configMall',
        meta: {
          perms: ['GET /admin/config/mall', 'POST /admin/config/mall'],
          title: '商场配置',
          noCache: true
        }
      },
      {
        path: 'express',
        component: () => import('@/views/config/express'),
        name: 'configExpress',
        meta: {
          perms: ['GET /admin/config/express', 'POST /admin/config/express'],
          title: '运费配置',
          noCache: true
        }
      },
      {
        path: 'order',
        component: () => import('@/views/config/order'),
        name: 'configOrder',
        meta: {
          perms: ['GET /admin/config/order', 'POST /admin/config/order'],
          title: '订单配置',
          noCache: true
        }
      },
      {
        path: 'wx',
        component: () => import('@/views/config/wx'),
        name: 'configWx',
        meta: {
          perms: ['GET /admin/config/wx', 'POST /admin/config/wx'],
          title: '小程序配置',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/stat',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'statManage',
    meta: {
      title: '统计报表',
      icon: 'chart'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/stat/user'),
        name: 'statUser',
        meta: {
          perms: ['GET /admin/stat/user'],
          title: '用户统计',
          noCache: true
        }
      },
      {
        path: 'order',
        component: () => import('@/views/stat/order'),
        name: 'statOrder',
        meta: {
          perms: ['GET /admin/stat/order'],
          title: '订单统计',
          noCache: true
        }
      },
      {
        path: 'goods',
        component: () => import('@/views/stat/goods'),
        name: 'statGoods',
        meta: {
          perms: ['GET /admin/stat/goods'],
          title: '商品统计',
          noCache: true
        }
      }
    ]
  },
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   alwaysShow: true,
  //   name: 'externalLink',
  //   meta: {
  //     title: '外链',
  //     icon: 'link'
  //   },
  //   children: [
  //     {
  //       path: 'https://cloud.tencent.com/product/cos',
  //       meta: { title: '腾讯云存储', icon: 'link' }
  //     },
  //     {
  //       path: 'https://cloud.tencent.com/product/sms',
  //       meta: { title: '腾讯云短信', icon: 'link' }
  //     },
  //     {
  //       path: 'https://pay.weixin.qq.com/index.php/core/home/login',
  //       meta: { title: '微信支付', icon: 'link' }
  //     },
  //     {
  //       path: 'https://mpkf.weixin.qq.com/',
  //       meta: { title: '小程序客服', icon: 'link' }
  //     },
  //     {
  //       path: 'https://www.alibabacloud.com/zh/product/oss',
  //       meta: { title: '阿里云存储', icon: 'link' }
  //     },
  //     {
  //       path: 'https://www.qiniu.com/products/kodo',
  //       meta: { title: '七牛云存储', icon: 'link' }
  //     },
  //     {
  //       path: 'http://www.kdniao.com/api-track',
  //       meta: { title: '快递鸟', icon: 'link' }
  //     }
  //   ]
  // },
  {
    path: '/profile',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    children: [
      {
        path: 'password',
        component: () => import('@/views/profile/password'),
        name: 'password',
        meta: { title: '修改密码', noCache: true }
      }
    ],
    hidden: true
  },
  {
    path: '/recruit',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'recruitManage',
    meta: {
      title: '招聘管理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'recruitList',
        component: () => import('@/views/recruit/recruitList'),
        name: 'recruitList',
        meta: {
          perms: ['POST /admin/recruit/list'],
          title: '招聘申请',
          noCache: true
        }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
