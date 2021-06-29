# 專案說明
Node.js + Fastify + .........
MySQL


devDependencies
npm i -D nodemon prisma prisma-merge


dependencies
npm i -S dotenv dotenv-expand axios @prisma/client

npm i -S fastify fastify-cors fastify-jwt fastify-multipart fastify-swagger

npm i -S json-keys-sort mysql2 nanoid sharp

npm i -S casbin fastify-casbin fastify-casbin-rest

TODO install
pm2 form-data


# prisma 指令
```shell
# Prisma 指令, 從資料庫生成 model json
npx prisma introspect

# Prisma 指令, 從 model json生成 Prisma client script
npx prisma generate

# prisma merge
npx prisma-merge
```

# TODO
env環境準備(test,production)
add casbin policy
errorList.js 持續補完
vue.config.js 反向代理前後端（本機開發用）