import request from '@/utils/request'

export function apiList(query) {
  return request({
    url: '/rechargeOrder/list',
    method: 'get',
    params: query
  })
}


