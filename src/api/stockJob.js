import request from '@/utils/request'

export function outList(params) {
  return request({
    url: '/stockJob/outList',
    method: 'get',
    params: params
  })
}

export function inList(params) {
  return request({
    url: '/stockJob/inList',
    method: 'get',
    params: params
  })
}

export function updateOut(data) {
  return request({
    url: '/stockJob/updateOut',
    method: 'post',
    data
  })
}

export function updateIn(data) {
  return request({
    url: '/stockJob/updateIn',
    method: 'post',
    data
  })
}

export function deleteOut(data) {
  return request({
    url: `/stockJob/deleteOut`,
    method: 'post',
    data
  })
}

export function deleteIn(data) {
  return request({
    url: `/stockJob/deleteIn`,
    method: 'post',
    data
  })
}

export function exportInSearch(params) {
  return request({
    url: '/stockJob/exportInSearch',
    method: 'get',
    responseType: 'blob',
    params: params
  })
}

export function exportIn() {
  return request({
    url: '/stockJob/exportIn',
    method: 'get',
    responseType: 'blob'
  })
}

export function importIn() {
  return '/stockJob/importIn'
}

export function exportOut() {
  return request({
    url: '/stockJob/exportOut',
    method: 'get',
    responseType: 'blob'
  })
}

export function importOut() {
  return '/stockJob/importOut'
}

export function exportOutSearch(params) {
  return request({
    url: '/stockJob/exportOutSearch',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}
