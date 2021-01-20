import request from '@/utils/request'

export function listSpu(data, page, limit) {
  return request({
    url: '/erp/spu/list',
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
      url: '/erp/spu/save',
      method: 'post',
      data
    })
  }

export function deleteSupplier(params) {
    return request({
      url: '/erp/spu/delete',
      method: 'get',
      params: params
    })
  }
