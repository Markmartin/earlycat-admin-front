import request from '@/utils/request'



export function apiList(query) {
  return request({
    url: '/recharge/list',
    method: 'get',
    params: query
  })
}


export function apiCreate(data) {
  return request({
    url: '/recharge/create',
    method: 'post',
    data
  })
}

export function apiUpdate(data) {
  return request({
    url: '/recharge/update',
    method: 'post',
    data
  })
}

export function apiDelete(data) {
  return request({
    url: '/recharge/delete',
    method: 'post',
    data
  })
}

