import request from '@/utils/request'

export function apiList(query) {
  return request({
    url: '/agent/withdraw/list',
    method: 'get',
    params: query
  })
}

export function apiEntPayBank(data) {
  return request({
    url: '/agent/withdraw/entpay',
    method: 'post',
    data
  })
}



