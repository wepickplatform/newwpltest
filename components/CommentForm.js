// components/CommentForm.js
import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { postComment } from '../lib/api';
import styles from '../styles/CommentForm.module.css';

export default function CommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      if (!isAuthenticated) {
        throw new Error('댓글을 작성하려면 로그인이 필요합니다.');
      }
      
      const newComment = await postComment(postId, content, user.token);
      setContent('');
      
      // 댓글 추가 완료 후 콜백 실행
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (error) {
      setError(error.message || '댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.formContainer}>
      <h3 className={styles.title}>댓글 작성</h3>
      
      {!isAuthenticated ? (
        <div className={styles.loginMessage}>
          댓글을 작성하려면 <a href="/login" className={styles.loginLink}>로그인</a>이 필요합니다.
        </div>
      ) : (
        <>
          {error && <div className={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={4}
              disabled={isSubmitting}
              className={styles.textarea}
            />
            
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className={styles.button}
            >
              {isSubmitting ? '등록 중...' : '댓글 등록'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
