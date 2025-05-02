const API_URL = 'https://letter.wepick.kr/wp-json/wp/v2';

export async function fetchAPI(endpoint, params = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error('API 요청 실패');
  }

  const json = await res.json();
  return json;
}

export async function getPosts(page = 1, perPage = 10) {
  const data = await fetchAPI(`/posts?page=${page}&per_page=${perPage}&_embed=true`);
  return data;
}

export async function getPost(slug) {
  const posts = await fetchAPI(`/posts?slug=${slug}&_embed=true`);
  return posts[0];
}

export async function getCategories() {
  const categories = await fetchAPI('/categories');
  return categories;
}

export async function getPages() {
  const pages = await fetchAPI('/pages?_embed=true');
  return pages;
}

export async function getPage(slug) {
  const pages = await fetchAPI(`/pages?slug=${slug}&_embed=true`);
  return pages[0];
}

export async function getTotalPosts() {
  const res = await fetch(`${API_URL}/posts?per_page=1`);
  return parseInt(res.headers.get('X-WP-Total'), 10);
}
