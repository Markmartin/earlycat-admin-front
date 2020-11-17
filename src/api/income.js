import request from '@/utils/request'

export function listIncome(query) {
  return request({
    url: '/income/list',
    method: 'get',
    params: query
  })
}

export function createAd(data) {
  return request({
    url: '/income/settled',
    method: 'post',
    data
  })
}

export function entpayIncome(data) {
  return request({
    url: '/income/entpay',
    method: 'post',
    data
  })
}

export function apiOrderDetail(id) {
  return request({
    url: '/income/orderDetail',
    method: 'get',
    params: { id }
  })
}

