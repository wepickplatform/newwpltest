import { useState } from 'react';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { getPosts, getTotalPosts } from '../lib/api';
import styles from '../styles/Home.module.css';

export default function Home({ initialPosts, totalPosts }) {
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
    <Layout title="Letter WePickr | 홈">
      <div className={styles.container}>
        <h1 className={styles.title}>최신 포스트</h1>
        
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
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const initialPosts = await getPosts(1);
  const totalPosts = await getTotalPosts();
  
  return {
    props: {
      initialPosts,
      totalPosts,
    },
    revalidate: 60, // 1분마다 재생성
  };
}