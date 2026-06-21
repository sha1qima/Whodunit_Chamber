function hasClass(element, className) {
    var parts = element.className.split(' ');
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] === className) {
            return true;
        }
    }
    return false;
}

function addClass(element, className) {
    if (!hasClass(element, className)) {
        if (element.className.length > 0) {
            element.className = element.className + ' ' + className;
        } else {
            element.className = className;
        }
    }
}

function removeClass(element, className) {
    var parts = element.className.split(' ');
    var newParts = [];
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] !== className && parts[i] !== '') {
            newParts.push(parts[i]);
        }
    }
    element.className = newParts.join(' ');
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

var scriptsDatabase = [];
var pageBg = document.getElementById('pageBg');
var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
var lastSection = 'home';

function updateBackground(id) {
    if (pageBg) {
        pageBg.style.backgroundImage = "url('assets/bg-characters.jpg')";
    }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
    for (var i = 0; i < navLinks.length; i++) {
        var link = navLinks[i];
        var href = link.getAttribute('href').substring(1);
        if (href === sectionId) {
            addClass(link, 'active');
        } else {
            removeClass(link, 'active');
        }
    }
    if (lastSection !== sectionId) {
        lastSection = sectionId;
        updateBackground(sectionId);
    }
}

for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function(e) {
        e.preventDefault();
        var sectionId = this.getAttribute('href').substring(1);
        scrollToSection(sectionId);
    });
}

// Scroll event listener to highlight current section in navbar
window.addEventListener('scroll', function() {
    var sections = ['home', 'secret-hub', 'library', 'game-sessions', 'clutch-moments', 'activities', 'primer-section', 'join-shop', 'footer'];
    var scrollPos = window.scrollY + 100;

    for (var i = 0; i < sections.length; i++) {
        var section = document.getElementById(sections[i]);
        if (section) {
            var offsetTop = section.offsetTop;
            var offsetBottom = offsetTop + section.offsetHeight;
            if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
                for (var j = 0; j < navLinks.length; j++) {
                    var link = navLinks[j];
                    var href = link.getAttribute('href').substring(1);
                    if (href === sections[i]) {
                        if (!hasClass(link, 'active')) {
                            addClass(link, 'active');
                        }
                    } else {
                        if (hasClass(link, 'active')) {
                            removeClass(link, 'active');
                        }
                    }
                }
                if (lastSection !== sections[i]) {
                    lastSection = sections[i];
                    updateBackground(sections[i]);
                }
                break;
            }
        }
    }
});

updateBackground('home');

// Popup modal that appears 0.5s after page loads
var promoPopup = document.getElementById('promoPopup');
var popupInnerClose = document.getElementById('popupInnerClose');

function showPopup() {
    if (promoPopup) addClass(promoPopup, 'active');
}
function hidePopup() {
    if (promoPopup) removeClass(promoPopup, 'active');
}
if (popupInnerClose) {
    popupInnerClose.addEventListener('click', hidePopup);
}
if (promoPopup) {
    promoPopup.addEventListener('click', function(e) {
        if (e.target === promoPopup) e.stopPropagation();
    });
}
window.addEventListener('load', function() {
    setTimeout(showPopup, 500);
});

// Load data from JSON file using XMLHttpRequest
function loadScriptsData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data.json', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                scriptsDatabase = data;
                init();
            } else {
                console.error('Error loading script data');
            }
        }
    };
    xhr.send();
}

var currentSlide = 0;
var slideInterval = null;

var carouselItems = [
    { img: "assets/carousel_replace1.jpg", slogan: "Players exchange information related to investigations." },
    { img: "assets/carousel2.jpg", slogan: "The game has started. Your part is about to begin." },
    { img: "assets/carousel_replace2.jpg", slogan: "Messy operating room, go find the key clues!" },
    { img: "assets/carousel4.jpg", slogan: "The circle is drawn. Now, don't break it." },
    { img: "assets/carousel5.jpg", slogan: "Read between the lines. The truth is hidden there. " },
    { img: "assets/carousel6.jpg", slogan: "The waiting room isn't for the living." },
    { img: "assets/carousel7.jpg", slogan: "Not every case gets closed. Some just get hidden." },
    { img: "assets/carousel8.jpg", slogan: "Smile for the camera… even if you're scared." },
    { img: "assets/carousel1.jpg", slogan: "Don't look too closely. She might look back." },
    { img: "assets/carousel10.jpg", slogan: "Behind these bars, no one hears you scream." },
    { img: "assets/carousel11.jpg", slogan: "Happy Birthday… if you survive the night." }
];

