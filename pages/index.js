// pages/index.js
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/ko';
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
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Letter WePickr</h1>
        <p className={styles.description}>워드프레스 헤드리스 사이트</p>
      </header>
      
      <main className={styles.main}>
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

function PostCard({ post }) {
  moment.locale('ko');
  const formattedDate = moment(post.date).format('YYYY년 MM월 DD일');
  
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.['author']?.[0];
  
  return (
    <div className={styles.card}>
      <Link href={`/post/${post.slug}`}>
        <a className={styles.cardLink}>
          {featuredMedia && featuredMedia.source_url && (
            <div className={styles.imageContainer}>
              <Image
                src={featuredMedia.source_url}
                alt={post.title.rendered}
                width={300}
                height={200}
                layout="responsive"
                className={styles.image}
              />
            </div>
          )}
          
          <div className={styles.cardContent}>
            <h3 
              className={styles.cardTitle}
              dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
            />
            
            <div className={styles.cardMeta}>
              {author && <span>작성자: {author.name}</span>}
              <span>작성일: {formattedDate}</span>
            </div>
            
            <div 
              className={styles.cardExcerpt}
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
            
            <span className={styles.readMore}>자세히 보기</span>
          </div>
        </a>
      </Link>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const initialPosts = await getPosts(1);
    const totalPosts = await getTotalPosts();
    
    return {
      props: {
        initialPosts: initialPosts || [],
        totalPosts: totalPosts || 0,
      },
      revalidate: 60, // 1분마다 재생성
    };
  } catch (error) {
    console.error('데이터 가져오기 오류:', error);
    return {
      props: {
        initialPosts: [],
        totalPosts: 0,
      },
      revalidate: 60,
    };
  }
}
