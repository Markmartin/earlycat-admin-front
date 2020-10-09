import request from '@/utils/request'

export function list() {
    return request({
        url: '/autoStock/list',
        method: 'get',
    })
}

export function update(data) {
    return request({
        url: '/autoStock/update',
        method: 'post',
        data
    })
}

export function add(data) {
    return request({
        url: '/autoStock/add',
        method: 'post',
        data
    })
}

export function deleteStock(params) {
    return request({
        url: '/autoStock/delete',
        method: 'delete',
        params: params
    })
}