import request from '@/utils/request'

export function stationList(query) {
  return request({
    url: '/station/list',
    method: 'get',
    params: query
  })
}

export function stationOrder(params) {
  return request({
    url: '/station/stationOrder',
    method: 'get',
    params: params
  })
}