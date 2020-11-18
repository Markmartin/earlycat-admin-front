import request from '@/utils/request'

export function saveOrUpdate(data) {
  return request({
    url: '/purchaseJob/saveOrUpdate',
    method: 'post',
    data
  })
}

export function listByAdmin(query) {
    return request({
      url: '/purchaseJob/listByAdmin',
      method: 'get',
      params:query
    })
  }

  export function deleteJob(query) {
    return request({
      url: '/purchaseJob/delete',
      method: 'get',
      params:query
    })
  }