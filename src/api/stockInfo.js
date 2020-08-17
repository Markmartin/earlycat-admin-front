import request from '@/utils/request'

export function listStockInfoList(query) {
  return request({
    url: '/stockinfo/list',
    method: 'get',
    params: query
  })
}

export function findPageByParam(data, page, limit) {
  return request({
    url: `/stockinfo/findPageByParam`,
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: {
      'page': page,
      'limit': limit
    },
    data
  })
  // return request({
  //   url: '/stockinfo/findPageByParam',
  //   method: 'post',
  //   params: {
  //     'page': page,
  //     'limit': limit
  //   },
  //   data
  // })
}

export function deleteStockInfo(id) {
  return request({
    url: '/stockinfo/delete',
    method: 'get',
    params: { id }
  })
}

export function publishStockInfo(data) {
  return request({
    url: '/stockinfo/create',
    method: 'post',
    data
  })
}

export function detailStockInfo(id) {
  return request({
    url: '/stockinfo/detail',
    method: 'get',
    params: { id }
  })
}

export function editStockInfo(data) {
  return request({
    url: '/stockinfo/update',
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
