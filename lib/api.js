// lib/api.js 전체 코드
const API_URL = 'https://letter.wepick.kr/wp-json/wp/v2';

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

// featuredPosts 및 popularPosts 함수 수정 - 실제 API 대신 기존 게시물 활용
export async function getFeaturedPosts() {
  try {
    // 최근 게시물 7개 가져오기
    const posts = await getPosts(1, 7);
    // 게시물 ID 목록 반환
    return posts.map(post => post.id);
  } catch (error) {
    console.error('추천 게시물 가져오기 오류:', error);
    return [];
  }
}

export async function getMultiplePosts(ids) {
  if (!ids || ids.length === 0) return [];
  try {
    const idList = ids.join(',');
    return await fetchAPI(`/posts?include=${idList}&per_page=${ids.length}&_embed=true`);
  } catch (error) {
    console.error('다중 게시물 가져오기 오류:', error);
    return [];
  }
}

export async function getPopularPosts() {
  try {
    // 최근 게시물 10개 가져오기
    const posts = await getPosts(1, 10);
    
    // 인기 게시물 형식으로 변환
    return posts.map((post, index) => ({
      post_number: index + 1,
      post_title: post.title.rendered,
      ID: post.id,
      slug: post.slug,
      post_author: post.author
    }));
  } catch (error) {
    console.error('인기 게시물 가져오기 오류:', error);
    return [];
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