function initCarousel() {
    var container = document.getElementById('carouselSlides');
    var dotsDiv = document.getElementById('carouselDots');
    if (!container || carouselItems.length === 0) return;

    var slidesHtml = '';
    var dotsHtml = '';
    for (var i = 0; i < carouselItems.length; i++) {
        var item = carouselItems[i];
        var activeClass = (i === 0) ? 'active' : '';

        slidesHtml += '<div class="carousel-slide ' + activeClass + '">' +
            '<div class="carousel-card">' +
            '<img src="' + item.img + '" alt="carousel ' + (i + 1) + '">' +
            '<div class="carousel-overlay">' +
            '<h3>' + item.slogan + '</h3>' +
            '</div></div>' +
            '</div>';
        dotsHtml += '<span class="carousel-dot ' + activeClass + '" data-index="' + i + '"></span>';
    }
    container.innerHTML = slidesHtml;
    if (dotsDiv) dotsDiv.innerHTML = dotsHtml;

    var dots = document.querySelectorAll('.carousel-dot');
    for (var i = 0; i < dots.length; i++) {
    dots[i].setAttribute('data-index', i);
    dots[i].addEventListener('click', function(e) {
        var idx = parseInt(e.target.getAttribute('data-index'));
        goToSlide(idx);
        resetInterval();
    });
}
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    if (prevBtn) {
        prevBtn.addEventListener('click', function() { prevSlide(); resetInterval(); });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function() { nextSlide(); resetInterval(); });
    }

    var carousel = document.getElementById('carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopInterval);
        carousel.addEventListener('mouseleave', startInterval);
    }
    startInterval();

    var carouselSlides = document.querySelectorAll('.carousel-slide');
    for (var i = 0; i < carouselSlides.length; i++) {
        carouselSlides[i].style.cursor = 'pointer';
        (function(slide) {
            slide.addEventListener('click', function(e) {
                // Don't trigger if clicking on button or dot
                if (e.target.closest('.carousel-btn') || e.target.closest('.carousel-dot')) {
                    return;
                }
                scrollToSection('library');
            });
        })(carouselSlides[i]);
    }
}

// Switch to specific slide . loop from last to first
function goToSlide(idx) {
    var slides = document.querySelectorAll('.carousel-slide');
    var dots = document.querySelectorAll('.carousel-dot');
    if (slides.length === 0) return;
    // if idx is -1, go to last slide; if idx is slides.length, go to first
    idx = (idx + slides.length) % slides.length;
    for (var i = 0; i < slides.length; i++) {
        if (i === idx) {
            addClass(slides[i], 'active');
        } else {
            removeClass(slides[i], 'active');
        }
        if (dots[i]) {
            if (i === idx) {
                addClass(dots[i], 'active');
            } else {
                removeClass(dots[i], 'active');
            }
        }
    }
    currentSlide = idx;
}
function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }
function startInterval() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 4000);
}
function stopInterval() {
    if (slideInterval) { clearInterval(slideInterval); slideInterval = null; }
}
function resetInterval() { stopInterval(); startInterval(); }
function renderRankingList() {
    var container = document.getElementById('rankingList');
    if (!container) return;

    var scriptList = [];
    for (var i = 0; i < scriptsDatabase.length; i++) {
        if (scriptsDatabase[i].gameType === 'script') {
            scriptList.push(scriptsDatabase[i]);
        }
    }
    for (var i = 0; i < scriptList.length - 1; i++) {
        for (var j = i + 1; j < scriptList.length; j++) {
            if (scriptList[j].rating > scriptList[i].rating) {
                var temp = scriptList[i];
                scriptList[i] = scriptList[j];
                scriptList[j] = temp;
            }
        }
    }
    var top10 = [];
    for (var i = 0; i < scriptList.length && i < 10; i++) {
        top10.push(scriptList[i]);
    }

    var html = '';
    for (var i = 0; i < top10.length; i++) {
        var item = top10[i];
        var rankNum = i + 1;
        var medal = '';
        if (rankNum === 1) medal = '🥇';
        else if (rankNum === 2) medal = '🥈';
        else if (rankNum === 3) medal = '🥉';
        else medal = rankNum;

        html += '<div class="ranking-item" onclick="scrollToSection(\'library\')">' +
            '<div class="ranking-number">' + medal + '</div>' +
            '<div class="ranking-img"><img src="' + item.img + '" alt="' + escapeHtml(item.name) + '"></div>' +
            '<div class="ranking-info"><h4>' + escapeHtml(item.name) + '</h4><p>' + (item.typeName || 'Script') + ' · ' + (item.players || '4-8') + '</p></div>' +
            '<div class="ranking-score">⭐ ' + (item.rating || '4.5') + '</div>' +
            '</div>';
    }
    container.innerHTML = html;
}

