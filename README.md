下载依赖
yarn install

运行本地前端项目：rebase
补充安装依赖
"@vitejs/plugin-vue": "^4.1.0",
"vite": "^4.3.9",
npm run dev
打包
npm run build

运行服务端
npm run dev:serve

_tk_enc = ca82ea7c8cc662df3aa6d5ddc9e71b09
_tk = cf52cb8b532785fba52b3045c34037ce_1690280976012

CREATE TABLE cookies (
    id SERIAL PRIMARY KEY,
    gyf_token VARCHAR,
    cookie_value TEXT
);

INSERT INTO cookies (gyf_token, cookie_value) VALUES ('gyfnice', 'asssssssssjjjjjjjjjsssssxxxxxxx');

CREATE TABLE goods_prices (
    id SERIAL PRIMARY KEY,
    store_id INTEGER,
    store_name VARCHAR,
    month_sell INTEGER,
    price NUMERIC,
    goods_name VARCHAR,
    timestamp  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE games (
   id SERIAL PRIMARY KEY,
   date TEXT,
   list JSON
);

CREATE TABLE sign_records (
   id SERIAL PRIMARY KEY,
   signkey TEXT,
   timestamp  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE global_game_info (
   id SERIAL PRIMARY KEY,
   timestamp  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   queryType TEXT,
   info JSON
);