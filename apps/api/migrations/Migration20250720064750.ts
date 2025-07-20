import { Migration } from '@mikro-orm/migrations';

export class Migration20250720064750 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" text not null default 'atksuq9qfs9kzk3rypu5yh3i', "name" text not null, "email" text not null, "email_verified" boolean not null default false, "image" text null, "created_at" date not null, "updated_at" date not null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "session" ("id" text not null default 'q8u4qc8pcy4z6g9zhhqow3o7', "expires_at" date not null, "token" text not null, "ip_address" text null, "user_agent" text null, "user_id" text not null, "created_at" date not null, "updated_at" date not null, constraint "session_pkey" primary key ("id"));`);
    this.addSql(`alter table "session" add constraint "session_token_unique" unique ("token");`);
    this.addSql(`create index "session_token_index" on "session" ("token");`);

    this.addSql(`create table "account" ("id" text not null default 'a0fpb2c2xnov06feu31hx636', "account_id" text not null, "provider_id" text not null, "user_id" text not null, "access_token" text null, "refresh_token" text null, "id_token" text null, "access_token_expires_at" date null, "refresh_token_expires_at" date null, "scope" text null, "password" text null, "created_at" date not null, "updated_at" timestamptz not null, constraint "account_pkey" primary key ("id"));`);

    this.addSql(`create table "verification" ("id" text not null default 'msycrd94hljsv93qfcd8qdrh', "identifier" text not null, "value" text not null, "expires_at" date not null, "created_at" date not null, "updated_at" date not null, constraint "verification_pkey" primary key ("id"));`);
    this.addSql(`create index "verification_identifier_index" on "verification" ("identifier");`);

    this.addSql(`alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "account" add constraint "account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
  }

}
