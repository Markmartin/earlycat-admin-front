import request from '@/utils/request'

export function listGoods(query) {
  return request({
    url: '/goods/list',
    method: 'get',
    params: query
  })
}

export function deleteGoods(data) {
  return request({
    url: '/goods/delete',
    method: 'post',
    data
  })
}

export function publishGoods(data) {
  return request({
    url: '/goods/create',
    method: 'post',
    data
  })
}

export function detailGoods(id) {
  return request({
    url: '/goods/detail',
    method: 'get',
    params: { id }
  })
}

export function editGoods(data) {
  return request({
    url: '/goods/update',
    method: 'post',
    data
  })
}

export function listCatAndBrand() {
  return request({
    url: '/goods/catAndBrand',
    method: 'get'
  })
}

//获取预售列表
export function getPresellListByParam(data, page, limit) {
  return request({
    url: `/zcmpresell/getPresellList`,
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: {
      'page': page,
      'limit': limit
    },
    data
  })
}

//删除预售及预售物品
export function deletePresellById(id) {
  return request({
    url: '/zcmpresell/deletePresell',
    method: 'get',
    params: { id }
  })
}

//查询所有预售物品
export function getPressGoodsList(acStatus) {
  return request({
    url: '/goods/queryAllList',
    method: 'get',
    params: { acStatus }
  })
}

//查询预售项目绑定的所有预售物品
export function getPresellItemsByPid(id) {
  return request({
    url: '/zcmpresell/getPresellItemsByPid',
    method: 'get',
    params: { id }
  })
}

