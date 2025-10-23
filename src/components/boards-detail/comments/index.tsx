/**
 * Comments Component
 * Design Source: Figma Node IDs 285:32630, 285:32460
 * Last Updated: 2025-01-17
 */

import React, { useState } from 'react';
import { Rate } from 'antd';
import { Button } from '@/commons/components/button';
import styles from './styles.module.css';
import Textarea from '@/commons/components/textarea';

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
  onEdit?: (id: string, content: string, rating: number) => void;
  onDelete?: (id: string) => void;
  className?: string;
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
      onEdit,
      onDelete,
      className = '',
    },
    ref
  ) => {
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(0);

    const handleSubmit = () => {
      if (newComment.trim() && rating > 0 && author.trim() && password.trim() && onSubmit) {
        onSubmit(newComment.trim(), rating);
        setNewComment('');
        setRating(0);
        setAuthor('');
        setPassword('');
      }
    };

    const handleEdit = (comment: Comment) => {
      setEditingId(comment.id);
      setEditContent(comment.content);
      setEditRating(comment.rating);
    };

    const handleSaveEdit = () => {
      if (editContent.trim() && editRating > 0 && onEdit && editingId) {
        onEdit(editingId, editContent.trim(), editRating);
        setEditingId(null);
        setEditContent('');
        setEditRating(0);
      }
    };

    const handleCancelEdit = () => {
      setEditingId(null);
      setEditContent('');
      setEditRating(0);
    };

    const handleDelete = (id: string) => {
      if (onDelete) {
        onDelete(id);
      }
    };

    return (
      <div ref={ref} className={`${styles.container} ${className}`}>
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
                onChange={setRating}
                className={styles.rate}
              />
            </div>
          </div>
          
          {/* 작성자 및 비밀번호 입력 영역 */}
          <div className={styles.authorPasswordSection}>
            <div className={styles.authorPasswordRow}>
              <div className={styles.authorInput}>
                <label className={styles.inputLabel}>작성자</label>
                <input
                  type="text"
                  placeholder="작성자를 입력해 주세요."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className={styles.authorPasswordInput}
                />
              </div>
              <div className={styles.passwordInput}>
                <label className={styles.inputLabel}>비밀번호</label>
                <input
                  type="password"
                  placeholder="비밀번호를 입력해 주세요."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.authorPasswordInput}
                />
              </div>
            </div>
          </div>
          
          <div className={styles.inputContainer}>
            <Textarea
              placeholder="댓글을 입력해 주세요."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={styles.commentInput}
            />
            <div className={styles.inputFooter}>
              <Button
                variant="secondary"
                styleType="filled"
                size="large"
                theme="light"
                shape="rounded"
                onClick={handleSubmit}
                disabled={!newComment.trim() || rating === 0 || !author.trim() || !password.trim()}
                className={styles.submitButton}
              >
                댓글 등록
              </Button>
            </div>
          </div>
        </div>

        {/* 댓글 목록 */}  

        <div className={styles.commentsList}>
           {comments.map((comment) => (
            <div key={comment.id} className={styles.commentWrapper}>
              <div className={styles.commentItem}>
                {editingId === comment.id ? (
                  // 편집 모드
                  <div className={styles.editMode}>
                    <div className={styles.editHeader}>
                      <div className={styles.profileAndRatingGroup}>
                        <div className={styles.profileSection}>
                          <img 
                            src={comment.profileImage} 
                            alt={comment.author}
                            className={styles.profileImage}
                          />
                          <span className={styles.authorName}>{comment.author}</span>
                        </div>
                        <div className={styles.editStarRating}>
                          <Rate 
                            value={editRating} 
                            onChange={setEditRating}
                            className={styles.rate}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles.editInputContainer}>
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className={styles.editInput}
                      />
                      <div className={styles.editActions}>
                        <Button
                          variant="secondary"
                          styleType="outline"
                          size="medium"
                          theme="light"
                          shape="rounded"
                          onClick={handleCancelEdit}
                          className={styles.cancelButton}
                        >
                          취소
                        </Button>
                        <Button
                          variant="secondary"
                          styleType="filled"
                          size="medium"
                          theme="light"
                          shape="rounded"
                          onClick={handleSaveEdit}
                          disabled={!editContent.trim() || editRating === 0}
                          className={styles.saveButton}
                        >
                          수정하기
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // 일반 모드
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
                      {comment.isOwner && (
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.actionButton}
                            onClick={() => handleEdit(comment)}
                            title="수정"
                          >
                            <img src="/icons/edit.svg" alt="수정" />
                          </button>
                          <button 
                            className={styles.actionButton}
                            onClick={() => handleDelete(comment.id)}
                            title="삭제"
                          >
                            <img src="/icons/close.svg" alt="삭제" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className={styles.commentText}>
                      {comment.content}
                    </div>
                    <div className={styles.commentDate}>
                      {comment.date}
                    </div>
                  </div>
                )}
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
