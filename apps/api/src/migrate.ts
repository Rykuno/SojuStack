import 'dotenv/config';
import { MikroORM } from '@mikro-orm/postgresql';
import mikroConfig from '../mikro-orm.config';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();

  // const post = orm.em.create(Post, { title: 'my first post' });
  // await orm.em.persistAndFlush(post);
};

main();
