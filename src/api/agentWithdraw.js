import request from '@/utils/request'

export function apiList(query) {
  return request({
    url: '/agent/withdraw/list',
    method: 'get',
    params: query
  })
}



