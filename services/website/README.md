釣り日誌フロントエンド
=====================

実行方法
--------

**Vite の実行**

```
npm install
npm run dev
```

上記実行後に http://localhost:3000 にアクセスする (自動的にブラウザーが起動する)

**Storybook の実行**

```
npm install
npm run storybook
```

上記実行後に http://localhost:6006 にアクセスする (自動的にブラウザーが起動する)

構築手順
--------

```
npm create vite@latest fishing-logger-website -- --template react-ts
mv fishing-logger-website/* .
mv fishing-logger-website/.gitignore .
rmdir fishing-logger-website
npx sb init --builder @storybook/builder-vite
npm install bootstrap reactstrap --force
npm install formik yup
npm install @js-joda/core
npm install react react-dom leaflet
npm install -D @types/leaflet
npm install react-router-dom@6
```
