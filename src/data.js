var random = function(list) {
  return list && list[Math.floor(Math.random() * list.length)];
}
var Factory = (function Factory() {
  this.targets = ['時代力量', '國民黨', '民進黨', '勞動部', '司法改革', '體育改革', '台南市長', '高雄市長'];
  this.names = ['蔡英文', '黃國昌', '范雲', '楊智達'];
  this.event = function() {
    return {
      title: random(this.targets) + '給問嗎？',
      date: '2015-03-17',
      start: '14:00',
      end: '16:00',
      description: '',
      guests: [],
      partners: [],
      signup: null,
      livestream: null,
      article: null,
      transcript: null,
    };
  }
  this.guest = function() {
    return {
      name: random(this.name),
      title: '總統',
      photo: 'president.jpg',
      events: [],
    };
  }
  this.partner = function() {
    return {
      name: 'FGT! 體育改革聯會',
      logo: null,
      link: null,
      events: [],
    };
  }
  return this;
})();
