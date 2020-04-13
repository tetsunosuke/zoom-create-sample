# zoom-create-sample
zoomのミーティングを作成するCLI

# 事前準備

`config.js` にAPIKey, APISecret, user（メールアドレス） を記載しておくこと

※ この設定法については詳しく書く

```config.js
const env = process.env.NODE_ENV || 'production'

//insert your API Key & Secret for each environment, keep this file local and never push it to a public repo for security purposes.
const config = {
	development :{
		APIKey : '',
		APISecret : '',
        user: ""
	},
	production:{
		APIKey : '',
		APISecret : '',
        user: ""
	}
};

module.exports = config[env]
```


# 使い方

$ node create.js {作成日時のパラメータ} {オプション}

## 作成日時のパラメータの例

```
# 今日の19時から
$ node create.js 19:00 
# 2020/10/10 11:00から
$ node create.js "2020/10/10 11:00"
```

デフォルト値は「今」です。

## オプション

- topic: ミーティング名称
- minutes: ミーティング予定時間

例

```
# 今から30分のミーティング
$ node create.js --topic "今からのミーティング" --minutes 30
# 19時から40分のミーティング
$ node create.js --topic "◯◯ミーティング" --minutes 40
```

それぞれ、デフォルト値は "no topic"と60分です。