var charactersDatabase = {
    "The sea is a rain": [
        { name: "Dieyi", img: "assets/sea-dieyi.jpg", intro: "Butterfly clan. Lucky, a sense of redemption.<br>If I could, I'd rather be a moth drawn to the flame." },
        { name: "Niaoniao", img: "assets/sea-niaoniao.jpg", intro: "Feather clan. Always thinking, wrestling with the truth of everything.<br>We are not tangled vines — we are variables and eternity." },
        { name: "Tuantuan", img: "assets/sea-tuantuan.jpg", intro: "Hedgehog clan. Pessimistic, a wanderer standing alone from the world." },
        { name: "Ayan", img: "assets/sea-ayan.jpg", intro: "Warm, sunny, embracing everything.<br>I'll carve out a land of freedom for you." },
        { name: "Xiaoye", img: "assets/sea-xiaoye.jpg", intro: "Cold, highly intelligent, keeping everyone at a distance." },
        { name: "Jingyu", img: "assets/sea-jingyu.jpg", intro: "A lofty flower, restrained, gentle — a practitioner in the snow temple." }
    ],
    "Sister Drum": [
        { name: "Zhang Yanyan", img: "assets/drum-zhangyanyan.jpg", intro: "A beautiful fair-skinned woman who looks almost identical to Zhang Lili." },
        { name: "Zhang Lili", img: "assets/drum-zhanglili.jpg", intro: "A charming middle-aged woman, still attractive and resilient." },
        { name: "Song Siqing", img: "assets/drum-songsiqing.jpg", intro: "A gentle man in his late twenties, wearing strange floral clothes." },
        { name: "Zuo Mu", img: "assets/drum-zuomu.jpg", intro: "A handsome young man around twenty, carrying an old small backpack." },
        { name: "Lin Yue", img: "assets/drum-linyue.jpg", intro: "A bright, beautiful young woman in a white dress." },
        { name: "Lin Xi", img: "assets/drum-linxi.png", intro: "A gentle, quiet woman in her twenties." },
        { name: "Wang Yang", img: "assets/drum-wangyang.jpg", intro: "A thin, pale middle-aged man with a weathered gaze." }
    ],
    "Yoko Yamada": [
        { name: "Sakurai Haruka", img: "assets/yoko-sakuraiharuka.jpg", intro: "A gentle, quiet girl with glasses." },
        { name: "Oda Shizuka", img: "assets/yoko-odashizuka.jpg", intro: "A cute round-faced girl, slightly plump." },
        { name: "Hoshino Go", img: "assets/yoko-hoshinogo.jpg", intro: "Tall, strong, and sunshiny boy." },
        { name: "Aragaki Yui", img: "assets/yoko-aragakiyui.jpg", intro: "A lively and energetic beauty." },
        { name: "Ozawa Ryunosuke", img: "assets/yoko-ozawaryunosuke.jpg", intro: "Handsome, stylish, the school's heartthrob." },
        { name: "Miyazaki Ayumi", img: "assets/yoko-miyazakayumi.jpg", intro: "A short-haired, capable tomboy." }
    ],
    "Dunes, roses, bitter moon": [
        { name: "Ruby", img: "assets/rose-ruby.jpg", intro: "The heiress of Redstone Town." },
        { name: "Nancy", img: "assets/rose-nancy.jpg", intro: "A married sheriff fighting for women's independence." },
        { name: "Victoria", img: "assets/rose-victoria.jpg", intro: "A self-made mafia leader." },
        { name: "Dylan", img: "assets/rose-dylan.jpg", intro: "A wealthy young man from Chicago." },
        { name: "Chris", img: "assets/rose-chris.jpg", intro: "A determined cowboy from Redstone Town." },
        { name: "Joe", img: "assets/rose-joe.jpg", intro: "A missionary priest from afar." }
    ],
    "WULA WULA": [
        { name: "Lulu", img: "assets/wula-lulu.jpg", intro: "Shrewd, calculating, loves to scheme." },
        { name: "Bubu", img: "assets/wula-bubu.jpg", intro: "Buddha-like, lazy on the surface." },
        { name: "Nunu", img: "assets/wula-nunu.jpg", intro: "Stubborn, persistent, a quest-driven maniac." },
        { name: "Kaka", img: "assets/wula-kaka.jpg", intro: "Social butterfly, smooth and diplomatic." },
        { name: "Chacha", img: "assets/wula-chacha.jpg", intro: "Lively and goofy, the vibe setter." },
        { name: "Papa", img: "assets/wula-papa.jpg", intro: "Impulsive, daring, with a gambler's mindset." },
        { name: "Pupu", img: "assets/wula-pupu.jpg", intro: "Clever and sharp, exploits rule loopholes." },
        { name: "Xiaxia", img: "assets/wula-xiaxia.jpg", intro: "Mysterious, reserved, with deep hidden agendas." }
    ]
};

