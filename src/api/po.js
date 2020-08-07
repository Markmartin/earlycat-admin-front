import request from '@/utils/request'

export function poList(query) {
  return request({
    url: '/po/list',
    method: 'get',
    params: query
  })
}

export function poDetail(query) {
  return request({
    url: '/po/detail',
    method: 'get',
    params: query
  })
}

export function poExport(query) {
  return request({
    url: '/po/export',
    method: 'get',
    params: query
  })
}

export function poDelete(data) {
  return request({
    url: '/po/delete',
    method: 'post',
    data
  })
}

export function poGenerator(data) {
  return request({
    url: '/po/generator',
    method: 'post',
    data
  })
}

export function poEdit(data) {
  return request({
    url: '/po/goods/edit',
    method: 'post',
    data
  })
}
