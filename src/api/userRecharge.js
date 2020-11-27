import request from '@/utils/request'

export function apiList(query) {
  return request({
    url: '/userRecharge/list',
    method: 'get',
    params: query
  })
}


