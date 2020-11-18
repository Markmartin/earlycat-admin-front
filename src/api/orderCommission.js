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
export function listOrderCommissionCount(query) {
  return request({
    url: '/orderCommission/count/list',
    method: 'get',
    params: query
  })
}



