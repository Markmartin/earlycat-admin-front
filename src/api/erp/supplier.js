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

export function saveOrUpdate(data) {
    return request({
      url: '/erp/supplier/saveOrUpdate',
      method: 'post',
      data
    })
  }

export function deleteSupplier(params) {
    return request({
      url: '/erp/supplier/delete',
      method: 'get',
      params: params
    })
  }
