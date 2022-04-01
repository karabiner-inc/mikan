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

see [DEVELOPMENT_GUIDE](DEVELOPMENT_GUIDE.md)
