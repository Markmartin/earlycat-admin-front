import request from '@/utils/request'

export function stationList(query) {
  return request({
    url: '/station/list',
    method: 'get',
    params: query
  })
}