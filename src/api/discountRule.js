import request from '@/utils/request'

//保存更新优惠规则数据
export function saveOrUpdateZcmActivity(data) {
  return request({
    url: '/zcmactivity/saveOrUpdateZcmActivity',
    method: 'post',
    data
  })
}

//保存更新优惠规则明细数据
export function saveOrUpdateZcmActivitySpec(data) {
  return request({
    url: '/zcmactivity/saveOrUpdateZcmActivitySpec',
    method: 'post',
    data
  })
}


//获取优惠规则列表
export function getZcmActivityList(data, page, limit) {
  return request({
    url: `/zcmactivity/getZcmActivityList`,
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: {
      'page': page,
      'limit': limit
    },
    data
  })
}

//删除规则
export function deleteZcmActivityById(id) {
  return request({
    url: '/zcmactivity/deleteZcmActivityById',
    method: 'get',
    params: { id }
  })
}

//删除规则明细
export function deleteZcmActivitySpecById(id) {
  return request({
    url: '/zcmactivity/deleteZcmActivitySpecById',
    method: 'get',
    params: { id }
  })
}

//获取规则明细列表
export function getZcmActivitySpecList(data, page, limit) {
  return request({
    url: `/zcmactivity/getZcmActivitySpecList`,
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: {
      'page': page,
      'limit': limit
    },
    data
  })
}



