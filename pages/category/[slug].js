// pages/category/[slug].js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/ko';
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
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>로딩 중...</p>
        </div>
      </div>
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
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/">
          <a className={styles.backLink}>← 홈으로 돌아가기</a>
        </Link>
        <h1 className={styles.title}>{category.name}</h1>
        {category.description && (
          <div 
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: category.description }}
          />
        )}
      </header>
      
      <main className={styles.main}>
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
