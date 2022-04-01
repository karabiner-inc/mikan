<div align="center">
  <h2>🍊 mikan 🍊</h2>
  <img src="https://img.shields.io/github/last-commit/karabiner-inc/mikan?&logo=github"/>
  <img src="https://img.shields.io/github/issues/karabiner-inc/mikan?logo=github" />
  <img src="https://img.shields.io/github/issues-pr-raw/karabiner-inc/mikan?logo=github" />
</div>

## Usage

```bash
mikan --help
  Usage:   mikan <command> [option]
  Version: 0.0.1

  Description:


    マークダウンファイルをNotionに送信し新しいページとして挿入します

  Options:

    -h, --help     - Show this help.
    -V, --version  - Show the version number for this program.

  Commands:

    upload       <directory>  - import md to Notion
    get          <target>     - get block info
    update       <target>     - update
    help         [command]    - Show this help or the help of a sub-command.
    completions               - Generate shell completions.

  Environment variables:

    NOTION_API_KEY         <value>  - Notion API key
    NOTION_ROOT_PARENT_ID  <value>  - Notion page id
    NOTION_DATABASE_ID     <value>  - Notion database id

  Examples:

    Move your-knowledge to Notion: $ mikan move
                                   search md file from ./md and call Notion API
```

## Development

### requirements

- [deno](https://github.com/denoland/deno_install)
- [vr](https://velociraptor.run/docs/installation/)
- [dex](https://github.com/kawarimidoll/deno-dex) (option but recommend)
- [gh](https://cli.github.com) (option but recommend)

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

2. Install deno, vr, and dex command

```bash
# deno
## 🍺 brew user
brew install deno
## 🐚 shell lover
curl -fsSL https://deno.land/x/install/install.sh | sh
## 🦀 rustisian
cargo install deno --locked

# vr
deno install -qAn vr https://deno.land/x/velociraptor@1.3.0/cli.ts

# dex
deno install \
  --allow-read --allow-write --allow-run \
  --reload \
  --force \
  --name dex \
  https://pax.deno.dev/kawarimidoll/deno-dex/main.ts
```

3. Get Notion API key and page/database id

   1. Follow [guide](https://developers.notion.com/docs)

   2. Create `.env` file

      ```env
      NOTION_API_KEY=<your api key>
      NOTION_ROOT_PARENT_ID=<your parent page id>
      DEBUG=true # enable debug-mode
      ```
4. read help

```bash
vr cli --help
```

5. motion command

First of all, you must create `md` directory and put sample markdown file.<br>
Next, run following command.

```
vr cli motion
```

### test

```bash
vr test
```
