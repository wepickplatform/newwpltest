// components/FeaturedSlider.js
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/FeaturedSlider.module.css';

export default function FeaturedSlider({ posts }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [posts.length]);
  
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };
  
  if (!posts || posts.length === 0) {
    return <div className={styles.noSlides}>추천 게시물이 없습니다.</div>;
  }
  
  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider}>
        // components/FeaturedSlider.js의 이미지 표시 부분 수정
// components/FeaturedSlider.js의 이미지 표시 부분 수정
{posts.map((post, index) => {
  // 먼저 main_img를 사용하고, 없으면 featured media로 폴백
  const mainImg = post.main_img;
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const featuredImgUrl = featuredMedia?.source_url;
  
  // 둘 중 하나를 사용
  const imageUrl = mainImg || featuredImgUrl;
  
  console.log(`Post ${index} (ID: ${post.id}) main_img:`, mainImg);
  console.log(`Post ${index} (ID: ${post.id}) featured image:`, featuredImgUrl);
  console.log(`Post ${index} (ID: ${post.id}) using image:`, imageUrl);
  
  return (
    <div
      key={post.id}
      className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
    >
      <Link href={`/post/${post.slug}`}>
        <a className={styles.slideLink}>
          {imageUrl ? (
            <div className={styles.imageWrapper}>
              <Image
                src={imageUrl}
                alt={post.title.rendered || '게시물 이미지'}
                width={1200}
                height={600}
                layout="responsive"
                objectFit="cover"
                priority={index === currentSlide}
                onError={(e) => {
                  console.error(`Image load error for post ${post.id}:`, e);
                  // 이미지 로드 실패 시 기본 이미지로 대체 (필요시)
                  // e.target.src = '/images/default.jpg';
                }}
              />
            </div>
          ) : (
            <div className={styles.noImage}>
              <div className={styles.noImageText}>이미지 없음</div>
            </div>
          )}
          <div className={styles.slideContent}>
            <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </div>
        </a>
      </Link>
    </div>
  );
})}
      </div>
      
      <button className={styles.prevButton} onClick={prevSlide} aria-label="이전 슬라이드">
        <span>&lt;</span>
      </button>
      <button className={styles.nextButton} onClick={nextSlide} aria-label="다음 슬라이드">
        <span>&gt;</span>
      </button>
      
      <div className={styles.indicators}>
        {posts.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`슬라이드 ${index + 1} 보기`}
          />
        ))}
      </div>
    </div>
  );
}
