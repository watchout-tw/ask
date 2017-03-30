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
      date: '2015-03-17',
      start: '14:00',
      end: '16:00',
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
