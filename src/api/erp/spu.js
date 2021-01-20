import request from '@/utils/request'

export function listSupplier(data, page, limit) {
  return request({
    url: '/erp/supplier/list',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: {
      'page': page,
      'limit': limit
    },
    data
  })
}

export function save(data) {
    return request({
      url: '/supplier/save',
      method: 'post',
      data
    })
  }

export function deleteSupplier(params) {
    return request({
      url: '/supplier/delete',
      method: 'get',
      params: params
    })
  }
