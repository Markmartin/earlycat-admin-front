import request from '@/utils/request'

export function listSupplier(query) {
  return request({
    url: '/supplier/list',
    method: 'get',
    params: query
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