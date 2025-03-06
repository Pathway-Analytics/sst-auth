# make new certs #

```bash
openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes -subj "/CN=local.pathwayanalytics.com"
```

Add it to Keychain and trust

```bash
open /Users/chewitt/code/pwa-refactor/packages/web/certs/cert.pem
```
