# 我的网站项目

这是一个简单的静态网站项目，使用 GitHub Actions 自动部署到 Vercel。

## 在 Trae 中配置 GitHub

### 1. 初始化 Git 仓库

如果还没有初始化 Git 仓库，请运行：

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. 连接到 GitHub 仓库

1. 在 GitHub 上创建一个新的仓库
2. 将本地仓库连接到 GitHub：

```bash
git remote add origin https://github.com/WangHaiFengUp/my-site.git
git branch -M main
git push -u origin main
```

### 3. 配置 GitHub Secrets

为了安全地使用 Vercel 部署，需要在 GitHub 仓库中设置以下 Secrets：

1. 进入你的 GitHub 仓库
2. 点击 `Settings` → `Secrets and variables` → `Actions`
3. 添加以下 Repository secrets：

- `VERCEL_TOKEN`: 你的 Vercel API Token
- `VERCEL_ORG_ID`: 你的 Vercel 组织 ID
- `VERCEL_PROJECT_ID`: 你的 Vercel 项目 ID

### 4. 获取 Vercel 配置信息

#### 获取 Vercel Token：
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入 `Settings` → `Tokens`
3. 创建一个新的 Token

#### 获取 Org ID 和 Project ID：
1. 在 Vercel 中创建或选择你的项目
2. 进入项目设置，在 URL 中可以找到这些 ID
3. 或者使用 Vercel CLI：
```bash
npx vercel link
```

### 5. 自动部署流程

配置完成后，每当你推送代码到 `main` 分支时，GitHub Actions 会自动：

1. 检出代码
2. 设置 Node.js 环境
3. 部署到 Vercel

### 6. 在 Trae 中使用

在 Trae IDE 中，你可以：

1. 使用内置的 Git 功能提交和推送代码
2. 查看 GitHub Actions 的运行状态
3. 直接在编辑器中管理你的项目文件

## 项目结构

```
mysite/
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions 配置
├── index.html           # 主页面
└── README.md           # 项目说明
```

## 部署状态

每次推送后，你可以在 GitHub 仓库的 `Actions` 标签页查看部署状态。