import request from '@/utils/request'

export function listCommunity(query) {
  return request({
    url: '/community/list',
    method: 'get',
    params: query
  })
}

export function createCommunity(data) {
  return request({
    url: '/community/create',
    method: 'post',
    data
  })
}

export function updateCommunity(data) {
  return request({
    url: '/community/update',
    method: 'post',
    data
  })
}

export function deleteCommunity(data) {
  return request({
    url: '/community/delete',
    method: 'post',
    data
  })
}

export function expressList(query) {
  return request({
    url: '/express/list',
    method: 'get',
    params: query
  })
}
