import request from '@/utils/request'
import Qs from 'qs'

export function listOrder(query) {
  return request({
    url: '/order/list',
    method: 'get',
    params: query,
    paramsSerializer: function(params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

export function detailOrder(id) {
  return request({
    url: '/order/detail',
    method: 'get',
    params: { id }
  })
}

export function printOrder(data) {
  return request({
    url: '/order/print',
    method: 'post',
    data
  })
}

export function shipOrder(data) {
  return request({
    url: '/order/ship',
    method: 'post',
    data
  })
}

export function arriveOrder(data) {
  return request({
    url: '/order/arrive',
    method: 'post',
    data
  })
}

export function refundOrder(data) {
  return request({
    url: '/order/refund',
    method: 'post',
    data
  })
}

export function replyComment(data) {
  return request({
    url: '/order/reply',
    method: 'post',
    data
  })
}

export function rbatchshipOrder(data) {
  return request({
    url: '/order/batchship',
    method: 'post',
    data
  })
}

export function expresslist(params) {
  return request({
    url: '/order/expresslist',
    method: 'get',
    params: params
  })
}

export function sendExpress() {
  return request({
    url: '/order/sendexpress',
    method: 'get'
  })
}

export function express(params) {
  return request({
    url: '/order/express',
    method: 'get',
    params: params
  })
}

export function uploadExpress(params) {
  return request({
    url: '/order/uploadExpress',
    method: 'get',
    params: params
  })
}

export function listMainOrder(params) {
  return request({
    url: '/order/listMainOrder',
    method: 'get',
    params: params
  })
}