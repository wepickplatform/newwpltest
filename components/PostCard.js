// components/PostCard.js - 설명 부분 제거
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/ko';
import styles from '../styles/PostCard.module.css';

export default function PostCard({ post }) {
  moment.locale('ko');
  const formattedDate = moment(post.date).format('YYYY년 MM월 DD일');
  
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.['author']?.[0];
  
  // 대표 이미지 URL 또는 main_img
  const imageUrl = post.main_img || (featuredMedia?.source_url || null);
  
  return (
    <article className={styles.card}>
      <Link href={`/post/${post.slug}`}>
        <a className={styles.cardLink}>
          <div className={styles.cardMedia}>
            {imageUrl ? (
              <div className={styles.imageContainer}>
                <Image
                  src={imageUrl}
                  alt={post.title.rendered}
                  width={400}
                  height={240}
                  layout="responsive"
                  className={styles.image}
                />
              </div>
            ) : (
              <div className={styles.noImage}>
                <span className={styles.noImageText}>이미지 없음</span>
              </div>
            )}
          </div>
          
          <div className={styles.cardContent}>
            <h3 
              className={styles.cardTitle}
              dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
            />
            
            <div className={styles.cardMeta}>
              {author && (
                <span className={styles.author}>
                  <span className={styles.metaIcon}>👤</span> {author.name}
                </span>
              )}
              <span className={styles.date}>
                <span className={styles.metaIcon}>📅</span> {formattedDate}
              </span>
            </div>
            
            {/* 설명(excerpt) 부분 제거 */}
            
            <span className={styles.readMore}>
              자세히 보기 <span className={styles.arrow}>→</span>
            </span>
          </div>
        </a>
      </Link>
    </article>
  );
}
