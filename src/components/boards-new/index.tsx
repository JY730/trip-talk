import React from 'react';
import styles from './styles.module.css';
import { Input } from '../../commons/components/input';
import { Textarea } from '../../commons/components/textarea';
import { Button } from '../../commons/components/button';

const BoardsNew = () => {
  return (
    <div className={styles.container}>      
      {/* Detail Title */}
      <div className={styles.submitTitle}>
        <h1>게시글 등록</h1>
      </div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Input User */}
      <div className={styles.inputUser}>
        <div className={styles.userInputWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            label="작성자"
            placeholder="작성자를 입력해 주세요."
            required
            containerClassName={styles.userInputContainer}
          />
        </div>
        <div className={styles.passwordInputWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            label="비밀번호"
            placeholder="비밀번호를 입력해 주세요."
            type="password"
            required
            containerClassName={styles.passwordInputContainer}
          />
        </div>
      </div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Divider */}
      <div className={styles.divider}></div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Input Title */}
      <div className={styles.inputTitle}>
        <Input
          variant="primary"
          theme="light"
          size="large"
          label="제목"
          placeholder="제목을 입력해 주세요."
          required
          containerClassName={styles.titleInputContainer}
        />
      </div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Divider */}
      <div className={styles.divider}></div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Input Content */}
      <div className={styles.inputContent}>
        <Textarea
          label="내용"
          placeholder="내용을 입력해 주세요."
          required
          containerClassName={styles.contentInputContainer}
        />
      </div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Input Address */}
      <div className={styles.inputAddress}>
        <div className={styles.postcodeWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            label="주소"
            placeholder="01234"
            containerClassName={styles.postcodeInputContainer}
            rightButton={
              <Button
                variant="secondary"
                styleType="outline"
                size="large"
                shape='rectangle'
                className={styles.postcodeSearchButton}
              >
                우편번호 검색
              </Button>
            }
          />
        </div>
        <div className={styles.addressInputWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            placeholder="주소를 입력해 주세요."
            containerClassName={styles.addressInputContainer}
          />
        </div>
        <div className={styles.detailAddressWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            placeholder="상세주소"
            containerClassName={styles.detailAddressInputContainer}
          />
        </div>
      </div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Divider */}
      <div className={styles.divider}></div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Input YouTube URL */}
      <div className={styles.inputYoutubeUrl}>
        <Input
          variant="primary"
          theme="light"
          size="large"
          label="유튜브 링크"
          placeholder="링크를 입력해 주세요."
          containerClassName={styles.youtubeInputContainer}
        />
      </div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Divider */}
      <div className={styles.divider}></div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Add Image Button */}
      <div className={styles.addImageSection}>
        <div className={styles.imageUploadLabel}>
          <span className={styles.imageLabel}>사진 첨부</span>
        </div>
        <div className={styles.imageUploadGrid}>
          <div className={styles.imageUploadSlot}>
            <img src="/icons/add.svg" alt="이미지 추가" className={styles.addIcon} />
            <span className={styles.addImageText}>클릭해서 사진 업로드</span>
          </div>
          <div className={styles.imageUploadSlot}>
            <img src="/icons/add.svg" alt="이미지 추가" className={styles.addIcon} />
            <span className={styles.addImageText}>클릭해서 사진 업로드</span>
          </div>
          <div className={styles.imageUploadSlot}>
            <img src="/icons/add.svg" alt="이미지 추가" className={styles.addIcon} />
            <span className={styles.addImageText}>클릭해서 사진 업로드</span>
          </div>
        </div>
      </div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Submit Button */}
      <div className={styles.button}>
        <div className={styles.buttonWrapper}>
          <Button
            variant="secondary"
            styleType="outline"
            size="large"
            shape='rectangle'
            className={styles.cancelButton}
          >
            취소
          </Button>
          <Button
            variant="primary"
            styleType="filled"
            size="large"
            shape='rectangle'
            className={styles.submitButton}
          >
            등록하기
          </Button>
        </div>
      </div>

      <div className={styles.gap}></div>
    </div>
  );
};

export default BoardsNew;
