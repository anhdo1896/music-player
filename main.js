
    /**
     * 1. Render songs -> ok
     * 2. Scroll top -> ok
     * 3. Play/ Pause/ seek
     * 4. CD rotate
     * 5. Next/ prev
     * 6. Random 
     * 7. Next/ Repeat when ended
     * 8. Active song
     * 9. Scroll active song into view
     * 10. Play song when click
     */
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const player = $('.player');
    const playlist = $('.playlist');
    const heading = $('header h2');
    const cdThumb = $('.cd-thumb');
    const cd = $('.cd');
    const audio = $('audio');
    const playBtn = $('.btn-toggle-play')
    const progress = $('#progress');
    const prevBtn = $('.btn-prev');
    const nextBtn = $('.btn-next');
    const randomBtn = $('.btn-random');
    const repeatBtn = $('.btn-repeat');

    const app = {
        currentIndex: 0,
        isPLaying: false,
        isRandom: false,
        isRepeat: false,
        songs: [
            {
                name: "Enjoy today",
                singer: "Shizuko Mori",
                path: "./assets/music/enjoy-today.mp3",
                image: "./assets/img/enjoy-today.jpeg"
            },
            {
                name: "At My Worst",
                singer: "Pink Sweat$",
                path: "./assets/music/at_my_worst.mp3",
                image: "./assets/img/at_my_worst.jpeg"
            },
            {
                name: "Livin' On Love",
                singer: "Alan Jackson",
                path: "./assets/music/living-on-love.mp3",
                image: "./assets/img/living-on-love.jpeg"
            },
            {
                name: "17",
                singer: "Wildflowers",
                path: "./assets/music/17.mp3",
                image: "./assets/img/17.jpeg"
            },
            {
                name: "Little Do You Know",
                singer: "Alex & Sierra",
                path: "./assets/music/little-do-you-know.mp3",
                image: "./assets/img/little-do-you-know.jpeg"
            },
            {
                name: "Why not me",
                singer: "Enrique Iglesias",
                path: "./assets/music/why-not-me.mp3",
                image: "./assets/img/why-not-me.jpg"
            },
            {
                name: "Photograph",
                singer: "Ed Sheeran",
                path: "./assets/music/photograph.mp3",
                image: "./assets/img/photograph.jpeg"
            },
            {
                name: "Espresso",
                singer: "Sabrina Carpenter ",
                path: "./assets/music/espresso.mp3",
                image: "./assets/img/espresso.jpeg"
            },
            {
                name: "Fortnight",
                singer: "Taylor Swift ",
                path: "./assets/music/fortnight.mp3",
                image: "./assets/img/fortnight.jpg"
            },
            {
                name: "Señorita",
                singer: "Shawn Mendes, Camila Cabello",
                path: "./assets/music/senorita.mp3",
                image: "./assets/img/senorita.jpeg"
            }
        ],
        render: function () {
            const htmls = this.songs.map((song, index) => {
                return (`
                    <div class="song ${this.currentIndex === index ? 'active' : ''}" data-index=${index}>
                    <div class="thumb" style="background-image: url(${song.image});"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
                
                `)
            })

            playlist.innerHTML = htmls.join('')
        },
        defineProperties: function () {
            Object.defineProperty(this, 'currentSong', {
                get: function () {
                    return this.songs[this.currentIndex];
                }
            });
        },
        handerEvents: function () {
            const cdWidth = cd.offsetWidth;

            const cdThumbAnimate = cdThumb.animate([
                { transform: 'rotate(360deg)' }
            ], {
                duration: 10000,
                iterations: Infinity
            });

            cdThumbAnimate.pause();

            document.onscroll = function () {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const newCdWidth = cdWidth - scrollTop;

                cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0
            }

            playBtn.onclick = () => {
                if (this.isPLaying) {
                    audio.pause();
                } else {
                    audio.play();
                }

            }

            audio.onplay = () => {
                this.isPLaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }

            audio.onpause = () => {
                this.isPLaying = false;
                player.classList.remove('playing')
                cdThumbAnimate.pause();
            }

            audio.ontimeupdate = () => {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent
                }
            }

            progress.oninput = function (e) {
                const seekTime = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;
            }

            nextBtn.onclick = () => {
                if (this.isRandom) {
                    this.playRandomSongs();
                } else {
                    this.nextSong();
                }
                audio.play();
                this.render();
                this.scrollToActiveSong()
            }

            prevBtn.onclick = () => {
                if (this.isRandom) {
                    this.playRandomSongs();
                } else {
                    this.prevSong();
                }
                audio.play();
                this.render();
                this.scrollToActiveSong();

            }

            randomBtn.onclick = () => {
                this.isRandom = !this.isRandom
                randomBtn.classList.toggle('active', this.isRandom)
            }

            repeatBtn.onclick = () => {
                this.isRepeat = !this.isRepeat
                repeatBtn.classList.toggle('active', this.isRepeat)
            }

            audio.onended = () => {
                if (this.isRepeat) {
                    audio.play()
                } else {
                    nextBtn.click();
                }
            }

            playlist.onclick = (e) => {
                const songNode = e.target.closest('.song:not(.active)');
                if (songNode || e.target.closest('option')) {
                    if (songNode) {
                        this.currentIndex = Number(songNode.dataset.index);
                        this.loadCurrentSong();
                        this.render();
                        audio.play();
                    }
                }
            }

        },
        loadCurrentSong: function () {
            heading.textContent = this.currentSong.name;
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
            audio.src = this.currentSong.path

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
        playRandomSongs: function () {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * this.songs.length);
            } while (newIndex === this.currentIndex)

            this.currentIndex = newIndex;
            this.loadCurrentSong();
        },
        scrollToActiveSong: function () {

            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        },
        start: function () {
            this.defineProperties()

            this.handerEvents()

            this.loadCurrentSong()

            this.render()
        },


    }

app.start()