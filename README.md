<div align="center">
  <h2>🍊 mikan 🍊</h2>
  <img src="https://img.shields.io/github/last-commit/karabiner-inc/mikan?&logo=github"/>
  <img src="https://img.shields.io/github/issues/karabiner-inc/mikan?logo=github" />
  <img src="https://img.shields.io/github/issues-pr-raw/karabiner-inc/mikan?logo=github" />
</div>

## Usage

```bash
mikan --help
  Usage:   mikan
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

  Examples:

    Upload markdown to Notion: $ mikan upload ./md
```

## Install

## Setup

Get Notion API key and page/database id

  1. Follow [guide](https://developers.notion.com/docs)
  2. Create root page
  3. Click `Share` and invide your integration
  4. Set environment variables

     ```bash
     export NOTION_API_KEY=<your api key>
     export NOTION_ROOT_PARENT_ID=<your parent page id>
     ```
  5. Completed!

## Development

see [DEVELOPMENT_GUIDE](DEVELOPMENT_GUIDE.md)
