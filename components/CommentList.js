// components/CommentList.js
import moment from 'moment';
import 'moment/locale/ko';
import styles from '../styles/CommentList.module.css';

export default function CommentList({ comments }) {
  moment.locale('ko');
  
  if (!comments || comments.length === 0) {
    return <div className={styles.noComments}>아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</div>;
  }
  
  return (
    <div className={styles.commentList}>
      {comments.map(comment => (
        <div key={comment.id} className={styles.comment}>
          <div className={styles.commentHeader}>
            <span className={styles.author}>{comment.author_name}</span>
            <span className={styles.date}>
              {moment(comment.date).format('YYYY년 MM월 DD일 HH:mm')}
            </span>
          </div>
          <div 
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
          />
        </div>
      ))}
    </div>
  );
}
