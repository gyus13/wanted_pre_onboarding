## Tech
* NodeJS(NestJS)
* MYSQL(TypeORM)
* ERD 설계도
  * https://www.erdcloud.com/d/2g9ZPdg6Tc8TsKf2n

## API 구현 과정

### 1. 채용공고 등록
* 데이터를 담을 dto를 작성하여, POST메소드를 활용하여 Request합니다.
```bash
# postPostRequestDto에 담아서 service layer에서 해당 데이터를 가지고 채용공고를 생성합니다.
const post = new Post();
      post.companyId = postPostRequestDto.companyId;
      post.position = postPostRequestDto.position;
      post.reward = postPostRequestDto.reward;
      post.text = postPostRequestDto.text;
      post.tech = postPostRequestDto.tech;
      post.createdAt = defaultCurrentDateTime();
      post.updatedAt = defaultCurrentDateTime();
      const postResult = await queryRunner.manager.save(post);
      
# 데이터를 입력하기 때문에 transaction을 설정해줍니다.(생성, 수정, 삭제 api에 모두 추가합니다.)
const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      ...
      await queryRunner.commitTransaction();
      ...
    } catch (error) {
      // Rollback
      await queryRunner.rollbackTransaction();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
```

### 2. 채용공고 수정
* 데이터를 담을 dto를 작성하여, PATCH메소드를 활용하여 Request합니다.
```bash
# postPostRequestDto에 담아서 service layer에서 해당 데이터를 가지고 채용공고를 수정합니다.
      await queryRunner.manager.update(
        Post,
        { id: id },
        { position: postPostRequestDto.position },
      );

      await queryRunner.manager.update(
        Post,
        { id: id },
        { reward: postPostRequestDto.reward },
      );
```

### 3. 채용공고 삭제
```bash
# DELETE 메소드로 parameter postId를 받아서 service layer에서 해당 채용공고를 삭제합니다.
      await queryRunner.manager.delete(Post, { id: id });
```

### 4. 채용공고 목록 조회 (검색 기능 구현)
```bash
# GET 방식으로 요청시 채용공고 목록 조회가 가능합니다.
const queryResult = await getManager()
        .createQueryBuilder(Post, 'post')
        .leftJoin(Company, 'company', 'post.companyId = company.id')
        .select([
          'post.id as postId',
          'post.position as position',
          'post.reward as reward',
          'post.tech as tech',
        ])
        .addSelect([
          'company.name as name',
          'company.country as country',
          'company.region as region',
        ])
        .getRawMany()
# queryString으로 검색어를 요청 할시 해당하는 데이터를 리턴 합니다.
if (request.query.keyword) {
        await queryResult.orWhere('post.position like :keyword', {
          keyword: `%${request.query.keyword}%`,
        });
        await queryResult.orWhere('post.reward like :keyword', {
          keyword: `%${request.query.keyword}%`,
        });
        await queryResult.orWhere('post.tech like :keyword', {
          keyword: `%${request.query.keyword}%`,
        });
        await queryResult.orWhere('company.name like :keyword', {
          keyword: `%${request.query.keyword}%`,
        });
        await queryResult.orWhere('company.country like :keyword', {
          keyword: `%${request.query.keyword}%`,
        });
        await queryResult.orWhere('company.region like :keyword', {
          keyword: `%${request.query.keyword}%`,
        });
      }
```

### 5. 채용공고 상세 조회
```bash
# development
$ npm run start
```

### 6. 채용공고 지원
```bash
# development
$ npm run start
```

