import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    await app.listen(4000);
    prismaService = app.get(PrismaService);
    await prismaService.cleanDb();
    pactum.request.setBaseUrl('http://localhost:4000');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const bodyDto: AuthDto = {
      email: 'hugo@gmail.com',
      password: 'admin',
    };

    describe('Signup', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: bodyDto.password,
          })
          .expectStatus(400)
          .inspect();
      });
    });

    describe('Signup', () => {
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: bodyDto.email,
          })
          .expectStatus(400)
          .inspect();
      });
    });

    describe('Signup', () => {
      it('should throw if no bady provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400)
          .inspect();
      });
    });

    describe('Signup', () => {
      it('should return a token', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(bodyDto)
          .expectStatus(201)
          .inspect();
      });
    });

    describe('Signin', () => {
      it('should return a token', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(bodyDto)
          .expectStatus(200)
          .inspect()
          .stores('userArt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should return a user profile', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: `Bearer $S{userArt}`,
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const bodyDto: EditUserDto = {
          email: 'hugo@gmail.com',
          firstname: 'Hugo',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `Bearer $S{userArt}`,
          })
          .withBody(bodyDto)
          .expectStatus(200)
          .expectBodyContains(bodyDto.firstname)
          .expectBodyContains(bodyDto.email);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get bookmarks', () => {
      it('should return a list of bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: `Bearer $S{userArt}`,
          })
          .expectStatus(200)
          .expectBody([]);
        //.expectJsonLength(1);
      });
    });

    describe('Create bookmark', () => {
      const bodyDto: CreateBookmarkDto = {
        link: 'https://www.google.com',
        title: 'Google',
      };
      it('should return a list of bookmarks', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: `Bearer $S{userArt}`,
          })
          .withBody(bodyDto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmark by Id', () => {
      it('should return a  bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: `Bearer $S{userArt}`,
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Edit bookmark by Id', () => {
      const bodyDto: EditBookmarkDto = {
        title: 'Google Updated',
        description: 'Google',
      };
      it('should return a  edited bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: `Bearer $S{userArt}`,
          })
          .withBody(bodyDto)
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains(bodyDto.title)
          .inspect();
      });
    });
    describe('Delete bookmark by Id', () => {
      it('should return a  deleted bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: `Bearer $S{userArt}`,
          })
          .expectStatus(204)
          .inspect();
      });
    });
  });
});
