// 文章接口模块

import request from '@/utils/request'

// 获取文章频道列表

export const getArticleList = (params) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: params
  })
}

// 获取所有频道
export const getAllChannels = () => {
  return request({
    method: 'Get',
    url: '/app/v1_0/channels'
  })
}

// 添加用户频道
export const addUserChannels = (channel) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      // channel传递过来时是一个对象，要求channels是一个数组，所以用[]括起来
      channels: [channel]
    }
  })
}

// 删除用户频道
export const deleteUserChannels = (channelId) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}

// 根据id获取文章详情列表
export const getArticleById = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}

// 收藏文章
export const addCollect = (target) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/collections',
    data: {
      target
    }

  })
}

// 取消收藏文章
export const deleteCollect = (target) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/collections/${target}`
  })
}

// 点赞
export const addLike = (target) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target
    }

  })
}

// 取消点赞
export const deleteLike = (target) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${target}`
  })
}
