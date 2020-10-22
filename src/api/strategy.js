import request from '@/utils/request'

export function fetchStrategyGroupList(query) {
  return request({
    url: '/strategy/group/list',
    method: 'get',
    params: query
  })
}
