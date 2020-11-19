import request from '@/utils/request'

export function list(data, page, limit) {
  return request({
    url: `/recruit/list`,
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: {
      'page': page,
      'limit': limit
    },
    data
  })
}

export function detail(id) {
  return request({
    url: '/afterSale/detail',
    method: 'post',
    params: { id }
  })
}

