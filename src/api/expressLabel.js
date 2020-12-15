import request from '@/utils/request'

//保存更新优惠规则数据
export function listAll(params) {
  return request({
    url: '/expressLabel/list',
    method: 'get',
    params: params
  })
}