var scriptSelect = document.getElementById('demoScriptSelect');
var galleryDiv = document.getElementById('characterGallery');
var detailDiv = document.getElementById('characterDetail');

function renderCharacterGallery(scriptName) {
    if (!galleryDiv || !detailDiv) return;
    var characters = charactersDatabase[scriptName];
    if (!characters || characters.length === 0) {
        galleryDiv.innerHTML = '<p style="text-align:center; color:#7a6856;">No character data available.</p>';
        detailDiv.innerHTML = '<p>Select a script, then click on a character to see their story.</p>';
        return;
    }

    var html = '';
    for (var i = 0; i < characters.length; i++) {
        var c = characters[i];
        html += '<div class="character-avatar" data-index="' + i + '">' +
            '<img src="' + c.img + '" onerror="this.src=\'assets/placeholder.jpg\'">' +
            '<div class="char-name">' + escapeHtml(c.name) + '</div>' +
            '</div>';
    }
    galleryDiv.innerHTML = html;

    var avatars = galleryDiv.querySelectorAll('.character-avatar');
    for (var i = 0; i < avatars.length; i++) {
        (function(idx) {
            avatars[idx].addEventListener('click', function() {
                for (var j = 0; j < avatars.length; j++) {
                    removeClass(avatars[j], 'active');
                }
                addClass(this, 'active');
                showCharacterDetail(scriptName, idx);
            });
        })(i);
    }
    if (characters.length > 0) {
        showCharacterDetail(scriptName, 0);
        var firstAvatar = galleryDiv.querySelector('.character-avatar');
        if (firstAvatar) {
            addClass(firstAvatar, 'active');
        }
    }
}

function showCharacterDetail(scriptName, charIndex) {
    var characters = charactersDatabase[scriptName];
    if (characters && characters[charIndex]) {
        var c = characters[charIndex];
        detailDiv.innerHTML = '<strong>' + escapeHtml(c.name) + '</strong><br>' + c.intro;
    } else {
        detailDiv.innerHTML = '<p>Character information not available.</p>';
    }
}

if (scriptSelect) {
    scriptSelect.addEventListener('change', function() {
        var selectedText = scriptSelect.options[scriptSelect.selectedIndex].text;
        renderCharacterGallery(selectedText);
    });
    var defaultScript = scriptSelect.options[scriptSelect.selectedIndex].text;
    renderCharacterGallery(defaultScript);
}

// Publish new post in Discussion Corner
var publishBtn = document.getElementById('publishPostBtn');
if (publishBtn) {
    publishBtn.addEventListener('click', function() {
        var input = document.getElementById('newPostInput');
        if (input && input.value.trim() !== '') {
            var discussDiv = document.getElementById('discussPosts');
            var newPost = document.createElement('div');
            newPost.className = 'post-item';
            newPost.innerHTML = '<strong>@CurrentUser</strong> · Just now<br>' + input.value + '<div class="post-actions"><span>Like 0</span> <span>Reply</span></div>';
            if (discussDiv) discussDiv.insertBefore(newPost, discussDiv.firstChild);
            input.value = '';
        }
    });
}

