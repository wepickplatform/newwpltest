// pages/post/[slug].js 수정
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import moment from 'moment';
import 'moment/locale/ko';
import { getPost, getPosts, getComments } from '../../lib/api';
import Header from '../../components/Header';
import CommentList from '../../components/CommentList';
import CommentForm from '../../components/CommentForm';
import styles from '../../styles/Post.module.css';

export default function Post({ post, initialComments }) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments || []);
  
  // 페이지 내용이 아직 생성되지 않았을 때
  if (router.isFallback) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loading}>로딩 중...</div>
        </main>
      </div>
    );
  }
  
  // 포스트를 찾을 수 없을 때
  if (!post) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.error}>
            <h1>포스트를 찾을 수 없습니다</h1>
            <p>요청하신 포스트가 존재하지 않습니다.</p>
            <Link href="/">
              <a className={styles.backLink}>홈으로 돌아가기</a>
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.['author']?.[0];
  
  moment.locale('ko');
  const formattedDate = moment(post.date).format('YYYY년 MM월 DD일');
  
  // 새 댓글이 추가되면 댓글 목록 업데이트
  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
  };
  
  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <article className={styles.post}>
          <header className={styles.postHeader}>
            <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            
            <div className={styles.meta}>
              {author && <span>작성자: {author.name}</span>}
              <span>작성일: {formattedDate}</span>
            </div>
          </header>
          
          {featuredMedia && featuredMedia.source_url && (
            <div className={styles.featuredImage}>  
              <Image
                src={featuredMedia.source_url}
                alt={post.title.rendered}
                width={1200}
                height={630}
                layout="responsive"
              />
            </div>
          )}
          
          <div 
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </article>
        
        <section className={styles.commentSection}>
          <h2 className={styles.commentTitle}>댓글</h2>
          <CommentList comments={comments} />
          <CommentForm 
            postId={post.id} 
            onCommentAdded={handleCommentAdded} 
          />
        </section>
      </main>
      
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Letter WePickr - 워드프레스 헤드리스 사이트</p>
      </footer>
    </div>
  );
}

export async function getStaticPaths() {
  try {
    const posts = await getPosts(1, 10);
    
    if (!posts || posts.length === 0) {
      return {
        paths: [],
        fallback: 'blocking'
      };
    }
    
    const paths = posts.map(post => ({
      params: { slug: post.slug }
    }));
    
    return {
      paths,
      fallback: 'blocking'
    };
  } catch (error) {
    console.error('경로 생성 오류:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const post = await getPost(params.slug);
    
    if (!post) {
      return {
        notFound: true,
      };
    }
    
    // 댓글 가져오기
    const comments = await getComments(post.id);
    
    return {
      props: {
        post,
        initialComments: comments || []
      },
      revalidate: 60, // 1분마다 재생성
    };
  } catch (error) {
    console.error('게시물 데이터 가져오기 오류:', error);
    return {
      notFound: true,
    };
  }
}
