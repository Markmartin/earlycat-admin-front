import request from '@/utils/request'

export function fetchStrategyGroupList(query) {
  return request({
    url: '/strategy/group/list',
    method: 'get',
    params: query
  })
}


export function apiCreate(data) {
  return request({
    url: '/strategy/group/create',
    method: 'post',
    data
  })
}

export function apiUpdate(data) {
  return request({
    url: '/strategy/group/update',
    method: 'post',
    data
  })
}

export function apiDelete(data) {
  return request({
    url: '/strategy/group/delete',
    method: 'post',
    data
  })
}
