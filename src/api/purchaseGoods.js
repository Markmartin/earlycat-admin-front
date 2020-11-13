import request from '@/utils/request'

export function listByAdmin(query) {
  return request({
    url: '/purchaserGoods/listByAdmin',
    method: 'get',
    params: query
  })
}