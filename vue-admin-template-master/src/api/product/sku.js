import request from '@/utils/request'

// sku列表接口
// /admin/product/list/{page}/{limit}
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })

// 上架
// GET /admin/product/onSale/{skuId}
export const reqSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

// 下架
// /admin/product/cancelSale/{skuId}
export const reqCancel = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

//获取sku详情的接口
// GET /admin/product/getSkuById/{skuId}
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })

// 删除sku
// DELETE /admin/product/deleteSku/{skuId}
export const reqSkuDelete = (skuId) => request({ url: `/admin/product/deleteSku/${skuId}`, method: 'delete' })

