var random = function(list) {
  return list && list[Math.floor(Math.random() * list.length)];
}
var randomInt = function(from, to) {
  return Math.floor(from + Math.random()*(to - from + 1));
}
var Sample = {
  target: ['時代力量', '國民黨', '民進黨', '勞動部', '司法改革', '體育改革', '台南市長', '高雄市長'],
  name: ['蔡英文', '黃國昌', '范雲', '楊智達', '張惠妹', '林祖儀', '呂家蓉', '王希'],
  job: ['總統', '主席', '立法委員', '候選人', '宅宅', '執行長', '歌手', '秘書長'],
  youtubeID: ['4BfxvvbVYWQ', 'THHQzPKuXzI', 'TdtXso7GB_s', 'ADxzZk9wzDk'],
  partner: ['FGT! 體育改革聯會', '自由時報', 'Google', 'Yahoo!', '蘋果日報', '報導者'],
  date: ['2017-06-08', '2017-05-20', '2017-05-13', '2017-04-17', '2017-04-05', '2016-09-09', '2016-08-31', '2016-06-04'],
  time: ['9:00', '10:30', '13:00', '14:30', '16:00', '18:00', '18:30', '19:30'],
}
var Factory = (function Factory() {
  this.event = function(options) {
    // init options
    options = options || {numberOf: {}};
    options.numberOf.guests = options.numberOf.guests || randomInt(1, 6);
    var guests = [];
    for(var i = 0; i < options.numberOf.guests; i++)
      guests.push(this.guest());

    options.numberOf.partners = options.numberOf.partners || randomInt(0, 2);
    var partners = [];
    for(var i = 0; i < options.numberOf.partners; i++)
      partners.push(this.partner());

    var youtubeID = random(Sample.youtubeID);

    // make fake data
    return {
      title: random(Sample.target) + '給問嗎？',
      date: Sample.date.splice(randomInt(0, Sample.date.length - 1), 1).pop(),
      start: random(Sample.time),
      end: '23:00',
      description: '皮亞價式再應口分，作應自上多言角下生考長頭看年其境父畫，人願加得院外頭改配選車北電小種因目。',
      guests: guests,
      partners: partners,
      signup: 'http://watchout.tw/',
      livestream: 'https://youtu.be/' + youtubeID,
      report: 'https://musou.tw/focuses/1344',
      transcript: 'https://hackpad.com/1sTYa1KtxXq',
    };
  }
  this.guest = function() {
    return {
      name: random(Sample.name),
      job: random(Sample.job),
      photo: 'president.jpg',
      events: [],
    };
  }
  this.partner = function() {
    return {
      name: random(Sample.partner),
      logo: null,
      link: null,
      events: [],
    };
  }
  return this;
})();

// Get raw data
var raw = [
  Factory.event(),
  Factory.event(),
  Factory.event(),
  Factory.event(),
  Factory.event(),
  Factory.event(),
  Factory.event(),
  Factory.event(),
];

function getEventStartTime(e) {
  return Math.round(new Date(e.date + 'T' + (e.start.length < 5 ? '0' : '') + e.start + "+08:00").getTime()/1000);
}
function getEventEndTime(e) {
  return Math.round(new Date(e.date + 'T' + (e.end.length < 5 ? '0' : '') + e.end + "+08:00").getTime()/1000);
}

// Raw data should be an array of events sorted by start datetime in descending order
raw.sort(function(a, b) {
  return getEventStartTime(b) - getEventStartTime(a);
});

// Make raw data into `events` object according to current time
var time = {
  now: Math.round(new Date().getTime()/1000),
  start: 0,
  end: 0,
}
var twoDays = 2*24*60*60;
var events = {
  isLive: false,
  now: null,
  next: null,
  history: [],
};
raw.forEach(function(v, k) {
  time.start = getEventStartTime(v);
  time.end = getEventEndTime(v);
  if(time.now >= time.start && time.now <= time.end) { // live event
    events.now = k;
    events.isLive = true;
  }
  else if(time.now < time.start) { // future event
    if(time.start - time.now <= twoDays) {
      events.now = k;
      events.isLive = false;
    }
    else {
      events.next = k;
    }
  }
  else {
    events.history.push(k);
  }
});

events.now = (events.now != null ? raw[events.now] : null);
events.next = (events.next != null ? raw[events.next] : null);
events.history = events.history.map(function(k) {
  return raw[k];
});
