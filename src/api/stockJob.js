import request from '@/utils/request'

export function getJobs(params) {
  return request({
    url: '/stockJob/list',
    method: 'get',
    params: params
  })
}

export function gather(params) {
  return request({
    url: '/stockJob/gather',
    method: 'get',
    params: params
  })
}

export function updateJob(data) {
  return request({
    url: '/stockJob/update',
    method: 'post',
    data
  })
}

export function deleteJob(id) {
  return request({
    url: `/stockJob/${id}`,
    method: 'get',
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

export function getSumPur(params) {
  return request({
    url: '/stockJob/getSumPur',
    method: 'get',
    params: params
  })
}