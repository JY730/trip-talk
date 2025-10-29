# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - link "TripTalk Logo" [ref=e6] [cursor=pointer]:
            - /url: /boards
            - img "TripTalk Logo" [ref=e7]
          - navigation [ref=e8]:
            - link "트립토크" [ref=e9] [cursor=pointer]:
              - /url: /boards
            - link "숙박권 구매" [ref=e10] [cursor=pointer]:
              - /url: /products
            - link "마이 페이지" [ref=e11] [cursor=pointer]:
              - /url: /mypage
        - link "로그인" [ref=e12] [cursor=pointer]:
          - /url: /auth/login
          - button "로그인" [ref=e13]:
            - generic [ref=e14]: 로그인
    - generic [ref=e19]:
      - generic [ref=e21]:
        - img "Banner 1"
      - generic [ref=e23]:
        - img "Banner 2"
      - generic [ref=e25]:
        - img "Banner 3"
    - main [ref=e31]:
      - heading "숙박권 상세" [level=1] [ref=e33]
  - alert [ref=e34]
```