// Publish new feed in Gameplay Record Area
var feedBtn = document.getElementById('publishFeedBtn');
if (feedBtn) {
    feedBtn.addEventListener('click', function() {
        var input = document.getElementById('newFeedInput');
        if (input && input.value.trim() !== '') {
            var feedDiv = document.getElementById('feedList');
            var newFeed = document.createElement('div');
            newFeed.className = 'feed-item';
            newFeed.innerHTML = '<strong>@Me</strong> ' + input.value + '<div class="feed-time">Just now · Like 0</div>';
            if (feedDiv) feedDiv.insertBefore(newFeed, feedDiv.firstChild);
            input.value = '';
        }
    });
}

// Library filters and rendering
var currentGameType = 'script';
var currentType = 'all';
var currentPlayers = 'all';
var currentDifficulty = 'all';
var currentSearch = '';

var scriptTypeOptionsAll = [
    { value: 'all', label: 'All' },
    { value: 'horror', label: 'Horror' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'emotional', label: 'Emotional' },
    { value: 'honkaku', label: 'Honkaku' },
    { value: 'mechanism', label: 'Mechanism' },
    { value: 'fun', label: 'Fun' }
];

function renderTypeButtons() {
    var container = document.getElementById('typeFilter');
    if (!container) return;
    var opts = [];
    if (currentGameType === 'script') {
        for (var i = 0; i < scriptTypeOptionsAll.length; i++) {
            opts.push(scriptTypeOptionsAll[i]);
        }
    } else {
        opts = [
            { value: 'all', label: 'All' },
            { value: 'horror', label: 'Horror' },
            { value: 'mystery', label: 'Mystery' },
            { value: 'emotional', label: 'Emotional' }
        ];
    }
    var html = '';
    for (var i = 0; i < opts.length; i++) {
        var activeClass = (currentType === opts[i].value) ? 'active' : '';
        html += '<button class="filter-chip ' + activeClass + '" data-type="' + opts[i].value + '">' + opts[i].label + '</button>';
    }
    container.innerHTML = html;
    var btns = container.querySelectorAll('.filter-chip');
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', function() {
            var allBtns = document.querySelectorAll('#typeFilter .filter-chip');
            for (var j = 0; j < allBtns.length; j++) {
                removeClass(allBtns[j], 'active');
            }
            addClass(this, 'active');
            currentType = this.getAttribute('data-type');
            renderLibrary();
        });
    }
}
function renderLibrary() {
    var grid = document.getElementById('allScriptsGrid');
    if (!grid) return;
    var filtered = [];
    for (var i = 0; i < scriptsDatabase.length; i++) {
        var s = scriptsDatabase[i];
        if (s.gameType !== currentGameType) continue;
        if (currentType !== 'all' && s.type !== currentType) continue;
        if (currentPlayers !== 'all') {
            var match = false;
            if (s.playerRange) {
                for (var j = 0; j < s.playerRange.length; j++) {
                    if (s.playerRange[j] === currentPlayers) {
                        match = true;
                        break;
                    }
                }
            }
            if (!match) continue;
        }
        if (currentDifficulty !== 'all' && s.difficulty !== currentDifficulty) continue;
        if (currentSearch !== '' && s.name.toLowerCase().indexOf(currentSearch.toLowerCase()) === -1) continue;
        filtered.push(s);
    }
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="no-results" style="text-align:center; padding:2rem;">No results found</div>';
        return;
    }
    var html = '';
    for (var i = 0; i < filtered.length; i++) {
        var s = filtered[i];
        html += '<div class="script-card" data-id="' + s.id + '">';
        html += '<img src="' + s.img + '" alt="' + s.name + '">';
        html += '<div class="script-overlay"><button class="read-more-btn">READ MORE</button></div>';
        var priceText = s.price ? '¥' + s.price : '¥88';
        html += '<div class="card-info"><h4>' + s.name + '</h4><p>' + (s.players || '4-8') + ' · ' + (s.difficulty || 'Medium') + '</p><div class="price">' + priceText + '</div></div></div>';
    }
    grid.innerHTML = html;
    var btns = document.querySelectorAll('.read-more-btn');
    for (var j = 0; j < btns.length; j++) {
        btns[j].addEventListener('click', function(e) {
            e.stopPropagation();
            var card = this.closest('.script-card');
            var id = parseInt(card.getAttribute('data-id'));
            openDetailModal(id);
        });
    }
}

