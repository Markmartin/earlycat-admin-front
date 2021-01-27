import request from "@/utils/request";

export function listSupplier(data, page, limit) {
  return request({
    url: "/erp/supplier/list",
    headers: { "Content-Type": "application/json" },
    method: "post",
    params: {
      page: page,
      limit: limit
    },
    data
  });
}

export function saveOrUpdate(data) {
  return request({
    url: "/erp/supplier/saveOrUpdate",
    method: "post",
    data
  });
}

export function deleteSupplier(params) {
  return request({
    url: "/erp/supplier/delete",
    method: "get",
    params: params
  });
}

export async function updateSupplierByName(name) {
  const response = await listSupplier({ name }, 0, 10);
  const { status, data } = response;
  const { errno } = data;
  return {
    status: status == 200 && errno == 0 ? true : false,
    data: data.data
  };
}
