import request from '@/utils/request'

export function apiBankCodeList() {
  return request({
    url: '/agent/bankList',
    method: 'get',
  })
}

export function apiList(query) {
  return request({
    url: '/agent/list',
    method: 'get',
    params: query
  })
}


export function apiCreate(data) {
  return request({
    url: '/agent/create',
    method: 'post',
    data
  })
}

export function apiUpdate(data) {
  return request({
    url: '/agent/update',
    method: 'post',
    data
  })
}

export function apiDelete(data) {
  return request({
    url: '/agent/delete',
    method: 'post',
    data
  })
}