function openDetailModal(id) {
    var script = null;
    for (var i = 0; i < scriptsDatabase.length; i++) {
        if (scriptsDatabase[i].id === id) {
            script = scriptsDatabase[i];
            break;
        }
    }
    if (!script) return;
    var modalImg = document.getElementById('modalDetailImage');
    var modalName = document.getElementById('modalDetailName');
    var modalDesc = document.getElementById('modalDetailDesc');
    if (modalImg) modalImg.src = script.img;
    if (modalName) modalName.innerText = script.name;
    if (modalDesc) modalDesc.innerText = script.description || 'No description available.';
    var modal = document.getElementById('scriptDetailModal');
    if (modal) modal.style.display = 'flex';
}
function closeDetailModal() {
    var modal = document.getElementById('scriptDetailModal');
    if (modal) modal.style.display = 'none';
}
var closeBtn = document.querySelector('.detail-modal-close');
if (closeBtn) closeBtn.addEventListener('click', closeDetailModal);
window.addEventListener('click', function(e) {
    var modal = document.getElementById('scriptDetailModal');
    if (e.target === modal) closeDetailModal();
});

function setupLibFilters() {
    var playerBtns = document.querySelectorAll('#playersFilter .filter-chip');
    for (var i = 0; i < playerBtns.length; i++) {
        playerBtns[i].addEventListener('click', function() {
            var btns = document.querySelectorAll('#playersFilter .filter-chip');
            for (var j = 0; j < btns.length; j++) {
                removeClass(btns[j], 'active');
            }
            addClass(this, 'active');
            currentPlayers = this.getAttribute('data-players');
            renderLibrary();
        });
    }
    var diffBtns = document.querySelectorAll('#difficultyFilter .filter-chip');
    for (var i = 0; i < diffBtns.length; i++) {
        diffBtns[i].addEventListener('click', function() {
            var btns = document.querySelectorAll('#difficultyFilter .filter-chip');
            for (var j = 0; j < btns.length; j++) {
                removeClass(btns[j], 'active');
            }
            addClass(this, 'active');
            currentDifficulty = this.getAttribute('data-difficulty');
            renderLibrary();
        });
    }
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearch = e.target.value;
            renderLibrary();
        });
    }
    var gameTypeBtns = document.querySelectorAll('.game-type-btn');
    for (var i = 0; i < gameTypeBtns.length; i++) {
        gameTypeBtns[i].addEventListener('click', function() {
            var btns = document.querySelectorAll('.game-type-btn');
            for (var j = 0; j < btns.length; j++) {
                removeClass(btns[j], 'active');
            }
            addClass(this, 'active');
            currentGameType = this.getAttribute('data-game');
            currentType = 'all';
            currentPlayers = 'all';
            currentDifficulty = 'all';
            currentSearch = '';
            var searchEl = document.getElementById('searchInput');
            if (searchEl) searchEl.value = '';
            renderTypeButtons();
            renderLibrary();
        });
    }
}

var gameSessions = [
    { id: 1, name: "Mist of the East River", date: "2026-05-11", time: "14:00", location: "Mystery Club", price: 88, slots: 5, remaining: 2, gameType: "script" },
    { id: 2, name: "Red and Black Mansion", date: "2026-05-08", time: "19:00", location: "Escape Zone", price: 128, slots: 6, remaining: 3, gameType: "escape" },
    { id: 3, name: "The Resonance of Chronos Night", date: "2026-04-13", time: "15:30", location: "Whodunit Studio", price: 138, slots: 6, remaining: 4, gameType: "script" },
    { id: 4, name: "Escape from the Weird School: Part 1", date: "2026-04-28", time: "18:00", location: "Escape Zone", price: 158, slots: 6, remaining: 1, gameType: "escape" },
    { id: 5, name: "Yi Shu", date: "2026-05-15", time: "13:00", location: "Mystery Club", price: 88, slots: 6, remaining: 5, gameType: "script" }
];

function renderSessions() {
    var container = document.getElementById('sessionList');
    if (!container) return;
    if (gameSessions.length === 0) {
        container.innerHTML = '<div class="session-card" style="text-align:center;">No sessions yet. Be the first to create one!</div>';
        return;
    }
    var html = '';
    for (var i = 0; i < gameSessions.length; i++) {
        var s = gameSessions[i];
        var dateStr = s.date + ' ' + s.time;
        var spotsText = s.remaining + ' spot' + (s.remaining !== 1 ? 's' : '') + ' left';
        var priceText = '¥' + s.price;
        html += '<div class="session-card" data-id="' + s.id + '">' +
            '<h4>' + escapeHtml(s.name) + '</h4>' +
            '<p>' + dateStr + ' · ' + escapeHtml(s.location) + ' · ' + priceText + '</p>' +
            '<p>' + spotsText + '</p>' +
            '<button class="join-btn">Join</button>' +
            '</div>';
    }
    container.innerHTML = html;
}

