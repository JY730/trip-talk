'use client';

/**
 * Boards Component
 * Design Source: Wireframe
 * Last Updated: 2025-10-20
 */

import React, { useState } from 'react';
import { DatePicker } from 'antd';
import { SearchBar } from '@/commons/components/searchbar';
import { Button } from '@/commons/components/button';
import { Dayjs } from 'dayjs';
import styles from './styles.module.css';

const { RangePicker } = DatePicker;

export default function Boards() {
  const [searchValue, setSearchValue] = useState('');

  const [selectedRange, setSelectedRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  
  const dateFormat = 'YYYY-MM-DD';
  // 검색 핸들러
  const handleSearch = (value: string) => {
    console.log('검색어:', value);
    // TODO: 실제 검색 로직 구현
  };

  // 날짜 변경 핸들러
  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setSelectedRange(dates || [null, null]);
  };


  // 검색 실행 핸들러
  const handleSearchClick = () => {
    console.log('검색 실행:', { searchValue, selectedRange });
    // TODO: 실제 검색 로직 구현
  };

  // 트립토크 등록 핸들러
  const handleWriteClick = () => {
    console.log('트립토크 등록 클릭');
    // TODO: 등록 페이지로 이동
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>트립토크</h1>
      </div>
      

      <div className={styles.searchContainer}>
        <div className={styles.searchRow}>
          <div className={styles.searchBox}>
            <SearchBar
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              placeholder="제목을 검색해 주세요."
              size="large"
              theme="light"
              containerClassName={styles.searchBarContainer}
            />
          </div>
          
          <div className={styles.datePickerBox}>
            
            <RangePicker
              value={selectedRange}
              onChange={handleRangeChange}
              placeholder={['YYYY-MM-DD', 'YYYY-MM-DD']}
              format={dateFormat}
              className={styles.datePicker}
              allowClear={false}
              suffixIcon={<img src="/icons/calendar.svg" alt="calendar icon" className={styles.calendarIcon} />}
            />

          </div>
          
          <div className={styles.searchButtonBox}>
            <Button
              variant="secondary"
              styleType="filled"
              size="large"
              theme="light"
              shape="rectangle"
              onClick={handleSearchClick}
              className={styles.searchButton}
            >
              검색
            </Button>
          </div>
        </div>
        
        <div className={styles.writeButton}>
          <Button
            variant="primary"
            styleType="filled"
            size="large"
            theme="light"
            shape="rectangle"
            leftIcon={
              <img 
                src="/icons/submit.svg" 
                alt="등록" 
              />
            }
            onClick={handleWriteClick}
            className={styles.writeButtonComponent}
          >
            트립토크 등록
          </Button>
        </div>
      </div>

      
      <div className={styles.contentSection}>
        <div className={styles.contentContainer}>
          <div className={styles.boardList}>
            <span className={styles.placeholderText}>Board List Items</span>
          </div>
        </div>
      </div>
    </div>
  );
}
