/**
 * Comments Component
 * Design Source: Figma Node IDs 285:32630, 285:32460
 * Last Updated: 2025-01-17
 */

import React, { useState } from 'react';
import { Rate } from 'antd';
import { Button } from '@/commons/components/button';
import { Input } from '@/commons/components/input';
import styles from './styles.module.css';
import Textarea from '@/commons/components/textarea';
import useCommentForm from './hooks/index.retrospect.form.hook';

export interface Comment {
  id: string;
  author: string;
  profileImage: string;
  rating: number;
  content: string;
  date: string;
  isOwner?: boolean;
}

export interface CommentsProps {
  comments?: Comment[];
  onSubmit?: (content: string, rating: number) => void;
  className?: string;
  boardId?: string;
}

/**
 * Comments Component
 * 
 * @example
 * // Basic usage
 * <Comments 
 *   comments={comments}
 *   onSubmit={(content, rating) => console.log(content, rating)}
 * />
 */
export const Comments = React.forwardRef<HTMLDivElement, CommentsProps>(
  (
    {
      comments = [],
      onSubmit,
      className = '',
      boardId,
    },
    ref
  ) => {
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');

    const {
      register,
      handleSubmit,
      formState,
      onSubmit: onSubmitForm,
    } = useCommentForm({ boardId });

    const submitDisabled = !author.trim() || !password.trim() || newComment.trim().length < 2;

    const handleEdit = () => {
      // 기능 비활성화
    };

    const handleDelete = () => {
      // 기능 비활성화
    };

    return (
      <div ref={ref} className={`${styles.container} ${className}`} data-testid="comments-section">
        {/* 댓글 입력 영역 */}
        <div className={styles.inputSection}>
          <div className={styles.titleSection}>
            <div className={styles.titleWithIcon}>
              <img 
                src="/icons/chat.svg" 
                alt="댓글" 
                className={styles.chatIcon}
              />
              <span className={styles.title}>댓글</span>
            </div>
            <div className={styles.starRating}>
              <Rate 
                value={rating} 
                onChange={(value) => {
                  setRating(value);
                }}
                className={styles.rate}
              />
            </div>
          </div>
          
          {/* 작성자 및 비밀번호 입력 영역 */}
          <div className={styles.authorPasswordSection}>
            <div className={styles.authorPasswordRow}>
              <div className={styles.authorInput}>
                <Input
                  variant="primary"
                  size="large"
                  theme="light"
                  label="작성자"
                  placeholder="작성자를 입력해 주세요."
                  value={author}
                  required={true}
                  onChange={(e) => setAuthor(e.target.value)}
                  className={styles.authorPasswordInput}
                  data-testid="comment-writer"
                />
              </div>
              <div className={styles.passwordInput}>
                <Input
                  variant="primary"
                  size="large"
                  theme="light"
                  label="비밀번호"
                  type="password"
                  placeholder="비밀번호를 입력해 주세요."
                  value={password}
                  required={true}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.authorPasswordInput}
                  data-testid="comment-password"
                />
              </div>
            </div>
          </div>
          
          <div className={styles.inputContainer}>
            <Textarea
              placeholder="댓글을 입력해 주세요."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={`${styles.commentInput} ${newComment.length > 0 && newComment.length < 2 ? styles.commentInputError : ''}`}
              data-testid="comment-contents"
            />
            <div className={styles.inputFooter}>
              {newComment.length > 0 && newComment.length < 2 && (
                <div className={styles.errorText} data-testid="comment-error">
                  댓글은 2자 이상 입력해 주세요.
                </div>
              )}
              <Button
                variant="secondary"
                styleType="filled"
                size="large"
                theme="light"
                shape="rounded"
                type="button"
                disabled={submitDisabled}
                className={styles.submitButton}
                data-testid="comment-submit"
                onClick={async () => {
                  await onSubmitForm({
                    writer: author,
                    password,
                    contents: newComment,
                    rating,
                  });
                  if (onSubmit) {
                    onSubmit(newComment.trim(), rating);
                  }
                }}
              >
                등록하기
              </Button>
            </div>
          </div>
        </div>

        {/* 댓글 목록 */}  

        <div className={styles.commentsList}>
           {comments.map((comment) => (
            <div key={comment.id} className={styles.commentWrapper}>
              <div className={styles.commentItem}>
                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <div className={styles.profileAndRatingGroup}>
                      <div className={styles.profileSection}>
                        <img 
                          src={comment.profileImage} 
                          alt={comment.author}
                          className={styles.profileImage}
                        />
                        <span className={styles.authorName}>{comment.author}</span>
                      </div>
                      <div className={styles.starRating}>
                        <Rate 
                          value={comment.rating} 
                          disabled
                          className={styles.rate}
                        />
                      </div>
                    </div>
                    <div className={styles.actionButtons}>
                      <button 
                        className={styles.actionButton}
                        onClick={handleEdit}
                        title="수정"
                      >
                        <img src="/icons/edit.svg" alt="수정" />
                      </button>
                      <button 
                        className={styles.actionButton}
                        onClick={handleDelete}
                        title="삭제"
                      >
                        <img src="/icons/close.svg" alt="삭제" />
                      </button>
                    </div>
                  </div>

                  <div className={styles.commentText}>
                    {comment.content}
                  </div>
                  <div className={styles.commentDate}>
                    {comment.date}
                  </div>
                </div>
              </div>
            </div>
           ))}
        </div>


      </div>
    );
  }
);

Comments.displayName = 'Comments';

export default Comments;
