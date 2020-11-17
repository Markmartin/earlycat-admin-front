import request from '@/utils/request'

export function getList(data, page, limit) {
  return request({
    url: `/afterSale/getList`,
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: {
      'page': page,
      'limit': limit
    },
    data
  })
}

export function detailAfterSale(id) {
  return request({
    url: '/afterSale/detail',
    method: 'get',
    params: { id }
  })
}

export function refund(orderId, afterSaleId, refundPrice) {
  return request({
    url: '/afterSale/refund',
    method: 'get',
    params: {
      'orderId': orderId,
      'afterSaleId': afterSaleId,
      'refundPrice': refundPrice
    }
  })
}

export function reject(afterSaleId, remark) {
  return request({
    url: '/afterSale/reject',
    method: 'get',
    params: {
      'afterSaleId': afterSaleId,
      'remark': remark
    }
  })
}

export function orderDetail(id) {
  return request({
    url: '/afterSale/orderDetail',
    method: 'get',
    params: { id }
  })
}


export function detailOrder(id) {
  return request({
    url: '/order/detail',
    method: 'get',
    params: { id }
  })
}
