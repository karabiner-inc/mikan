## Development

### requirements

- [deno](https://github.com/denoland/deno_install)

### development step

1. Clone repo

```bash
# git user
git clone https://github.com/karabiner-inc/mikan

# ghq user
ghq get https://github.com/karabiner-inc/mikan

# gh user
gh repo clone https://github.com/karabiner-inc/mikan
```

2. Install deno

```bash
# deno
## 🍺 brew user
brew install deno
## 🐚 shell lover
curl -fsSL https://deno.land/x/install/install.sh | sh
## 🦀 rustisian
cargo install deno --locked
```

3. Get Notion API key and page/database id

   1. Follow [guide](https://developers.notion.com/docs)

   2. Create `.env` file

      ```env
      NOTION_API_KEY=<your api key>
      NOTION_ROOT_PARENT_ID=<your parent page id>
      DEBUG=true # enable debug-mode
      ```
5. execute command

First of all, you create `md` directory and put markdown files.  
Next, run following command.

```
deno task cli upload ./md
```

### test

```bash
deno task test:cli
```

