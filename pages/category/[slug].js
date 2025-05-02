// pages/category/[slug].js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import PostCard from '../../components/PostCard';
import { getCategories, getCategory, getPostsByCategory, getTotalPostsByCategory } from '../../lib/api';
import styles from '../../styles/Category.module.css';

export default function Category({ category, initialPosts, totalPosts }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // 카테고리를 찾을 수 없거나 로딩 중일 때
  if (router.isFallback || !category) {
    return (
      <Layout>
        <div className={styles.loading}>
          <p>로딩 중...</p>
        </div>
      </Layout>
    );
  }
  
  const postsPerPage = 10;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  const loadMorePosts = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const newPosts = await getPostsByCategory(category.id, nextPage);
    
    setPosts([...posts, ...newPosts]);
    setPage(nextPage);
    setLoading(false);
  };
  
  return (
    <Layout>
      <div className={styles.categoryHeader}>
        <h1 className={styles.title}>{category.name}</h1>
        {category.description && (
          <div 
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: category.description }}
          />
        )}
      </div>
      
      <div className={styles.grid}>
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className={styles.noPosts}>
            <p>이 카테고리에 게시물이 없습니다.</p>
          </div>
        )}
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
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    const categories = await getCategories();
    
    const paths = categories.map(category => ({
      params: { slug: category.slug }
    }));
    
    return {
      paths,
      fallback: 'blocking'
    };
  } catch (error) {
    console.error('카테고리 경로 생성 오류:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const category = await getCategory(params.slug);
    
    if (!category) {
      return {
        notFound: true,
      };
    }
    
    const initialPosts = await getPostsByCategory(category.id, 1);
    const totalPosts = await getTotalPostsByCategory(category.id);
    
    return {
      props: {
        category,
        initialPosts,
        totalPosts,
      },
      revalidate: 60, // 1분마다 재생성
    };
  } catch (error) {
    console.error('카테고리 데이터 가져오기 오류:', error);
    return {
      notFound: true,
    };
  }
}
