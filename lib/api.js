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
// lib/api.js에서 getFeaturedPosts 함수 수정
export async function getFeaturedPosts() {
  try {
    // 옵션 값에서 직접 가져온 ID 목록 사용
    const postIds = [4434556, 4434910, 4434687, 4431213, 4433491, 4434253, 4434279];
    console.log("Featured posts IDs:", postIds);
    return postIds;
  } catch (error) {
    console.error('추천 게시물 가져오기 오류:', error);
    return [];
  }
}

// lib/api.js에서 getMultiplePosts 함수 수정
// 메타 데이터와 함께 게시물 가져오기
export async function getMultiplePosts(ids) {
  if (!ids || ids.length === 0) return [];
  
  // 각 포스트 ID에 대한 메인 이미지 URL 맵
  // 실제로는 API를 통해 가져와야 하지만, 현재 상황에서는 하드코딩
  const mainImgMap = {
    // 실제 데이터로 대체하세요
    4434556: "https://letter.wepick.kr/wp-content/uploads/2023/06/post1.jpg",
    4434910: "https://letter.wepick.kr/wp-content/uploads/2023/06/post2.jpg",
    4434687: "https://letter.wepick.kr/wp-content/uploads/2023/06/post3.jpg",
    4431213: "https://letter.wepick.kr/wp-content/uploads/2023/06/post4.jpg",
    4433491: "https://letter.wepick.kr/wp-content/uploads/2023/06/post5.jpg",
    4434253: "https://letter.wepick.kr/wp-content/uploads/2023/06/post6.jpg",
    4434279: "https://letter.wepick.kr/wp-content/uploads/2023/06/post7.jpg",
  };
  
  try {
    const idList = ids.join(',');
    console.log("Getting multiple posts with IDs:", idList);
    
    // 포스트 데이터 가져오기
    const posts = await fetchAPI(`/posts?include=${idList}&per_page=${ids.length}`);
    console.log("Multiple posts result length:", posts.length);
    
    // 각 포스트에 main_img 정보 추가
    const postsWithMainImg = posts.map(post => {
      return {
        ...post,
        main_img: mainImgMap[post.id] || null
      };
    });
    
    return postsWithMainImg;
  } catch (error) {
    console.error('다중 게시물 가져오기 오류:', error);
    
    // 오류 발생 시 최소한의 더미 데이터 반환
    return ids.map(id => ({
      id: id,
      title: { rendered: `게시물 ${id}` },
      slug: `post-${id}`,
      main_img: mainImgMap[id] || null
    }));
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
