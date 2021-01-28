import domtoimage from "dom-to-image-scale";
import OSS from "ali-oss";
import dayjs from "dayjs";
import { downloadStorage } from "@/api/storage.js";

const formatResponse = (status, data = {}, message = "") => {
  return { status, data, message };
};

const ossClient = new OSS({
  accessKeyId: "LTAI4GFjHPmtqXzihUpGhMtG",
  accessKeySecret: "hRBiYLj5QTo00TDDnD14teAfC4DZa4",
  bucket: "earlycat-share",
  region: "oss-cn-shanghai"
});

async function generateSharingGraph(
  goodsUrl,
  shareUrl = null,
  domId = "share-dom",
  blobUrlKey = "blobUrl"
) {
  const downloadResp = await downloadStorage(
    new URL(goodsUrl).pathname.split("/")[1]
  );
  if (!downloadResp.data || downloadResp.status != 200) {
    return formatResponse(false, null, "下载图片失败");
  }

  this[blobUrlKey] = window.URL.createObjectURL(downloadResp.data);

  const generateGraphResp = await new Promise((resolve, reject) => {
    this.$nextTick(function() {
      const node = document.getElementById(domId);
      if (!node) {
        reject(formatResponse(false, null, "绘图节点不存在"));
      }
      domtoimage
        .toBlob(node, { bgcolor: "#ffffff" })
        .then(function(blob) {
          resolve(formatResponse(true, blob));
        })
        .catch(() => reject(formatResponse(false, null, "生成海报失败")));
    });
  });

  if (!generateGraphResp.status) {
    return generateGraphResp;
  }

  let fileName = `${dayjs().valueOf()}.png`;
  if (shareUrl) {
    fileName = new URL(shareUrl).pathname.split("/")[1];
  }
  const uploadResp = await ossClient.put(fileName, generateGraphResp.data);
  if (uploadResp.res.status == 200 && uploadResp.url) {
    return formatResponse(true, uploadResp.url);
  }

  return formatResponse(false, null);
}

export default generateSharingGraph;
