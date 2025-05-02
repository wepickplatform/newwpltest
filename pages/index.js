// pages/index.js
import { useState } from 'react';
import Link from 'next/link';
import { 
  getPosts, 
  getTotalPosts, 
  getCategories, 
  getFeaturedPosts, 
  getMultiplePosts,
  getPopularPosts
} from '../lib/api';
import FeaturedSlider from '../components/FeaturedSlider';
import PopularPosts from '../components/PopularPosts';
import PostCard from '../components/PostCard';
import styles from '../styles/Home.module.css';

export default function Home({ 
  featuredPosts, 
  popularPosts, 
  initialPosts, 
  totalPosts, 
  categories 
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const postsPerPage = 10;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  const loadMorePosts = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const newPosts = await getPosts(nextPage);
    
    setPosts([...posts, ...newPosts]);
    setPage(nextPage);
    setLoading(false);
  };
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Letter WePickr</h1>
        <p className={styles.description}>워드프레스 헤드리스 사이트</p>
        
        <nav className={styles.nav}>
          <ul className={styles.categoryList}>
            {categories.map(category => (
              <li key={category.id} className={styles.categoryItem}>
                <Link href={`/category/${category.slug}`}>
                  <a className={styles.categoryLink}>{category.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      
      <main className={styles.main}>
        <div className={styles.featuredSection}>
          <div className={styles.sliderColumn}>
            <FeaturedSlider posts={featuredPosts} />
          </div>
          <div className={styles.popularColumn}>
            <PopularPosts posts={popularPosts} />
          </div>
        </div>
        
        <h2 className={styles.sectionTitle}>최신 포스트</h2>
        
        <div className={styles.grid}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        
        {page < totalPages && (
          <div className={styles.loadMore}>
            <button 
              onClick={loadMorePosts} 
              disabled={loading}
              className={styles.button}
            >
              {loading ? '로딩 중...' : '더 보기'}
            </button>
          </div>
        )}
      </main>
      
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Letter WePickr - 워드프레스 헤드리스 사이트</p>
      </footer>
    </div>
  );
}

// PostCard 컴포넌트를 별도 파일로 분리 (components/PostCard.js)

export async function getStaticProps() {
  try {
    // 카테고리 및 기본 게시물 가져오기
    const initialPosts = await getPosts(1);
    const totalPosts = await getTotalPosts();
    const categories = await getCategories();
    
    // 추천 게시물 ID 가져오기
    const featuredPostIds = await getFeaturedPosts();
    
    // 추천 게시물 상세 정보 가져오기
    const featuredPosts = await getMultiplePosts(featuredPostIds);
    
    // 인기 게시물 가져오기
    const popularPosts = await getPopularPosts();
    
    return {
      props: {
        featuredPosts: featuredPosts || [],
        popularPosts: popularPosts || [],
        initialPosts: initialPosts || [],
        totalPosts: totalPosts || 0,
        categories: categories || [],
      },
      revalidate: 60, // 1분마다 재생성
    };
  } catch (error) {
    console.error('데이터 가져오기 오류:', error);
    return {
      props: {
        featuredPosts: [],
        popularPosts: [],
        initialPosts: [],
        totalPosts: 0,
        categories: [],
      },
      revalidate: 60,
    };
  }
}
