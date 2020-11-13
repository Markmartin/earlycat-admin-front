import request from '@/utils/request'

export function apiList(query) {
  return request({
    url: '/orderCommission/list',
    method: 'get',
    params: query
  })
}

export function apiOrderDetail(id) {
  return request({
    url: '/orderCommission/orderDetail',
    method: 'get',
    params: { id }
  })
}




