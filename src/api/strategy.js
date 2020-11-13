import request from '@/utils/request'

export function fetchStrategyGroupList(query) {
  return request({
    url: '/strategy/list',
    method: 'get',
    params: query
  })
}

export function apiListAll(query) {
  return request({
    url: '/strategy/listAll',
    method: 'get',
    params: query
  })
}


export function apiCreate(data) {
  return request({
    url: '/strategy/create',
    method: 'post',
    data
  })
}

export function apiUpdate(data) {
  return request({
    url: '/strategy/update',
    method: 'post',
    data
  })
}

export function apiDelete(data) {
  return request({
    url: '/strategy/delete',
    method: 'post',
    data
  })
}
