import request, { downloadRequest } from "@/utils/request";

export function listStorage(query) {
  return request({
    url: "/storage/list",
    method: "get",
    params: query
  });
}

export function createStorage(data) {
  return request({
    url: "/storage/create",
    method: "post",
    data
  });
}

export function readStorage(data) {
  return request({
    url: "/storage/read",
    method: "get",
    data
  });
}

export function updateStorage(data) {
  return request({
    url: "/storage/update",
    method: "post",
    data
  });
}

export function deleteStorage(data) {
  return request({
    url: "/storage/delete",
    method: "post",
    data
  });
}

export async function downloadStorage(key) {
  return await downloadRequest({
    url: `/storage/download`,
    method: "get",
    responseType: "blob",
    params: { key }
  });
}

const uploadPath = process.env.BASE_API + "/storage/create";
export { uploadPath };
