const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2 ');
const cdThumbnail = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');

const PLAYER_STORAGE_KEY = '';

const app = {
   currentIndex: 0,
   isPlaying: false,
   isRandom: false,
   isRepeat: false,
   config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
   songs: [
      {
         name: 'Chuyện Cũ Bỏ Qua',
         singer: 'Bích Phương',
         path: './assets/music/song1.mp3',
         image: './assets/img/image1.png',
      },
      {
         name: 'Tết Bình An',
         singer: 'Hana Cẩm Tiên',
         path: './assets/music/song2.mp3',
         image: './assets/img/image2.png',
      },
      {
         name: 'Tết Đong Đầy',
         singer: 'Kay Trần x Khoa',
         path: './assets/music/song3.mp3',
         image: './assets/img/image3.png',
      },
      {
         name: 'Một Năm Mới Bình An',
         singer: 'Sơn Tùng MTP',
         path: './assets/music/song4.mp3',
         image: './assets/img/image4.png',
      },
      {
         name: 'Làm Gì Phải Hốt',
         singer: 'Đen x Hoàng Thùy Linh',
         path: './assets/music/song5.mp3',
         image: './assets/img/image5.png',
      },
      {
         name: 'Đi Về Nhà',
         singer: 'Đen x JustaTee',
         path: './assets/music/song6.mp3',
         image: './assets/img/image6.png',
      },
      {
         name: 'Năm Qua Đã Làm Gì',
         singer: 'Noo Phước Thịnh',
         path: './assets/music/song7.mp3',
         image: './assets/img/image7.png',
      },
      {
         name: 'Như Hoa Mùa Xuân',
         singer: 'Hiền Mai',
         path: './assets/music/song8.mp3',
         image: './assets/img/image8.png',
      },
      {
         name: 'Thế Là Tết',
         singer: 'Đức Phúc x Hòa Minzy',
         path: './assets/music/song9.mp3',
         image: './assets/img/image9.png',
      },
      {
         name: 'Tự Nhiên Cái Tết',
         singer: 'Xuân Nghị',
         path: './assets/music/song10.mp3',
         image: './assets/img/image10.png',
      },
   ],
   setConfig: function (key, value) {
      this.config[key] = value;
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
   },
   render: function () {
      const htmls = this.songs.map((song, index) => {
         return `
         <div class="song ${
            index === this.currentIndex ? 'active' : ''
         }" data-index="${index}">
            <div
            class="thumb"
            style="
                background-image: url('${song.image}');
            "
            ></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option color-op">
                <i class="fas fa-ellipsis-h"></i>
            </div>
         </div>`;
      });
      playList.innerHTML = htmls.join('');
   },
   defineProperties() {
      Object.defineProperty(this, 'currentSong', {
         get: function () {
            return this.songs[this.currentIndex];
         },
      });
   },
   handleEvent: function () {
      const _this = this;
      const cdWidth = cd.offsetWidth;

      const cdThumbnailAnimate = cdThumbnail.animate(
         [
            {
               transform: 'rotate(360deg)',
            },
         ],
         {
            duration: 10000,
            iterations: Infinity,
         },
      );
      cdThumbnailAnimate.pause();

      document.onscroll = function () {
         const scrollTop = window.scrollY || document.documentElement.scrollTop;
         const newCdWidth = cdWidth - scrollTop;

         cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
         cd.style.opacity = newCdWidth / cdWidth;
      };
      playBtn.onclick = function () {
         if (_this.isPlaying) {
            audio.pause();
         } else {
            audio.play();
         }

         audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbnailAnimate.play();
         };
         audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbnailAnimate.pause();
         };
         audio.ontimeupdate = function () {
            if (audio.duration) {
               const currentProgressPrecent = Math.floor(
                  (audio.currentTime / audio.duration) * 100,
               );
               progress.value = currentProgressPrecent;
            }
         };
         progress.oninput = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
         };
      };
      nextBtn.onclick = function () {
         if (_this.isRandom) {
            _this.playRandomSong();
         } else {
            _this.nextSong();
         }
         _this.render();
         audio.play();
         _this.scrollToActiveSong();
      };
      prevBtn.onclick = function () {
         if (_this.isRandom) {
            _this.playRandomSong();
         } else {
            _this.prevSong();
         }
         _this.render();
         audio.play();
      };
      randomBtn.onclick = function () {
         _this.isRandom = !_this.isRandom;
         _this.setConfig('isRandom', _this.isRandom);
         randomBtn.classList.toggle('active', _this.isRandom);
      };
      repeatBtn.onclick = function () {
         _this.isRepeat = !_this.isRepeat;
         _this.setConfig('isRepeat', _this.isRepeat);
         repeatBtn.classList.toggle('active', _this.isRepeat);
      };
      audio.onended = function () {
         if (_this.isRepeat) {
            audio.play();
         } else {
            nextBtn.click();
         }
      };
      playList.onclick = function (e) {
         const songElement = e.target.closest('.song:not(.active)');
         const songOption = e.target.closest('.option');

         if (songElement || songOption) {
            if (songElement && !songOption) {
               _this.currentIndex = Number(songElement.dataset.index);
               _this.loadCurrentSong();
               _this.render();
               audio.play();
            }

            if (songOption) {
               alert('Tính năng chưa hoàn thiện!');
            }
         }
      };
   },
   loadCurrentSong: function () {
      heading.textContent = this.currentSong.name;
      cdThumbnail.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.path;
   },
   loadConfig: function () {
      this.isRandom = this.config.isRandom;
      this.isRepeat = this.config.isRepeat;
   },
   nextSong: function () {
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length) {
         this.currentIndex = 0;
      }
      this.loadCurrentSong();
   },
   prevSong: function () {
      this.currentIndex--;
      if (this.currentIndex < 0) {
         this.currentIndex = this.songs.length - 1;
      }
      this.loadCurrentSong();
   },
   playRandomSong: function () {
      let newIndex;
      do {
         newIndex = Math.floor(Math.random() * this.songs.length);
      } while (newIndex === this.currentIndex);
      this.currentIndex = newIndex;
      this.loadCurrentSong();
   },
   scrollToActiveSong: function () {
      setTimeout(() => {
         $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
         });
      }, 300);
   },
   start: function () {
      this.loadConfig();

      this.defineProperties();

      this.handleEvent();

      this.loadCurrentSong();

      this.render();

      randomBtn.classList.toggle('active', this.isRandom);
      repeatBtn.classList.toggle('active', _this.isRepeat);
   },
};
app.start();
