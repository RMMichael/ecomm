# ecomm
## TODO
- [?] nginx works locally
- [?] nginx works on aws
- [ ] https set up
- [ ] integrate google account sign in, express sessions, users table in db
- [ ] express api https://github.com/cdimascio/express-openapi-validator
- [ ] database model and api implementation
- [ ] ui/frontend/react stuff
## Tech Stack
- frontend
    - react
    - nextjs
- backend
    - node
    - express
    - postgres
- deployment
    - docker
    - aws ec2
    - cloudflare

# Development
## Useful Commands
- `docker-compose up --build [-d]` - build images and run containers \[in background\]
- `docker-compose down` - stops and removes containers and networks from `docker-compose up`
- `docker-compose exec SERVICE /bin/bash` - connect to backend/frontend/... container
  labeled by `service` in docker-compose.yaml
- `docker-compose logs --help` - view logs from containers

## Setting up https
- certbot [quickstart](https://certbot.eff.org/lets-encrypt/ubuntufocal-nginx)
- certbot [docs](https://certbot.eff.org/docs/using.html)
- nginx serves static files from `./frontend/dist` and we configure it to serve
  `/.well-known/acme-challenge/` over http port 80 to validate the server (see also `nginx.conf`)
- assuming project is in `~/ut-reviews` and config file is in `~/letsencrypt/cli.ini`
- `sudo cerbot certonly --dry-run --config-dir ~/letsencrypt --webroot -w ~/ut-reviews/frontend/dist -d ut-reviews.com -d www.ut-reviews.com`
- remove `--dry-run` when it works
- `sudo certbot renew --dry-run --config-dir ~/letsencrypt` test automatic renew
- add to `.env`: `KEY_FILE=/path/to/privkey.pem` and `CERT_FILE=/path/to/fullchain.pem`

## Setting up https in development (optional)
- for development, typically test using frontend webpack dev server on `localhost:8080`
- this is for testing nginx using `localhost:80` and `localhost:443` without https warnings
- https://web.dev/how-to-use-local-https/
    - `mkcert -key-file privkey.pem -cert-file fullchain.pem localhost`
    - set the directories in `.env` (/path/to/containing/folder)
        - `KEY_FOLDER=./`
        - `CERT_FOLDER=./`
    - `mkcert -uninstall` will remove the installed CA from your browser and system
