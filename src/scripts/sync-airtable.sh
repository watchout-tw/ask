echo 'ask cron job started' > /home/wesley_lin/ask.log
if [ ! -d "ask.watchout.tw" ]; then
    git clone https://github.com/watchout-tw/ask.watchout.tw.git
fi
if [ -d "ask.watchout.tw" ]; then
    cd ask.watchout.tw && git pull
fi
curl -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization:Bearer keyFcWwzNgkQUNPBh" 
-X GET 'https://api.airtable.com/v0/apppL3V4r4Tqf0nhR/Events?view=Main' -o ./data/events.json
curl -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization:Bearer keyFcWwzNgkQUNPBh" 
-X GET 'https://api.airtable.com/v0/apppL3V4r4Tqf0nhR/Guests?view=Main' -o ./data/guests.json
curl -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization:Bearer keyFcWwzNgkQUNPBh" 
-X GET 'https://api.airtable.com/v0/apppL3V4r4Tqf0nhR/Partners?view=Main' -o ./data/partners.json
echo 'ask cron job curl success' > /home/wesley_lin/ask.log
git commit -a -m "Update data"
git push
echo 'ask cron job git success' > /home/wesley_lin/ask.log
