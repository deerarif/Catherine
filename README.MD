##Catherine
This is bit whats'app using Fonnte.com
How to setup is as follows
1. Install nginx and python dependencies
```bash
sudo apt install nginx
pip install  requirements.txt
```
2. Import database
```bash
mysqldump -h <database host> -u <username> -p Catherine > Catherine.sql
```
3. Setup Nginx
```bash
cat default > /etc/nginx/sites-available/default
systemctl restart nginx
```
4. Install pm2
```bash
npm install pm2 -g
```
5. Start service
```bash
start index.js --name="Catherine"
```
