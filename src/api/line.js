import request from '@/utils/request'

export function listLine(query) {
  return request({
    url: '/line/list',
    method: 'get',
    params: query
  })
}

export function createLine(data) {
  return request({
    url: '/line/create',
    method: 'post',
    data
  })
}

export function updateLine(data) {
  return request({
    url: '/line/update',
    method: 'post',
    data
  })
}

export function deleteLine(data) {
  return request({
    url: '/line/delete',
    method: 'post',
    data
  })
}

export function detailLine(id) {
  return request({
    url: '/line/detail',
    method: 'get',
    params: { id }
  })
}

export function listByType(type) {
  return request({
    url: '/line/listByType',
    method: 'get',
    params: { type }
  })
}

