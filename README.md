# About This Project

Export disqus comments as github issues.

# Usage

## Export the XML

Export from disqus, wait for the mail to download data. Then,

```bash
gunzip harttleland-2018-05-02T16_51_51.747424-all.xml.gz
mv *.xml data.xml
```

## Sync with Your Issues

Important! Modify the `config.json` accordingly.

```bash
cp config.example.json config.json
```

Install dependencies and run.

```bash
npm install
node index.js
```
