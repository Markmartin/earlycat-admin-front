import request from '@/utils/request'

export function listPurchaser(query) {
  return request({
    url: '/purchaser/list',
    method: 'get',
    params: query
  })
}

export function save(data) {
    return request({
      url: '/purchaser/save',
      method: 'post',
      data
    })
  }

export function deletePurchaser(params) {
    return request({
      url: '/purchaser/delete',
      method: 'get',
      params: params
    })
  }