// lib/api.js
const API_URL = 'https://letter.wepick.kr/wp-json/wp/v2';
const CUSTOM_API_URL = 'https://letter.wepick.kr/wp-json/custom/v1'; // 커스텀 API 엔드포인트

export async function fetchAPI(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`);
    
    if (!res.ok) {
      console.error(`API 요청 실패: ${res.status} ${res.statusText}`);
      throw new Error('API 요청이 실패했습니다');
    }
    
    return await res.json();
  } catch (error) {
    console.error('API 오류:', error);
    throw error;
  }
}

export async function fetchCustomAPI(endpoint) {
  try {
    const res = await fetch(`${CUSTOM_API_URL}${endpoint}`);
    
    if (!res.ok) {
      console.error(`커스텀 API 요청 실패: ${res.status} ${res.statusText}`);
      throw new Error('커스텀 API 요청이 실패했습니다');
    }
    
    return await res.json();
  } catch (error) {
    console.error('커스텀 API 오류:', error);
    // 실제 API가 없는 경우 임시 데이터 반환
    if (endpoint === '/featured-posts') {
      return getMockFeaturedPosts();
    } else if (endpoint === '/popular-posts') {
      return await getMockPopularPosts();
    }
    throw error;
  }
}

// 추가 API 함수
export async function getPosts(page = 1, perPage = 10) {
  return await fetchAPI(`/posts?page=${page}&per_page=${perPage}&_embed=true`);
}

export async function getPost(slug) {
  const posts = await fetchAPI(`/posts?slug=${slug}&_embed=true`);
  return posts[0];
}

export async function getPostById(id) {
  try {
    return await fetchAPI(`/posts/${id}?_embed=true`);
  } catch (error) {
    console.error(`ID로 게시물 가져오기 오류: ${error}`);
    return null;
  }
}

export async function getMultiplePosts(ids) {
  if (!ids || ids.length === 0) return [];
  const idList = ids.join(',');
  return await fetchAPI(`/posts?include=${idList}&per_page=${ids.length}&_embed=true`);
}

export async function getFeaturedPosts() {
  try {
    // 워드프레스에 커스텀 REST API 엔드포인트가 있다고 가정
    return await fetchCustomAPI('/featured-posts');
  } catch (error) {
    console.error('추천 게시물 가져오기 오류:', error);
    // 실제 API가 없으면 임시 데이터 사용
    return getMockFeaturedPosts();
  }
}

export async function getPopularPosts() {
  try {
    // 워드프레스에 커스텀 REST API 엔드포인트가 있다고 가정
    return await fetchCustomAPI('/popular-posts');
  } catch (error) {
    console.error('인기 게시물 가져오기 오류:', error);
    // 실제 API가 없으면 임시 데이터 사용
    return await getMockPopularPosts();
  }
}

// 임시 데이터 (실제 API가 없을 때 사용)
function getMockFeaturedPosts() {
  return [4434556, 4434910, 4434687, 4431213, 4433491, 4434253, 4434279];
}

// 실제 게시물 데이터를 가져와서 올바른 형식으로 반환
async function getMockPopularPosts() {
  try {
    // 10개의 실제 게시물 가져오기
    const posts = await fetchAPI('/posts?per_page=10&_embed=true');
    
    // 인기 게시물 형식으로 변환
    return posts.map((post, index) => ({
      post_number: index + 1,
      post_title: post.title.rendered,
      ID: post.id,
      slug: post.slug,
      post_author: post.author
    }));
  } catch (error) {
    console.error('인기 게시물 목업 생성 오류:', error);
    // 오류 발생 시 최소한의 더미 데이터 반환
    return Array.from({ length: 10 }, (_, i) => ({
      post_number: i + 1,
      post_title: `인기 게시물 ${i + 1}`,
      ID: 1,
      slug: 'sample-post',
      post_author: 1
    }));
  }
}

export async function getCategories() {
  return await fetchAPI('/categories');
}

export async function getCategory(slug) {
  const categories = await fetchAPI(`/categories?slug=${slug}`);
  return categories[0];
}

export async function getPostsByCategory(categoryId, page = 1, perPage = 10) {
  return await fetchAPI(`/posts?categories=${categoryId}&page=${page}&per_page=${perPage}&_embed=true`);
}

export async function getTotalPostsByCategory(categoryId) {
  try {
    const res = await fetch(`${API_URL}/posts?categories=${categoryId}&per_page=1`);
    return parseInt(res.headers.get('X-WP-Total'), 10);
  } catch (error) {
    console.error('카테고리별 총 게시물 수 가져오기 오류:', error);
    return 0;
  }
}

export async function getPages() {
  return await fetchAPI('/pages?_embed=true');
}

export async function getPage(slug) {
  const pages = await fetchAPI(`/pages?slug=${slug}&_embed=true`);
  return pages[0];
}

export async function getTotalPosts() {
  try {
    const res = await fetch(`${API_URL}/posts?per_page=1`);
    return parseInt(res.headers.get('X-WP-Total'), 10);
  } catch (error) {
    console.error('총 게시물 수 가져오기 오류:', error);
    return 0;
  }
}
