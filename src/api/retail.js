import request from '@/utils/request'

export function selectAll(params) {
  return request({
    url: '/retail/selectAll',
    method: 'get',
    params: params
  })
}

export function updateRetail(data) {
  return request({
    url: '/retail/update',
    method: 'post',
    data
  })
}

export function deleteRetail(params) {
  return request({
    url: '/retail/delete',
    method: 'get',
    params: params
  })
}