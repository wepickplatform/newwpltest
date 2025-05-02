// pages/post/[slug].js
import { useRouter } from 'next/router';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/ko';
import Layout from '../../components/Layout';
import { getPost, getPosts } from '../../lib/api';
import styles from '../../styles/Post.module.css';

export default function Post({ post }) {
  const router = useRouter();
  
  // 페이지 내용이 아직 생성되지 않았을 때
  if (router.isFallback) {
    return <Layout><div className={styles.loading}>로딩 중...</div></Layout>;
  }
  
  // 포스트를 찾을 수 없을 때
  if (!post) {
    return (
      <Layout title="포스트를 찾을 수 없습니다">
        <div className={styles.error}>
          <h1>포스트를 찾을 수 없습니다</h1>
          <p>요청하신 포스트가 존재하지 않습니다.</p>
          <button 
            onClick={() => router.push('/')}
            className={styles.button}
          >
            홈으로 돌아가기
          </button>
        </div>
      </Layout>
    );
  }
  
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.['author']?.[0];
  
  moment.locale('ko');
  const formattedDate = moment(post.date).format('YYYY년 MM월 DD일');
  
  return (
    <Layout title={`${post.title.rendered} | Letter WePickr`}>
      <article className={styles.post}>
        <header className={styles.header}>
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
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    const posts = await getPosts(1, 10); // 처음 10개만 사전 생성
    
    // 게시물이 없는 경우 빈 경로 배열 반환
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
    
    return {
      props: {
        post,
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
