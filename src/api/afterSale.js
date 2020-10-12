import request from '@/utils/request'

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


export function detailAfterSale(id) {
  return request({
    url: '/afterSale/detail',
    method: 'get',
    params: { id }
  })
}