// Form validation for publishing a new session
var sessionForm = document.getElementById('publishSessionForm');
if (sessionForm) {
    sessionForm.addEventListener('submit', function(e) {
        e.preventDefault();

        function showError(fieldName, message) {
            var errorSpan = sessionForm.querySelector('.error-msg[data-field="' + fieldName + '"]');
            if (errorSpan) {
                errorSpan.innerHTML = message;
            }
        }

        var allErrorSpans = sessionForm.querySelectorAll('.error-msg');
        for (var i = 0; i < allErrorSpans.length; i++) {
            allErrorSpans[i].innerHTML = '';
        }

        var isValid = true;
        var name = sessionForm.querySelector('input[name="scriptName"]').value.trim();
        var date = sessionForm.querySelector('input[name="date"]').value;
        var time = sessionForm.querySelector('input[name="time"]').value;
        var location = sessionForm.querySelector('input[name="location"]').value.trim();
        var slots = sessionForm.querySelector('input[name="slots"]').value;
        var price = sessionForm.querySelector('input[name="price"]').value;

        if (name === '') {
            showError('scriptName', 'Game name is required');
            isValid = false;
        }
        if (date === '') {
            showError('date', 'Date is required');
            isValid = false;
        }
        if (time === '') {
            showError('time', 'Time is required');
            isValid = false;
        }
        if (location === '') {
            showError('location', 'Location is required');
            isValid = false;
        }
        if (slots === '' || parseInt(slots, 10) <= 0) {
            showError('slots', 'Please enter a valid number of slots (≥1)');
            isValid = false;
        }
        if (price === '' || isNaN(parseFloat(price))) {
            showError('price', 'Price is required (enter 0 if free)');
            isValid = false;
        }

        if (!isValid) return;

        var gameType = sessionForm.querySelector('select[name="gameType"]').value;
        var remarks = sessionForm.querySelector('textarea[name="remark"]').value;
        var maxId = 0;
        for (var i = 0; i < gameSessions.length; i++) {
            if (gameSessions[i].id > maxId) maxId = gameSessions[i].id;
        }
        var newId = gameSessions.length > 0 ? maxId + 1 : 3;

        var newSession = {
            id: newId,
            name: name,
            date: date,
            time: time,
            location: location,
            price: parseInt(price, 10) || 0,
            slots: parseInt(slots, 10),
            remaining: parseInt(slots, 10),
            gameType: gameType,
            remark: remarks
        };
        gameSessions.push(newSession);
        renderSessions();
        sessionForm.reset();
        alert('Session published!');
    });
}
var shopForm = document.getElementById('shopForm');
if (shopForm) {
    shopForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var allErrorSpans = shopForm.querySelectorAll('.error-msg');
        for (var i = 0; i < allErrorSpans.length; i++) {
            allErrorSpans[i].innerHTML = '';
        }
        var isValid = true;
        var shopName = shopForm.querySelector('input[name="shopName"]').value.trim();
        var phone = shopForm.querySelector('input[name="phone"]').value.trim();
        var address = shopForm.querySelector('input[name="address"]').value.trim();
        var intention = shopForm.querySelector('select[name="intention"]').value;

        function showError(fieldName, message) {
            var errorSpan = shopForm.querySelector('.error-msg[data-field="' + fieldName + '"]');
            if (errorSpan) errorSpan.innerHTML = message;
        }
        if (shopName === '') {
            showError('shopName', 'Shop name is required');
            isValid = false;
        }
        if (phone === '') {
            showError('phone', 'Contact number is required');
            isValid = false;
        }
        if (address === '') {
            showError('address', 'Address is required');
            isValid = false;
        }
        if (intention === '' || intention === '-- Please select --') {
            showError('intention', 'Please select a partnership type');
            isValid = false;
        }
        if (!isValid) return;
        alert('Application submitted!');
        shopForm.reset();
    });
}

document.body.addEventListener('click', function(e) {
    if (e.target.className && e.target.className.indexOf('join-btn') !== -1) {
        alert('You joined this session!');
    }
});

