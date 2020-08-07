import request from '@/utils/request'

export function listTerminal(query) {
  return request({
    url: '/terminal/list',
    method: 'get',
    params: query
  })
}

export function createTerminal(data) {
  return request({
    url: '/terminal/save',
    method: 'post',
    data
  })
}

export function updateTerminal(data) {
  return request({
    url: '/terminal/update',
    method: 'post',
    data
  })
}

export function bindingCommunity(data) {
  return request({
    url: '/terminal/binding',
    method: 'get',
    params: data
  })
}

export function activationTerminal(data) {
  return request({
    url: '/terminal/activation',
    method: 'post',
    data
  })
}
