var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    alert('This site is not yet viewable on mobile devices. Please view on desktop. Sorry for the inconvinience.');
}

var newSize = isMobile ? window.innerWidth : window.innerHeight;
var coordinates = [];
var currentIndex = 0;

var NUM_PARTICLES = ((ROWS = windowHeight = window.innerHeight) * (COLS = windowWidth = window.innerWidth)),
    THICKNESS = Math.pow(80, 2.2),
    SPACING = 1,
    COLOR = 25,
    DRAG = 0.95,
    EASE = 0.25,
    MARGIN_TOP = 104, // Navbar height
    MARGIN_LEFT = 0,
    container,
    particle,
    canvas,
    list,
    ctx,
    tog,
    man,
    dx, dy,
    mx, my,
    d, t, f,
    a, b,
    i, n,
    w, h,
    p, s,
    r, c,
    filter = []
    ;

particle = {
    vx: 0,
    vy: 0,
    x: 0,
    y: 0
};

function init() {

    if (isMobile) {
        document.body.addEventListener( 'touchstart', function(e) {
            THICKNESS = Math.pow(80, 2.2);
            bounds = container.getBoundingClientRect();
            mx = e.touches[0].clientX - bounds.left;
            my = e.touches[0].clientY - bounds.top;
            man = true;
        });

        document.body.addEventListener( 'touchmove', function(e) {
            THICKNESS = Math.pow(80, 2.2);
            mx = e.touches[0].clientX - bounds.left;
            my = e.touches[0].clientY - bounds.top;
            man = true;
        });

        document.body.addEventListener( 'touchend', function(e) {
            THICKNESS = 0;
            mx = 0;
            my = 0;
        });

        let bannerTextContainer = document.getElementById('banner_text_container');

        filter[0] = bannerTextContainer.getBoundingClientRect().top - (MARGIN_TOP + 10);
        filter[1] = bannerTextContainer.getBoundingClientRect().bottom - (MARGIN_TOP - 10);
    } else {
        MARGIN_LEFT = windowWidth / 2;

        document.body.addEventListener( 'mousemove', function(e) {
            THICKNESS = Math.pow(80, 2.2)
            bounds = container.getBoundingClientRect();
            mx = e.clientX - bounds.left;
            my = e.clientY - bounds.top;
            man = true;
        });
    }

    container = document.getElementById( 'banner_face' );
    canvas = document.createElement( 'canvas' );

    ctx = canvas.getContext( '2d' );
    man = false;
    tog = false;

    list = [];

    w = canvas.width = COLS * SPACING;
    h = canvas.height = ROWS * SPACING;

    for ( i = 0; i < coordinates.length; i++ ) {
        if (!isMobile || coordinates[i][1] < filter[0] || coordinates[i][1] > filter[1]) {
            p = Object.create( particle );
            p.x = p.ox = MARGIN_LEFT + SPACING * coordinates[i][0];
            p.y = p.oy = MARGIN_TOP + SPACING * coordinates[i][1];

            list.push(p);
        }
    }

    container.appendChild( canvas );

    mx = MARGIN_LEFT + 131;
    my = windowHeight / 2;
    THICKNESS = Math.pow(80, 4);
}

function step() {
    if (currentIndex == 0) {
        if ( tog = !tog ) {
            if ( !man ) {
                THICKNESS /= 2;
            }
            
            for ( i = 0; i < list.length; i++ ) {
            
                p = list[i];
                
                d = ( dx = mx - p.x ) * dx + ( dy = my - p.y ) * dy;
                f = -THICKNESS / d;
    
                if ( d < THICKNESS ) {
                    t = Math.atan2( dy, dx );
                    p.vx += f * Math.cos(t);
                    p.vy += f * Math.sin(t);
                }
    
                p.x += ( p.vx *= DRAG ) + (p.ox - p.x) * EASE;
                p.y += ( p.vy *= DRAG ) + (p.oy - p.y) * EASE;
    
            }
    
        } else {
            b = ( a = ctx.createImageData( w, h ) ).data;
    
            for ( i = 0; i < list.length; i++ ) {
                p = list[i];
                b[n = ( ~~p.x + ( ~~p.y * w ) ) * 4] = b[n+1] = b[n+2] = COLOR, b[n+3] = 255;
            }
    
            ctx.putImageData( a, 0, 0 );
        }
    }

    requestAnimationFrame( step );
}