var viewAllLink = document.getElementById('viewAllLink');
if (viewAllLink) {
    viewAllLink.addEventListener('click', function(e) {
        e.preventDefault();
        scrollToSection('library');
    });
}

var videoEl = document.getElementById('promoVideo');
if (videoEl) videoEl.controls = true;

var moreLink = document.getElementById('moreContentLink');
if (moreLink) {
    moreLink.addEventListener('click', function(e) {
        e.preventDefault();
        var clutchSection = document.getElementById('clutch-moments');
        if (clutchSection) {
            clutchSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// press Enter in home search box, jump to Library and fill the search input
var homeSearchInput = document.getElementById('homeSearchInput');
if (homeSearchInput) {
    homeSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            var searchText = homeSearchInput.value.trim();
            if (searchText) {
                scrollToSection('library');
                // Delay to wait for scroll animation to finish
                setTimeout(function() {
                    var libSearch = document.getElementById('searchInput');
                    if (libSearch) {
                        libSearch.value = searchText;
                        currentSearch = searchText;
                        renderLibrary();
                    }
                }, 300);
            }
        }
    });
}

var searchHint = document.getElementById('searchHint');
if (searchHint) {
    homeSearchInput.addEventListener('focus', function() {
        searchHint.style.opacity = '1';
    });
    homeSearchInput.addEventListener('blur', function() {
        searchHint.style.opacity = '0';
    });
}

// Accordion initialization
function initAccordion() {
    var accordionBtns = document.querySelectorAll('.accordion-header-btn');
    for (var i = 0; i < accordionBtns.length; i++) {
        accordionBtns[i].addEventListener('click', function() {
            var targetId = this.getAttribute('data-target');
            var targetBody = document.getElementById(targetId);
            if (targetBody) {
                if (hasClass(targetBody, 'show')) {
                    removeClass(targetBody, 'show');
                } else {
                    addClass(targetBody, 'show');
                }
            }
        });
    }
}

// Burger menu for mobile
function initBurgerMenu() {
    var burgerBtn = document.querySelector('.navbar-toggler');
    var navCollapse = document.getElementById('navbarNav');
    if (burgerBtn && navCollapse) {
        burgerBtn.addEventListener('click', function() {
            if (hasClass(navCollapse, 'show')) {
                removeClass(navCollapse, 'show');
            } else {
                addClass(navCollapse, 'show');
            }
        });
    }
}

//highlight empty required fields on blur
var formInputs = document.querySelectorAll('#publishSessionForm input, #publishSessionForm select');
for (var i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener('focus', function() {
        removeClass(this, 'error-highlight');
        var errorSpan = this.parentElement.querySelector('.error-msg');
        if (errorSpan) errorSpan.innerHTML = '';
    });
    formInputs[i].addEventListener('blur', function() {
        if (this.value.trim() === '' && this.hasAttribute('required')) {
            addClass(this, 'error-highlight');
        }
    });
}

function init() {
    initCarousel();
    renderRankingList();
    renderTypeButtons();
    setupLibFilters();
    renderLibrary();
    renderSessions();
    initAccordion();
    initBurgerMenu();
}

window.scrollToSection = scrollToSection;
window.closeDetailModal = closeDetailModal;
loadScriptsData();

Vue.createApp({
    data() {
        return {
            name: '',
            email: '',
            interest: 'script',
            interestOptions: [
                { value: 'script', label: 'Script Murder' },
                { value: 'escape', label: 'Escape Room' },
                { value: 'both', label: 'Both' }
            ],
            isSubmitting: false,
            showSuccess: false,
            showError: false,
            nameError: false,
            emailError: false
        }
    },
    methods: {
        clearError(field) {
            if (field === 'name') this.nameError = false;
            if (field === 'email') this.emailError = false;
            this.showError = false;
        },
        subscribe() {
            this.nameError = !this.name.trim();
            // Simple email validation using regex 
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            this.emailError = !this.email.trim() || !emailPattern.test(this.email);
            
            if (this.nameError || this.emailError) {
                this.showError = true;
                this.showSuccess = false;
                return;
            }
            
            this.isSubmitting = true;
            var self = this;
            setTimeout(function() {
                self.isSubmitting = false;
                self.showSuccess = true;
                self.showError = false;
                self.name = '';
                self.email = '';
                setTimeout(function() { self.showSuccess = false; }, 3000);
            }, 1000);
        }
    }
}).mount('#vue-app');