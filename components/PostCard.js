import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/ko';
import styles from '../styles/PostCard.module.css';

export default function PostCard({ post }) {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.['author']?.[0];
  
  moment.locale('ko');
  const formattedDate = moment(post.date).format('YYYY년 MM월 DD일');
  
  return (
    <div className={styles.card}>
      {featuredMedia && featuredMedia.source_url && (
        <div className={styles.imageContainer}>
          <Image
            src={featuredMedia.source_url}
            alt={post.title.rendered}
            layout="fill"
            objectFit="cover"
            className={styles.image}
          />
        </div>
      )}
      
      <div className={styles.content}>
        <h2>
          <Link href={`/post/${post.slug}`}>
            <a dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </Link>
        </h2>
        
        <div className={styles.meta}>
          {author && <span>작성자: {author.name}</span>}
          <span>작성일: {formattedDate}</span>
        </div>
        
        <div 
          className={styles.excerpt}
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
        
        <Link href={`/post/${post.slug}`}>
          <a className={styles.readMore}>자세히 보기</a>
        </Link>
      </div>
    </div>
  );
}