getCoordinates(isMobile, newSize, (resultCoordinates) => {
    coordinates = resultCoordinates;
    init();
    step();
    setTimeout(() => {
        document.getElementById('banner_text_container').className += 'active';
    }, 2500)
});


// Page switching logic
var links = document.getElementsByClassName('nav_link');
var mainContainer = document.getElementById('main_container');
var sideButtons = document.getElementsByClassName('nav_sides_btn');
var progresses = document.getElementsByTagName('progress');
var progressValues = [90, 85, 80, 85, 80, 60, 75];

for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', (e) => {
        e.preventDefault();
        let pageIndex = parseInt(e.target.dataset.index);

        switchPage(pageIndex);
    });
}

for (let i = 0; i < sideButtons.length; i++) {
    sideButtons[i].addEventListener('click', (e) => {
        let val = parseInt(e.target.value);
        let pageIndex = currentIndex + val;

        switchPage(pageIndex);
    });
}

function toggleSideButton(buttonIndex, toggle) {
    sideButtons[buttonIndex].style['opacity'] = toggle ? '1' : '0';
    sideButtons[buttonIndex].style['pointer-events'] = toggle ? 'all' : 'none';
}

var pauseScroll = false;

document.body.addEventListener('wheel', (e) => {
    if (!pauseScroll) {
        pauseScroll = true;
        let val =  e.deltaY > 0 ? -1 : 1;
        let pageIndex = currentIndex + val;

        switchPage(pageIndex);
        setTimeout(() => {
            pauseScroll = false;
        }, 600);
    }
});

document.addEventListener('keyup', (e) => {
    let pageIndex = currentIndex;

    if (e.keyCode == 39 || e.keyCode == 37) {
        if (e.keyCode == 39) {
            pageIndex += 1;
        } else if (e.keyCode == 37) {
            pageIndex -= 1;
        }

        switchPage(pageIndex);
    }
});

function switchPage(pageIndex) {
    pageIndex = pageIndex < 0 ? 0 : pageIndex;
    pageIndex = pageIndex > 3 ? 3 : pageIndex;

    mainContainer.style.transform = `translateX(-${pageIndex * 100}vw)`;

    links[currentIndex].className = links[currentIndex].className.replace(' active', '');
    links[pageIndex].className += ' active';

    currentIndex = pageIndex;

    if (currentIndex == 0) {
        toggleSideButton(0, 0);
        toggleSideButton(1, 1);
    } else if (currentIndex == 3) {
        toggleSideButton(0, 1);
        toggleSideButton(1, 0);
    } else {
        toggleSideButton(0, 1);
        toggleSideButton(1, 1);
    }

    if (currentIndex == 1) {
        document.getElementById('about').className += ' active';
        setTimeout(() => {
            for (let i = 0; i < progresses.length; i++) {
                progresses[i].value = progressValues[i];
            }
        }, 1200)
    }
}

// Mail sending logic

function submitForm() {
    document.getElementById('btn_submit').disabled = true;
    let name = document.getElementById('input_name').value;
    let email = document.getElementById('input_email').value;
    let message = document.getElementById('input_message').value;

    postAjax(
        '/api/mail.php',
        {
            name: name,
            email: email,
            message: message
        },
        (response) => {
            if (response.status == 200) {
                document.getElementById('form_contact').className = 'success';
            } else {
                document.getElementById('form_contact').className = 'error';
                setTimeout(() => {
                    document.getElementById('form_contact').className = '';
                    document.getElementById('btn_submit').disabled = false;
                }, 4000);
            }
        }
    );

}

function postAjax(url, data, done) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
        ).join('&');
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    document.getElementById('form_contact').className += ' loading'
    xhr.open('POST', url);

    xhr.onreadystatechange = function() {
        if (xhr.readyState > 3) done(xhr);
    };

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);

    return xhr;
}