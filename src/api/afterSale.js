import request from '@/utils/request'

export function listAd(query) {
  return request({
    url: '/ad/list',
    method: 'get',
    params: query
  })
}

export function getList(data, page, limit) {
  return request({
    url: `/afterSale/getList`,
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: {
      'page': page,
      'limit': limit
    },
    data
  })
}
