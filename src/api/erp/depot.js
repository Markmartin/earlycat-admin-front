import request from '@/utils/request'

export function listDepot(data, page, limit) {
  return request({
    url: '/erp/depot/list',
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
      url: '/erp/depot/saveOrUpdate',
      method: 'post',
      data
    })
  }

export function deleteDepot(params) {
    return request({
      url: '/erp/depot/delete',
      method: 'get',
      params: params
    })
  }
