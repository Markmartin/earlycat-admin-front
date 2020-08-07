import request from '@/utils/request'

export function listWxwork(query) {
  return request({
    url: '/wxwork/list',
    method: 'get',
    params: query
  })
}

export function createWxwork(data) {
  return request({
    url: '/wxwork/create',
    method: 'post',
    data
  })
}

export function updateWxwork(data) {
  return request({
    url: '/wxwork/update',
    method: 'post',
    data
  })
}

export function deleteWxwork(data) {
  return request({
    url: '/wxwork/delete',
    method: 'post',
    data
  })
}
